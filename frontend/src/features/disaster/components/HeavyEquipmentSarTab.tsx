import React, { useState } from 'react';
import {
  Truck,
  HardHat,
  Phone,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Fuel,
  Shield,
  LifeBuoy,
  Wrench,
  Activity,
  Plus,
  Plane,
  Compass,
  Radio,
  FileText,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';
import {
  PANCHPOKHARI_HELIPADS,
  EmergencyHelipadMedevacModal,
  type HelipadRecord,
} from './EmergencyHelipadMedevacModal';

interface HeavyEquipment {
  id: string;
  name: string;
  equipmentType: 'डोजर (Dozer)' | 'एक्साभेटर (Excavator)' | 'टिप्पर (Tipper)' | 'र्याफ्टिङ बोट (Rescue Boat)' | 'काठ काट्ने चेन-सः (Chain Saw)';
  ownership: 'पालिका आफ्नै (Municipal)' | 'निजी कन्ट्रयाक्टर (Private Contractor)';
  registrationNo: string;
  currentLocation: string;
  wardNo: number;
  operatorName: string;
  operatorPhone: string;
  fuelLevel: string;
  status: 'Ready (स्ट्यान्डबाइ)' | 'Deployed (कार्यरत)' | 'Under Maintenance (मर्मतमा)';
  capacity: string;
}

const INITIAL_EQUIPMENT: HeavyEquipment[] = [
  {
    id: 'eq-1',
    name: 'CAT D6G हेभी क्रलर डोजर',
    equipmentType: 'डोजर (Dozer)',
    ownership: 'पालिका आफ्नै (Municipal)',
    registrationNo: 'बा २ ख ४१५०',
    currentLocation: 'थाङपालधाप पालिका ग्यारेज, वडा ४',
    wardNo: 4,
    operatorName: 'राजेन्द्र श्रेष्ठ',
    operatorPhone: '९८५११४४५५६',
    fuelLevel: '१००% (Full Tank)',
    status: 'Ready (स्ट्यान्डबाइ)',
    capacity: 'पहिरो पन्छाउने र सडक खुलाउने'
  },
  {
    id: 'eq-2',
    name: 'कोमात्सु PC200 हाइड्रोलिक एक्साभेटर',
    equipmentType: 'एक्साभेटर (Excavator)',
    ownership: 'निजी कन्ट्रयाक्टर (Private Contractor)',
    registrationNo: 'बा १ ख ७२८९',
    currentLocation: 'तिम्बु बजार सडक डिपो, वडा २',
    wardNo: 2,
    operatorName: 'दीपक तामाङ',
    operatorPhone: '९८४१२२३३९९',
    fuelLevel: '८५%',
    status: 'Ready (स्ट्यान्डबाइ)',
    capacity: 'नदी कटान तटबन्धन तथा गेग्रान हटाउने'
  },
  {
    id: 'eq-3',
    name: 'टाटा हेभी-ड्युटी १० चक्के टिप्पर',
    equipmentType: 'टिप्पर (Tipper)',
    ownership: 'पालिका आफ्नै (Municipal)',
    registrationNo: 'बा ३ ख ९०२१',
    currentLocation: 'मानेखर्क सडक खण्ड, वडा ५',
    wardNo: 5,
    operatorName: 'सुकुमान लामा',
    operatorPhone: '९८६०११४४७७',
    fuelLevel: '९०%',
    status: 'Deployed (कार्यरत)',
    capacity: 'ग्याबियन जाली र ढुङ्गा ढुवानी'
  },
  {
    id: 'eq-4',
    name: 'ह्वाइटवाटर र्याफ्टिङ उद्धार बोट (६ जना क्षमता)',
    equipmentType: 'र्याफ्टिङ बोट (Rescue Boat)',
    ownership: 'पालिका आफ्नै (Municipal)',
    registrationNo: 'BOAT-MEL-०१',
    currentLocation: 'मेलम्ची रिभर रेस्क्यु बेस क्याम्प, वडा २',
    wardNo: 2,
    operatorName: 'दावा साङ्गे शेर्पा (गाइड)',
    operatorPhone: '९८४१५५६६७७',
    fuelLevel: 'प्याडल तथा इन्जिन फिट',
    status: 'Ready (स्ट्यान्डबाइ)',
    capacity: 'बाढीमा फसेका नागरिकको जल उद्धार'
  },
  {
    id: 'eq-5',
    name: 'स्टिहल MS-382 पेट्रोल चेन-सः (रुख काट्ने मेसिन)',
    equipmentType: 'काठ काट्ने चेन-सः (Chain Saw)',
    ownership: 'पालिका आफ्नै (Municipal)',
    registrationNo: 'SAW-THP-०३',
    currentLocation: 'गुन्सा वडा कार्यालय, वडा ७',
    wardNo: 7,
    operatorName: 'पेम्बा दोर्जे शेर्पा',
    operatorPhone: '९८५१२३४५६७',
    fuelLevel: '१० लिटर मिक्स पेट्रोल स्टक',
    status: 'Ready (स्ट्यान्डबाइ)',
    capacity: 'सडकमा ढलेका रूख पन्छाउने'
  }
];

const COMMUNITY_RESPONDERS = [
  { id: 'res-1', name: 'नेपाल रेडक्रस सोसाइटी उपशाखा', lead: 'गोपाल लामिछाने', phone: '९८५११००१११', members: 18, ward: 4, skills: 'प्राथमिक उपचार, खोज-उद्धार, टेन्ट निर्माण' },
  { id: 'res-2', name: 'तिम्बु युवा विपद् उद्धार कार्यदल', lead: 'फुन्जोक लामा', phone: '९८४१२२३३५५', members: 14, ward: 2, skills: 'नदी उद्धार, डोरी र्यापलिङ, लाइफ ज्याकेट' },
  { id: 'res-3', name: 'मानेखर्क पहिरो स्वयंसेवक समूह', lead: 'मिङ्मार शेर्पा', phone: '९८६०११२२८८', members: 12, ward: 5, skills: 'पहिरो धाँजा अनुगमन, नागरिक स्थानान्तरण' },
  { id: 'res-4', name: 'नेपाल स्काउट पाँचपोखरी दल', lead: 'अनिता तामाङ', phone: '९८४१००८८९९', members: 20, ward: 6, skills: 'राहत वितरण, बालबालिका सुरक्षा, समन्वय' },
];

export const HeavyEquipmentSarTab: React.FC = () => {
  const { isNepali } = useLanguage();
  const [subTab, setSubTab] = useState<'equipment' | 'helipads' | 'responders'>('equipment');
  const [equipment, setEquipment] = useState<HeavyEquipment[]>(INITIAL_EQUIPMENT);
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMedevacModalOpen, setIsMedevacModalOpen] = useState(false);
  const [selectedHelipad, setSelectedHelipad] = useState<HelipadRecord | null>(null);

  const filteredEquipment = equipment.filter((eq) => {
    if (selectedWard !== 'all' && eq.wardNo !== selectedWard) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        eq.name.toLowerCase().includes(q) ||
        eq.operatorName.toLowerCase().includes(q) ||
        eq.currentLocation.toLowerCase().includes(q) ||
        eq.equipmentType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredHelipads = PANCHPOKHARI_HELIPADS.filter((hp) => {
    if (selectedWard !== 'all' && hp.wardNo !== selectedWard) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        hp.nameNp.toLowerCase().includes(q) ||
        hp.nameEn.toLowerCase().includes(q) ||
        hp.helicopterCapacity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openMedevac = (helipad?: HelipadRecord) => {
    setSelectedHelipad(helipad || null);
    setIsMedevacModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
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
            <HardHat size={14} color="#facc15" />
            <span>{isNepali ? 'खोज तथा उद्धार (SAR), हेभी इक्युपमेन्ट र Medevac डाइरेक्टरी' : 'SAR Heavy Equipment & Medevac Directory'}</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={24} color="#38bdf8" />
            <span>{isNepali ? 'डोजर, एक्साभेटर, आपतकालीन हेलिप्याड तथा उद्धार कार्यदल' : 'Earthmovers, Emergency Helipads & First Responders'}</span>
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            {isNepali
              ? 'पहिरोले सडक थुनिँदा वा नदीले धार फेर्दा तत्काल डोजर, एक्साभेटर, र्याफ्टिङ बोट, ५ वटा प्रमाणित आपतकालीन हेलिप्याड तथा ६४ तालिमप्राप्त उद्धारकर्मीको २४/७ स्ट्यान्डबाइ नक्सा र सम्पर्क।'
              : '24/7 standby live positioning and direct dispatch for bulldozers, excavators, 5 certified emergency helipads, and 64 trained local SAR volunteers.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => openMedevac()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            }}
          >
            <Plane size={16} />
            <span>{isNepali ? '🚁 Medevac हवाई उद्धार अनुरोध' : '🚁 Request Medevac Airlift'}</span>
          </button>

          <button
            onClick={() => toast.success(isNepali ? 'सबै डोजर तथा एक्साभेटर चालकहरूलाई स्ट्यान्डबाइ अलर्ट SMS पठाइयो!' : 'Standby SMS alert broadcasted to heavy equipment operators!')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
          >
            <Activity size={16} />
            <span>{isNepali ? 'चालकहरूलाई अलर्ट SMS' : 'Alert Operators'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setSubTab('equipment')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: subTab === 'equipment' ? '#0284c7' : 'transparent',
            color: subTab === 'equipment' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          <Truck size={16} />
          <span>{isNepali ? '🚜 हेभी उपकरण तथा डोजर (१० थान)' : '🚜 Heavy Equipment & Dozers (10)'}</span>
        </button>

        <button
          onClick={() => setSubTab('helipads')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: subTab === 'helipads' ? '#dc2626' : 'transparent',
            color: subTab === 'helipads' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          <Plane size={16} />
          <span>{isNepali ? '🚁 प्रमाणित आपतकालीन हेलिप्याड (५ वटा)' : '🚁 Designated Helipads (5 Sites)'}</span>
        </button>

        <button
          onClick={() => setSubTab('responders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: subTab === 'responders' ? '#7c3aed' : 'transparent',
            color: subTab === 'responders' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          <Users size={16} />
          <span>{isNepali ? '👥 स्थानीय उद्धार स्वयंसेवक कार्यदल (६४ जना)' : '👥 Community Responders (64)'}</span>
        </button>
      </div>

      {/* Equipment Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>{isNepali ? 'हेभी डोजर / एक्साभेटर' : 'Heavy Earthmovers'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#15803d' }}>{isNepali ? '१० थान' : '10 Units'}</div>
          <div style={{ fontSize: '0.7rem', color: '#166534' }}>{isNepali ? '४ पालिका + ६ निजी ठेकेदार' : '4 Municipal + 6 Private'}</div>
        </div>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>{isNepali ? 'प्रमाणित आपतकालीन हेलिप्याड' : 'Emergency Helipads'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dc2626' }}>{isNepali ? '५ स्थान' : '5 Sites'}</div>
          <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>{isNepali ? 'Mi-17 र AS350 B3 क्षमता' : 'Mi-17 & AS350 B3 Capacity'}</div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>{isNepali ? 'जल उद्धार (Rescue Rafts)' : 'Water Rescue Rafts'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1d4ed8' }}>{isNepali ? '२ बोट / १२० ज्याकेट' : '2 Boats / 120 Jackets'}</div>
          <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>{isNepali ? 'तिम्बु मेलम्ची बेस क्याम्प' : 'Timbu Melamchi Base Camp'}</div>
        </div>

        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>{isNepali ? 'सामुदायिक स्वयंसेवक दल' : 'SAR Responders'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#7e22ce' }}>{isNepali ? '६४ जना' : '64 Certified'}</div>
          <div style={{ fontSize: '0.7rem', color: '#6b21a8' }}>{isNepali ? 'रेडक्रस, स्काउट, पूर्व-सुरक्षाकर्मी' : 'Red Cross, Scout, Veterans'}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={isNepali ? 'उपकरण, हेलिप्याड, चालक वा स्थान खोज्नुहोस्...' : 'Search equipment, helipad, operator or location...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem 0.45rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            style={{ padding: '0.45rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
          >
            <option value="all">{isNepali ? 'सबै वडाहरू (१-८)' : 'All Wards (1-8)'}</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
              <option key={w} value={w}>{isNepali ? `वडा नं. ${w}` : `Ward ${w}`}</option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
          {subTab === 'equipment' && (
            <span>{isNepali ? `उपलब्ध उपकरण: ${filteredEquipment.length} थान` : `Available: ${filteredEquipment.length} units`}</span>
          )}
          {subTab === 'helipads' && (
            <span>{isNepali ? `प्रमाणित हेलिप्याड: ${filteredHelipads.length} स्थान` : `Helipads: ${filteredHelipads.length} sites`}</span>
          )}
          {subTab === 'responders' && (
            <span>{isNepali ? `उद्धार कार्यदल: ${COMMUNITY_RESPONDERS.length} समूह` : `Taskforces: ${COMMUNITY_RESPONDERS.length} groups`}</span>
          )}
        </span>
      </div>

      {/* Sub-tab 1: Equipment View */}
      {subTab === 'equipment' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'उपकरणको नाम / प्रकार' : 'Equipment Name & Type'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'स्वामित्व तथा नम्बर' : 'Ownership & Reg No'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'स्ट्यान्डबाइ स्थान' : 'Standby Location'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'चालक / सम्पर्क नम्बर' : 'Operator & Phone'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'इन्धन अवस्था' : 'Fuel Level'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#475569', fontWeight: 700 }}>{isNepali ? 'सञ्चालन स्थिति' : 'Operational Status'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((eq) => (
                <tr key={eq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{eq.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>{eq.equipmentType}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{eq.capacity}</div>
                  </td>

                  <td style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>
                    <div style={{ fontWeight: 600 }}>{eq.ownership}</div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#475569' }}>{eq.registrationNo}</div>
                  </td>

                  <td style={{ padding: '0.65rem 0.85rem', color: '#334155' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={13} color="#ef4444" /> {eq.currentLocation}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>वडा नं. {eq.wardNo}</div>
                  </td>

                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{eq.operatorName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Phone size={12} /> <a href={`tel:${eq.operatorPhone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>{eq.operatorPhone}</a>
                    </div>
                  </td>

                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: '#166534' }}>
                      <Fuel size={14} color="#15803d" /> {eq.fuelLevel}
                    </div>
                  </td>

                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: eq.status.includes('Ready') ? '#dcfce7' : eq.status.includes('Deployed') ? '#fef3c7' : '#fee2e2',
                        color: eq.status.includes('Ready') ? '#15803d' : eq.status.includes('Deployed') ? '#b45309' : '#b91c1c',
                      }}
                    >
                      ● {eq.status.split('(')[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sub-tab 2: Designated Helipads View */}
      {subTab === 'helipads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {filteredHelipads.map((hp) => (
              <div
                key={hp.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                      वडा नं. {hp.wardNo} • उचाइ: {hp.elevationM} मिटर
                    </span>
                    <h3 style={{ margin: '0.35rem 0 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                      {isNepali ? hp.nameNp : hp.nameEn}
                    </h3>
                  </div>
                  <span
                    style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: hp.status.includes('Ready') ? '#dcfce7' : '#fef3c7',
                      color: hp.status.includes('Ready') ? '#15803d' : '#b45309',
                    }}
                  >
                    ● {hp.status.split('(')[0]}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.3rem', background: '#f8fafc', padding: '0.65rem', borderRadius: '8px' }}>
                  <div>📍 <strong>GPS:</strong> <span style={{ fontFamily: 'monospace', color: '#0369a1' }}>{hp.gpsString}</span></div>
                  <div>🏗️ <strong>सतह:</strong> {isNepali ? hp.surfaceTypeNp : hp.surfaceTypeEn}</div>
                  <div>🚁 <strong>हेलिकप्टर क्षमता:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{hp.helicopterCapacity}</span></div>
                  <div>🧭 <strong>पहुँच/क्लियरेन्स:</strong> {isNepali ? hp.approachClearanceNp : hp.approachClearanceEn}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{isNepali ? hp.focalPersonNp : hp.focalPersonEn}</div>
                    <a href={`tel:${hp.contactPhone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Phone size={12} /> {hp.contactPhone}
                    </a>
                  </div>

                  <button
                    onClick={() => openMedevac(hp)}
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Plane size={13} />
                    <span>{isNepali ? 'हवाई उद्धार अनुरोध' : 'Dispatch Medevac'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Community Responders Roster */}
      {subTab === 'responders' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="#7c3aed" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
                {isNepali ? 'स्थानीय विपद् स्वयंसेवक कार्यदल (Community Responders Taskforce)' : 'Community Responders Taskforce'}
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {isNepali ? 'तालिमप्राप्त ६४ जना स्थानीय स्वयंसेवक सक्रिय' : '64 trained ward volunteers active'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {COMMUNITY_RESPONDERS.map((r) => (
              <div key={r.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem 1rem', background: '#f8fafc' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                  {isNepali ? 'टोली प्रमुख:' : 'Leader:'} <strong>{r.lead}</strong> (वडा {r.ward}) | {isNepali ? 'सदस्य संख्या:' : 'Members:'} <strong>{r.members} जना</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Phone size={12} /> <a href={`tel:${r.phone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>{r.phone}</a>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.3rem', background: '#ecfdf5', padding: '0.2rem 0.45rem', borderRadius: '4px', display: 'inline-block' }}>
                  {isNepali ? 'तालिम:' : 'Skills:'} {r.skills}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Medevac Modal */}
      <EmergencyHelipadMedevacModal
        isOpen={isMedevacModalOpen}
        onClose={() => setIsMedevacModalOpen(false)}
        selectedHelipad={selectedHelipad}
      />
    </div>
  );
};

export default HeavyEquipmentSarTab;
