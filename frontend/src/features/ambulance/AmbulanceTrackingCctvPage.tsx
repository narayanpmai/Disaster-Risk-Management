import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Truck,
  Activity,
  Video,
  Camera,
  Radio,
  PhoneCall,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Crosshair,
  Shield,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Compass,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  Building2,
  Eye,
  Sliders,
  Share2,
  Download,
  Flame,
  Phone,
  UserCheck,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import {
  INITIAL_AMBULANCE_FLEET,
  REGIONAL_HOSPITALS,
  type AmbulanceRecord,
  type AmbulanceCctvChannel,
  type PatientTriage,
} from './ambulanceData';

// Fix for default Leaflet marker assets in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to compute bearing between two coordinates
function computeBearing(from: [number, number], to: [number, number]): number {
  const lat1 = (from[0] * Math.PI) / 180;
  const lon1 = (from[1] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const lon2 = (to[1] * Math.PI) / 180;
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export const AmbulanceTrackingCctvPage: React.FC = () => {
  const { isNepali } = useLanguage();

  // Fleet state
  const [fleet, setFleet] = useState<AmbulanceRecord[]>(INITIAL_AMBULANCE_FLEET);
  const [selectedAmbId, setSelectedAmbId] = useState<string>('amb-01');

  // Simulation & Map Controls
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [followVehicle, setFollowVehicle] = useState<boolean>(true);
  const [mapBaseLayer, setMapBaseLayer] = useState<'hybrid' | 'osm' | 'terrain'>('hybrid');

  // CCTV Viewing Controls
  const [activeCamType, setActiveCamType] = useState<'front' | 'cabin' | 'rear' | 'quad'>('front');
  const [isNightVision, setIsNightVision] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isSirenSounding, setIsSirenSounding] = useState<boolean>(false);
  const [telemetryOverlay, setTelemetryOverlay] = useState<boolean>(true);

  // Map & Audio Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylinesRef = useRef<Map<string, { full: L.Polyline; covered: L.Polyline }>>(new Map());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sirenOsc1Ref = useRef<OscillatorNode | null>(null);
  const sirenOsc2Ref = useRef<OscillatorNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Active selected ambulance
  const selectedAmbulance = useMemo(() => {
    return fleet.find((a) => a.id === selectedAmbId) || fleet[0];
  }, [fleet, selectedAmbId]);

  // Current live CCTV channel
  const activeCctvChannel = useMemo(() => {
    if (activeCamType === 'front') {
      return selectedAmbulance.cctvChannels.find((c) => c.viewType === 'front_dashcam') || selectedAmbulance.cctvChannels[0];
    }
    if (activeCamType === 'cabin') {
      return selectedAmbulance.cctvChannels.find((c) => c.viewType === 'cabin_telemedicine') || selectedAmbulance.cctvChannels[0];
    }
    if (activeCamType === 'rear') {
      return selectedAmbulance.cctvChannels.find((c) => c.viewType === 'rear_360') || selectedAmbulance.cctvChannels[0];
    }
    return selectedAmbulance.cctvChannels[0];
  }, [selectedAmbulance, activeCamType]);

  // ── 1. Map Initialization ──────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = selectedAmbulance.coords;
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Google Satellite Hybrid tile layer
    const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxNativeZoom: 20,
      maxZoom: 22,
      attribution: '&copy; Google Hybrid | Nepal Integrated DRRMS',
    }).addTo(map);

    (map as any)._baseSatellite = satelliteLayer;
    mapInstanceRef.current = map;

    // Render Hospital Markers
    REGIONAL_HOSPITALS.forEach((hosp) => {
      const hospHtml = `
        <div style="
          background: #ffffff;
          border: 2px solid #dc2626;
          border-radius: 8px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
          font-family: system-ui, sans-serif;
          white-space: nowrap;
        ">
          <span style="font-size: 16px;">🏥</span>
          <span style="font-size: 11px; font-weight: 800; color: #991b1b;">${hosp.nameNp}</span>
        </div>
      `;
      const icon = L.divIcon({
        html: hospHtml,
        className: 'hospital-marker-div',
        iconSize: [140, 32],
        iconAnchor: [70, 16],
      });
      L.marker([hosp.lat, hosp.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <strong style="color: #dc2626; font-size: 13px;">🏥 ${hosp.nameNp}</strong><br/>
            <span style="color: #475569; font-size: 11px;">${hosp.locationNp}</span><br/>
            <span style="color: #166534; font-weight: 700; font-size: 11px;">आकस्मिक ICU: ${hosp.icuBeds} शय्या | भेन्टिलेटर: ${hosp.ventilators} थान</span><br/>
            <a href="tel:${hosp.phone}" style="display: inline-block; margin-top: 6px; color: #0284c7; font-weight: 700; text-decoration: none;">📞 ${hosp.phone}</a>
          </div>
        `);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── 2. Render & Update Fleet on Map ─────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    fleet.forEach((amb) => {
      const isSelected = amb.id === selectedAmbId;
      const isEmergency = amb.status === 'emergency_transit' || amb.sirenActive;

      // Custom high-tech Ambulance marker HTML
      const markerHtml = `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          ${
            isEmergency
              ? `<div style="
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                  background: rgba(239, 68, 68, 0.4);
                  animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>`
              : ''
          }
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: ${isSelected ? '#dc2626' : '#1e3a8a'};
            border: 2.5px solid #ffffff;
            box-shadow: 0 4px 15px rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 18px;
            transform: rotate(${amb.headingDegrees}deg);
            transition: transform 0.3s ease;
          ">
            🚑
          </div>
          <div style="
            position: absolute;
            bottom: -16px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 23, 42, 0.85);
            color: #ffffff;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 800;
            white-space: nowrap;
            letter-spacing: 0.2px;
            border: 1px solid rgba(255,255,255,0.2);
          ">
            ${amb.callSign.split(' ')[0]} ${amb.speedKmH > 0 ? `(${amb.speedKmH}k)` : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: `ambulance-marker-${amb.id}`,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      // Update or create marker
      if (markersRef.current.has(amb.id)) {
        const marker = markersRef.current.get(amb.id)!;
        marker.setLatLng(amb.coords);
        marker.setIcon(customIcon);
      } else {
        const marker = L.marker(amb.coords, { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedAmbId(amb.id);
        });
        markersRef.current.set(amb.id, marker);
      }

      // Draw or Update Route Polyline for selected ambulance
      if (isSelected && amb.routeWaypoints && amb.routeWaypoints.length > 1) {
        let lines = routePolylinesRef.current.get(amb.id);
        const coveredPath = amb.routeWaypoints.slice(0, amb.currentWaypointIdx + 1);
        const remainingPath = amb.routeWaypoints.slice(amb.currentWaypointIdx);

        if (!lines) {
          const covered = L.polyline(coveredPath, {
            color: '#10b981',
            weight: 5,
            opacity: 0.85,
          }).addTo(map);

          const full = L.polyline(remainingPath, {
            color: '#ef4444',
            weight: 5,
            opacity: 0.9,
            dashArray: '8, 8',
          }).addTo(map);

          lines = { full, covered };
          routePolylinesRef.current.set(amb.id, lines);
        } else {
          lines.covered.setLatLngs(coveredPath);
          lines.full.setLatLngs(remainingPath);
        }
      }
    });

    // Auto-center on selected vehicle if follow is enabled
    if (followVehicle && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(selectedAmbulance.coords, { animate: true, duration: 0.8 });
    }
  }, [fleet, selectedAmbId, followVehicle]);

  // ── 3. Real-Time Moving GPS Simulation Loop ─────────────────────────
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(300, 1500 / simSpeed);
    const timer = setInterval(() => {
      setFleet((prevFleet) => {
        return prevFleet.map((amb) => {
          // Only animate active ambulances on routes
          if (amb.status === 'standby' || !amb.routeWaypoints || amb.routeWaypoints.length < 2) {
            return amb;
          }

          const waypoints = amb.routeWaypoints;
          let nextIdx = amb.currentWaypointIdx + 1;

          // Loop back or change direction when reaching end of route
          if (nextIdx >= waypoints.length) {
            nextIdx = 0;
          }

          const currentPos = waypoints[amb.currentWaypointIdx];
          const nextPos = waypoints[nextIdx];
          const newBearing = computeBearing(currentPos, nextPos);

          // Realistic dynamic speed adjustment
          const baseSpeed = amb.status === 'emergency_transit' ? 48 : 34;
          const jitter = Math.floor(Math.random() * 8) - 4;
          const newSpeed = Math.max(20, baseSpeed + jitter);

          // Decrement ETA slightly
          const newEta = Math.max(3, amb.destinationHospital.etaMinutes - (nextIdx % 5 === 0 ? 1 : 0));

          return {
            ...amb,
            coords: nextPos,
            currentWaypointIdx: nextIdx,
            headingDegrees: Math.round(newBearing),
            speedKmH: newSpeed,
            destinationHospital: {
              ...amb.destinationHospital,
              etaMinutes: newEta,
            },
          };
        });
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed]);

  // ── 4. Web Audio Emergency Siren Synthesizer ─────────────────────────
  const toggleSirenAudio = () => {
    if (isSirenSounding) {
      // Stop siren
      if (sirenOsc1Ref.current) {
        try {
          sirenOsc1Ref.current.stop();
        } catch {}
        sirenOsc1Ref.current = null;
      }
      if (sirenOsc2Ref.current) {
        try {
          sirenOsc2Ref.current.stop();
        } catch {}
        sirenOsc2Ref.current = null;
      }
      setIsSirenSounding(false);
      toast.success(isNepali ? 'आपतकालीन साइरन बन्द गरियो' : 'Emergency Siren Deactivated');
    } else {
      // Start siren
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioContextClass();
        audioCtxRef.current = ctx;

        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        // Authentic dual-tone emergency ambulance wail (700Hz to 1100Hz cycling)
        const now = ctx.currentTime;
        osc1.frequency.setValueAtTime(750, now);
        osc2.frequency.setValueAtTime(950, now);

        // Modulate frequency periodically
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.6, now); // ~1.6 second wail cycle
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, now);

        lfo.connect(osc1.frequency);
        lfo.connect(osc2.frequency);

        gainNode.gain.setValueAtTime(0.18, now);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();

        sirenOsc1Ref.current = osc1;
        sirenOsc2Ref.current = osc2;

        setIsSirenSounding(true);
        toast.success(isNepali ? '🚨 आपतकालीन ऐम्बुलेन्स साइरन सक्रिय' : '🚨 Ambulance Siren Activated');
      } catch (err) {
        console.warn('Siren audio error:', err);
        toast.error('Audio synthesizer unavailable');
      }
    }
  };

  // ── 5. Canvas Video Simulation Loop for CCTV ────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background
      if (isNightVision) {
        ctx.fillStyle = '#062006';
      } else {
        ctx.fillStyle = '#080d1a';
      }
      ctx.fillRect(0, 0, w, h);

      if (activeCamType === 'front') {
        // Front Dashcam Rendering: Animated mountain road perspective
        ctx.strokeStyle = isNightVision ? '#22c55e' : '#38bdf8';
        ctx.lineWidth = 2;

        // Sky / Mountain silhouettes
        ctx.fillStyle = isNightVision ? '#0a2e0a' : '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, h * 0.45);
        ctx.lineTo(w * 0.25, h * 0.32);
        ctx.lineTo(w * 0.5, h * 0.42);
        ctx.lineTo(w * 0.75, h * 0.3);
        ctx.lineTo(w, h * 0.45);
        ctx.lineTo(w, 0);
        ctx.lineTo(0, 0);
        ctx.fill();

        // Winding road surface
        ctx.fillStyle = isNightVision ? '#041804' : '#1e293b';
        ctx.beginPath();
        const roadCurve = Math.sin(frame * 0.03) * 60;
        ctx.moveTo(w * 0.48 + roadCurve * 0.2, h * 0.45);
        ctx.lineTo(w * 0.52 + roadCurve * 0.2, h * 0.45);
        ctx.lineTo(w * 0.95 + roadCurve, h);
        ctx.lineTo(w * 0.05 + roadCurve, h);
        ctx.closePath();
        ctx.fill();

        // Road center dashed line moving
        ctx.strokeStyle = isNightVision ? '#86efac' : '#facc15';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 25]);
        ctx.lineDashOffset = -frame * (selectedAmbulance.speedKmH > 0 ? 3 : 0);
        ctx.beginPath();
        ctx.moveTo(w * 0.5 + roadCurve * 0.2, h * 0.45);
        ctx.lineTo(w * 0.5 + roadCurve, h);
        ctx.stroke();
        ctx.setLineDash([]);

        // Front Hood of Ambulance
        ctx.fillStyle = isNightVision ? '#15803d' : '#dc2626';
        ctx.beginPath();
        ctx.moveTo(w * 0.2, h);
        ctx.lineTo(w * 0.35, h * 0.88);
        ctx.lineTo(w * 0.65, h * 0.88);
        ctx.lineTo(w * 0.8, h);
        ctx.closePath();
        ctx.fill();

        // Hood highlight / cross
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(w * 0.485, h * 0.9, w * 0.03, h * 0.06);
        ctx.fillRect(w * 0.465, h * 0.915, w * 0.07, h * 0.03);
      } else if (activeCamType === 'cabin') {
        // Patient Cabin Telemedicine Camera: Hospital Stretcher, Vitals Monitor & Paramedic
        // Cabin interior walls
        ctx.fillStyle = isNightVision ? '#052e16' : '#1e293b';
        ctx.fillRect(0, 0, w, h);

        // Medical Stretcher Bed
        ctx.fillStyle = '#334155';
        ctx.fillRect(w * 0.2, h * 0.45, w * 0.6, h * 0.45);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(w * 0.22, h * 0.42, w * 0.56, h * 0.08);

        // Patient silhouette on bed
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(w * 0.32, h * 0.42, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(w * 0.36, h * 0.44, w * 0.36, h * 0.25);

        // Oxygen mask and tubing
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.34, h * 0.42);
        ctx.lineTo(w * 0.38, h * 0.32);
        ctx.lineTo(w * 0.45, h * 0.28);
        ctx.stroke();

        // Paramedic silhouette attending
        ctx.fillStyle = '#f87171';
        ctx.beginPath();
        ctx.arc(w * 0.72, h * 0.35, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(w * 0.65, h * 0.42, w * 0.16, h * 0.4);

        // Live ECG Waveform on in-cabin monitor
        const ecgX = w * 0.04;
        const ecgY = h * 0.18;
        const ecgW = w * 0.28;
        const ecgH = h * 0.24;

        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(ecgX, ecgY, ecgW, ecgH);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.strokeRect(ecgX, ecgY, ecgW, ecgH);

        // Draw animated ECG heartbeat pulse
        ctx.beginPath();
        for (let i = 0; i < ecgW; i += 2) {
          const t = (frame * 4 + i) % 180;
          let yOffset = 0;
          if (t > 70 && t < 78) yOffset = -22;
          else if (t >= 78 && t < 84) yOffset = 38;
          else if (t >= 84 && t < 92) yOffset = -12;
          else if (t >= 110 && t < 125) yOffset = 6;

          const px = ecgX + i;
          const py = ecgY + ecgH * 0.5 + yOffset;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`HR: ${selectedAmbulance.patientTriage?.pulseBpm || 78} BPM`, ecgX + 8, ecgY + 20);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`SpO2: ${selectedAmbulance.patientTriage?.spo2 || 96}%`, ecgX + 8, ecgY + 38);
        ctx.fillStyle = '#facc15';
        ctx.fillText(`BP: ${selectedAmbulance.patientTriage?.bloodPressure || '120/80'}`, ecgX + 8, ecgY + 56);
      } else {
        // Rear Camera: Road receding, mountain slopes
        ctx.fillStyle = isNightVision ? '#041c04' : '#0f172a';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = isNightVision ? '#22c55e' : '#64748b';
        ctx.strokeRect(w * 0.25, h * 0.35, w * 0.5, h * 0.45);
        ctx.fillStyle = isNightVision ? '#86efac' : '#94a3b8';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isNepali ? 'पछाडिको ३६०° सडक तथा ब्याकअप क्यामेरा' : 'Rear 360° Backup View', w * 0.5, h * 0.5);
      }

      // Night Vision scanlines and green tint
      if (isNightVision) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 1);
        }
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.fillRect(0, 0, w, h);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeCamType, isNightVision, selectedAmbulance]);

  // Dispatch Pre-Arrival Notification to Hospital
  const handleSendHospitalAlert = () => {
    toast.success(
      isNepali
        ? `अस्पताल पूर्वसूचना सन्देश पठाइयो: ${selectedAmbulance.destinationHospital.nameNp} ट्रमा टिम अलर्ट!`
        : `Pre-Arrival notification sent to ${selectedAmbulance.destinationHospital.nameEn} Emergency Room!`
    );
  };

  // Capture Snapshot
  const handleCaptureSnapshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ambulance_${selectedAmbulance.vehicleNumber}_cctv_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(isNepali ? 'CCTV स्न्यापसट सुरक्षित गरियो' : 'CCTV Snapshot downloaded successfully');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', paddingBottom: '2.5rem' }}>
      
      {/* ── KPI FLEET STATUS BAR ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          className="dt-card"
          style={{
            borderLeft: '4px solid #ef4444',
            padding: '1.1rem 1.25rem',
            background: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {isNepali ? 'कुल ऐम्बुलेन्स (फ्लीट)' : 'Total Ambulance Fleet'}
            </span>
            <Truck size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
            {fleet.length} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{isNepali ? 'वटा' : 'Units'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.2rem' }}>
            {isNepali ? '४ वटै युनिट २४/७ जीपीएस तथा क्यामेरा अनलाइन' : 'All 4 units GPS & CCTV active'}
          </div>
        </div>

        <div
          className="dt-card"
          style={{
            borderLeft: '4px solid #f59e0b',
            padding: '1.1rem 1.25rem',
            background: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {isNepali ? 'सक्रिय उद्धारमा (In Transit)' : 'Active Emergency Runs'}
            </span>
            <HeartPulse size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#b45309', marginTop: '0.25rem' }}>
            {fleet.filter((a) => a.status === 'emergency_transit' || a.status === 'en_route_patient').length}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{isNepali ? 'सवारी' : 'Active'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.2rem' }}>
            {isNepali ? '१ बिरामी बोकी अस्पताल, १ घटनास्थल जाँदै' : '1 hospital transit, 1 en-route'}
          </div>
        </div>

        <div
          className="dt-card"
          style={{
            borderLeft: '4px solid #10b981',
            padding: '1.1rem 1.25rem',
            background: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {isNepali ? 'स्ट्यान्डबाइ तयार (Ready)' : 'Standby Base Ready'}
            </span>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803d', marginTop: '0.25rem' }}>
            {fleet.filter((a) => a.status === 'standby').length}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{isNepali ? 'सवारी' : 'Ready'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '0.2rem' }}>
            {isNepali ? 'तिम्बु र थाङपालकोट बेसमा तुरुन्त परिचालनयोग्य' : 'Timbu & Thangpalkot bases'}
          </div>
        </div>

        <div
          className="dt-card"
          style={{
            borderLeft: '4px solid #7c3aed',
            padding: '1.1rem 1.25rem',
            background: '#ffffff',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
              {isNepali ? 'प्रत्यक्ष CCTV स्ट्रिम' : 'Live CCTV Feeds'}
            </span>
            <Video size={20} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#6d28d9', marginTop: '0.25rem' }}>
            {fleet.reduce((acc, a) => acc + a.cctvChannels.length, 0)}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{isNepali ? 'च्यानल' : 'Feeds'}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600, marginTop: '0.2rem' }}>
            {isNepali ? 'सडक + क्याबिन टेलि-मेडिसिन FHD' : 'Road + In-Cabin Tele-Medicine'}
          </div>
        </div>
      </div>

      {/* ── FLEET SELECTOR TABS BAR ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        {fleet.map((amb) => {
          const isSelected = amb.id === selectedAmbId;
          const isEmergency = amb.status === 'emergency_transit' || amb.status === 'en_route_patient';

          return (
            <div
              key={amb.id}
              onClick={() => setSelectedAmbId(amb.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.1rem',
                borderRadius: '12px',
                border: isSelected ? '2px solid #ef4444' : '1.5px solid #e2e8f0',
                backgroundColor: isSelected ? '#fef2f2' : '#ffffff',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 14px rgba(239, 68, 68, 0.15)' : 'none',
                transition: 'all 0.15s ease',
                flexShrink: 0,
                minWidth: '240px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#ef4444' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                🚑
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isSelected ? '#991b1b' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isNepali ? amb.callSign : amb.callSignEn}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  {amb.vehicleNumber}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: amb.statusColor,
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: amb.statusColor }}>
                    {isNepali ? amb.statusNp : amb.statusEn}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN SPLIT VIEW: LIVE GPS MAP (LEFT) & ONBOARD CCTV VIEWPORT (RIGHT) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          gap: '1.25rem',
        }}
      >
        {/* LEFT COLUMN: INTERACTIVE LIVE GPS MAP */}
        <div
          className="dt-card"
          style={{
            padding: '1.25rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* Map Top Action Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Navigation size={18} color="#0284c7" />
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {isNepali ? 'लाइभ जीपीएस सडक नक्सा ट्र्याकिङ' : 'Live GPS Road Map Tracking'}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  fontWeight: 700,
                }}
              >
                {selectedAmbulance.speedKmH} km/h
              </span>
            </div>

            {/* Simulation & Map Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsSimulating(!isSimulating)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: isSimulating ? '#fef3c7' : '#ffffff',
                  color: isSimulating ? '#92400e' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                {isSimulating ? <Pause size={12} /> : <Play size={12} />}
                {isSimulating ? (isNepali ? 'रोक्नुहोस्' : 'Pause') : (isNepali ? 'सुरु गर्नुहोस्' : 'Resume')}
              </button>

              <button
                type="button"
                onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#0284c7',
                  cursor: 'pointer',
                }}
              >
                {simSpeed}x
              </button>

              <button
                type="button"
                onClick={() => setFollowVehicle(!followVehicle)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: followVehicle ? '#0284c7' : '#ffffff',
                  color: followVehicle ? '#ffffff' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Crosshair size={13} />
                {isNepali ? 'सवारी पछ्याउनुहोस्' : 'Follow'}
              </button>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '460px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
              border: '1px solid #cbd5e1',
            }}
          />

          {/* Active Ambulance GPS Telemetry Details Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.65rem',
              padding: '0.75rem',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.78rem',
            }}
          >
            <div>
              <span style={{ color: '#64748b' }}>{isNepali ? 'स्थान:' : 'Location:'}</span>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{isNepali ? selectedAmbulance.currentLocationNp : selectedAmbulance.currentLocationEn}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{isNepali ? 'गन्तव्य अस्पताल:' : 'Destination:'}</span>
              <div style={{ fontWeight: 700, color: '#dc2626' }}>{isNepali ? selectedAmbulance.destinationHospital.nameNp : selectedAmbulance.destinationHospital.nameEn}</div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{isNepali ? 'पुग्न लाग्ने समय (ETA):' : 'ETA Countdown:'}</span>
              <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.88rem' }}>
                {selectedAmbulance.destinationHospital.etaMinutes} {isNepali ? 'मिनेट' : 'mins'} ({selectedAmbulance.destinationHospital.distanceKm} km)
              </div>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{isNepali ? 'इन्धन तथा अक्सिजन:' : 'Fuel & Oxygen:'}</span>
              <div style={{ fontWeight: 700, color: '#0284c7' }}>
                ⛽ {selectedAmbulance.fuelLevelPercent}% | 💨 {selectedAmbulance.oxygenLevelPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ONBOARD CCTV CAMERA MONITORING VIEWPORT */}
        <div
          className="dt-card"
          style={{
            padding: '1.25rem',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* CCTV View Angle Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={18} color="#7c3aed" />
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {isNepali ? 'ऐम्बुलेन्स प्रत्यक्ष CCTV अनुगमन' : 'Onboard CCTV Live Surveillance'}
              </span>
            </div>

            {/* Camera angle switcher pills */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[
                { id: 'front', labelNp: '१. सडक (Road)', labelEn: '1. Front Dashcam' },
                { id: 'cabin', labelNp: '२. क्याबिन (Patient)', labelEn: '2. Patient Cabin' },
                { id: 'rear', labelNp: '३. पछाडि (Rear)', labelEn: '3. Rear View' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setActiveCamType(btn.id as any)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: activeCamType === btn.id ? '#7c3aed' : '#f1f5f9',
                    color: activeCamType === btn.id ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isNepali ? btn.labelNp : btn.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* High-Tech CCTV Viewport Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '320px',
              backgroundColor: '#050a14',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              border: isNightVision ? '2px solid #22c55e' : '1px solid #1e293b',
            }}
          >
            {/* Live Canvas Feed */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* CCTV HUD Top Overlay Bar */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'pulse 1s infinite' }} />
                  LIVE
                </span>
                <span style={{ color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  {activeCctvChannel.resolution} | {activeCctvChannel.fps} FPS
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  {selectedAmbulance.vehicleNumber}
                </span>
                <span style={{ color: '#22c55e', fontSize: '0.72rem', fontWeight: 800 }}>
                  4G LTE 98%
                </span>
              </div>
            </div>

            {/* Emergency Priority Alert Overlay Banner */}
            {selectedAmbulance.sirenActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
                  left: '12px',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(220, 38, 38, 0.85)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  animation: 'pulse 1.5s infinite',
                  pointerEvents: 'none',
                }}
              >
                🚨 {isNepali ? 'आपतकालीन प्राथमिकता साइरन सक्रिय' : 'EMERGENCY RUN - SIREN ACTIVE'}
              </div>
            )}

            {/* CCTV HUD Bottom Overlay Bar */}
            {telemetryOverlay && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                  pointerEvents: 'none',
                }}
              >
                <div>
                  <div>GPS: {selectedAmbulance.coords[0].toFixed(5)}°N, {selectedAmbulance.coords[1].toFixed(5)}°E</div>
                  <div>SPD: {selectedAmbulance.speedKmH} KM/H | HDG: {selectedAmbulance.headingDegrees}°</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>{new Date().toLocaleTimeString()} NPT</div>
                  <div style={{ color: '#38bdf8' }}>{isNepali ? selectedAmbulance.cctvChannels.find(c => c.viewType === (activeCamType === 'front' ? 'front_dashcam' : activeCamType === 'cabin' ? 'cabin_telemedicine' : 'rear_360'))?.nameNp : 'HD Stream'}</div>
                </div>
              </div>
            )}
          </div>

          {/* CCTV Quick Actions Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={toggleSirenAudio}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  border: isSirenSounding ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                  backgroundColor: isSirenSounding ? '#dc2626' : '#ffffff',
                  color: isSirenSounding ? '#ffffff' : '#991b1b',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  boxShadow: isSirenSounding ? '0 0 12px rgba(220, 38, 38, 0.6)' : 'none',
                }}
              >
                {isSirenSounding ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
                {isSirenSounding ? (isNepali ? 'साइरन चालु...' : 'Siren On...') : (isNepali ? 'साइरन बजाउनुहोस्' : 'Trigger Siren')}
              </button>

              <button
                type="button"
                onClick={() => setIsNightVision(!isNightVision)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: isNightVision ? '#15803d' : '#ffffff',
                  color: isNightVision ? '#ffffff' : '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Eye size={13} />
                {isNightVision ? (isNepali ? 'नाइट भिजन (चालु)' : 'Night Vision (ON)') : (isNepali ? 'नाइट भिजन' : 'Night Vision')}
              </button>

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Camera size={13} />
                {isNepali ? 'स्न्यापसट' : 'Snapshot'}
              </button>
            </div>

            <button
              type="button"
              onClick={handleSendHospitalAlert}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
              }}
            >
              <Building2 size={13} />
              {isNepali ? 'अस्पताल पूर्वसूचना (Pre-Arrival Alert)' : 'Hospital Pre-Arrival Alert'}
            </button>
          </div>

          {/* Patient Triage & Onboard Telemedicine Card */}
          {selectedAmbulance.patientTriage ? (
            <div
              style={{
                backgroundColor: '#fff7ed',
                border: '1.5px solid #fed7aa',
                borderRadius: '12px',
                padding: '0.9rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#9a3412', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <HeartPulse size={16} color="#ea580c" />
                  {isNepali ? 'सवार बिरामी स्वास्थ्य अवस्था (Tele-Triage)' : 'Onboard Patient Vitals (Tele-Triage)'}
                </span>
                <span
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {isNepali ? 'गम्भीर (Critical)' : 'Critical Condition'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: '#7c2d12' }}>{isNepali ? 'नाम/उमेर:' : 'Name/Age:'}</span>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>
                    {isNepali ? selectedAmbulance.patientTriage.nameNp : selectedAmbulance.patientTriage.nameEn} ({selectedAmbulance.patientTriage.age} वर्ष)
                  </div>
                </div>
                <div>
                  <span style={{ color: '#7c2d12' }}>SpO2 (अक्सिजन):</span>
                  <div style={{ fontWeight: 800, color: '#0284c7' }}>{selectedAmbulance.patientTriage.spo2}% (मास्क चालु)</div>
                </div>
                <div>
                  <span style={{ color: '#7c2d12' }}>{isNepali ? 'मुटुको धड्कन (Pulse):' : 'Pulse / HR:'}</span>
                  <div style={{ fontWeight: 800, color: '#16a34a' }}>{selectedAmbulance.patientTriage.pulseBpm} bpm</div>
                </div>
                <div>
                  <span style={{ color: '#7c2d12' }}>{isNepali ? 'रक्तचाप (BP):' : 'Blood Pressure:'}</span>
                  <div style={{ fontWeight: 800, color: '#b45309' }}>{selectedAmbulance.patientTriage.bloodPressure}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4 }}>
                <strong>{isNepali ? 'लक्षण:' : 'Complaint:'}</strong>{' '}
                {isNepali ? selectedAmbulance.patientTriage.chiefComplaintNp : selectedAmbulance.patientTriage.chiefComplaintEn}
              </div>

              {/* Direct call buttons to Driver and Paramedic */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                <a
                  href={`tel:${selectedAmbulance.driver.phone}`}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Phone size={12} color="#0284c7" />
                  {isNepali ? `चालक: ${selectedAmbulance.driver.nameNp}` : `Driver: ${selectedAmbulance.driver.nameEn}`}
                </a>
                <a
                  href={`tel:${selectedAmbulance.paramedic.phone}`}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <UserCheck size={12} color="#16a34a" />
                  {isNepali ? `प्यारामेडिक: ${selectedAmbulance.paramedic.nameNp.split(' ')[0]}` : `Medic: ${selectedAmbulance.paramedic.nameEn}`}
                </a>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.9rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.82rem',
              }}
            >
              {isNepali ? 'हाल कुनै बिरामी सवार छैन (सवारी स्ट्यान्डबाइ तयार अवस्थामा छ)' : 'No patient onboard currently (Vehicle is on standby ready)'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

