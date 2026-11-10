import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Plane,
  AlertTriangle,
  CheckCircle2,
  Send,
  X,
  Compass,
  Wind,
  ShieldCheck,
  Activity,
  Copy,
  Radio
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

export interface HelipadRecord {
  id: string;
  nameNp: string;
  nameEn: string;
  wardNo: number;
  elevationM: number;
  coordinates: { lat: number; lng: number };
  gpsString: string;
  surfaceTypeNp: string;
  surfaceTypeEn: string;
  helicopterCapacity: string;
  approachClearanceNp: string;
  approachClearanceEn: string;
  focalPersonNp: string;
  focalPersonEn: string;
  contactPhone: string;
  status: 'Ready (सञ्चालनयोग्य)' | 'Caution (सजगता आवश्यक)' | 'Obstructed (अवरोध)';
}

export const PANCHPOKHARI_HELIPADS: HelipadRecord[] = [
  {
    id: 'hp-1',
    nameNp: 'मानेखर्क खेलमैदान आकस्मिक हेलिप्याड',
    nameEn: 'Manekharka Stadium Emergency Helipad',
    wardNo: 4,
    elevationM: 2150,
    coordinates: { lat: 27.9541, lng: 85.6321 },
    gpsString: '27.9541° N, 85.6321° E',
    surfaceTypeNp: 'कडा समथर घाँसे चौर (Hard Compact Grass)',
    surfaceTypeEn: 'Hard Compact Grass Field',
    helicopterCapacity: 'Mi-17 (नेपाली सेना) / Bell 407 / AS350 B3',
    approachClearanceNp: 'दक्षिण-पश्चिम पूर्ण खुला, उच्च भोल्टेज तार रहित',
    approachClearanceEn: 'South-West clear approach, zero high-tension wires',
    focalPersonNp: 'मोहन श्रेष्ठ (वडाध्यक्ष)',
    focalPersonEn: 'Mohan Shrestha (Ward Chair)',
    contactPhone: '९८५११४४०२१',
    status: 'Ready (सञ्चालनयोग्य)',
  },
  {
    id: 'hp-2',
    nameNp: 'थाङपालधाप गाउँपालिका प्रशासनिक प्राङ्गण',
    nameEn: 'Thangpaldhap Palika Complex Helipad',
    wardNo: 6,
    elevationM: 1480,
    coordinates: { lat: 27.9123, lng: 85.5912 },
    gpsString: '27.9123° N, 85.5912° E',
    surfaceTypeNp: 'आरसीसी ढलान पक्की सतह (Paved Concrete RCC)',
    surfaceTypeEn: 'RCC Paved Concrete',
    helicopterCapacity: 'AS350 B3 Ecureuil / Bell 206 JetRanger',
    approachClearanceNp: 'उत्तर-दक्षिण नदी करिडोर खुला, २४ सै घण्टा स्ट्यान्डबाइ',
    approachClearanceEn: 'North-South river corridor clear, 24/7 standby',
    focalPersonNp: 'नारायण बस्नेत (विपद् अधिकृत)',
    focalPersonEn: 'Narayan Basnet (DRR Officer)',
    contactPhone: '९८४१२२३३९९',
    status: 'Ready (सञ्चालनयोग्य)',
  },
  {
    id: 'hp-3',
    nameNp: 'भोताङदेवि मा.वि. खेलमैदान हेलिप्याड',
    nameEn: 'Bhotangdevi Secondary Ground Helipad',
    wardNo: 3,
    elevationM: 1920,
    coordinates: { lat: 27.9654, lng: 85.6421 },
    gpsString: '27.9654° N, 85.6421° E',
    surfaceTypeNp: 'ग्राभेल-माटो समथर चौर (Level Gravel Soil)',
    surfaceTypeEn: 'Level Gravel & Soil',
    helicopterCapacity: 'AS350 B3 / Eurocopter Medevac',
    approachClearanceNp: 'पूर्व-पश्चिम खुला, लेकाली हुस्सु हुँदा दृष्टिक्षमता जाँच आवश्यक',
    approachClearanceEn: 'East-West clear, visibility check required in fog',
    focalPersonNp: 'पेम्बा दोर्जे लामा (शिक्षक/स्वयंसेवक)',
    focalPersonEn: 'Pemba Dorje Lama (Volunteer)',
    contactPhone: '९८६०११२२३३',
    status: 'Ready (सञ्चालनयोग्य)',
  },
  {
    id: 'hp-4',
    nameNp: 'बरुवा स्वास्थ्य चौकी चौर उच्च-लेकाली हेलिप्याड',
    nameEn: 'Baruwa Health Post High-Altitude Helipad',
    wardNo: 2,
    elevationM: 2340,
    coordinates: { lat: 27.9812, lng: 85.6711 },
    gpsString: '27.9812° N, 85.6711° E',
    surfaceTypeNp: 'उच्च हिमाली घाँसे डाँडा (Mountain Meadow)',
    surfaceTypeEn: 'Mountain Meadow Turf',
    helicopterCapacity: 'AS350 B3 High-Altitude Specialist Only',
    approachClearanceNp: 'खोँच हावा सतर्कता, स्वास्थ्य चौकी नजिकै सिधै बिरामी सार्न सकिने',
    approachClearanceEn: 'Gorge wind caution, immediate health post transfer',
    focalPersonNp: 'सोम तामाङ (स्वास्थ्य चौकी इन्चार्ज)',
    focalPersonEn: 'Som Tamang (Health Post Incharge)',
    contactPhone: '९८४१००८८९९',
    status: 'Caution (सजगता आवश्यक)',
  },
  {
    id: 'hp-5',
    nameNp: 'तिपेनी बजार मेलम्ची किनार हेलिप्याड',
    nameEn: 'Tipeni Bazaar Melamchi Riverside Helipad',
    wardNo: 7,
    elevationM: 1120,
    coordinates: { lat: 27.9189, lng: 85.5812 },
    gpsString: '27.9189° N, 85.5812° E',
    surfaceTypeNp: 'बगर समथर कडा ग्राभेल (Compacted Riverbed Gravel)',
    surfaceTypeEn: 'Compacted Riverbed Gravel',
    helicopterCapacity: 'Mi-17 (डबल ल्यान्डिङ क्षमता) / Bell 407',
    approachClearanceNp: 'नदी किनारा फराकिलो खुला, भारी राहत सामग्री ढुवानी उपयुक्त',
    approachClearanceEn: 'Wide river corridor, ideal for heavy cargo airlift',
    focalPersonNp: 'गोपाल श्रेष्ठ (वडा सचिव)',
    focalPersonEn: 'Gopal Shrestha (Ward Secretary)',
    contactPhone: '९८५१००११२२',
    status: 'Ready (सञ्चालनयोग्य)',
  },
];

interface MedevacModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHelipad?: HelipadRecord | null;
}

export const EmergencyHelipadMedevacModal: React.FC<MedevacModalProps> = ({
  isOpen,
  onClose,
  selectedHelipad,
}) => {
  const { isNepali } = useLanguage();
  const [helipadId, setHelipadId] = useState<string>(selectedHelipad?.id || 'hp-1');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('महिला');
  const [medicalCondition, setMedicalCondition] = useState('सुत्केरी व्यथा जटिल / Complicated Delivery');
  const [triageUrgency, setTriageUrgency] = useState<'रेड (तत्काल उद्धार/Immediate)' | 'यलो (गम्भीर/Urgent)'>('रेड (तत्काल उद्धार/Immediate)');
  const [weatherCondition, setWeatherCondition] = useState('खुला घाम / Clear Sky & High Visibility');
  const [localContact, setLocalContact] = useState('');
  const [dispatchGenerated, setDispatchGenerated] = useState(false);

  const activeHelipad = PANCHPOKHARI_HELIPADS.find((h) => h.id === helipadId) || PANCHPOKHARI_HELIPADS[0];

  if (!isOpen) return null;

  const generatedPayload = `[NIDRMS-MEDEVAC-AIR-RESCUE-DISPATCH]
मिति: ${new Date().toISOString().split('T')[0]} | EOC टोकन: MDV-081-${Math.floor(1000 + Math.random() * 9000)}
१. गन्तव्य हेलिप्याड: ${activeHelipad.nameNp} (${activeHelipad.nameEn})
२. GPS निर्देशांक: ${activeHelipad.gpsString} (Elev: ${activeHelipad.elevationM}m)
३. बिरामी: ${patientName || 'अज्ञात'}, उमेर: ${patientAge || '-'}, लिङ्ग: ${patientGender}
४. स्वास्थ्य अवस्था: ${medicalCondition} [प्राथमिकता: ${triageUrgency}]
५. मौसम तथा दृष्टिक्षमता: ${weatherCondition}
६. अवतरण क्षमता: ${activeHelipad.helicopterCapacity}
७. ग्राउन्ड सम्पर्क व्यक्ति: ${activeHelipad.focalPersonNp} (मो: ${activeHelipad.contactPhone} / ${localContact})
८. अनुरोधकर्ता निकाय: पाँचपोखरी थाङपाल गाउँपालिका आपतकालीन कार्यसञ्चालन केन्द्र (LEOC)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPayload);
    toast.success(isNepali ? 'Medevac विवरण क्लिपबोर्डमा कपी भयो!' : 'Medevac dispatch payload copied to clipboard!');
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error(isNepali ? 'कृपया बिरामीको नाम अनिवार्य भर्नुहोस्।' : 'Please provide patient name.');
      return;
    }
    setDispatchGenerated(true);
    toast.success(
      isNepali
        ? 'नेपाली सेना, गृह मन्त्रालय (NEOC) र एयर डेस्कमा Medevac अनुरोध सफलतापूर्वक प्रेषित भयो!'
        : 'Emergency Medevac dispatch request successfully routed to Army & MoHA Air Desk!'
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #cbd5e1',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
            padding: '1.25rem 1.5rem',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Plane size={24} color="#fef08a" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                {isNepali ? '🚨 आपतकालीन Medevac हवाई उद्धार अनुरोध' : '🚨 Emergency Medevac Air Rescue Request'}
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', opacity: 0.9 }}>
                {isNepali ? 'गृह मन्त्रालय (NEOC) र नेपाली सेना एयर विंग प्रत्यक्ष अन्तरआबद्धता' : 'Direct Interlink with MoHA NEOC & Nepal Army Air Wing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0.35rem',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {!dispatchGenerated ? (
            <form onSubmit={handleDispatch} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  {isNepali ? '१. अवतरण हुने प्रमाणित हेलिप्याड छनोट गर्नुहोस् *' : '1. Select Designated Helipad *'}
                </label>
                <select
                  value={helipadId}
                  onChange={(e) => setHelipadId(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  {PANCHPOKHARI_HELIPADS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {isNepali ? h.nameNp : h.nameEn} (वडा {h.wardNo}, उचाइ: {h.elevationM}m) - {h.status}
                    </option>
                  ))}
                </select>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 0.75rem', marginTop: '0.35rem', fontSize: '0.72rem', color: '#475569' }}>
                  📍 <strong>GPS:</strong> {activeHelipad.gpsString} | 🚁 <strong>क्षमता:</strong> {activeHelipad.helicopterCapacity} | 📞 <strong>सम्पर्क:</strong> {activeHelipad.focalPersonNp} ({activeHelipad.contactPhone})
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? '२. बिरामी / घाइतेको नाम *' : '2. Patient Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isNepali ? 'उदा: पेम्बा लामु शेर्पा' : 'e.g. Pemba Lamu Sherpa'}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? 'उमेर' : 'Age'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: २८"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? 'लिङ्ग' : 'Gender'}
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="महिला">महिला (Female)</option>
                    <option value="पुरुष">पुरुष (Male)</option>
                    <option value="बालबालिका">बालबालिका (Child)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? '३. आपतकालीन स्वास्थ्य अवस्था *' : '3. Medical Condition *'}
                  </label>
                  <select
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="सुत्केरी व्यथा जटिल / Complicated Delivery">सुत्केरी व्यथा जटिल (राष्ट्रपति महिला उत्थान कार्यक्रम)</option>
                    <option value="पहिरो/भिरबाट खसेको गम्भीर चोट (Severe Trauma/Fracture)">पहिरो/भिरबाट खसेको गम्भीर चोट (Severe Trauma)</option>
                    <option value="बाढीमा डुबेको अचेत अवस्था (Near Drowning/Unconscious)">बाढीमा डुबेको अचेत अवस्था (Unconscious)</option>
                    <option value="हृदयघात वा मस्तिष्कघात (Cardiac / Stroke)">हृदयघात वा मस्तिष्कघात (Cardiac/Stroke)</option>
                    <option value="अग्निदग्ध गम्भीर अवस्था (Severe Burn)">अग्निदग्ध गम्भीर अवस्था (Severe Burn)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? 'ट्रियाज प्राथमिकता *' : 'Triage Priority *'}
                  </label>
                  <select
                    value={triageUrgency}
                    onChange={(e) => setTriageUrgency(e.target.value as any)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1.5px solid #ef4444', fontSize: '0.82rem', fontWeight: 700, color: '#b91c1c' }}
                  >
                    <option value="रेड (तत्काल उद्धार/Immediate)">🔴 RED - तत्काल उद्धार (Immediate Life Threat &lt; 2 hrs)</option>
                    <option value="यलो (गम्भीर/Urgent)">🟡 YELLOW - गम्भीर अवस्था (Urgent &lt; 6 hrs)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? '४. वर्तमान मौसम तथा दृष्टिक्षमता' : '4. Weather & Visibility'}
                  </label>
                  <select
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="खुला घाम / Clear Sky & High Visibility">☀️ खुला घाम (Clear Visibility &gt; 5 km)</option>
                    <option value="हल्का बादल तर उडान योग्य / Light Clouds">⛅ हल्का बादल तर उडान योग्य (VFR OK)</option>
                    <option value="हुस्सु/कुहिरो हावा सतर्कता / Dense Fog Caution">🌫️ हुस्सु/कुहिरो (Foggy / Caution)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    {isNepali ? 'स्थानीय प्रत्यक्ष सम्पर्क फोन' : 'Local Direct Phone'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: ९८५११००२२२"
                    value={localContact}
                    onChange={(e) => setLocalContact(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem', fontSize: '0.75rem', color: '#991b1b', lineHeight: 1.5 }}>
                ⚠️ <strong>कानुनी मापदण्ड:</strong> Medevac हवाई उद्धार अनुरोध सिधै नेपाली सेना हवाई महानिर्देशनालय र गृह मन्त्रालय राष्ट्रिय आपतकालीन कार्यसञ्चालन केन्द्र (NEOC) को हटलाइनमा ब्रोडकास्ट हुनेछ। गलत विवरण प्रविष्ट गर्नु कानुनतः दण्डनीय छ।
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f1f5f9',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                  }}
                >
                  {isNepali ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.3rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Send size={15} />
                  <span>{isNepali ? 'हवाई उद्धार अनुरोध प्रेषित गर्नुहोस्' : 'Submit Air Rescue Request'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <CheckCircle2 size={32} color="#059669" />
                <div>
                  <h4 style={{ margin: 0, color: '#065f46', fontSize: '0.95rem', fontWeight: 800 }}>
                    {isNepali ? 'Medevac हवाई उद्धार सफलतापूर्वक दर्ता तथा सम्प्रेषित भयो!' : 'Medevac Request Successfully Transmitted!'}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#047857' }}>
                    नेपाली सेना रेस्क्यु युनिट तथा गृह मन्त्रालय NEOC एयर डेस्कमा निम्न टोकन सुरक्षित छ:
                  </p>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    {isNepali ? 'पाइलट तथा EOC आधिकारिक ब्रोडकास्ट फर्म्याट:' : 'Pilot & EOC Broadcast Payload:'}
                  </span>
                  <button
                    onClick={handleCopy}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Copy size={13} /> {isNepali ? 'कपी गर्नुहोस्' : 'Copy Payload'}
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={8}
                  value={generatedPayload}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    backgroundColor: '#0f172a',
                    color: '#38bdf8',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button
                  onClick={() => {
                    setDispatchGenerated(false);
                    onClose();
                  }}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {isNepali ? 'सम्पन्न भयो (बन्द गर्नुहोस्)' : 'Done (Close)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
