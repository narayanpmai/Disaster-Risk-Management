import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  ShieldCheck,
  Waves,
  Mountain,
  Video,
  Camera,
  Activity,
  PhoneCall,
  RefreshCw,
  CheckCircle2,
  Clock,
  Radio,
  Eye,
  Tent,
  ExternalLink,
  Droplets,
  Zap,
  Users,
  MapPin,
  Volume2,
  VolumeX,
  Gauge,
  Compass,
  ArrowRight,
  Sparkles,
  Package,
  Layers,
  Thermometer,
  Wind,
  Coins,
  Truck,
  WifiOff,
} from 'lucide-react';
import { municipalityApi, type SensorItem, type CameraItem } from '../../api/municipality';
import { disasterApi, type Shelter, type EmergencyContact, type DisasterEvent } from '../../api/disaster';
import { IvrVoiceSirenModule } from '../../features/disaster/components/IvrVoiceSirenModule';
import { MicroVulnerabilityTab } from '../../features/disaster/components/MicroVulnerabilityTab';
import { RdraAssessmentTab } from '../../features/disaster/components/RdraAssessmentTab';
import { HeavyEquipmentSarTab } from '../../features/disaster/components/HeavyEquipmentSarTab';
import { OfflineMeshRadioTab } from '../../features/disaster/components/OfflineMeshRadioTab';
import { Terrain3DView } from '../../components/maps/Terrain3DView';

// Real-time Emergency Relief Materials Stock
const RELIEF_SUPPLIES_STOCK = [
  { item: 'आपतकालीन त्रिपाल (Heavy Duty Tarpaulins)', qty: '३५० थान', available: 'उपलब्ध', color: '#0284c7' },
  { item: 'लाइफ ज्याकेट तथा सुरक्षा डोरी (Life Jackets & Ropes)', qty: '१२० सेट', available: 'उपलब्ध', color: '#16a34a' },
  { item: 'प्राथमिक उपचार तथा औषधि किट (First Aid Kits)', qty: '७५ बक्स', available: 'उपलब्ध', color: '#dc2626' },
  { item: 'ड्राइ फुड तथा पोषण आहार (Emergency Ration Packs)', qty: '५०० प्याकेट', available: 'उपलब्ध', color: '#d97706' },
  { item: 'पोर्टेबल जेनेरेटर तथा सोलार ब्याट्री युनिट', qty: '८ युनिट', available: 'स्ट्यान्डबाइ', color: '#7c3aed' },
  { item: 'पहिरो पन्छाउने खोज-उद्धार किट (Shovels & Digging Kits)', qty: '६० सेट', available: 'उपलब्ध', color: '#0f172a' },
];

// Verified Landslide High-Risk Zones
const LANDSLIDE_ZONES = [
  {
    id: 'zone-1',
    name: 'मानेखर्क डाँडागाउँ भिरालो क्षेत्र',
    wardNo: 4,
    riskLevel: 'high',
    sensorId: 'SEN-MAN-03',
    sensorName: 'मानेखर्क इन्क्लिनोमिटर',
    movementRate: '१.१ mm/hr',
    dangerThreshold: '२.५ mm/hr',
    soilMoisture: '६८% (संतृप्त)',
    householdsAtRisk: 35,
    safeShelter: 'थाङपाल भ्याली मा.वि. आश्रयस्थल',
    status: 'सचेत अनुगमन जारी',
    description: 'ढुङ्गेनी भिरालो सतह, निरन्तर वर्षा हुँदा धाँजा फाट्ने जोखिम। स्थानीय विपद् समितिलाई सतर्क राखिएको।'
  },
  {
    id: 'zone-2',
    name: 'थाङपालकोट कृषि सडक खण्ड',
    wardNo: 6,
    riskLevel: 'moderate',
    sensorId: 'SEN-MEL-01',
    sensorName: 'सडक कटान अनुगमन',
    movementRate: '०.४ mm/hr',
    dangerThreshold: '२.० mm/hr',
    soilMoisture: '५४% (सामान्य)',
    householdsAtRisk: 12,
    safeShelter: 'छिम्ती आधारभूत विद्यालय हल',
    status: 'सवारी आवागमन खुला',
    description: 'भिरालो ढलानबाट माटो खस्ने जोखिम भए तापनि सडक डिभिजन र गाउँपालिका डोजर स्ट्यान्डबाइ राखिएको।'
  },
  {
    id: 'zone-3',
    name: 'भोताङ-याङ्ग्री पदमार्ग तथा भिरालो क्षेत्र',
    wardNo: 2,
    riskLevel: 'moderate',
    sensorId: 'SEN-BHO-02',
    sensorName: 'भोताङ वर्षा गेज',
    movementRate: '०.६ mm/hr',
    dangerThreshold: '२.० mm/hr',
    soilMoisture: '६२%',
    householdsAtRisk: 18,
    safeShelter: 'भोताङ सामुदायिक भवन',
    status: 'सावधानीपूर्वक यात्रा',
    description: 'वर्षायाममा छिमिटि खोला आसपास बाटो चिप्लो हुने र ढुङ्गा खस्ने जोखिम।'
  },
  {
    id: 'zone-4',
    name: 'तिम्बु-मेलम्ची नदी कटान तटीय बस्ती',
    wardNo: 7,
    riskLevel: 'high',
    sensorId: 'SEN-GUN-04',
    sensorName: 'गुन्सा बाढी साइरन तथा गेज',
    movementRate: '१.४ mm/hr (कटान दर)',
    dangerThreshold: '२.५ mm/hr',
    soilMoisture: '७५% (उच्च)',
    householdsAtRisk: 42,
    safeShelter: 'गुन्सा वडा सामुदायिक हल',
    status: 'तटीय गस्ती परिचालन',
    description: 'नदीको धार बस्तीतर्फ सोझिने जोखिम। ग्याबियन पर्खाल निर्माण तथा नेपाल प्रहरी टोली तैनाथ।'
  }
];

export const Disaster: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const validTabs = [
    'river_twin',
    'landslide',
    'siren',
    'micro_vulnerability',
    'rdra_damage',
    'heavy_equipment',
    'offline_mesh',
    'cameras',
    'shelters',
    'hotlines',
  ] as const;
  type TabType = typeof validTabs[number];

  const getTabFromLocation = (): TabType => {
    const p = location.pathname;
    if (p.includes('/landslide')) return 'landslide';
    if (p.includes('/siren')) return 'siren';
    if (p.includes('/micro-vulnerability') || p.includes('/vulnerability')) return 'micro_vulnerability';
    if (p.includes('/rdra') || p.includes('/damage')) return 'rdra_damage';
    if (p.includes('/heavy-equipment') || p.includes('/sar')) return 'heavy_equipment';
    if (p.includes('/offline-mesh') || p.includes('/radio')) return 'offline_mesh';
    if (p.includes('/shelters')) return 'shelters';
    if (p.includes('/cameras') || p.includes('/cctv')) return 'cameras';
    if (p.includes('/hotlines') || p.includes('/eoc')) return 'hotlines';
    if (p.includes('/river-twin')) return 'river_twin';
    const queryTab = searchParams.get('tab') as TabType | null;
    if (queryTab && validTabs.includes(queryTab)) return queryTab;
    return 'river_twin';
  };

  const [activePublicTab, setActivePublicTab] = useState<TabType>(getTabFromLocation);

  useEffect(() => {
    const matched = getTabFromLocation();
    if (matched !== activePublicTab) {
      setActivePublicTab(matched);
    }
  }, [location.pathname, searchParams]);

  const changeTab = (tabId: TabType) => {
    setActivePublicTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const pageMeta: Record<TabType, { badge: string; badgeIcon: React.ReactNode; title: string; desc: string; bannerGradient: string; iconWatermark: React.ReactNode }> = {
    river_twin: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — स्वचालित जलसतह टेलिमेट्री तथा बाढी डिजिटल ट्विन',
      badgeIcon: <Waves size={16} color="#38bdf8" />,
      title: 'मेलम्ची-इन्द्रावती नदी जलसतह तथा बाढी पूर्वसूचना प्रणाली',
      desc: 'थाङपालधाप र गुन्सा स्वचालित IoT राडार जलसतह गेज, मेलम्ची खोलाको प्रत्यक्ष जलस्तर अनुगमन तथा सम्भावित बाढीको पूर्वचेतावनी डिजिटल ट्विन।',
      bannerGradient: 'linear-gradient(135deg, #0b192c 0%, #1e3e62 50%, #001f3f 100%)',
      iconWatermark: <Waves size={360} color="#38bdf8" />,
    },
    landslide: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — पहिरो संवेदनशीलता, धाँजा तथा इन्क्लिनोमिटर अनुगमन',
      badgeIcon: <Mountain size={16} color="#eab308" />,
      title: 'पहिरो जोखिम, धाँजा तथा इन्क्लिनोमिटर चाल पूर्वसूचना प्रणाली',
      desc: 'मानेखर्क डाँडागाउँ, सेर्माथाङ र भिरालो बस्तीहरूमा जडित उच्च-सटीक इन्क्लिनोमिटर, माटोको आर्द्रता (Soil Moisture) तथा भौगर्भिक चालको प्रत्यक्ष अनुगमन।',
      bannerGradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 50%, #292524 100%)',
      iconWatermark: <Mountain size={360} color="#eab308" />,
    },
    siren: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — स्वचालित आपतकालीन IVR भ्वाइस कल तथा मेश-साइरन',
      badgeIcon: <Radio size={16} color="#ef4444" />,
      title: 'स्वचालित भ्वाइस कल (IVR Alert) तथा अफलाइन सौर्य-साइरन (LoRa Mesh)',
      desc: 'खतरा विन्दु पार हुनासाथ तटीय बासिन्दालाई नेपाली भाषामा स्वचालित फोन कल र बिना इन्टरनेट ५-१० कि.मी. टाढासम्म आवाज दिने सौर्य-साइरन।',
      bannerGradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #3f0909 100%)',
      iconWatermark: <Radio size={360} color="#ef4444" />,
    },
    micro_vulnerability: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — ५,८०५ घरधुरी डाटा अन्तर-आबद्धता (Micro-Vulnerability Index)',
      badgeIcon: <Users size={16} color="#ec4899" />,
      title: 'अति-संवेदनशील नागरिक तथा आवास संरचनात्मक जोखिम वर्गीकरण',
      desc: 'सुत्केरी, पूर्ण अपाङ्गता, ७० वर्षमाथिका ज्येष्ठ नागरिक र भत्कने उच्च जोखिम रहेका काँचो ढुङ्गा-माटोका घरहरूको प्राथमिकता उद्धार व्यवस्थापन।',
      bannerGradient: 'linear-gradient(135deg, #701a75 0%, #86198f 50%, #4a044e 100%)',
      iconWatermark: <Users size={360} color="#ec4899" />,
    },
    rdra_damage: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — गृह मन्त्रालय "विपद् राहत मापदण्ड २०७७" आधारित',
      badgeIcon: <Coins size={16} color="#10b981" />,
      title: 'द्रुत क्षति मूल्याङ्कन (Mobile RDRA) र प्रत्यक्ष बैंक राहत (DBT)',
      desc: 'घटनास्थलको फोटो र GPS सहित सरकारी दर (पूर्ण क्षति रु ५ लाख, आंशिक रु ५० हजार) स्वतः हिसाब भई सिधै बैंक खातामा क्षतिपूर्ति सिफारिस।',
      bannerGradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)',
      iconWatermark: <Coins size={360} color="#10b981" />,
    },
    heavy_equipment: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — खोज तथा उद्धार (SAR) र हेभी इक्युपमेन्ट डाइरेक्टरी',
      badgeIcon: <Truck size={16} color="#f59e0b" />,
      title: 'डोजर/एक्साभेटर लाइभ डाइरेक्टरी तथा स्थानीय स्वयंसेवक कार्यदल',
      desc: 'पालिका तथा निजी डोजर, एक्साभेटर, र्याफ्टिङ बोट र तालिमप्राप्त ६४ जना स्थानीय स्वयंसेवक दलको स्ट्यान्डबाइ नक्सा र सम्पर्क नम्बर।',
      bannerGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
      iconWatermark: <Truck size={360} color="#f59e0b" />,
    },
    offline_mesh: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — विपद् प्रतिरोधी शून्य-इन्टरनेट अफलाइन प्रणाली',
      badgeIcon: <WifiOff size={16} color="#6366f1" />,
      title: 'अफलाइन सञ्चालन (Offline PWA) र आपतकालीन VHF रेडियो फ्रिक्वेन्सी',
      desc: 'इन्टरनेट र टेलिकम टावर बन्द हुँदा पनि लोकल वाईफाईबाट खुल्ने र नेपाल प्रहरी, सशस्त्र प्रहरी तथा EOC बीचको VHF रेडियो फ्रिक्वेन्सी लिङ्केज।',
      bannerGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
      iconWatermark: <WifiOff size={360} color="#6366f1" />,
    },
    shelters: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — सुरक्षित आश्रयस्थल प्रमाणीकरण तथा राहत सामग्री मौज्दात',
      badgeIcon: <Tent size={16} color="#10b981" />,
      title: 'सुरक्षित आश्रयस्थल (Evacuation Shelters) तथा राहत मौज्दात प्रणाली',
      desc: 'पालिकाका सबै ८ वटै वडामा प्रमाणीकरण गरिएका १,३१० जना क्षमताका ६ वटा सुरक्षित आश्रयस्थल, वडा सम्पर्क व्यक्ति, र आपतकालीन त्रिपाल/औषधि मौज्दात।',
      bannerGradient: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #022c22 100%)',
      iconWatermark: <Tent size={360} color="#10b981" />,
    },
    cameras: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — २४/७ प्रत्यक्ष CCTV क्यामेरा भिडियो सर्भिलेन्स',
      badgeIcon: <Video size={16} color="#a855f7" />,
      title: 'उच्च जोखिम क्षेत्र प्रत्यक्ष CCTV क्यामेरा लाइभ सर्भिलेन्स',
      desc: 'मेलम्ची नदी पुल, गाम्चेत बजार, मानेखर्क भिरालो क्षेत्र र पालिका प्रवेशद्वारमा जडित २४/७ प्रत्यक्ष हाई-डेफिनिसन क्यामेरा भिडियो निगरानी कक्ष।',
      bannerGradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #2e1065 100%)',
      iconWatermark: <Video size={360} color="#a855f7" />,
    },
    hotlines: {
      badge: 'पाँचपोखरी थाङपाल गाउँपालिका — २४/७ आपतकालीन कार्यसञ्चालन केन्द्र (EOC) हटलाइन',
      badgeIcon: <PhoneCall size={16} color="#f97316" />,
      title: 'आपतकालीन नियन्त्रण कक्ष (EOC) तथा खोज-उद्धार टेलिफोन डाइरेक्टरी',
      desc: 'नेपाल प्रहरी, सशस्त्र प्रहरी बल, प्राथमिक उपचार एम्बुलेन्स सेवा, स्वास्थ्य चौकी र वडास्तरीय विपद् फोकल पर्सनहरूको २४/७ हटलाइन डाइरेक्टरी।',
      bannerGradient: 'linear-gradient(135deg, #431407 0%, #7c2d12 50%, #270d05 100%)',
      iconWatermark: <PhoneCall size={360} color="#f97316" />,
    },
  };
  const [selectedRiverSensor, setSelectedRiverSensor] = useState<string>('SEN-MEL-01');
  const [isSirenTesting, setIsSirenTesting] = useState<boolean>(false);
  const [shelterWardFilter, setShelterWardFilter] = useState<number | 'all'>('all');
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Queries
  const { data: sensors = [], isLoading: isSensorsLoading, refetch: refetchSensors } = useQuery<SensorItem[]>({
    queryKey: ['public-sensors'],
    queryFn: () => municipalityApi.getSensors(),
    refetchInterval: 8000,
  });

  const { data: cameras = [], isLoading: isCamerasLoading, refetch: refetchCameras } = useQuery<CameraItem[]>({
    queryKey: ['public-cameras'],
    queryFn: () => municipalityApi.getCameras(),
    refetchInterval: 15000,
  });

  const { data: contacts = [], isLoading: isContactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ['public-contacts'],
    queryFn: () => disasterApi.getContacts(),
  });

  const { data: vulnerableSettlements = [] } = useQuery<any[]>({
    queryKey: ['public-vulnerable-settlements'],
    queryFn: () => disasterApi.getSettlements().then((r: any) => Array.isArray(r) ? r : (r?.data || [])).catch(() => []),
  });

  const { data: shelters = [], isLoading: isSheltersLoading } = useQuery<Shelter[]>({
    queryKey: ['public-shelters'],
    queryFn: () => disasterApi.getShelters(),
  });

  const { data: events = [] } = useQuery<DisasterEvent[]>({
    queryKey: ['disaster-events-public'],
    queryFn: () => disasterApi.getEvents(),
  });

  const activeAlerts = sensors.filter(s => s.status === 'Warning' || s.status === 'Critical');

  // Find River Sensor & Bhotang Rain Gauge
  const melamchiSensor = sensors.find(s => s.sensorId === 'SEN-MEL-01') || {
    sensorId: 'SEN-MEL-01',
    name: 'मेलम्ची खोला जलसतह सेन्सर (थाङपालधाप)',
    lastValue: 3.2,
    unit: 'm',
    dangerThreshold: 5.5,
    status: 'Normal',
    location: 'थाङपालधाप मेलम्ची पुल (Ward 3)',
  };

  const gunsaSensor = sensors.find(s => s.sensorId === 'SEN-GUN-04') || {
    sensorId: 'SEN-GUN-04',
    name: 'गुन्सा बाढी सतर्कता साइरन तथा गेज',
    lastValue: 2.7,
    unit: 'm',
    dangerThreshold: 4.8,
    status: 'Normal',
    location: 'गुन्सा तटीय क्षेत्र (Ward 5)',
  };

  const bhotangRainSensor = sensors.find(s => s.sensorId === 'SEN-BHO-02') || {
    sensorId: 'SEN-BHO-02',
    name: 'भोताङ स्वचालित वर्षा मापन केन्द्र',
    lastValue: 42.0,
    unit: 'mm',
    dangerThreshold: 80.0,
    status: 'Normal',
    location: 'भोताङ वडा कार्यालय (Ward 2)',
  };

  const manekharkaSensor = sensors.find(s => s.sensorId === 'SEN-MAN-03') || {
    sensorId: 'SEN-MAN-03',
    name: 'मानेखर्क पहिरो इन्क्लिनोमिटर',
    lastValue: 1.1,
    unit: 'mm/hr',
    dangerThreshold: 2.5,
    status: 'Normal',
    location: 'मानेखर्क भिरालो क्षेत्र (Ward 4)',
  };

  const activeGauge = selectedRiverSensor === 'SEN-GUN-04' ? gunsaSensor : melamchiSensor;
  const gaugeThreshold = activeGauge.dangerThreshold || 5.5;
  const gaugeWarningThreshold = gaugeThreshold * 0.8;
  const gaugeCurrentVal = activeGauge.lastValue || 3.2;
  const gaugePct = Math.min(Math.round((gaugeCurrentVal / 7.0) * 100), 100);

  // Siren Audio Simulator using Web Audio API
  const handleToggleSirenTest = () => {
    if (isSirenTesting) {
      setIsSirenTesting(false);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    } else {
      setIsSirenTesting(true);
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          gain.gain.setValueAtTime(0.08, ctx.currentTime);

          // Alternating Dual Tone Siren Modulation (750Hz <-> 1000Hz)
          const now = ctx.currentTime;
          osc.frequency.setValueAtTime(750, now);
          osc.frequency.linearRampToValueAtTime(1050, now + 0.5);
          osc.frequency.linearRampToValueAtTime(750, now + 1.0);
          osc.frequency.linearRampToValueAtTime(1050, now + 1.5);
          osc.frequency.linearRampToValueAtTime(750, now + 2.0);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();

          setTimeout(() => {
            if (osc) {
              try { osc.stop(); } catch (e) {}
            }
            if (ctx && ctx.state !== 'closed') {
              ctx.close();
            }
            setIsSirenTesting(false);
          }, 3500);
        }
      } catch (err) {
        console.warn('Web Audio siren playback error:', err);
        setTimeout(() => setIsSirenTesting(false), 3000);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const filteredShelters = shelters.filter(sh => {
    if (shelterWardFilter === 'all') return true;
    return sh.wardNumber === shelterWardFilter;
  });

  const currentMeta = pageMeta[activePublicTab] || pageMeta.river_twin;

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '1.5rem 1rem 3.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Banner with Dynamic Meta according to Selected Single Module */}
      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: currentMeta.bannerGradient,
        color: '#ffffff',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 35px -10px rgba(11, 25, 44, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        transition: 'background 0.3s ease',
      }}>
        {/* Dynamic Watermark */}
        <div style={{
          position: 'absolute',
          right: '-40px',
          bottom: '-30px',
          opacity: 0.12,
          pointerEvents: 'none',
        }}>
          {currentMeta.iconWatermark}
        </div>

        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(8px)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}>
            {currentMeta.badgeIcon} <span>{currentMeta.badge}</span>
          </div>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, lineHeight: 1.25, margin: '0 0 0.85rem 0', letterSpacing: '-0.5px' }}>
            {currentMeta.title}
          </h1>
          
          <p style={{ fontSize: '1.02rem', lineHeight: 1.65, opacity: 0.92, margin: '0 0 1.75rem 0' }}>
            {currentMeta.desc}
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleToggleSirenTest}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: isSirenTesting ? '#dc2626' : 'rgba(239, 68, 68, 0.2)',
                color: '#ffffff',
                border: '1.5px solid #ef4444',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: isSirenTesting ? '0 0 20px rgba(239, 68, 68, 0.8)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {isSirenTesting ? <Volume2 size={18} className="animate-pulse" /> : <Radio size={18} />}
              {isSirenTesting ? '🚨 साइरन ध्वनि परीक्षण जारी...' : '🚨 आपतकालीन साइरन परीक्षण (Test Siren)'}
            </button>

            <button
              onClick={() => window.open('/gis-map?filter=shelter', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#bae6fd',
                border: '1px solid rgba(186, 230, 253, 0.4)',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Compass size={18} /> ३D GIS विपद् जोखिम नक्सा
            </button>

            <a
              href="tel:011460123"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.92rem',
                transition: 'all 0.2s'
              }}
            >
              <PhoneCall size={18} /> २४/७ EOC हटलाइन: ०११-४६०१२३
            </a>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner if threshold crossed */}
      {activeAlerts.length > 0 ? (
        <div style={{
          marginBottom: '1.75rem',
          padding: '1.25rem 1.5rem',
          borderRadius: '14px',
          backgroundColor: '#fef2f2',
          border: '2px solid #ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 6px 18px rgba(239, 68, 68, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={26} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#991b1b' }}>
                🚨 उच्च बाढी/पहिरो पूर्वसूचना: {activeAlerts.map(a => a.name).join(', ')} खतरा स्तर पार!
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#b91c1c' }}>
                तटीय क्षेत्र तथा भिरालो जमिन आसपासका नागरिकहरू तुरुन्तै सतर्क रहनुहोला र आवश्यक परे नजिकको सुरक्षित आश्रयस्थलमा जानुहोला।
              </p>
            </div>
          </div>
          <a
            href="tel:011460123"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <PhoneCall size={16} /> २४/७ EOC हटलाइन: ०११-४६०१२३
          </a>
        </div>
      ) : (
        <div style={{
          marginBottom: '1.75rem',
          padding: '0.9rem 1.25rem',
          borderRadius: '12px',
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #86efac',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534' }}>
              वर्तमान अवस्था सामान्य: मेलम्ची तथा गुन्सा जलसतह खतरा विन्दुभन्दा तल (सुरक्षित स्तर ३.२ मी.)
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
            अन्तिम टेलिमेट्री सिङ्क: {new Date().toLocaleTimeString()} NPT
          </span>
        </div>
      )}

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -2px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.9rem', borderRadius: '12px' }}>
            <Waves size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>मेलम्ची नदी जलसतह</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0369a1', marginTop: '0.1rem' }}>
              {melamchiSensor.lastValue} मी.
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -2px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dbeafe', color: '#1d4ed8', padding: '0.9rem', borderRadius: '12px' }}>
            <CloudRain size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>भोताङ वर्षा (२४ घण्टा)</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e40af', marginTop: '0.1rem' }}>
              {bhotangRainSensor.lastValue} मि.मि.
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -2px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#b45309', padding: '0.9rem', borderRadius: '12px' }}>
            <Mountain size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>मानेखर्क पहिरो चाल</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', marginTop: '0.1rem' }}>
              {manekharkaSensor.lastValue} mm/h
            </div>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -2px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.9rem', borderRadius: '12px' }}>
            <Tent size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>प्रमाणित आश्रयस्थल</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', marginTop: '0.1rem' }}>
              ६ वटा (१,३१० जना)
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: RIVER LEVEL TWIN & UPSTREAM-DOWNSTREAM FLOOD CORRELATION */}
      {/* ========================================================================= */}
      {activePublicTab === 'river_twin' && (
        <div>
          {/* Station Selector Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedRiverSensor('SEN-MEL-01')}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '1.25rem',
                borderRadius: '14px',
                border: selectedRiverSensor === 'SEN-MEL-01' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
                background: selectedRiverSensor === 'SEN-MEL-01' ? '#f0f9ff' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: selectedRiverSensor === 'SEN-MEL-01' ? '0 6px 14px rgba(2, 132, 199, 0.15)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#0284c7', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                  स्टेशन १ (मुख्य पुल)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>खतरा: ५.५ मी.</span>
              </div>
              <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                थाङपालधाप मेलम्ची पुल गेज (SEN-MEL-01)
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>वडा नं. ३ • अक्षांश: २७.९६२०° N • देशान्तर: ८५.६२८०° E</div>
              <div style={{ marginTop: '0.6rem', fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>
                {melamchiSensor.lastValue} मिटर <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16a34a' }}>● सुरक्षित प्रवाह</span>
              </div>
            </button>

            <button
              onClick={() => setSelectedRiverSensor('SEN-GUN-04')}
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '1.25rem',
                borderRadius: '14px',
                border: selectedRiverSensor === 'SEN-GUN-04' ? '2.5px solid #0284c7' : '1px solid #cbd5e1',
                background: selectedRiverSensor === 'SEN-GUN-04' ? '#f0f9ff' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: selectedRiverSensor === 'SEN-GUN-04' ? '0 6px 14px rgba(2, 132, 199, 0.15)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#7c3aed', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                  स्टेशन २ (तटीय साइरन)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6d28d9' }}>खतरा: ४.८ मी.</span>
              </div>
              <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                गुन्सा बाढी सतर्कता साइरन तथा गेज (SEN-GUN-04)
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>वडा नं. ५ • अक्षांश: २७.९४५०° N • देशान्तर: ८५.६५१०° E</div>
              <div style={{ marginTop: '0.6rem', fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed' }}>
                {gunsaSensor.lastValue} मिटर <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#16a34a' }}>● सामान्य जलसतह</span>
              </div>
            </button>
          </div>

          {/* Interactive River Water Column Meter & Upstream Correlation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Real-time Vertical Column Gauge */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 6px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    वास्तविक-समय नदी स्तम्भ मिटर (Real-time Gauge)
                  </h3>
                  <button
                    onClick={() => refetchSensors()}
                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <RefreshCw size={12} className={isSensorsLoading ? 'spin' : ''} /> लाइभ रिड
                  </button>
                </div>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                  {activeGauge.name} — खतरा स्तर {gaugeThreshold} मी.
                </p>

                {/* Vertical Graduated Water Level Column */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  {/* Visual Column */}
                  <div style={{
                    width: '75px',
                    height: '240px',
                    borderRadius: '12px',
                    border: '3px solid #334155',
                    background: '#f8fafc',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    {/* Danger Line */}
                    <div style={{
                      position: 'absolute',
                      bottom: `${(gaugeThreshold / 7.0) * 100}%`,
                      left: 0,
                      right: 0,
                      borderTop: '2px dashed #ef4444',
                      zIndex: 3,
                    }} />

                    {/* Warning Line */}
                    <div style={{
                      position: 'absolute',
                      bottom: `${(gaugeWarningThreshold / 7.0) * 100}%`,
                      left: 0,
                      right: 0,
                      borderTop: '2px dashed #f59e0b',
                      zIndex: 3,
                    }} />

                    {/* Water Level Fill with Animation */}
                    <div style={{
                      height: `${gaugePct}%`,
                      width: '100%',
                      background: gaugeCurrentVal >= gaugeThreshold ? 'linear-gradient(to top, #dc2626, #ef4444)' : gaugeCurrentVal >= gaugeWarningThreshold ? 'linear-gradient(to top, #d97706, #f59e0b)' : 'linear-gradient(to top, #0284c7, #38bdf8)',
                      transition: 'height 0.8s ease-in-out',
                      position: 'relative',
                    }}>
                      {/* Ripple Wave Top */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'rgba(255, 255, 255, 0.6)',
                      }} />
                    </div>
                  </div>

                  {/* Level Legend & Attributes */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>हालको जलसतह</div>
                      <div style={{ fontSize: '2.4rem', fontWeight: 800, color: gaugeCurrentVal >= gaugeThreshold ? '#dc2626' : '#0284c7', lineHeight: 1.1 }}>
                        {gaugeCurrentVal} <span style={{ fontSize: '1.1rem' }}>मिटर</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontWeight: 700 }}>
                        <span>🚨 खतरा विन्दु (Danger Level):</span>
                        <span>{gaugeThreshold} मिटर</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d97706', fontWeight: 700 }}>
                        <span>⚠️ सचेत विन्दु (Warning Level):</span>
                        <span>{gaugeWarningThreshold.toFixed(1)} मिटर</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                        <span>✓ सामान्य सुरक्षित स्तर:</span>
                        <span>१.५ - ३.५ मिटर</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span>सेन्सर आईडी: {activeGauge.sensorId}</span>
                <span>स्वचालित IoT टेलिमेट्री (IoT Live Sync)</span>
              </div>
            </div>

            {/* Upstream-Downstream Early Warning Correlation Flow */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 6px 14px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CloudRain size={20} color="#0284c7" /> माथिल्लो जलाधार वर्षा र बाढी प्रवाह समय (Lead Time)
                </h3>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                  भोताङ उच्च जलाधारमा वर्षा भएपछि मेलम्ची खोलामा जलसतह बढ्ने र तटीय बस्तीमा बाढी आइपुग्ने समय अन्तर:
                </p>

                {/* Flow Step-by-Step */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#eff6ff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <div style={{ background: '#0284c7', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                      १
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e3a8a' }}>माथिल्लो भेग भोताङ वर्षा मापन (२,१०० मी.)</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>हालको वर्षा: <strong>{bhotangRainSensor.lastValue} मि.मि.</strong> (खतरा स्तर: ८० मि.मि.)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ↓ नदी प्रवाह समय अन्तर: ३५ देखि ४५ मिनेट ↓
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f0fdf4', padding: '0.85rem', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                    <div style={{ background: '#16a34a', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                      २
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#14532d' }}>थाङपालधाप मेलम्ची पुल जलसतह (१,४०० मी.)</div>
                      <div style={{ fontSize: '0.8rem', color: '#15803d' }}>अनुमानित प्रवाह गति: <strong>१४५ घनमिटर/सेकेन्ड (m³/s)</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ↓ तटीय पूर्वसूचना साइरन प्रसारण ↓
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#faf5ff', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
                    <div style={{ background: '#7c3aed', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                      ३
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#581c87' }}>गुन्सा तथा तटीय बस्ती साइरन र SMS प्रसारण</div>
                      <div style={{ fontSize: '0.8rem', color: '#7c3aed' }}>नागरिकहरूलाई सुरक्षित आश्रयस्थल सर्न पर्याप्त समय उपलब्ध</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => window.open('/gis-map?filter=shelter', '_blank')}
                  style={{ width: '100%', background: '#0f172a', color: '#fff', border: 'none', padding: '0.65rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  🌐 GIS नक्सामा तटीय जोखिम क्षेत्र हेर्नुहोस्
                </button>
              </div>
            </div>
          </div>

          {/* 3D Terrain Inundation Twin & Evacuation Route Simulator */}
          <div style={{ marginTop: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={20} color="#0284c7" /> ३D भू-धरातल बाढी डुबान सिमुलेटर (3D Inundation Twin)
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  जलसतह १ देखि ५ मिटर वृद्धि हुँदा नदी तटीय कुन कुन घरधुरी डुब्छन् र सुरक्षित निकास मार्ग कताबाट जान्छ भन्ने प्रत्यक्ष ३D सिमुलेशन:
                </p>
              </div>
            </div>
            <Terrain3DView
              sensors={sensors}
              settlements={vulnerableSettlements}
              height="580px"
              initialWaterRise={2}
              initialShowEvacuation={true}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LANDSLIDE SUSCEPTIBILITY & INCLINOMETER MOTION */}
      {/* ========================================================================= */}
      {activePublicTab === 'landslide' && (
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #451a03 0%, #78350f 60%, #92400e 100%)',
            color: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -5px rgba(120, 53, 15, 0.25)'
          }}>
            <div style={{ maxWidth: '820px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                <Mountain size={15} color="#fde68a" /> भू-गर्भ तथा पहिरो जोखिम अनुगमन
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.65rem 0' }}>
                पहिरो जोखिम नक्सांकन तथा मानेखर्क इन्क्लिनोमिटर सेन्सर ट्विन
              </h2>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.92, margin: 0 }}>
                पाँचपोखरीका उच्च भिरालो भू-भागहरू (मानेखर्क डाँडागाउँ, थाङपालकोट सडक, भोताङ भिरालो) मा जडान गरिएका जमिन हलचल मापन इन्क्लिनोमिटर सेन्सर र वर्षा मापन केन्द्रहरूको प्रत्यक्ष अवस्था।
              </p>
            </div>
          </div>

          {/* Landslide Risk Zones Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {LANDSLIDE_ZONES.map(z => (
              <div key={z.id} style={{
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      वडा नं. {z.wardNo}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, background: z.riskLevel === 'high' ? '#fee2e2' : '#fef3c7', color: z.riskLevel === 'high' ? '#b91c1c' : '#92400e', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                      {z.riskLevel === 'high' ? '⚠️ उच्च जोखिम' : 'मध्यम जोखिम'}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                    {z.name}
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.45 }}>
                    {z.description}
                  </p>

                  <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>मापन सेन्सर:</span>
                      <strong>{z.sensorName}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>जमिन हलचल दर:</span>
                      <strong style={{ color: '#b45309' }}>{z.movementRate}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>माटो संतृप्ति:</span>
                      <strong>{z.soilMoisture}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>जोखिम घरधुरी:</span>
                      <strong style={{ color: '#dc2626' }}>{z.householdsAtRisk} घरधुरी</strong>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>सुरक्षित आश्रय: {z.safeShelter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EARLY WARNING SIREN & SAFETY PROTOCOLS */}
      {/* ========================================================================= */}
      {activePublicTab === 'siren' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Automated IVR Call & LoRa Solar Siren Module */}
          <IvrVoiceSirenModule />
          {/* Siren Control & Status */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #cbd5e1',
            padding: '1.75rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Radio size={22} color="#dc2626" /> स्वचालित बाढी-पहिरो पूर्वसूचना साइरन नेटवर्क
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  नदी जलसतह ५.५ मिटर भन्दा माथि पुग्दा वा भारी पहिरोको जोखिम हुँदा स्वचालित रूपमा बज्ने साइरन प्रणाली
                </p>
              </div>

              <button
                onClick={handleToggleSirenTest}
                style={{
                  background: isSirenTesting ? '#dc2626' : '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '0.7rem 1.3rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isSirenTesting ? '0 0 15px rgba(220, 38, 38, 0.6)' : 'none'
                }}
              >
                {isSirenTesting ? <Volume2 size={18} /> : <Volume2 size={18} />}
                {isSirenTesting ? 'साइरन बजिरहेको छ...' : 'साइरन ध्वनि परीक्षण (Test Audio)'}
              </button>
            </div>

            {/* Siren Tower Nodes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                { name: 'गुन्सा तटीय साइरन टावर', loc: 'वडा नं. ५', status: 'सक्रिय (Online)', power: 'सोलार + ब्याट्री', coverage: '३ कि.मी. परिधि' },
                { name: 'थाङपालधाप मेलम्ची पुल साइरन', loc: 'वडा नं. ३', status: 'सक्रिय (Online)', power: 'सोलार + मुख्य ग्रिड', coverage: '२.५ कि.मी. परिधि' },
                { name: 'भोताङ गेट साइरन', loc: 'वडा नं. २', status: 'सक्रिय (Online)', power: 'सोलार ब्याकअप', coverage: '२ कि.मी. परिधि' },
                { name: 'मानेखर्क पहिरो चेतावनी साइरन', loc: 'वडा नं. ४', status: 'सक्रिय (Online)', power: 'सोलार ब्याकअप', coverage: '२ कि.मी. परिधि' },
              ].map((st, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>{st.loc}</span>
                    <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                      ● {st.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{st.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem' }}>
                    ऊर्जा: {st.power} • कभरेज: {st.coverage}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Do's & Don'ts Guides */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Flood Protocol */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px solid #bfdbfe', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: '#1e3a8a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Waves size={20} color="#0284c7" /> बाढी आउँदा के गर्ने / के नगर्ने? (Flood Safety)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>तुरुन्तै अग्लो स्थानमा जानुहोस्:</strong> नदी किनार तथा होचो भू-भाग छाडी तोकिएको सुरक्षित आश्रयस्थल वा सुरक्षित डाँडामा जानुहोस्।</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>विद्युत र ग्यास बन्द गर्नुहोस्:</strong> घर छाड्नु अघि मुख्य बिजुली स्विच र ग्यास सिलिन्डर बन्द गर्नुहोस्।</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>उर्लंदो भेलमा नपस्नुहोस्:</strong> बाढीको भेलमा हिँड्ने वा सवारी साधन चलाउने प्रयास कदापि नगर्नुहोस्।</div>
                </div>
              </div>
            </div>

            {/* Landslide Protocol */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px solid #fde68a', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: '#92400e', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mountain size={20} color="#d97706" /> पहिरो आउँदा के गर्ने / के नगर्ने? (Landslide Safety)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>धाँजा फाटेको जमिन तुरुन्त छाड्नुहोस्:</strong> जमिन भासिएको, रुखहरू ढल्केको वा पानीको मुहान अचानक धमिलो भएमा तत्काल सुरक्षित ठाउँमा जानुहोस्।</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>रातको समयमा सचेत रहनुहोस्:</strong> भारी वर्षा भइरहेको रातमा भिरालो क्षेत्रका घरहरू छाडी वडा सामुदायिक भवन वा आफन्तको सुरक्षित घरमा बास बस्नुहोस्।</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>पहिरोको फेदमा नबस्नुहोस्:</strong> पहिरो खसिरहेको ठाउँमा तस्बिर खिच्न वा हेर्न नजानुहोस्।</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EVACUATION SHELTERS & RELIEF SUPPLIES */}
      {/* ========================================================================= */}
      {activePublicTab === 'shelters' && (
        <div>
          {/* Ward Filters for Shelters */}
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>वडा अनुसार आश्रयस्थल:</span>
              {[
                { label: 'सबै वडा', val: 'all' as const },
                { label: 'वडा १ (बाँसखर्क)', val: 1 },
                { label: 'वडा २ (भोताङ)', val: 2 },
                { label: 'वडा ३ (थाङपालधाप)', val: 3 },
                { label: 'वडा ४ (मानेखर्क)', val: 4 },
                { label: 'वडा ५ (गुन्सा)', val: 5 },
                { label: 'वडा ६ (छिम्ती)', val: 6 },
              ].map(w => (
                <button
                  key={String(w.val)}
                  onClick={() => setShelterWardFilter(w.val)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: shelterWardFilter === w.val ? '#0284c7' : '#cbd5e1',
                    background: shelterWardFilter === w.val ? '#0284c7' : '#f8fafc',
                    color: shelterWardFilter === w.val ? '#fff' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shelters Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {filteredShelters.map((sh, idx) => (
              <div
                key={sh.id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '1.35rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.85rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      वडा नं. {sh.wardNumber}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Users size={14} /> क्षमता: {sh.capacity} जना
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <Tent size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{sh.name}</span>
                  </h4>

                  <div style={{ fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                    <MapPin size={13} />
                    <span>स्थान: <strong>{sh.location}</strong></span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: '#475569', marginTop: '0.35rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Droplets size={13} color={sh.hasWater ? '#0284c7' : '#94a3b8'} />
                      खानेपानी: {sh.hasWater ? 'प्रशस्त उपलब्ध' : 'ट्याङ्कर'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Zap size={13} color={sh.hasPowerBackup ? '#eab308' : '#94a3b8'} />
                      बत्ती: {sh.hasPowerBackup ? 'सोलार/जेनेरेटर ब्याकअप' : 'सामान्य'}
                    </span>
                  </div>

                  {sh.facilitiesDescription && (
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.6rem', backgroundColor: '#f8fafc', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      {sh.facilitiesDescription}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {sh.contactPhone ? (
                    <a
                      href={`tel:${sh.contactPhone}`}
                      style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <PhoneCall size={14} />
                      <span>{sh.contactPerson || 'सम्पर्क'}: {sh.contactPhone}</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>२४ सै घण्टा खुला</span>
                  )}

                  {sh.lat && sh.lng && (
                    <a
                      href={`/gis-map?filter=shelter&lat=${sh.lat}&lng=${sh.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <ExternalLink size={13} /> नक्सामा हेर्नुहोस्
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Relief Supplies Live Inventory */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #cbd5e1',
            padding: '1.75rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={22} color="#0284c7" /> गाउँपालिका आपतकालीन राहत सामग्री मौज्दात (Relief Supplies Twin)
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
              विपद्को तत्काल प्रतिकार्यका लागि पालिका गोदाम तथा वडा विपद् भण्डारमा सुरक्षित राखिएका उद्धार तथा राहत सामग्रीहरू:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {RELIEF_SUPPLIES_STOCK.map((rel, idx) => (
                <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{rel.item}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: rel.color, marginTop: '0.2rem' }}>{rel.qty}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                    ● {rel.available}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: LIVE CCTV CAMERAS */}
      {/* ========================================================================= */}
      {activePublicTab === 'cameras' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
              प्रत्यक्ष CCTV निगरानी क्यामेराहरू (Panchpokhari Security & Flood Feeds)
            </h3>
            <button
              onClick={() => refetchCameras()}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <RefreshCw size={14} className={isCamerasLoading ? 'spin' : ''} />
              <span>ताजा गर्नुहोस्</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {cameras.map(cam => (
              <div
                key={cam.id || cam.cameraId}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '0.6rem 0.9rem', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{cam.name.split('(')[0]}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#10b981', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    ● LIVE
                  </span>
                </div>

                {/* CCTV Screen Viewport */}
                <div
                  style={{
                    position: 'relative',
                    height: '190px',
                    backgroundColor: '#070b14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ position: 'absolute', top: '8px', left: '12px', color: '#ef4444', fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 700 }}>
                    ● REC - {cam.cameraId}
                  </div>
                  <div style={{ position: 'absolute', top: '8px', right: '12px', color: '#38bdf8', fontSize: '0.7rem', fontFamily: 'monospace' }}>
                    {new Date().toLocaleTimeString()} NPT
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <Video size={36} color="#a78bfa" style={{ margin: '0 auto 0.4rem' }} />
                    <div style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>{cam.location || 'Panchpokhari'}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>H.264 HD Stream • 1080p @ 30fps</div>
                  </div>

                  <div style={{ position: 'absolute', bottom: '8px', left: '12px', fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>
                    STATUS: ACTIVE_STREAMING
                  </div>
                </div>

                <div style={{ padding: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>📍 स्थान: </span>
                    <strong>{cam.location}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#64748b' }}>दैनिक आवतजावत: </span>
                    <strong style={{ color: '#7c3aed' }}>{cam.todayVisitorCount} जना</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: 24/7 EOC HOTLINES & SEARCH RESCUE */}
      {/* ========================================================================= */}
      {activePublicTab === 'hotlines' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {isContactsLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>सम्पर्क विवरण लोड हुँदैछ...</div>
          ) : contacts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>कुनै आपतकालीन सम्पर्क नम्बर उपलब्ध छैन।</div>
          ) : (
            contacts.map((c, i) => (
              <div
                key={c.id || i}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1.5px solid #fecdd3',
                  padding: '1.25rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase' }}>
                      {c.role}
                    </span>
                    {c.wardNumber && (
                      <span style={{ fontSize: '0.7rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        वडा नं. {c.wardNumber}
                      </span>
                    )}
                  </div>
                  <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    {c.name}
                  </h4>
                  {(c as any).department && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {(c as any).department}
                    </div>
                  )}
                </div>

                <a
                  href={`tel:${c.phone.split('/')[0].trim()}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <PhoneCall size={16} /> 📞 {c.phone}
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: MICRO-VULNERABILITY INDEX (५,८०५ घरधुरी डाटा) */}
      {/* ========================================================================= */}
      {activePublicTab === 'micro_vulnerability' && (
        <MicroVulnerabilityTab />
      )}

      {/* ========================================================================= */}
      {/* TAB 8: RAPID DISASTER DAMAGE ASSESSMENT (RDRA मापदण्ड २०७७) */}
      {/* ========================================================================= */}
      {activePublicTab === 'rdra_damage' && (
        <RdraAssessmentTab />
      )}

      {/* ========================================================================= */}
      {/* TAB 9: HEAVY EQUIPMENT & COMMUNITY SAR DIRECTORY */}
      {/* ========================================================================= */}
      {activePublicTab === 'heavy_equipment' && (
        <HeavyEquipmentSarTab />
      )}

      {/* ========================================================================= */}
      {/* TAB 10: OFFLINE RESILIENCE & EMERGENCY VHF RADIO */}
      {/* ========================================================================= */}
      {activePublicTab === 'offline_mesh' && (
        <OfflineMeshRadioTab />
      )}
    </div>
  );
};

export default Disaster;
