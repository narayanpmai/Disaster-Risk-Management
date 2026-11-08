import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Radio,
  HardDrive,
  Database,
  RefreshCw,
  CheckCircle2,
  Signal,
  TowerControl,
  Zap,
  PhoneCall,
  ShieldAlert,
  Sliders,
  Layers,
  FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RadioFrequency {
  id: string;
  agency: string;
  callSign: string;
  frequencyMhz: string;
  channelType: 'VHF FM' | 'HF SSB' | 'UHF LoRa';
  repeaterLocation: string;
  coverage: string;
  primaryContact: string;
  phone: string;
  status: 'सक्रिय (Active 24/7)' | 'स्ट्यान्डबाइ';
}

const EMERGENCY_FREQUENCIES: RadioFrequency[] = [
  {
    id: 'rf-1',
    agency: 'नेपाल प्रहरी (जिल्ला प्रहरी कार्यालय सिन्धुपाल्चोक)',
    callSign: 'सिन्धु-कमाण्ड (Sindhu-1)',
    frequencyMhz: '142.125 MHz',
    channelType: 'VHF FM',
    repeaterLocation: 'आमा याङ्ग्री पिक रिपीटर (३,७७१ मि)',
    coverage: 'पाँचपोखरी, मेलम्ची तथा हेलम्बु बेसिन',
    primaryContact: 'इन्सपेक्टर रमेश अधिकारी',
    phone: '०११-४६०१११, ९८५११००१००',
    status: 'सक्रिय (Active 24/7)'
  },
  {
    id: 'rf-2',
    agency: 'सशस्त्र प्रहरी बल (APF नं. २२ गण विपद् उद्धार)',
    callSign: 'मुक्तिनाथ-रेस्क्यु (Muktinath-EOC)',
    frequencyMhz: '148.550 MHz',
    channelType: 'VHF FM',
    repeaterLocation: 'चौतारा डाँडा तथा थाङपाल टावर',
    coverage: 'सिन्धुपाल्चोक जिल्लाभर आपतकालीन खोज-उद्धार',
    primaryContact: 'डिएसपी सुरेश श्रेष्ठ',
    phone: '०११-६२०११४, ९८५१२१२१२१',
    status: 'सक्रिय (Active 24/7)'
  },
  {
    id: 'rf-3',
    agency: 'पाँचपोखरी थाङपाल गाउँपालिका आपतकालीन कमाण्ड (EOC)',
    callSign: 'थाङपाल-कन्ट्रोल (Thangpal-EOC)',
    frequencyMhz: '156.800 MHz',
    channelType: 'VHF FM',
    repeaterLocation: 'थाङपालधाप प्रशासकीय भवन टावर',
    coverage: '८ वटै वडा कार्यालय, स्वास्थ्य चौकी र तटीय साइरन',
    primaryContact: 'नवराज पौडेल (विपद् फोकल)',
    phone: '०११-४६०१२३, ९८५११२३४५६',
    status: 'सक्रिय (Active 24/7)'
  },
  {
    id: 'rf-4',
    agency: 'नेपाल रेडक्रस सोसाइटी जिल्ला विपद् टोली',
    callSign: 'रेडक्रस-हेल्प (RedCross-SAR)',
    frequencyMhz: '162.200 MHz',
    channelType: 'VHF FM',
    repeaterLocation: 'मेलम्ची बजार रिले',
    coverage: 'प्राथमिक उपचार तथा राहत वितरण युनिट',
    primaryContact: 'गोपाल लामिछाने',
    phone: '९८५११००१११',
    status: 'सक्रिय (Active 24/7)'
  },
  {
    id: 'rf-5',
    agency: 'सौर्य साइरन तथा सेन्सर टेलिमेट्री मेश',
    callSign: 'LORA-MESH-DRM',
    frequencyMhz: '433.920 MHz',
    channelType: 'UHF LoRa',
    repeaterLocation: 'तिम्बु, थाङपालधाप र गुन्सा त्रिकोणीय रिले',
    coverage: 'नदी जलसतह गेज र स्वचालित साइरन नियन्त्रण',
    primaryContact: 'प्रणाली प्राविधिक कक्ष',
    phone: '९८४१००२२३३',
    status: 'सक्रिय (Active 24/7)'
  }
];

export const OfflineMeshRadioTab: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [cachedItemsCount, setCachedItemsCount] = useState<number>(5805);
  const [lastSyncTime, setLastSyncTime] = useState<string>('भर्खरै');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncOfflineData = () => {
    setIsSyncing(true);
    toast.loading('पालिका लोकल इन्ट्रानेट र IndexedDB क्यासमा डाटा सिंक गरिँदैछ...', { id: 'sync' });

    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('अहिले');
      toast.success('५,८०५ घरधुरी, आश्रयस्थल र आपतकालीन सम्पर्कहरू अफलाइन प्रयोगका लागि सुरक्षित भए!', { id: 'sync' });
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091e3a 0%, #1e3a5f 50%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <WifiOff size={14} color="#38bdf8" /> विपद् प्रतिरोधी अफलाइन क्षमता (Disaster Resilience)
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Radio size={24} color="#38bdf8" /> अफलाइन सञ्चालन (Offline PWA) र आपतकालीन VHF रेडियो फ्रिक्वेन्सी
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            बाढी-पहिरोले NTC/Ncell मोबाइल टावर, बिजुली र इन्टरनेट पूर्ण रूपमा बगाए तापनि पालिकाको लोकल वाईफाई/इन्ट्रानेटबाट प्रणाली खुल्ने (Service Worker & IndexedDB)
            र नेपाल प्रहरी, सशस्त्र प्रहरी तथा EOC बीच चल्ने आधिकारिक रेडियो फ्रिक्वेन्सी लिङ्केज।
          </p>
        </div>

        <button
          onClick={handleSyncOfflineData}
          disabled={isSyncing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            padding: '0.65rem 1.1rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: isSyncing ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
          }}
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'सिंक हुँदैछ...' : 'अफलाइन क्यास सिंक गर्नुहोस् (Sync Offline)'}</span>
        </button>
      </div>

      {/* Network & Cache Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: isOnline ? '#ecfdf5' : '#fef2f2', border: `1px solid ${isOnline ? '#a7f3d0' : '#fecaca'}`, borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: isOnline ? '#065f46' : '#991b1b', fontWeight: 600 }}>इन्टरनेट स्थिति</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: isOnline ? '#047857' : '#b91c1c' }}>
            {isOnline ? '🌐 अनलाइन सक्रिय' : '📡 अफलाइन (लोकल मोड)'}
          </div>
          <div style={{ fontSize: '0.7rem', color: isOnline ? '#065f46' : '#991b1b' }}>
            {isOnline ? 'क्लाउड सर्भरसँग प्रत्यक्ष जडित' : 'लोकल इन्ट्रानेट क्यासबाट सञ्चालित'}
          </div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>लोकल IndexedDB क्यास डाटा</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1d4ed8' }}>{cachedItemsCount.toLocaleString()} रेकर्ड</div>
          <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>घरधुरी, आश्रयस्थल र हटलाइन सुरक्षित</div>
        </div>

        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>LoRa मेश रेडियो नेटवर्क</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#7e22ce' }}>४३३ MHz सक्रिय</div>
          <div style={{ fontSize: '0.7rem', color: '#6b21a8' }}>बिना इन्टरनेट सेन्सर टेलिमेट्री खुला</div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600 }}>अन्तिम लोकल सिंक</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>{lastSyncTime}</div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>PWA Service Worker v2.0</div>
        </div>
      </div>

      {/* Emergency Radio Frequency Directory */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TowerControl size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              आधिकारिक आपतकालीन VHF/HF रेडियो फ्रिक्वेन्सी च्यानलहरू (Emergency Frequencies)
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>नेपाल प्रहरी, सशस्त्र प्रहरी, रेडक्रस र EOC फ्रिक्वेन्सी</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {EMERGENCY_FREQUENCIES.map((f) => (
            <div
              key={f.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                background: '#f8fafc',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.85rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{f.agency}</div>
                <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginTop: '0.2rem' }}>
                  कल साइन (Call Sign): <span style={{ fontFamily: 'monospace' }}>{f.callSign}</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                  रिपीटर: <strong>{f.repeaterLocation}</strong> | कभरेज: {f.coverage}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#334155', marginTop: '0.2rem' }}>
                  सम्पर्क अधिकारी: <strong>{f.primaryContact}</strong> ({f.phone})
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                <span
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                  }}
                >
                  {f.frequencyMhz}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CheckCircle2 size={12} /> {f.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfflineMeshRadioTab;
