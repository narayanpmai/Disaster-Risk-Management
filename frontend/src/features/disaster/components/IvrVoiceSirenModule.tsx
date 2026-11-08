import React, { useState, useRef } from 'react';
import {
  PhoneCall,
  Radio,
  Volume2,
  VolumeX,
  Zap,
  Sun,
  BatteryCharging,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  PhoneForwarded,
  ShieldAlert,
  Send,
  Users,
  Signal
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CallRecipient {
  id: string;
  name: string;
  role: string;
  phone: string;
  ward: number;
  location: string;
  status: 'सम्पर्क भयो (Delivered)' | 'घन्टी बज्दै (Calling)' | 'पुनः प्रयास (Retrying)' | 'सम्पर्क हुन सकेन (Failed)';
  durationSec: number;
  timestamp: string;
}

const INITIAL_RECIPIENTS: CallRecipient[] = [
  { id: 'c-1', name: 'दावा साङ्गे शेर्पा', role: 'वडाध्यक्ष', phone: '९८५११२३४५६', ward: 2, location: 'तिम्बु खोला बजार', status: 'सम्पर्क भयो (Delivered)', durationSec: 38, timestamp: '१० मिनेट अघि' },
  { id: 'c-2', name: 'निमा तामाङ', role: 'तटीय बासिन्दा (होटल व्यवसायी)', phone: '९८४१५५६६७७', ward: 2, location: 'मेलम्ची नदी किनार', status: 'सम्पर्क भयो (Delivered)', durationSec: 42, timestamp: '९ मिनेट अघि' },
  { id: 'c-3', name: 'सूर्य मान श्रेष्ठ', role: 'प्रहरी चौकी इन्चार्ज', phone: '९८४१२२३३४४', ward: 2, location: 'तिम्बु प्रहरी चौकी', status: 'सम्पर्क भयो (Delivered)', durationSec: 55, timestamp: '९ मिनेट अघि' },
  { id: 'c-4', name: 'पेम्बा दोर्जे शेर्पा', role: 'वडा सदस्य / विपद् फोकल', phone: '९८६०११२२३३', ward: 7, location: 'गुन्सा बजार', status: 'सम्पर्क भयो (Delivered)', durationSec: 34, timestamp: '८ मिनेट अघि' },
  { id: 'c-5', name: 'माया लामा', role: 'स्वास्थ्य चौकी इन्चार्ज', phone: '९८१२३४५६७८', ward: 4, location: 'थाङपालधाप पुल नजिक', status: 'घन्टी बज्दै (Calling)', durationSec: 15, timestamp: 'अहिले' },
  { id: 'c-6', name: 'गोविन्द अधिकारी', role: 'तटीय बासिन्दा (पुलचोक)', phone: '९८४१००९९८८', ward: 4, location: 'मेलम्ची-थाङपाल पुल', status: 'सम्पर्क भयो (Delivered)', durationSec: 29, timestamp: '७ मिनेट अघि' },
  { id: 'c-7', name: 'फुन्जोक लामा', role: 'सामुदायिक स्वयंसेवक', phone: '९८५१२३४५६७', ward: 7, location: 'याङ्ग्री दोभान', status: 'पुनः प्रयास (Retrying)', durationSec: 0, timestamp: 'प्रतीक्षारत' },
];

const SOLAR_SIRENS = [
  {
    id: 'siren-1',
    name: 'तिम्बु बजार सौर्य साइरन (MEL-SR-01)',
    ward: 2,
    location: 'तिम्बु बजार, मेलम्ची नदी पुल नजिक',
    batteryPct: 96,
    solarStatus: 'Charging (१८.५ V, ४.२ A)',
    rfRssi: '-64 dBm (अति उत्तम)',
    frequency: '433.92 MHz LoRa Mesh',
    audibleRadius: '८.५ कि.मी.',
    lastPings: '३० सेकेन्ड अघि',
    status: 'Ready (स्ट्यान्डबाइ)',
    hardware: 'Dual 120W Trumpet Siren, Solar 150W, LiFePO4 100Ah'
  },
  {
    id: 'siren-2',
    name: 'थाङपालधाप प्रशासकीय केन्द्र साइरन (THP-SR-02)',
    ward: 4,
    location: 'गाउँपालिका परिसर, थाङपालधाप',
    batteryPct: 92,
    solarStatus: 'Charging (१९.१ V, ४.८ A)',
    rfRssi: '-58 dBm (अति उत्तम)',
    frequency: '433.92 MHz LoRa Mesh',
    audibleRadius: '१०.० कि.मी.',
    lastPings: '१५ सेकेन्ड अघि',
    status: 'Ready (स्ट्यान्डबाइ)',
    hardware: 'Omnidirectional 200W Tower Siren, Solar 200W, LiFePO4 150Ah'
  },
  {
    id: 'siren-3',
    name: 'गुन्सा तटीय बजार साइरन (GUN-SR-03)',
    ward: 7,
    location: 'गुन्सा तटीय दोभान क्षेत्र',
    batteryPct: 88,
    solarStatus: 'Charging (१७.८ V, ३.९ A)',
    rfRssi: '-71 dBm (उत्तम)',
    frequency: '433.92 MHz LoRa Mesh',
    audibleRadius: '७.५ कि.मी.',
    lastPings: '४५ सेकेन्ड अघि',
    status: 'Ready (स्ट्यान्डबाइ)',
    hardware: 'Dual 120W Trumpet Siren, Solar 150W, LiFePO4 100Ah'
  }
];

export const IvrVoiceSirenModule: React.FC = () => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [selectedWardFilter, setSelectedWardFilter] = useState<number | 'all'>('all');
  const [callRecipients, setCallRecipients] = useState<CallRecipient[]>(INITIAL_RECIPIENTS);
  const [isCallingBatch, setIsCallingBatch] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Nepali Audio Speech Warning Alert
  const warningTextNepali = `सावधान! सावधान! पाँचपोखरी थाङपाल गाउँपालिका विपद् व्यवस्थापन शाखाको आपतकालीन पूर्वसूचना। 
मेलम्ची नदीमा जलसतह खतराको विन्दु पार भएको छ। तटीय क्षेत्र तथा बाढी जोखिममा रहेका सम्पूर्ण नागरिकहरू 
तुरुन्त घर खाली गरी नजिकको सुरक्षित आश्रयस्थल वा अग्लो डाँडातर्फ जानुहोला। 
आपतकालीन सम्पर्क: ९८५११२३४५६ वा नजिकको प्रहरी चौकी।`;

  const playVoiceAlert = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingVoice) {
        window.speechSynthesis.cancel();
        setIsPlayingVoice(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(warningTextNepali);
      utterance.lang = 'ne-NP';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingVoice(true);
      utterance.onend = () => setIsPlayingVoice(false);
      utterance.onerror = () => setIsPlayingVoice(false);

      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('यस ब्राउजरमा अडियो संश्लेषण (Speech Synthesis) उपलब्ध छैन।');
    }
  };

  // 3D Audio Siren Oscillator Simulation
  const toggleSirenSound = () => {
    if (isSirenActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setIsSirenActive(false);
      toast('साइरन ध्वनी बन्द गरियो।', { icon: '🔕' });
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      // Pitch sweep simulation (emergency wail siren: 440Hz -> 880Hz -> 440Hz)
      const now = ctx.currentTime;
      for (let i = 0; i < 15; i++) {
        osc.frequency.setValueAtTime(440, now + i * 2);
        osc.frequency.linearRampToValueAtTime(880, now + i * 2 + 1);
        osc.frequency.linearRampToValueAtTime(440, now + i * 2 + 2);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setIsSirenActive(true);
      toast.error('🚨 आपतकालीन मेश-साइरन सक्रिय भयो! ५-१० कि.मी. वरपर ध्वनी प्रसारण हुँदैछ।', { duration: 5000 });
    } catch (e) {
      console.error(e);
      toast.error('अडियो प्ले गर्न सकिएन।');
    }
  };

  const handleTriggerBulkIVR = () => {
    setIsCallingBatch(true);
    toast.loading('तटीय क्षेत्रका नागरिक तथा जनप्रतिनिधिलाई स्वचालित IVR फोन कल डायल गरिँदैछ...', { id: 'ivr-call' });

    setTimeout(() => {
      setIsCallingBatch(false);
      toast.success('४२ वटा स्वचालित IVR फोन कल सफलतापूर्वक सम्पन्न! नागरिकहरूलाई पूर्वचेतावनी दिइयो।', { id: 'ivr-call', duration: 5000 });
      setCallRecipients(prev => prev.map(c => ({
        ...c,
        status: 'सम्पर्क भयो (Delivered)',
        timestamp: 'भर्खरै'
      })));
    }, 2500);
  };

  const filteredRecipients = selectedWardFilter === 'all'
    ? callRecipients
    : callRecipients.filter(r => r.ward === selectedWardFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(49, 46, 129, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Zap size={14} color="#facc15" /> अन्तिम माइल पूर्वसूचना प्रणाली (Last-Mile EWS)
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PhoneCall size={24} color="#38bdf8" /> स्वचालित भ्वाइस कल (IVR Alert) र अफलाइन सौर्य-साइरन (LoRa Mesh)
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            मध्यरातमा मनसुनजन्य बाढी वा पहिरो आउँदा सुतिरहेका तटीय नागरिकहरूलाई सिधै नेपाली भाषामा ठूलो आवाजमा बज्ने स्वचालित फोन कल र
            विद्युत/इन्टरनेट बन्द भए पनि ब्याट्री र सौर्य ऊर्जाबाट ५-१० कि.मी. सम्म आवाज दिने रेडियो फ्रिक्वेन्सी (LoRa) साइरन सक्रियता।
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleTriggerBulkIVR}
            disabled={isCallingBatch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '0.7rem 1.2rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: isCallingBatch ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
              transition: 'all 0.15s ease',
            }}
          >
            {isCallingBatch ? <RefreshCw size={18} className="animate-spin" /> : <PhoneForwarded size={18} />}
            <span>{isCallingBatch ? 'कल जाँदैछ...' : '🚨 तत्काल सबैलाई IVR अटो-कल पठाउनुहोस्'}</span>
          </button>

          <button
            onClick={toggleSirenSound}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: isSirenActive ? '#dc2626' : '#f59e0b',
              color: '#ffffff',
              border: 'none',
              padding: '0.7rem 1.2rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.15s ease',
            }}
          >
            {isSirenActive ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isSirenActive ? 'साइरन ध्वनी बन्द गर्नुहोस्' : '📢 सौर्य-साइरन ध्वनी परीक्षण (Test Siren)'}</span>
          </button>
        </div>
      </div>

      {/* Grid: IVR Voice Simulator & LoRa Mesh Sirens */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
        {/* Module 1: Automated IVR Call Simulator */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '10px' }}>
                <PhoneCall size={20} color="#2563eb" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                  स्वचालित IVR फोन कल सन्देश (Nepali Voice Audio)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>खतरा विन्दु पार हुनासाथ स्वतः बज्ने अडियो</span>
              </div>
            </div>

            <button
              onClick={playVoiceAlert}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: isPlayingVoice ? '#ef4444' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isPlayingVoice ? <Square size={14} /> : <Play size={14} />}
              <span>{isPlayingVoice ? 'रोक्नुहोस्' : 'अडियो सुन्नुहोस् (Listen)'}</span>
            </button>
          </div>

          {/* Voice Text Box */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '1rem',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: '#334155',
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={15} /> स्वचालित कलमा बज्ने सन्देश:
            </div>
            "{warningTextNepali}"
            {isPlayingVoice && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontSize: '0.78rem', fontWeight: 700 }}>
                <Volume2 size={16} className="animate-pulse" />
                <span>अडियो प्रसारण भइरहेको छ...</span>
              </div>
            )}
          </div>

          {/* Call Stats Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>सम्पर्क भएको दर</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>९०.५%</div>
              <div style={{ fontSize: '0.7rem', color: '#166534' }}>३८/४२ जना</div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>औसत कल अवधि</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>३५ सेकेन्ड</div>
              <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>पूर्ण सूचना प्रवाह</div>
            </div>

            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#991b1b', fontWeight: 600 }}>पुनः प्रयास (Retries)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b91c1c' }}>४ जना</div>
              <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>स्वतः ३ पटक डायल</div>
            </div>
          </div>

          {/* Ward Filter and Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>तटीय प्राथमिकता कल सूची (Call Logs)</span>
            <select
              value={selectedWardFilter}
              onChange={(e) => setSelectedWardFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            >
              <option value="all">सबै वडा (All Wards)</option>
              <option value={2}>वडा नं. २ (तिम्बु)</option>
              <option value={4}>वडा नं. ४ (थाङपालधाप)</option>
              <option value={7}>वडा नं. ७ (गुन्सा)</option>
            </select>
          </div>

          <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '0.45rem 0.6rem', textAlign: 'left', color: '#64748b' }}>नागरिक / पद</th>
                  <th style={{ padding: '0.45rem 0.6rem', textAlign: 'left', color: '#64748b' }}>स्थान / वडा</th>
                  <th style={{ padding: '0.45rem 0.6rem', textAlign: 'left', color: '#64748b' }}>फोन नम्बर</th>
                  <th style={{ padding: '0.45rem 0.6rem', textAlign: 'right', color: '#64748b' }}>कल स्थिति</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipients.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.45rem 0.6rem', fontWeight: 600, color: '#1e293b' }}>
                      {r.name}
                      <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b', fontWeight: 400 }}>{r.role}</span>
                    </td>
                    <td style={{ padding: '0.45rem 0.6rem', color: '#475569' }}>
                      {r.location} (वडा {r.ward})
                    </td>
                    <td style={{ padding: '0.45rem 0.6rem', fontFamily: 'monospace', color: '#2563eb' }}>{r.phone}</td>
                    <td style={{ padding: '0.45rem 0.6rem', textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: r.status.includes('Delivered') ? '#dcfce7' : r.status.includes('Calling') ? '#fef3c7' : '#fee2e2',
                          color: r.status.includes('Delivered') ? '#15803d' : r.status.includes('Calling') ? '#b45309' : '#b91c1c',
                        }}
                      >
                        {r.status.split('(')[0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Module 2: LoRa / RF Mesh Solar Siren Diagnostics */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '10px' }}>
                <Radio size={20} color="#d97706" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                  इन्टरनेट बिना बज्ने सौर्य-साइरन (LoRa/RF Mesh Sirens)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>४३३ MHz रेडियो फ्रिक्वेन्सी र सौर्य ब्याट्री स्थिति</span>
              </div>
            </div>

            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '12px' }}>
              <WifiOff size={12} /> शून्य इन्टरनेट (RF Mesh Online)
            </span>
          </div>

          {/* Siren Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {SOLAR_SIRENS.map((s) => (
              <div
                key={s.id}
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f8fafc',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📍 {s.location}</div>
                  </div>
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    ● {s.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.6rem', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e293b' }}>
                    <BatteryCharging size={14} color="#16a34a" />
                    <span>ब्याट्री: <strong>{s.batteryPct}%</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e293b' }}>
                    <Sun size={14} color="#eab308" />
                    <span>सौर्य: <strong>सक्रिय</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e293b' }}>
                    <Signal size={14} color="#0284c7" />
                    <span>RF: <strong>{s.rfRssi.split(' ')[0]}</strong></span>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                  <span>आवाज कभरेज: <strong>{s.audibleRadius}</strong> (LoRa Mesh)</span>
                  <span>हार्डवेयर: {s.hardware.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* LoRa Info Alert */}
          <div style={{ marginTop: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.76rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} color="#3b82f6" />
            <span>
              <strong>विपद् प्रतिरोधी प्रविधि:</strong> बिजुलीका पोल ढल्दा वा NTC/Ncell टावर बगाउँदा पनि यी साइरनहरू सिधै
              नदीको राडार गेज र पालिका कन्ट्रोल युनिटसँग रेडियो वेभमार्फत जोडिन्छन्।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IvrVoiceSirenModule;
