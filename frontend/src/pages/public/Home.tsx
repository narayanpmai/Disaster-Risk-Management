import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Layers,
  ShieldAlert,
  Users,
  Building2,
  FileCheck2,
  AlertTriangle,
  FolderGit2,
  TrendingUp,
  Waves,
  Video,
  PhoneCall,
  ChevronRight,
  ExternalLink,
  MapPin,
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calendar,
  CreditCard,
  FileText,
  Activity,
  HeartHandshake,
  Briefcase,
} from 'lucide-react';
import { municipalityApi, type SensorItem, type CameraItem } from '../../api/municipality';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { GisMapPage } from '../../features/gis/GisMapPage';
import { DashboardOverview, toNepaliDigits } from '../../features/dashboard/DashboardOverview';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isNepali, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch real-time sensors
  const { data: sensors = [] } = useQuery<SensorItem[]>({
    queryKey: ['home-sensors'],
    queryFn: () => municipalityApi.getSensors(),
    refetchInterval: 12000,
  });

  // Fetch real-time cameras
  const { data: cameras = [] } = useQuery<CameraItem[]>({
    queryKey: ['home-cameras'],
    queryFn: () => municipalityApi.getCameras(),
    refetchInterval: 15000,
  });

  const melamchiSensor = sensors.find(s => s.sensorId === 'SEN-MEL-01') || {
    name: isNepali ? 'मेलम्ची खोला जलसतह' : 'Melamchi River Water Level',
    lastValue: 3.2,
    unit: 'm',
    dangerThreshold: 5.5,
    status: 'Normal',
  };

  const bhotangSensor = sensors.find(s => s.sensorId === 'SEN-BHO-02') || {
    name: isNepali ? 'भोताङ स्वचालित वर्षा मापन' : 'Bhotang Automated Rainfall Station',
    lastValue: 42.0,
    unit: 'mm',
    dangerThreshold: 80.0,
    status: 'Normal',
  };

  const citizenServices = [
    {
      title: isNepali ? 'विपद् जोखिम व्यवस्थापन केन्द्र (DRRM Hub)' : 'Disaster Risk Management Hub',
      desc: isNepali
        ? 'घटना दर्ता, स्थलगत प्रमाणीकरण, राहत वितरण र आपतकालीन नियन्त्रण कक्ष'
        : 'Incident reporting, verification, relief distribution & emergency operation centre',
      icon: <AlertTriangle size={28} color="#dc2626" />,
      link: '/disaster',
      badge: isNepali ? 'केन्द्र' : 'DRRM Hub',
      badgeColor: '#dc2626',
    },
    {
      title: isNepali ? '३D/जीआईएस विपद् जोखिम नक्सा (Hazard Map)' : '3D/GIS Disaster Risk Map',
      desc: isNepali
        ? '५,८०५+ घरधुरी, नदी कटान २००m बफर, पहिरो जोखिम क्षेत्र र ३डी डिजिटल मोडल'
        : '5,805+ households, river erosion 200m buffer zones, landslide hazards & 3D models',
      icon: <Layers size={28} color="#0284c7" />,
      link: '/gis-map',
      badge: isNepali ? '३D GIS ट्विन' : '3D GIS Twin',
      badgeColor: '#0284c7',
    },
    {
      title: isNepali ? 'स्वचालित IVR कल तथा मेश-साइरन' : 'Automated IVR Calls & Mesh Siren',
      desc: isNepali
        ? 'खतरा विन्दु पार हुनासाथ तटीय बासिन्दालाई स्वचालित फोन कल र ५-१० किमी सौर्य-साइरन'
        : 'Automated outbound alert calls to downstream residents and 5-10 km solar sirens',
      icon: <Waves size={28} color="#0284c7" />,
      link: '/disaster?tab=siren',
      badge: isNepali ? 'Last-Mile' : 'Last-Mile',
      badgeColor: '#0284c7',
    },
    {
      title: isNepali ? 'खोज-उद्धार (SAR) र हेभी इक्युपमेन्ट' : 'SAR Heavy Equipment Directory',
      desc: isNepali
        ? 'पालिका तथा निजी डोजर, एक्साभेटर, र्याफ्टिङ बोट र ६४ जना स्वयंसेवक कार्यदल'
        : 'Dozers, excavators, rescue boats and 64 certified local SAR volunteers',
      icon: <Briefcase size={28} color="#f59e0b" />,
      link: '/disaster?tab=heavy_equipment',
      badge: isNepali ? 'स्ट्यान्डबाइ' : 'Standby',
      badgeColor: '#f59e0b',
    },
    {
      title: isNepali ? 'सुरक्षित आश्रयस्थल र राहत मौज्दात' : 'Evacuation Shelters & Relief Stock',
      desc: isNepali
        ? '८ वटै वडाका १,३१० जना क्षमताका ६ वटा आश्रयस्थल, सौर्य ऊर्जा, पानी र त्रिपाल मौज्दात'
        : '6 certified shelters across all 8 wards (1,310 capacity) with water, power & tarpaulins',
      icon: <Building2 size={28} color="#16a34a" />,
      link: '/disaster?tab=shelters',
      badge: isNepali ? '६ आश्रयस्थल' : '6 Shelters',
      badgeColor: '#16a34a',
    },
    {
      title: isNepali ? 'द्रुत क्षति मूल्याङ्कन (Mobile RDRA राहत)' : 'Rapid Damage Assessment (RDRA)',
      desc: isNepali
        ? 'गृहमन्त्रालय राहत मापदण्ड २०७७ अनुसार घटनास्थलमै क्षति मूल्याङ्कन र DBT सिफारिस'
        : 'MoHA Standard 2077 field damage assessments and direct bank cash grants (DBT)',
      icon: <TrendingUp size={28} color="#10b981" />,
      link: '/disaster?tab=rdra_damage',
      badge: isNepali ? 'राहत मापदण्ड' : 'Relief 2077',
      badgeColor: '#10b981',
    },
    {
      title: isNepali ? 'अति-संवेदनशील नागरिक उद्धार सूची' : 'Vulnerable Citizens Evacuation',
      desc: isNepali
        ? 'सुत्केरी, अपाङ्गता भएका नागरिक, ७०+ ज्येष्ठ नागरिक र काँचो माटोका घरहरूको प्राथमिकता सूची'
        : 'Prioritized evacuation list for pregnant mothers, disabled citizens & senior citizens',
      icon: <Users size={28} color="#ec4899" />,
      link: '/disaster?tab=micro_vulnerability',
      badge: isNepali ? '५,८०५ घरधुरी' : '5,805 HH',
      badgeColor: '#ec4899',
    },
    {
      title: isNepali ? 'अफलाइन PWA तथा VHF रेडियो सञ्चार' : 'Offline PWA & VHF Radio Mesh',
      desc: isNepali
        ? 'इन्टरनेट नहुँदा पनि फिल्ड रिपोर्टिङ, स्थानीय IndexedDB भण्डार र VHF रेडियो डाइरेक्टरी'
        : 'Zero-internet offline field reporting with local IndexedDB vault & VHF radio contacts',
      icon: <PhoneCall size={28} color="#6366f1" />,
      link: '/pwa',
      badge: isNepali ? 'PWA/VHF' : 'PWA/VHF',
      badgeColor: '#6366f1',
    },
    {
      title: isNepali ? 'वातावरण तथा नदीजन्य खानी नियमन (IEE)' : 'Environment & Mining Regulation',
      desc: isNepali
        ? 'नदीजन्य ढुङ्गा, गिट्टी, बालुवा उत्खनन कोटा नियमन र पहिरो न्यूनीकरण अनुगमन'
        : 'Riverbed quarry extraction quotas, environmental monitoring & slope stabilization',
      icon: <FileText size={28} color="#059669" />,
      link: '/environmental-mining',
      badge: isNepali ? 'IEE/वातावरण' : 'IEE/Mining',
      badgeColor: '#059669',
    },
    {
      title: isNepali ? 'विपद् गुनासो तथा उजुरी सुनुवाई' : 'Disaster Grievances & Complaints',
      desc: isNepali
        ? 'नागरिकका विपद् सम्बन्धी समस्या, राहत गुनासो र क्षति उजुरी प्रत्यक्ष दर्ता तथा ट्र्याकिङ'
        : 'Citizen disaster grievance tracking, relief inquiries and damage appeals',
      icon: <AlertTriangle size={28} color="#ef4444" />,
      link: '/complaints',
      badge: isNepali ? 'द्रुत सुनुवाई' : 'Fast Response',
      badgeColor: '#ef4444',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('नक्सा') && !q.includes('gis')) {
      navigate(isAuthenticated ? '/ebps' : '/register');
    }
    else if (q.includes('ठेक्का') || q.includes('बोलपत्र') || q.includes('खरिद')) {
      navigate(isAuthenticated ? '/procurement?tab=apply' : '/register');
    }
    else if (q.includes('gis')) navigate('/gis-map');
    else if (q.includes('विपद्') || q.includes('बाढी') || q.includes('सेन्सर')) navigate('/disaster');
    else if (q.includes('योजना') || q.includes('प्रोजेक्ट')) navigate('/projects');
    else if (q.includes('सिफारिस') || q.includes('सेवा')) navigate('/citizen-services');
    else if (q.includes('गुनासो')) navigate('/complaints');
    else if (q.includes('पर्यटन') || q.includes('पाँचपोखरी')) navigate('/tourism');
    else navigate('/citizen-portal');
  };

  const handleProtectedAction = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      alert("यो सेवा प्रयोग गर्नको लागि पहिले दर्ता (Register) वा लगइन (Login) गर्नुपर्दछ।");
      navigate('/register');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-family, sans-serif)' }}>
      {/* ── 1. PREMIUM DIGITAL TWIN HERO SECTION ───────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          background: "linear-gradient(135deg, rgba(8, 20, 39, 0.90) 0%, rgba(15, 23, 42, 0.94) 50%, rgba(6, 78, 59, 0.88) 100%), url('/hero.jpg') no-repeat center center",
          backgroundSize: 'cover',
          minHeight: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.75rem 1.25rem',
          color: '#ffffff',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Glowing Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '15%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '15%',
            width: '340px',
            height: '340px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle Geometric Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.45,
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '920px', margin: '0 auto', zIndex: 2, position: 'relative' }}>
          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.09)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.3rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              marginBottom: '0.85rem',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            />
            <span style={{ letterSpacing: '0.02em', color: '#f8fafc' }}>
              LIVE · {isNepali ? 'पाँचपोखरी थाङपाल गाउँपालिका · राष्ट्रिय एकीकृत विपद् व्यवस्थापन' : 'Panchpokhari Thangpal · Nepal Integrated DRRMS'}
            </span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span style={{ color: '#a7f3d0', fontWeight: 700 }}>
              {isNepali ? '८ वडा · राष्ट्रिय विपद् नियन्त्रण' : '8 Wards · National Operations'}
            </span>
          </div>

          {/* Hero Heading */}
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3.1vw, 2.35rem)',
              fontWeight: 800,
              lineHeight: 1.24,
              margin: '0 0 0.65rem',
              letterSpacing: '-0.02em',
              textShadow: '0 3px 16px rgba(0,0,0,0.45)',
            }}
          >
            {isNepali ? (
              <>
                नक्सामा विकास । पूर्वसूचनामा सतर्कता ।<br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  AI, IoT तथा GIS बाट एकीकृत विपद् जोखिम व्यवस्थापन
                </span>
              </>
            ) : (
              <>
                Resilience on Maps | Preparedness in Action |<br />
                <span
                  style={{
                    background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  Integrated Disaster Risk Management via AI, IoT & GIS
                </span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.84rem, 1.15vw, 0.96rem)',
              color: '#e2e8f0',
              maxWidth: '720px',
              margin: '0 auto 1.35rem',
              lineHeight: 1.55,
              opacity: 0.95,
            }}
          >
            {isNepali
              ? 'पालिकाका ८ वटै वडा, ५,८०५ घरधुरी, नदी जलसतह सेन्सर, CCTV सर्भिलेन्स, डिजिटल नक्सा र आपतकालीन सेवाहरू एउटै अत्याधुनिक डिजिटल प्लेटफर्मबाट।'
              : 'Real-time telemetry across 8 wards, 5,805 households, river level sensors, CCTV surveillance, 3D risk mapping, and emergency services.'}
          </p>

          {/* Smart Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: '560px', margin: '0 auto 0.75rem', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(20px)',
                borderRadius: '50px',
                padding: '0.28rem 0.35rem 0.28rem 1.1rem',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}
            >
              <Search size={18} color="#0284c7" style={{ flexShrink: 0, marginRight: '0.55rem' }} />
              <input
                type="text"
                placeholder={isNepali ? "बाढी पूर्वसूचना, सुरक्षित आश्रयस्थल, राहत वा वडा सेवा खोज्नुहोस्..." : "Search flood warnings, shelters, relief, or emergency services..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  backgroundColor: 'transparent',
                  fontWeight: 500,
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '0.55rem 1.35rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{isNepali ? 'खोज्नुहोस्' : 'Search'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* Quick Search Chip Pills (द्रुत खोज) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>⚡</span> {isNepali ? 'द्रुत खोज:' : 'Quick Tags:'}
            </span>
            {[
              { label: isNepali ? '३D जोखिम नक्सा' : '3D Risk Map', path: '/gis-map' },
              { label: isNepali ? 'बाढी पूर्वसूचना' : 'Early Warning', path: '/disaster' },
              { label: isNepali ? 'सुरक्षित आश्रयस्थल' : 'Shelters', path: '/disaster?tab=shelters' },
              { label: isNepali ? 'खोज तथा उद्धार SAR' : 'SAR Equipment', path: '/disaster?tab=heavy_equipment' },
              { label: isNepali ? 'राहत वितरण RDRA' : 'Relief RDRA', path: '/disaster?tab=rdra_damage' },
              { label: isNepali ? 'अफलाइन PWA' : 'Offline PWA', path: '/pwa' },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  setSearchQuery(tag.label);
                  navigate(tag.path);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Primary High-Value Action Buttons (Streamlined to 3 Cohesive Pillars) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* 1. Flagship 3D GIS Digital Twin */}
            <Link
              to="/gis-map"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#0f172a',
                padding: '0.62rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 800,
                textDecoration: 'none',
                fontSize: '0.86rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 6px 18px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(245, 158, 11, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(245, 158, 11, 0.3)';
              }}
            >
              <Layers size={16} />
              <span>{isNepali ? '३D डिजिटल जोखिम नक्सा (GIS Twin)' : '3D Hazard Twin (GIS Map)'}</span>
              <span
                style={{
                  fontSize: '0.66rem',
                  background: 'rgba(15, 23, 42, 0.2)',
                  color: '#0f172a',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  marginLeft: '0.15rem',
                }}
              >
                LIVE
              </span>
            </Link>

            {/* 2. Disaster EOC & Early Warning */}
            <Link
              to="/disaster"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#0f172a',
                padding: '0.62rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.86rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(255, 255, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.12)';
              }}
            >
              <ShieldAlert size={16} color="#dc2626" />
              <span>{isNepali ? 'विपद् पूर्वसूचना तथा आपतकालीन केन्द्र' : 'Disaster EOC & Early Warning'}</span>
              <span
                style={{
                  fontSize: '0.66rem',
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  marginLeft: '0.15rem',
                }}
              >
                {isNepali ? '२४/७ सक्रिय' : '24/7 EOC'}
              </span>
            </Link>

            {/* 3. Offline Citizen PWA & VHF Mesh */}
            <Link
              to="/pwa"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(59, 130, 246, 0.45) 100%)',
                border: '1.5px solid rgba(165, 180, 252, 0.55)',
                color: '#ffffff',
                backdropFilter: 'blur(12px)',
                padding: '0.62rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.86rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 6px 18px rgba(99, 102, 241, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(199, 210, 254, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(99, 102, 241, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(165, 180, 252, 0.55)';
              }}
            >
              <PhoneCall size={16} color="#a5b4fc" />
              <span>{isNepali ? 'अफलाइन PWA तथा VHF सञ्चार' : 'Offline PWA & VHF Mesh'}</span>
              <span
                style={{
                  fontSize: '0.66rem',
                  background: 'rgba(165, 180, 252, 0.25)',
                  color: '#e0e7ff',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  marginLeft: '0.15rem',
                }}
              >
                {isNepali ? 'अफलाइन' : 'Off-Grid'}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. LIVE PALIKA KEY METRICS (PREMIUM CARDS) ──────────────────────────────── */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 1.25rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Card 1: Wards */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem 0.95rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.08)';
              e.currentTarget.style.borderColor = '#bae6fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
            <div style={{ display: 'inline-flex', padding: '0.35rem', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', marginBottom: '0.35rem' }}>
              <MapPin size={16} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{isNepali ? '८' : '8'}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginTop: '0.2rem', letterSpacing: '0.03em' }}>{isNepali ? 'वडाहरू' : 'Wards'}</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '0.25rem', background: '#ecfdf5', padding: '1px 7px', borderRadius: '20px', display: 'inline-block' }}>
              {isNepali ? '● १००% डिजिटल अभिलेखीकरण' : '● 100% Geo-Mapped'}
            </div>
          </div>

          {/* Card 2: Population */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem 0.95rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.08)';
              e.currentTarget.style.borderColor = '#a7f3d0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
            <div style={{ display: 'inline-flex', padding: '0.35rem', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', marginBottom: '0.35rem' }}>
              <Users size={16} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{isNepali ? '१७,५२१' : '17,521'}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginTop: '0.2rem', letterSpacing: '0.03em' }}>{isNepali ? 'कुल जनसंख्या' : 'Total Population'}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginTop: '0.25rem', background: '#f1f5f9', padding: '1px 7px', borderRadius: '20px', display: 'inline-block' }}>
              {isNepali ? '५,२३४ घरधुरी प्रोफाइल' : '5,234 Household Profiles'}
            </div>
          </div>

          {/* Card 3: Projects */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem 0.95rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(217, 119, 6, 0.08)';
              e.currentTarget.style.borderColor = '#fde68a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #d97706, #fbbf24)' }} />
            <div style={{ display: 'inline-flex', padding: '0.35rem', borderRadius: '8px', background: '#fef3c7', color: '#d97706', marginBottom: '0.35rem' }}>
              <FolderGit2 size={16} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{isNepali ? '२४७' : '247'}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginTop: '0.2rem', letterSpacing: '0.03em' }}>{isNepali ? 'विपद् तथा पूर्वाधार योजनाहरू' : 'Disaster & Recovery Projects'}</div>
            <div style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 600, marginTop: '0.25rem', background: '#fffbeb', padding: '1px 7px', borderRadius: '20px', display: 'inline-block' }}>
              {isNepali ? '१३२ सम्पन्न · ११५ चालु' : '132 Completed · 115 Active'}
            </div>
          </div>

          {/* Card 4: GPS Households */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem 0.95rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.08)';
              e.currentTarget.style.borderColor = '#ddd6fe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
            <div style={{ display: 'inline-flex', padding: '0.35rem', borderRadius: '8px', background: '#ede9fe', color: '#7c3aed', marginBottom: '0.35rem' }}>
              <Building2 size={16} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>{isNepali ? '५,८०५' : '5,805'}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginTop: '0.2rem', letterSpacing: '0.03em' }}>{isNepali ? 'GPS नक्साङ्कन घरहरू' : 'GPS Mapped Households'}</div>
            <div style={{ fontSize: '0.7rem', color: '#6d28d9', fontWeight: 600, marginTop: '0.25rem', background: '#f5f3ff', padding: '1px 7px', borderRadius: '20px', display: 'inline-block' }}>
              {isNepali ? 'QR कोड डिजिटल ठेगाना' : 'QR Code Digital Address'}
            </div>
          </div>

          {/* Card 5: IoT and CCTV */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem 0.95rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ef4444, #f87171)' }} />
            <div style={{ display: 'inline-flex', padding: '0.35rem', borderRadius: '8px', background: '#fee2e2', color: '#ef4444', marginBottom: '0.35rem' }}>
              <Activity size={16} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {isNepali ? `${toNepaliDigits(sensors.length || 5)} + ${toNepaliDigits(cameras.length || 4)}` : `${sensors.length || 5} + ${cameras.length || 4}`}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginTop: '0.2rem', letterSpacing: '0.03em' }}>{isNepali ? 'IoT सेन्सर र CCTV' : 'IoT Sensors & CCTV'}</div>
            <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 600, marginTop: '0.25rem', background: '#fef2f2', padding: '1px 7px', borderRadius: '20px', display: 'inline-block' }}>
              {isNepali ? '● २४/७ लाइभ टेलिमेट्री' : '● 24/7 Live Telemetry'}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2.5 LIVE SECTORAL DATA OVERVIEW (Dashboard Widget) ────────────────────── */}
      <section style={{ padding: '2.5rem 1.5rem', backgroundColor: '#f8fafc' }}>
        <ErrorBoundary>
          <DashboardOverview readOnly={true} />
        </ErrorBoundary>
      </section>

      {/* ── 3. REAL-TIME HYDROMET & RIVER LEVEL BANNER ────────────────────────────── */}
      <section style={{ width: '100%', maxWidth: '100%', margin: '2rem 0 0', padding: '0 0.5rem' }}>
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Waves size={26} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isNepali ? 'प्रत्यक्ष जलसतह तथा बाढी पूर्वसूचना (Live Hydromet Alert)' : 'Live Water Level & Flood Early Warning'}
              </div>
              <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.15rem', fontWeight: 700 }}>
                {isNepali ? 'मेलम्ची खोला' : 'Melamchi River'}: <span style={{ color: melamchiSensor.status === 'Critical' ? '#ef4444' : '#38bdf8' }}>{melamchiSensor.lastValue} {melamchiSensor.unit}</span> ({isNepali ? 'खतरा' : 'Danger'}: {melamchiSensor.dangerThreshold}m) · {isNepali ? 'भोताङ वर्षा' : 'Bhotang Rain'}: <span style={{ color: '#a78bfa' }}>{bhotangSensor.lastValue} {bhotangSensor.unit}</span>
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              to="/disaster"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Video size={15} /> {isNepali ? 'प्रत्यक्ष सेन्सर र CCTV हेर्नुहोस्' : 'View Sensors & CCTV'}
            </Link>
            <a
              href="tel:011460111"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <PhoneCall size={15} /> {isNepali ? 'हटलाइन: ०११-४६०१११' : 'Hotline: 011-460111'}
            </a>
          </div>
        </div>
      </section>

      {/* ── 4. DIGITAL CITIZEN SERVICES (E-SERVICES GRID) ─────────────────────────── */}
      <section style={{ width: '100%', maxWidth: '100%', margin: '3rem 0', padding: '0 0.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isNepali ? 'नागरिक विपद् सेवाहरू (Citizen DRRM Services)' : 'Citizen Disaster Services'}
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.5rem' }}>
            {isNepali ? 'एकीकृत विपद् व्यवस्थापन तथा नागरिक पूर्वसूचना प्रणाली' : 'Integrated Disaster Management & Citizen Early Warning'}
          </h2>
          <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            {isNepali ? 'बाढी, पहिरो तथा आपतकालीन अवस्थामा तत्काल प्रतिकार्य, राहत र नागरिक सुरक्षाका लागि एकीकृत डिजिटल गेटवे' : 'Integrated digital gateway for immediate disaster response, relief tracking and citizen safety'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {citizenServices.map((svc, i) => (
            <Link
              key={i}
              to={svc.link}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.75rem',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    {svc.icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', backgroundColor: `${svc.badgeColor}15`, color: svc.badgeColor }}>
                    {svc.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                  {svc.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {svc.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', marginTop: '1.25rem' }}>
                <span>{isNepali ? 'सेवा सुरु गर्नुहोस्' : 'Launch Service'}</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4.5 SENDAI FRAMEWORK 10-STAGE DISASTER RISK MANAGEMENT LIFECYCLE ─────── */}
      <section style={{ width: '100%', maxWidth: '100%', margin: '2rem 0 3rem', padding: '0 0.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', background: '#fee2e2', padding: '3px 10px', borderRadius: '20px' }}>
              {isNepali ? 'सेन्डाई संरचना १०-चरण विपद् जीवनचक्र' : 'Sendai Framework 10-Stage DRRM Lifecycle'}
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0 0.25rem' }}>
              {isNepali ? 'एकीकृत विपद् व्यवस्थापन चक्र (End-to-End Resilience)' : 'Comprehensive Disaster Management Lifecycle'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '700px', margin: '0 auto' }}>
              {isNepali ? 'घटना दर्तादेखि पुनर्निर्माणसम्म एउटै घटना ID (Incident ID) द्वारा अन्तरसम्बन्धित राष्ट्रिय मापदण्ड' : 'Single Incident ID connecting Prevention, Early Warning, Rescue, Relief & Reconstruction'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
            {[
              { phase: '1', titleNp: 'पूर्वतयारी तथा रोकथाम', titleEn: '1. Prevention & Mitigation', descNp: 'नदी कटान तटबन्धन तथा IEE नियमन', descEn: 'Erosion control & IEE quarry limits', link: '/environmental-mining', color: '#0284c7' },
              { phase: '2', titleNp: 'जोखिम नक्साङ्कन', titleEn: '2. Hazard Mapping', descNp: '३D जीआईएस तथा २००m बफर सिमुलेसन', descEn: '3D GIS twin & 200m river buffers', link: '/gis-map', color: '#6366f1' },
              { phase: '3', titleNp: 'पूर्वसूचना तथा साइरन', titleEn: '3. Early Warning & Siren', descNp: 'टेलिमेट्री, IVR कल र मेश-साइरन', descEn: 'Telemetry, IVR calls & mesh siren', link: '/disaster?tab=siren', color: '#ea580c' },
              { phase: '4', titleNp: 'घटना दर्ता वडा तह', titleEn: '4. Ward Incident Log', descNp: 'वडा सचिवद्वारा स्थानीय घटना दर्ता', descEn: 'Ward-level field incident logging', link: '/disaster?tab=events', color: '#ef4444' },
              { phase: '5', titleNp: 'स्थलगत प्रमाणीकरण', titleEn: '5. Field Verification', descNp: 'EOC टोलीद्वारा GPS प्रमाण प्रमाणीकरण', descEn: 'GPS photo & technical verification', link: '/disaster?tab=events', color: '#dc2626' },
              { phase: '6', titleNp: 'खोज तथा उद्धार (SAR)', titleEn: '6. SAR Dispatch', descNp: 'डोजर, डुङ्गा र स्वयंसेवक परिचालन', descEn: 'Dozers, boats & volunteer teams', link: '/disaster?tab=heavy_equipment', color: '#d97706' },
              { phase: '7', titleNp: 'सुरक्षित आश्रयस्थल', titleEn: '7. Shelter Evacuation', descNp: '१,३१० क्षमताका ६ आश्रयस्थल व्यवस्थापन', descEn: '6 certified shelters (1,310 cap)', link: '/disaster?tab=shelters', color: '#059669' },
              { phase: '8', titleNp: 'द्रुत क्षति मूल्याङ्कन', titleEn: '8. RDRA Damage Assessment', descNp: 'मापदण्ड २०७७ अनुसार क्षति अभिलेख', descEn: 'MoHA Standard 2077 damage audits', link: '/disaster?tab=rdra_damage', color: '#10b981' },
              { phase: '9', titleNp: 'राहत वितरण तथा DBT', titleEn: '9. Direct Bank Relief', descNp: 'बैंक खातामै नगद राहत तथा सामग्री', descEn: 'Direct bank cash grants & ration', link: '/disaster?tab=relief_funds', color: '#16a34a' },
              { phase: '10', titleNp: 'पुनर्लाभ तथा पुनर्निर्माण', titleEn: '10. Build Back Better', descNp: 'दीर्घकालीन पुनर्निर्माण आयोजना ३६०', descEn: 'Long-term resilient reconstruction', link: '/projects', color: '#7c3aed' },
            ].map((p, idx) => (
              <Link
                key={idx}
                to={p.link}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.15s ease',
                  borderTop: `3px solid ${p.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = p.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: p.color, marginBottom: '0.25rem' }}>
                  {isNepali ? p.titleNp : p.titleEn}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                  {isNepali ? p.descNp : p.descEn}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DIGITAL TWIN 3D/GIS SHOWCASE ───────────────────────────────────────── */}
      <section style={{ width: '100%', maxWidth: '100%', margin: '3rem 0', padding: '0 0.5rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <Sparkles size={16} />
              <span>{isNepali ? 'नेपालकै पहिलो नगरस्तरीय विपद् डिजिटल ट्विन' : 'Nepal First Municipal Disaster Digital Twin'}</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, margin: '0 0 1rem' }}>
              {isNepali ? 'पाँचपोखरीको ३डी जोखिम नक्सा तथा भू-स्थानिक (GIS) इन्टेलिजेन्स' : '3D Multi-Hazard Twin & Geospatial GIS Intelligence'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
              {isNepali
                ? 'प्रत्येक घरधुरीको स्थान, भवन संरचना, बाढी तथा पहिरो जोखिम क्षेत्र, खानेपानी तथा सडक सञ्जाललाई एकीकृत थ्री-डी जियो-पोर्टलमा अवलोकन गर्नुहोस्।'
                : 'Interactive 3D geospatial intelligence showing 5,805+ households, river inundation buffers, landslide slopes, and evacuation routes.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/gis-map"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Layers size={18} /> {isNepali ? 'GIS नक्सा खोल्नुहोस्' : 'Open 3D GIS Twin'}
              </Link>
              <Link
                to="/projects"
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                }}
              >
                {isNepali ? 'पुनर्निर्माण आयोजनाहरू हेर्नुहोस्' : 'View Reconstruction Projects'}
              </Link>
            </div>
          </div>

          <div
            style={{
              minHeight: '340px',
              background: "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000') no-repeat center center",
              backgroundSize: 'cover',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '2rem',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)' }} />
            <div style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>{isNepali ? '३डी डिजिटल नक्सा प्रणाली' : '3D Digital Hazard Twin'}</div>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.25rem', fontWeight: 700 }}>{isNepali ? 'थाङपाल भ्याली तथा पाँचपोखरी बेसिन मोडल' : 'Thangpal Valley & Panchpokhari Basin Model'}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5.5 EMBEDDED GIS MAP ─────────────────────────────────────────────────── */}
      <section style={{ width: '100%', maxWidth: '100%', margin: '0 0 3rem', padding: '0 0.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: '1.5rem', overflow: 'hidden' }}>
          <ErrorBoundary>
            <GisMapPage isPublic={true} />
          </ErrorBoundary>
        </div>
      </section>

      {/* ── 6. EMERGENCY CONTACTS & FIRST RESPONDER HOTLINES DIRECTORY ───────────── */}
      <section style={{ width: '100%', maxWidth: '100%', margin: '3rem 0 4rem', padding: '0 0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>
              {isNepali ? '२४/७ आपतकालीन सम्पर्क तथा सुरक्षा निकाय' : '24/7 Emergency Contacts & First Responders'}
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0' }}>
              {isNepali ? 'सुरक्षा निकाय तथा आपतकालीन हटलाइन डाइरेक्टरी' : 'Emergency Hotlines & Security Directory'}
            </h2>
          </div>
          <Link to="/disaster" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {isNepali ? 'विपद् केन्द्र ड्यासबोर्ड' : 'Disaster Hub Dashboard'} <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          {[
            { titleNp: 'नेपाल प्रहरी (Police)', titleEn: 'Nepal Police', phone: '100', descNp: '२४/७ तत्काल शान्ति सुरक्षा तथा उद्धार', descEn: '24/7 Immediate Law & Rescue', tagNp: 'आकस्मिक', tagEn: 'Hotline', color: '#dc2626' },
            { titleNp: 'सशस्त्र प्रहरी बल (APF)', titleEn: 'Armed Police Force (APF)', phone: '1114', descNp: 'विपद् उद्धार तथा सीमा सुरक्षा', descEn: 'Disaster Rescue & Security', tagNp: 'SAR कार्यदल', tagEn: 'SAR Force', color: '#ea580c' },
            { titleNp: 'नेपाली सेना (Army)', titleEn: 'Nepal Army', phone: '102', descNp: 'हेलिकप्टर उद्धार तथा हेभी अपरेसन', descEn: 'Helicopter Rescue & Heavy Ops', tagNp: 'आपतकालीन', tagEn: 'Air SAR', color: '#b45309' },
            { titleNp: 'पालिका EOC नियन्त्रण कक्ष', titleEn: 'Palika EOC Control Room', phone: '011-460111', descNp: '२४ घण्टा कार्यरत स्थानीय विपद् कक्ष', descEn: '24/7 Municipal Disaster Desk', tagNp: 'LEOC', tagEn: 'LEOC', color: '#0284c7' },
            { titleNp: 'एम्बुलेन्स सेवा (Ambulance)', titleEn: 'Local Ambulance', phone: '102', descNp: 'आकस्मिक स्वास्थ्य उपचार तथा ओसारपसार', descEn: 'Emergency Medical Transit', tagNp: 'स्वास्थ्य', tagEn: 'Medical', color: '#059669' },
            { titleNp: 'दमकल तथा वारुणयन्त्र', titleEn: 'Fire Brigade', phone: '101', descNp: 'आगलागी नियन्त्रण तथा उद्धार', descEn: 'Firefighting & Suppression', tagNp: 'आगलागी', tagEn: 'Fire', color: '#e11d48' },
            { titleNp: 'नेपाल रेडक्रस सोसाइटी', titleEn: 'Nepal Red Cross', phone: '011-460122', descNp: 'प्राथमिक उपचार, रक्तसञ्चार र राहत', descEn: 'First Aid, Blood & Relief', tagNp: 'राहत', tagEn: 'Relief', color: '#be123c' },
            { titleNp: 'VHF रेडियो आपतकालीन फ्रिक्वेन्सी', titleEn: 'VHF Emergency Frequency', phone: 'Ch. 16 (148.5 MHz)', descNp: 'इन्टरनेट नहुँदा स्थानीय मेश रेडियो', descEn: 'Off-grid local mesh radio', tagNp: 'VHF रेडियो', tagEn: 'VHF Mesh', color: '#4f46e5' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '1.25rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
                borderLeft: `4px solid ${item.color}`,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: item.color, backgroundColor: `${item.color}15`, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {isNepali ? item.tagNp : item.tagEn}
                  </span>
                  <PhoneCall size={15} color={item.color} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.5rem 0 0.2rem' }}>
                  {isNepali ? item.titleNp : item.titleEn}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                  {isNepali ? item.descNp : item.descEn}
                </p>
              </div>
              <a
                href={item.phone.startsWith('Ch') ? '#/pwa' : `tel:${item.phone.replace(/[^0-9]/g, '')}`}
                style={{
                  fontSize: '0.92rem',
                  color: item.color,
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0',
                }}
              >
                📞 {item.phone}
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
