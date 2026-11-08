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
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [equipment, setEquipment] = useState<HeavyEquipment[]>(INITIAL_EQUIPMENT);
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
            <HardHat size={14} color="#facc15" /> खोज तथा उद्धार (SAR) र हेभी इक्युपमेन्ट डाइरेक्टरी
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={24} color="#38bdf8" /> पालिका तथा निजी हेभी इक्युपमेन्ट र स्वयंसेवक कार्यदल
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            पहिरोले सडक थुनिँदा वा नदीले धार फेर्दा तत्काल डोजर, एक्साभेटर, र्याफ्टिङ बोट र तालिमप्राप्त उद्धारकर्मी कहाँ छन्
            भन्ने विवरण सहित चालकको प्रत्यक्ष सम्पर्क नम्बर र स्ट्यान्डबाइ नक्सा।
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => toast.success('सबै डोजर तथा एक्साभेटर चालकहरूलाई स्ट्यान्डबाइ अलर्ट SMS पठाइयो!')}
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
            <span>🚨 चालकहरूलाई स्ट्यान्डबाइ अलर्ट पठाउनुहोस्</span>
          </button>
        </div>
      </div>

      {/* Equipment Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>हेभी डोजर / एक्साभेटर</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#15803d' }}>१० थान</div>
          <div style={{ fontSize: '0.7rem', color: '#166534' }}>४ पालिका + ६ निजी ठेकेदार</div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>जल उद्धार (Rescue Rafts)</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1d4ed8' }}>२ बोट / १२० ज्याकेट</div>
          <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>तिम्बु मेलम्ची बेस क्याम्प</div>
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>काठ काट्ने चेन-सः मेसिन</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#b45309' }}>५ युनिट</div>
          <div style={{ fontSize: '0.7rem', color: '#92400e' }}>रूख ढलेर सडक अवरोध हटाउन</div>
        </div>

        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>सामुदायिक स्वयंसेवक दल</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#7e22ce' }}>६४ जना</div>
          <div style={{ fontSize: '0.7rem', color: '#6b21a8' }}>रेडक्रस, स्काउट, पूर्व-सुरक्षाकर्मी</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="उपकरण, चालकको नाम वा स्थान खोज्नुहोस्..."
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
            <option value="all">सबै वडाहरू (१-८)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
              <option key={w} value={w}>वडा नं. {w}</option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
          उपलब्ध उपकरण: <strong>{filteredEquipment.length}</strong> थान
        </span>
      </div>

      {/* Equipment Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>उपकरणको नाम / प्रकार</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>स्वामित्व तथा नम्बर</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>स्ट्यान्डबाइ स्थान</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>चालक / सम्पर्क नम्बर</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>इन्धन अवस्था</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#475569', fontWeight: 700 }}>सञ्चालन स्थिति</th>
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

      {/* Community Responders Roster */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#7c3aed" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              स्थानीय विपद् स्वयंसेवक कार्यदल (Community Responders Taskforce)
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>तालिमप्राप्त ६४ जना स्थानीय स्वयंसेवक सक्रिय</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {COMMUNITY_RESPONDERS.map((r) => (
            <div key={r.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem 1rem', background: '#f8fafc' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{r.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                टोली प्रमुख: <strong>{r.lead}</strong> (वडा {r.ward}) | सदस्य संख्या: <strong>{r.members} जना</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={12} /> <a href={`tel:${r.phone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>{r.phone}</a>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.3rem', background: '#ecfdf5', padding: '0.2rem 0.45rem', borderRadius: '4px', display: 'inline-block' }}>
                तालिम: {r.skills}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeavyEquipmentSarTab;
