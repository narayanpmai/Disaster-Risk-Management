import React, { useEffect, useRef, useState } from 'react';
import type { SensorItem } from '../../api/municipality';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Compass,
  Activity,
  Layers,
  AlertTriangle,
  Waves,
  Navigation,
  Users,
  ShieldCheck,
  Zap,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface Terrain3DViewProps {
  sensors?: SensorItem[];
  settlements?: any[];
  height?: string;
  initialWaterRise?: number;
  initialShowEvacuation?: boolean;
  initialShowRiverRedZone?: boolean;
}

interface Point3D {
  x: number;
  y: number; // elevation
  z: number;
}

export const Terrain3DView: React.FC<Terrain3DViewProps> = ({
  sensors = [],
  settlements = [],
  height = '560px',
  initialWaterRise = 0,
  initialShowEvacuation = false,
  initialShowRiverRedZone = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationX, setRotationX] = useState<number>(0.55); // tilt angle
  const [rotationY, setRotationY] = useState<number>(0.75); // azimuth
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 3D Flood Inundation Simulator & Evacuation Route States
  const [waterRise, setWaterRise] = useState<number>(initialWaterRise);
  const [showEvacuationRoute, setShowEvacuationRoute] = useState<boolean>(initialShowEvacuation);
  const [showVulnerablePins, setShowVulnerablePins] = useState<boolean>(false);
  const [showRiverRedZone, setShowRiverRedZone] = useState<boolean>(initialShowRiverRedZone);

  // Panchpokhari Topographic Grid (Valley 1,200m -> 4,100m Peak)
  const gridSize = 24;
  const gridSpacing = 22;

  // Elevation generator modeled after Panchpokhari geography
  const getElevation = (gx: number, gz: number): number => {
    const nx = (gx - gridSize / 2) / (gridSize / 2);
    const nz = (gz - gridSize / 2) / (gridSize / 2);

    // River gorge running north-south in middle
    const riverValley = Math.exp(-Math.pow(nx * 3.5, 2)) * -45;

    // Mountain slopes rising steeply to North/East (Panchpokhari Range)
    const alpineSlope = (nz * 0.8 + 0.5) * 80 + Math.sin(nx * 3.0) * 20;

    // Rugged mountain ridgelines
    const ridges = Math.cos(nx * 5.0) * Math.sin(nz * 4.0) * 25;

    return Math.max(10, alpineSlope + riverValley + ridges + 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 560;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Gradient Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0a0f1d');
      skyGrad.addColorStop(0.65, '#1e293b');
      skyGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Starry sky / high altitude haze
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 45; i++) {
        const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (height * 0.4);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Projection parameters
      const centerX = width / 2;
      const centerY = height / 2 + 50;
      const scale = 1.1 * zoom;

      const project = (p: Point3D): { x: number; y: number; z: number } => {
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const fov = 450;
        const dist = z2 + 600;
        const projScale = (fov / dist) * scale;

        return {
          x: centerX + x1 * projScale,
          y: centerY - y2 * projScale,
          z: z2,
        };
      };

      const halfGrid = (gridSize * gridSpacing) / 2;

      // 1. Draw 3D Topographic Terrain Mesh
      for (let gx = 0; gx < gridSize; gx++) {
        for (let gz = 0; gz < gridSize; gz++) {
          const x0 = gx * gridSpacing - halfGrid;
          const z0 = gz * gridSpacing - halfGrid;
          const y0 = getElevation(gx, gz);

          const x1 = (gx + 1) * gridSpacing - halfGrid;
          const z1 = gz * gridSpacing - halfGrid;
          const y1 = getElevation(gx + 1, gz);

          const x2 = gx * gridSpacing - halfGrid;
          const z2 = (gz + 1) * gridSpacing - halfGrid;
          const y2 = getElevation(gx, gz + 1);

          const p0 = project({ x: x0, y: y0, z: z0 });
          const p1 = project({ x: x1, y: y1, z: z1 });
          const p2 = project({ x: x2, y: y2, z: z2 });

          const avgElev = (y0 + y1 + y2) / 3;
          let strokeColor = 'rgba(56, 189, 248, 0.25)'; // Valley
          let fillColor = 'rgba(14, 116, 144, 0.15)';

          if (avgElev > 120) {
            strokeColor = 'rgba(255, 255, 255, 0.6)'; // Snow peak
            fillColor = 'rgba(226, 232, 240, 0.25)';
          } else if (avgElev > 80) {
            strokeColor = 'rgba(52, 211, 153, 0.4)'; // Sub-alpine forest
            fillColor = 'rgba(16, 185, 129, 0.18)';
          } else if (avgElev > 45) {
            strokeColor = 'rgba(245, 158, 11, 0.35)'; // Middle hill terraced
            fillColor = 'rgba(217, 119, 6, 0.12)';
          }

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.fillStyle = fillColor;
          ctx.fill();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      const time = Date.now() * 0.003;

      // 2. Render Melamchi River Vector Path (Normal River)
      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < gridSize; i++) {
        const rx = Math.sin(i * 0.4) * 15;
        const rz = i * gridSpacing - halfGrid;
        const ry = getElevation(gridSize / 2, i) - 8;
        const rp = project({ x: rx, y: ry, z: rz });
        if (i === 0) ctx.moveTo(rp.x, rp.y);
        else ctx.lineTo(rp.x, rp.y);
      }
      ctx.stroke();

      // 2.5 Render 200m Riparian Red Zone Ribbon (When showRiverRedZone is true)
      if (showRiverRedZone) {
        const redZoneWidth = 44; // Represents 200m corridor on both banks in 3D scale
        for (let i = 0; i < gridSize - 1; i++) {
          const z0 = i * gridSpacing - halfGrid;
          const z1 = (i + 1) * gridSpacing - halfGrid;
          const cx0 = Math.sin(i * 0.4) * 15;
          const cx1 = Math.sin((i + 1) * 0.4) * 15;
          const y0 = getElevation(gridSize / 2, i) - 5;
          const y1 = getElevation(gridSize / 2, i + 1) - 5;

          const left0 = project({ x: cx0 - redZoneWidth, y: y0, z: z0 });
          const right0 = project({ x: cx0 + redZoneWidth, y: y0, z: z0 });
          const left1 = project({ x: cx1 - redZoneWidth, y: y1, z: z1 });
          const right1 = project({ x: cx1 + redZoneWidth, y: y1, z: z1 });

          ctx.beginPath();
          ctx.moveTo(left0.x, left0.y);
          ctx.lineTo(right0.x, right0.y);
          ctx.lineTo(right1.x, right1.y);
          ctx.lineTo(left1.x, left1.y);
          ctx.closePath();
          ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
          ctx.fill();

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Floating 3D Red Zone Label
        const rzMarker = project({ x: 0, y: getElevation(gridSize / 2, 4) + 14, z: 4 * gridSpacing - halfGrid });
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        const rzText = '🔴 नदी दुवैतर्फ २००m रेड जोन (भवन निर्माण निषेधित क्षेत्र)';
        ctx.font = 'bold 11px sans-serif';
        const rzw = ctx.measureText(rzText).width + 20;

        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(rzMarker.x - rzw / 2, rzMarker.y - 14, rzw, 24, 6);
        else ctx.rect(rzMarker.x - rzw / 2, rzMarker.y - 14, rzw, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fca5a5';
        ctx.fillText(rzText, rzMarker.x - rzw / 2 + 10, rzMarker.y + 2);
      }

      // 3. Render 3D Flood Inundation Twin Water Sheet (When waterRise > 0)
      if (waterRise > 0) {
        const waterHeightBoost = waterRise * 6.5;
        const waterAlpha = Math.min(0.75, 0.35 + waterRise * 0.08);

        // Flood Inundation Ribbon across the river gorge
        for (let i = 0; i < gridSize - 1; i++) {
          const z0 = i * gridSpacing - halfGrid;
          const z1 = (i + 1) * gridSpacing - halfGrid;

          // River center curve
          const cx0 = Math.sin(i * 0.4) * 15;
          const cx1 = Math.sin((i + 1) * 0.4) * 15;

          // Spread width increases with water rise
          const spreadWidth = 22 + waterRise * 14 + Math.sin(time + i) * 3;
          const yBase0 = getElevation(gridSize / 2, i) - 8 + waterHeightBoost;
          const yBase1 = getElevation(gridSize / 2, i + 1) - 8 + waterHeightBoost;

          const left0 = project({ x: cx0 - spreadWidth, y: yBase0, z: z0 });
          const right0 = project({ x: cx0 + spreadWidth, y: yBase0, z: z0 });
          const left1 = project({ x: cx1 - spreadWidth, y: yBase1, z: z1 });
          const right1 = project({ x: cx1 + spreadWidth, y: yBase1, z: z1 });

          // Fill water polygon
          ctx.beginPath();
          ctx.moveTo(left0.x, left0.y);
          ctx.lineTo(right0.x, right0.y);
          ctx.lineTo(right1.x, right1.y);
          ctx.lineTo(left1.x, left1.y);
          ctx.closePath();

          ctx.fillStyle = waterRise >= 4 ? `rgba(239, 68, 68, ${waterAlpha})` : `rgba(14, 165, 233, ${waterAlpha})`;
          ctx.fill();

          // Inundation Shoreline Wave
          ctx.strokeStyle = waterRise >= 4 ? '#f87171' : '#7dd3fc';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Floating Water Rise Label in 3D Space
        const midZ = 0;
        const midY = getElevation(gridSize / 2, gridSize / 2) + waterHeightBoost;
        const floodMarker = project({ x: 0, y: midY + 12, z: midZ });

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = waterRise >= 3 ? '#ef4444' : '#0284c7';
        ctx.lineWidth = 1.5;
        const fText = `🌊 डुबान सिमुलेटर: +${waterRise} मिटर (जलसतह)`;
        ctx.font = 'bold 11px sans-serif';
        const fw = ctx.measureText(fText).width + 20;

        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(floodMarker.x - fw / 2, floodMarker.y - 14, fw, 24, 6);
        else ctx.rect(floodMarker.x - fw / 2, floodMarker.y - 14, fw, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = waterRise >= 3 ? '#fca5a5' : '#7dd3fc';
        ctx.fillText(fText, floodMarker.x - fw / 2 + 10, floodMarker.y + 2);
      }

      // 4. Safe Evacuation Route Navigation (सुरक्षित निकास मार्ग)
      if (showEvacuationRoute) {
        // High-ground escape corridor from riverbed up along safe ridge to shelter
        const routeWaypoints = [
          { gx: 12, gz: 6, label: '🚨 जोखिम तटीय बस्ती (बगहा)' },
          { gx: 14, gz: 9, label: 'मार्शल डाँडा लिंक' },
          { gx: 16, gz: 13, label: 'अग्लो कृषि बाटो' },
          { gx: 18, gz: 17, label: 'सामुदायिक डाँडा' },
          { gx: 20, gz: 20, label: '🏢 सुरक्षित आश्रयस्थल (थाङपाल मा.वि.)' },
        ];

        // Draw animated glowing neon-green evacuation corridor
        ctx.beginPath();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 5;
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 10;
        routeWaypoints.forEach((wp, idx) => {
          const x = wp.gx * gridSpacing - halfGrid;
          const z = wp.gz * gridSpacing - halfGrid;
          const y = getElevation(wp.gx, wp.gz) + 5;
          const p = project({ x, y, z });
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Route dashes
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        routeWaypoints.forEach((wp, idx) => {
          const x = wp.gx * gridSpacing - halfGrid;
          const z = wp.gz * gridSpacing - halfGrid;
          const y = getElevation(wp.gx, wp.gz) + 5;
          const p = project({ x, y, z });
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Waypoint nodes
        routeWaypoints.forEach((wp, idx) => {
          const x = wp.gx * gridSpacing - halfGrid;
          const z = wp.gz * gridSpacing - halfGrid;
          const y = getElevation(wp.gx, wp.gz) + 5;
          const p = project({ x, y, z });

          ctx.beginPath();
          ctx.arc(p.x, p.y, idx === routeWaypoints.length - 1 ? 8 : 5, 0, Math.PI * 2);
          ctx.fillStyle = idx === routeWaypoints.length - 1 ? '#10b981' : '#f59e0b';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Waypoint text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(wp.label, p.x + 10, p.y - 4);
        });
      }

      // 5. Render 3D Spatial IoT Sensors
      sensors.forEach((s, idx) => {
        const gx = Math.min(gridSize - 1, Math.max(0, Math.floor(((s.longitude - 85.60) / 0.13) * gridSize)));
        const gz = Math.min(gridSize - 1, Math.max(0, Math.floor(((s.latitude - 27.93) / 0.12) * gridSize)));

        const x = gx * gridSpacing - halfGrid;
        const z = gz * gridSpacing - halfGrid;
        const y = getElevation(gx, gz) + 18;
        const p = project({ x, y, z });

        const isWarning = s.status === 'Warning' || s.status === 'Critical' || (waterRise >= 3 && s.type === 'water_level');
        const sensorColor = isWarning ? '#ef4444' : '#10b981';

        const groundP = project({ x, y: getElevation(gx, gz), z });
        ctx.beginPath();
        ctx.strokeStyle = sensorColor;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 2]);
        ctx.moveTo(groundP.x, groundP.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const pulse = (Math.sin(time + idx) * 0.5 + 0.5) * 8 + 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = sensorColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = sensorColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`📡 ${s.sensorId} (${s.lastValue} ${s.unit})`, p.x + 8, p.y + 3);
      });

      // 6. Render High-Risk Landslides & Vulnerable Settlements
      settlements.forEach((st: any, idx: number) => {
        const wardNumber = Number(st.wardNumber || st.ward_number || 1);
        const wardGridOffsets: Record<number, { gx: number; gz: number }> = {
          1: { gx: 18, gz: 19 },
          2: { gx: 15, gz: 16 },
          3: { gx: 12, gz: 14 },
          4: { gx: 8, gz: 12 },
          5: { gx: 6, gz: 9 },
          6: { gx: 10, gz: 8 },
          7: { gx: 14, gz: 5 },
          8: { gx: 7, gz: 4 },
        };
        const base = wardGridOffsets[wardNumber] || { gx: 10 + (idx % 5), gz: 10 + Math.floor(idx / 5) };
        const gx = Math.min(gridSize - 1, Math.max(0, base.gx + ((idx % 3) * 2 - 2)));
        const gz = Math.min(gridSize - 1, Math.max(0, base.gz + (Math.floor(idx / 3) * 2 - 1)));

        const x = gx * gridSpacing - halfGrid;
        const z = gz * gridSpacing - halfGrid;
        const groundY = getElevation(gx, gz);
        const y = groundY + 24;
        const p = project({ x, y, z });
        const groundP = project({ x, y: groundY, z });

        // Check if settlement is submerged under water rise
        const isSubmerged = waterRise > 0 && Math.abs(gx - gridSize / 2) <= (1 + waterRise * 0.8);

        const rLevel = String(st.riskLevel || st.risk_level || 'उच्च');
        const isCritical = rLevel.includes('उच्च') || isSubmerged;
        const hazardColor = isSubmerged ? '#38bdf8' : isCritical ? '#ef4444' : '#f59e0b';

        ctx.beginPath();
        ctx.strokeStyle = hazardColor;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([3, 2]);
        ctx.moveTo(groundP.x, groundP.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const pulse = (Math.sin(time * 1.5 + idx * 1.2) * 0.5 + 0.5) * 6 + 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = hazardColor;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.fillStyle = hazardColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        const sName = st.settlementName || st.settlement_name || st.name || 'जोखिम बस्ती';
        const labelText = isSubmerged ? `🌊 जलमग्न! ${sName}` : `⚠️ ${sName}`;
        const hhCount = st.atRiskHouseholds || st.at_risk_households || 0;
        const subText = isSubmerged ? `डुबान जोखिम | विस्थापित: ${hhCount * 4} जना` : `घरधुरी: ${hhCount} | ${rLevel}`;

        ctx.font = 'bold 11px sans-serif';
        const metrics = ctx.measureText(labelText);
        const tagWidth = Math.max(metrics.width, 115) + 14;
        const tagHeight = 28;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = hazardColor;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(p.x + 10, p.y - 18, tagWidth, tagHeight, 6);
        else ctx.rect(p.x + 10, p.y - 18, tagWidth, tagHeight);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(labelText, p.x + 16, p.y - 5);

        ctx.fillStyle = isSubmerged ? '#7dd3fc' : isCritical ? '#fca5a5' : '#fde68a';
        ctx.font = '9px sans-serif';
        ctx.fillText(subText, p.x + 16, p.y + 7);
      });

      // 7. Micro-Vulnerability Glowing Household Pins (When enabled)
      if (showVulnerablePins) {
        const vulnerableHouses = [
          { gx: 13, gz: 8, label: '🔴 सुत्केरी महिला (घर नं १२४)' },
          { gx: 11, gz: 11, label: '🟣 पूर्ण अपाङ्गता (घर नं ८९)' },
          { gx: 15, gz: 7, label: '🟠 ७५+ ज्येष्ठ नागरिक (घर नं ४५)' },
          { gx: 9, gz: 14, label: '🔴 सुत्केरी तथा बालबालिका (घर नं १७)' },
        ];

        vulnerableHouses.forEach((vh, idx) => {
          const x = vh.gx * gridSpacing - halfGrid;
          const z = vh.gz * gridSpacing - halfGrid;
          const y = getElevation(vh.gx, vh.gz) + 14;
          const p = project({ x, y, z });

          ctx.beginPath();
          ctx.arc(p.x, p.y, 6 + Math.sin(time * 2 + idx) * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9.5px sans-serif';
          ctx.fillText(vh.label, p.x + 8, p.y + 3);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [rotationX, rotationY, zoom, sensors, settlements, waterRise, showEvacuationRoute, showVulnerablePins, showRiverRedZone]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotationY((prev) => prev + deltaX * 0.008);
    setRotationX((prev) => Math.max(0.15, Math.min(1.25, prev - deltaY * 0.008)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetCamera = () => {
    setRotationX(0.55);
    setRotationY(0.75);
    setZoom(1.0);
  };

  // Stats calculation
  const inundatedHouseholds = waterRise * 6;
  const inundatedPopulation = waterRise * 26;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={(e) => {
        e.preventDefault();
        setZoom((prev) => Math.max(0.6, Math.min(2.0, prev - e.deltaY * 0.001)));
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Top HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          padding: '0.45rem 0.85rem',
          color: '#ffffff',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          flexWrap: 'wrap',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Layers size={14} color="#38bdf8" />
          <span>३D विपद् जोखिम भू-धरातल</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
          <Compass size={14} />
          <span>{Math.round((rotationY * 180) / Math.PI) % 360}° | {Math.round((rotationX * 180) / Math.PI)}°</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981' }}>
          <Activity size={14} />
          <span>{sensors.length} IoT स्टेशन</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontWeight: 600 }}>
          <AlertTriangle size={14} />
          <span>{settlements.length} पहिरो क्षेत्र</span>
        </div>
        {waterRise > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontWeight: 700 }}>
            <Waves size={14} />
            <span>बाढी: +{waterRise}m ({inundatedHouseholds} घरधुरी जोखिम)</span>
          </div>
        )}
      </div>

      {/* Bottom Center: Interactive 3D Inundation Simulator & Evacuation Controller */}
      <div
        style={{
          position: 'absolute',
          bottom: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          padding: '0.5rem 1rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 20,
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
          flexWrap: 'wrap',
        }}
      >
        {/* Water Rise Slider Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Waves size={14} /> जलसतह वृद्धि:
          </span>
          <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255, 255, 255, 0.1)', padding: '2px', borderRadius: '6px' }}>
            {[0, 1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setWaterRise(lvl)}
                style={{
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: waterRise === lvl ? (lvl >= 4 ? '#ef4444' : lvl >= 2 ? '#f59e0b' : '#0284c7') : 'transparent',
                  color: '#ffffff',
                  transition: 'all 0.15s ease',
                }}
                title={lvl === 0 ? 'सामान्य नदी बहाव' : `जलसतह ${lvl} मिटर वृद्धि हुँदा डुबान क्षेत्र सिमुलेशन`}
              >
                {lvl === 0 ? 'सामान्य' : `+${lvl}m`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '1px', height: '22px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Safe Evacuation Route Toggle */}
        <button
          onClick={() => setShowEvacuationRoute((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '4px 10px',
            borderRadius: '6px',
            border: showEvacuationRoute ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: showEvacuationRoute ? 'rgba(16, 185, 129, 0.3)' : 'transparent',
            color: showEvacuationRoute ? '#6ee7b7' : '#e2e8f0',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="बाढीले नकाटिने अग्लो भू-भाग हुँदै सुरक्षित आश्रयस्थल जाने बाटो"
        >
          <Navigation size={13} color={showEvacuationRoute ? '#34d399' : '#e2e8f0'} />
          <span>{showEvacuationRoute ? '✓ निकास मार्ग सक्रिय' : '🚶‍♂️ सुरक्षित निकास मार्ग'}</span>
        </button>

        {/* Micro-Vulnerability Pins Toggle */}
        <button
          onClick={() => setShowVulnerablePins((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '4px 10px',
            borderRadius: '6px',
            border: showVulnerablePins ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: showVulnerablePins ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
            color: showVulnerablePins ? '#fca5a5' : '#e2e8f0',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="सुत्केरी, अपाङ्गता, ७० वर्षमाथिका ज्येष्ठ नागरिकका घरधुरी ३D मा देखाउनुहोस्"
        >
          <Users size={13} color={showVulnerablePins ? '#ef4444' : '#e2e8f0'} />
          <span>{showVulnerablePins ? '✓ अति-संवेदनशील पिन' : '🔴 संवेदनशील नागरिक'}</span>
        </button>

        {/* 200m River Red Zone Ribbon Toggle */}
        <button
          onClick={() => setShowRiverRedZone((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '4px 10px',
            borderRadius: '6px',
            border: showRiverRedZone ? '1.5px solid #dc2626' : '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: showRiverRedZone ? 'rgba(220, 38, 38, 0.45)' : 'transparent',
            color: showRiverRedZone ? '#fca5a5' : '#e2e8f0',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: showRiverRedZone ? '0 0 10px rgba(220, 38, 38, 0.6)' : 'none',
          }}
          title="नदी किनार २०० मिटर रेड जोन (भवन निर्माण निषेधित क्षेत्र) ३D मा देखाउनुहोस्"
        >
          <ShieldAlert size={13} color={showRiverRedZone ? '#f87171' : '#e2e8f0'} />
          <span>{showRiverRedZone ? '✓ २००m रेड जोन सक्रिय' : '🌊 २००m रेड जोन'}</span>
        </button>
      </div>

      {/* Floating Camera Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.2))}
          title="Zoom In"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Maximize2 size={15} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          title="Zoom Out"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Minimize2 size={15} />
        </button>
        <button
          onClick={handleResetCamera}
          title="क्यामेरा रिसेट गर्नुहोस्"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#38bdf8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
};

export default Terrain3DView;
