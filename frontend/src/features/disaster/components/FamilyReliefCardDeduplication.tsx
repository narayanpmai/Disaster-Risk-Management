import React, { useState } from 'react';
import {
  QrCode,
  Search,
  AlertTriangle,
  CheckCircle2,
  Users,
  Package,
  Calendar,
  Building,
  Printer,
  ShieldAlert,
  FileCheck2,
  RefreshCw,
  Plus,
  X,
  HeartHandshake
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

export interface ReliefHistoryRecord {
  id: string;
  distributedDateBs: string;
  daysAgo: number;
  agencyNp: string;
  agencyEn: string;
  itemsNp: string[];
  itemsEn: string[];
  officerNp: string;
  officerEn: string;
}

export interface FamilyReliefProfile {
  token: string;
  houseMatrixNo: string;
  wardNo: number;
  headNameNp: string;
  headNameEn: string;
  citizenshipNo: string;
  contactPhone: string;
  totalMembers: number;
  vulnerableBreakdown: {
    childrenUnder5: number;
    pregnantOrLactating: number;
    seniors70Plus: number;
    differentlyAbled: number;
  };
  damageStatusNp: string;
  damageStatusEn: string;
  reliefHistory: ReliefHistoryRecord[];
}

const INITIAL_FAMILIES: FamilyReliefProfile[] = [
  {
    token: 'REL-081-W2-104',
    houseMatrixNo: 'THP-W2-0084',
    wardNo: 2,
    headNameNp: 'दावा साङ्गे शेर्पा',
    headNameEn: 'Dawa Sangye Sherpa',
    citizenshipNo: '२७-०१-६८-०९१२३',
    contactPhone: '९८४१२२३३९९',
    totalMembers: 5,
    vulnerableBreakdown: {
      childrenUnder5: 1,
      pregnantOrLactating: 1,
      seniors70Plus: 1,
      differentlyAbled: 0,
    },
    damageStatusNp: 'आंशिक क्षति (घर भित्र लेदो पसेको)',
    damageStatusEn: 'Partial Structural Damage (Mud Inundation)',
    reliefHistory: [
      {
        id: 'dist-01',
        distributedDateBs: '२०८१-०१-१९',
        daysAgo: 2,
        agencyNp: 'नेपाल रेडक्रस सोसाइटी (उपशाखा)',
        agencyEn: 'Nepal Red Cross Society',
        itemsNp: ['चामल २५ केजी', 'दाल ३ केजी', 'त्रिपाल १ थान'],
        itemsEn: ['Rice 25kg', 'Lentils 3kg', 'Tarpaulin 1 pc'],
        officerNp: 'गोपाल लामिछाने',
        officerEn: 'Gopal Lamichhane',
      },
    ],
  },
  {
    token: 'REL-081-W5-219',
    houseMatrixNo: 'THP-W5-0219',
    wardNo: 5,
    headNameNp: 'राम बहादुर तामाङ',
    headNameEn: 'Ram Bahadur Tamang',
    citizenshipNo: '२७-०१-७२-०३४२१',
    contactPhone: '९८५११४४५५६',
    totalMembers: 6,
    vulnerableBreakdown: {
      childrenUnder5: 0,
      pregnantOrLactating: 0,
      seniors70Plus: 2,
      differentlyAbled: 1,
    },
    damageStatusNp: 'पूर्ण क्षति (पहिरोले घर भत्किएको)',
    damageStatusEn: 'Total Loss (House Collapsed in Slide)',
    reliefHistory: [
      {
        id: 'dist-02',
        distributedDateBs: '२०८१-०१-०३',
        daysAgo: 18,
        agencyNp: 'पाँचपोखरी गाउँपालिका विपद् कोष',
        agencyEn: 'Municipal Disaster Relief Fund',
        itemsNp: ['नगद राहत रु. २०,०००', 'कम्बल २ थान', 'हाइजिन किट १'],
        itemsEn: ['Cash Grant NPR 20k', 'Blankets 2 pcs', 'Hygiene Kit 1'],
        officerNp: 'सुरेश श्रेष्ठ (प्राविधिक)',
        officerEn: 'Suresh Shrestha',
      },
    ],
  },
  {
    token: 'REL-081-W3-112',
    houseMatrixNo: 'THP-W3-0112',
    wardNo: 3,
    headNameNp: 'पासाङ याङ्जी लामा',
    headNameEn: 'Pasang Yangji Lama',
    citizenshipNo: '२७-०१-७४-०५६७८',
    contactPhone: '९८६०११२२३३',
    totalMembers: 4,
    vulnerableBreakdown: {
      childrenUnder5: 2,
      pregnantOrLactating: 1,
      seniors70Plus: 0,
      differentlyAbled: 0,
    },
    damageStatusNp: 'उच्च जोखिम विस्थापित बस्ती (आश्रयस्थलमा)',
    damageStatusEn: 'Evacuated Vulnerable Settlement (In Shelter)',
    reliefHistory: [],
  },
];

export const FamilyReliefCardDeduplication: React.FC = () => {
  const { isNepali } = useLanguage();
  const [families, setFamilies] = useState<FamilyReliefProfile[]>(INITIAL_FAMILIES);
  const [searchQuery, setSearchQuery] = useState('REL-081-W2-104');
  const [activeFamily, setActiveFamily] = useState<FamilyReliefProfile | null>(INITIAL_FAMILIES[0]);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);

  // New distribution form state
  const [distAgency, setDistAgency] = useState('पाँचपोखरी गाउँपालिका विपद् कोष');
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'चामल (२५ केजी बोरा)',
    'दाल (३ केजी)',
    'खानेतेल (२ लिटर)',
    'त्रिपाल (Heavy Duty १६×१२ फिट)',
  ]);
  const [overrideReason, setOverrideReason] = useState('');
  const [isPrintVoucherOpen, setIsPrintVoucherOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    const found = families.find(
      (f) =>
        f.token.toLowerCase().includes(q) ||
        f.headNameNp.toLowerCase().includes(q) ||
        f.headNameEn.toLowerCase().includes(q) ||
        f.citizenshipNo.includes(q) ||
        f.houseMatrixNo.toLowerCase().includes(q)
    );
    if (found) {
      setActiveFamily(found);
      toast.success(isNepali ? `परिवार फेला पर्यो: ${found.headNameNp}` : `Family found: ${found.headNameEn}`);
    } else {
      toast.error(isNepali ? 'उक्त टोकन वा नागरिकता भएको परिवार फेला परेन।' : 'Family record not found.');
    }
  };

  // Deduplication Logic (< 7 days check)
  const latestRelief = activeFamily?.reliefHistory[0];
  const isDuplicateRisk = !!latestRelief && latestRelief.daysAgo < 7;

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFamily) return;
    if (selectedItems.length === 0) {
      toast.error(isNepali ? 'कृपया कम्तिमा १ राहत सामग्री छनोट गर्नुहोस्।' : 'Select at least 1 relief item.');
      return;
    }
    if (isDuplicateRisk && !overrideReason.trim()) {
      toast.error(
        isNepali
          ? '७ दिनभित्र दोहोरो वितरण गर्न कार्यदल संयोजकको विशेष तोक/कारण अनिवार्य छ!'
          : 'Coordinator override reason required for distribution within 7 days!'
      );
      return;
    }

    const newRecord: ReliefHistoryRecord = {
      id: `dist-${Date.now()}`,
      distributedDateBs: '२०८१-०१-२१ (आज)',
      daysAgo: 0,
      agencyNp: distAgency,
      agencyEn: distAgency,
      itemsNp: selectedItems,
      itemsEn: selectedItems,
      officerNp: 'विपद् राहत वितरण टोली',
      officerEn: 'Disaster Relief Dispatch Team',
    };

    const updated = families.map((f) =>
      f.token === activeFamily.token
        ? { ...f, reliefHistory: [newRecord, ...f.reliefHistory] }
        : f
    );

    setFamilies(updated);
    setActiveFamily({ ...activeFamily, reliefHistory: [newRecord, ...activeFamily.reliefHistory] });
    setIsDistributeModalOpen(false);
    setIsPrintVoucherOpen(true);
    toast.success(isNepali ? 'राहत सामग्री सफलतापूर्वक वितरण तथा अभिलेख भयो!' : 'Relief package dispatched & recorded!');
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: '#1d4ed8', padding: '0.25rem 0.65rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
            <QrCode size={14} />
            <span>{isNepali ? 'पारिवारिक डिजिटल राहत कार्ड तथा दोहोरोपन नियन्त्रण' : 'Family Digital Relief Card & Deduplication'}</span>
          </div>
          <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            {isNepali ? 'राहत वितरण QR टोकन प्रमाणीकरण र दोहोरोपन रोकथाम प्रणाली' : 'Relief QR Token Verification & Anti-Duplication Engine'}
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            {isNepali
              ? 'एकै परिवारलाई विभिन्न संस्था वा निकायबाट दोहोरो राहत वितरण हुन नदिन डिजिटल टोकन र ७-दिने कुलडाउन नियन्त्रण।'
              : 'Prevents duplicate aid distribution across multiple agencies using family QR tokens and a 7-day cooldown alert.'}
          </p>
        </div>

        {/* Quick Family Token Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {families.map((f) => (
            <button
              key={f.token}
              onClick={() => {
                setActiveFamily(f);
                setSearchQuery(f.token);
              }}
              style={{
                background: activeFamily?.token === f.token ? '#0284c7' : '#f8fafc',
                color: activeFamily?.token === f.token ? '#ffffff' : '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isNepali ? f.headNameNp : f.headNameEn} ({f.token})
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.6rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder={isNepali ? 'परिवार टोकन (उदा: REL-081-W2-104), नागरिकता नं, वा घरमूलीको नाम...' : 'Search token (REL-081-W2-104), citizenship or family head...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.4rem',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          {isNepali ? 'टोकन प्रमाणीकरण गर्नुहोस्' : 'Verify Token'}
        </button>
      </form>

      {/* Active Family Card */}
      {activeFamily && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {/* Left Column: Family Profile */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', background: '#0284c7', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                {activeFamily.token}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                {isNepali ? `वडा नं. ${activeFamily.wardNo}` : `Ward ${activeFamily.wardNo}`} • {activeFamily.houseMatrixNo}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {isNepali ? activeFamily.headNameNp : activeFamily.headNameEn}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                नागरिकता नं: <strong>{activeFamily.citizenshipNo}</strong> | सम्पर्क: <strong>{activeFamily.contactPhone}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.2rem' }}>
                स्थिति: {isNepali ? activeFamily.damageStatusNp : activeFamily.damageStatusEn}
              </div>
            </div>

            {/* Demographics Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', textAlign: 'center', background: '#ffffff', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>कुल सदस्य</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{activeFamily.totalMembers}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#dc2626' }}>बालबालिका (&lt;५)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626' }}>{activeFamily.vulnerableBreakdown.childrenUnder5}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#ec4899' }}>गर्भवती/सुत्केरी</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ec4899' }}>{activeFamily.vulnerableBreakdown.pregnantOrLactating}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#7c3aed' }}>ज्येष्ठ (७०+)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#7c3aed' }}>{activeFamily.vulnerableBreakdown.seniors70Plus}</div>
              </div>
            </div>

            {/* Deduplication Status Banner */}
            {isDuplicateRisk ? (
              <div style={{ background: '#fef2f2', border: '1.5px solid #f87171', borderRadius: '8px', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#991b1b', fontWeight: 800, fontSize: '0.82rem' }}>
                  <AlertTriangle size={16} color="#dc2626" />
                  <span>{isNepali ? '⚠️ दोहोरो राहत वितरण चेतावनी (Duplicate Alert)' : '⚠️ Duplicate Relief Distribution Alert'}</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#b91c1c', lineHeight: 1.4 }}>
                  {isNepali
                    ? `यस परिवारले ${latestRelief?.daysAgo} दिन अगाडि (${latestRelief?.distributedDateBs}) "${latestRelief?.agencyNp}" बाट राहत प्राप्त गरिसकेको छ (< ७ दिन)।`
                    : `This family received relief ${latestRelief?.daysAgo} days ago (${latestRelief?.distributedDateBs}) from "${latestRelief?.agencyEn}".`}
                </div>
              </div>
            ) : (
              <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '8px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <div style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: 700 }}>
                  {isNepali ? '✅ नयाँ राहत सामग्री वितरण योग्य (Eligible for Relief Dispatch)' : '✅ Eligible for Relief Dispatch (Cooldown Clear)'}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsDistributeModalOpen(true)}
              style={{
                marginTop: 'auto',
                background: isDuplicateRisk ? '#d97706' : '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Plus size={16} />
              <span>
                {isDuplicateRisk
                  ? (isNepali ? 'तोकसहित विशेष राहत निकासा गर्नुहोस्' : 'Override & Issue Relief')
                  : (isNepali ? 'नयाँ राहत सामग्री निकासा गर्नुहोस्' : 'Issue Relief Package')}
              </span>
            </button>
          </div>

          {/* Right Column: Historical Relief Log */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileCheck2 size={18} color="#0284c7" />
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                  {isNepali ? 'राहत प्राप्ति इतिहास (Relief History Log)' : 'Relief Received Log'}
                </h4>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {isNepali ? `कुल प्राप्त: ${activeFamily.reliefHistory.length} पटक` : `Total: ${activeFamily.reliefHistory.length} times`}
              </span>
            </div>

            {activeFamily.reliefHistory.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                {isNepali ? 'यस परिवारले हालसम्म कुनै राहत सामग्री प्राप्त गरेको छैन।' : 'No prior relief packages recorded for this family.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {activeFamily.reliefHistory.map((h) => (
                  <div key={h.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0369a1', background: '#e0f2fe', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {isNepali ? h.agencyNp : h.agencyEn}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {h.distributedDateBs} ({h.daysAgo === 0 ? (isNepali ? 'आज' : 'Today') : (isNepali ? `${h.daysAgo} दिन अघि` : `${h.daysAgo}d ago`)})
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.35rem' }}>
                      {h.itemsNp.map((item, idx) => (
                        <span key={idx} style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                          ✓ {item}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.4rem' }}>
                      प्रमाणित गर्ने अधिकृत: <strong>{isNepali ? h.officerNp : h.officerEn}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Issue Relief Modal */}
      {isDistributeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {isNepali ? 'नयाँ राहत सामग्री निकासा फाराम' : 'Relief Package Dispatch Form'}
                </h3>
              </div>
              <button onClick={() => setIsDistributeModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleDistribute} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  {isNepali ? 'वितरण गर्ने आधिकारिक निकाय *' : 'Distributing Agency *'}
                </label>
                <select
                  value={distAgency}
                  onChange={(e) => setDistAgency(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="पाँचपोखरी गाउँपालिका विपद् कोष">पाँचपोखरी गाउँपालिका विपद् कोष</option>
                  <option value="नेपाल रेडक्रस सोसाइटी (उपशाखा)">नेपाल रेडक्रस सोसाइटी (उपशाखा)</option>
                  <option value="विश्व खाद्य कार्यक्रम (WFP / UN)">विश्व खाद्य कार्यक्रम (WFP)</option>
                  <option value="जिल्ला विपद् व्यवस्थापन कोष (DDMC)">जिल्ला विपद् व्यवस्थापन कोष (DDMC)</option>
                  <option value="निजी तथा गैरसरकारी संस्था सहकार्य">निजी तथा गैरसरकारी संस्था सहकार्य</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'राहत सामग्री चेकलिस्ट (छनोट गर्नुहोस्) *' : 'Relief Package Checklist *'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  {[
                    'चामल (२५ केजी बोरा)',
                    'दाल (३ केजी)',
                    'खानेतेल (२ लिटर)',
                    'त्रिपाल (Heavy Duty १६×१२ फिट)',
                    'न्यानो कम्बल (२ थान)',
                    'औषधि तथा प्राथमिक उपचार किट',
                    'ड्राइ फुड तथा पोषण आहार प्याक',
                    'खानेपानी शुद्धीकरण पियुष/क्लोरिन',
                  ].map((item) => (
                    <label
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.75rem',
                        background: selectedItems.includes(item) ? '#ecfdf5' : '#f8fafc',
                        border: `1px solid ${selectedItems.includes(item) ? '#10b981' : '#cbd5e1'}`,
                        padding: '0.4rem 0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item)}
                        onChange={() => toggleItem(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isDuplicateRisk && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.25rem' }}>
                    {isNepali ? '⚠️ ७-दिनभित्र दोहोरो वितरण कारण / संयोजकको तोक आदेश *' : 'Coordinator Override Justification *'}
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder={isNepali ? 'उदा: घर पूर्ण क्षति भई थप परिवार सदस्य आश्रयस्थलमा थपिएकाले विशेष निर्णय बमोजिम...' : 'Enter reason for early re-distribution...'}
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #ef4444', fontSize: '0.8rem' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsDistributeModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  {isNepali ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#059669', color: '#ffffff', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                >
                  {isNepali ? 'राहत भौचर जारी गर्नुहोस्' : 'Issue Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Voucher Modal */}
      {isPrintVoucherOpen && activeFamily && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid #0284c7' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>पाँचपोखरी थाङपाल गाउँपालिका</div>
              <h3 style={{ margin: '0.2rem 0', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                पारिवारिक विपद् राहत वितरण भौचर (RELIEF VOUCHER)
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                टोकन नं: <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>{activeFamily.token}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>घरमुली: <strong>{activeFamily.headNameNp}</strong> ({activeFamily.citizenshipNo})</div>
              <div>स्थान: <strong>वडा नं. {activeFamily.wardNo}</strong> (घर नं: {activeFamily.houseMatrixNo})</div>
              <div>वितरण निकाय: <strong>{distAgency}</strong></div>
              <div>वितरण मिति: <strong>२०८१/०१/२१</strong></div>
              <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>निकासा भएका राहत सामग्रीहरू:</div>
                {selectedItems.map((item, idx) => (
                  <div key={idx} style={{ color: '#065f46' }}>✓ {item}</div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => {
                  window.print();
                }}
                style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Printer size={14} /> {isNepali ? 'भौचर प्रिन्ट गर्नुहोस्' : 'Print Voucher'}
              </button>
              <button
                onClick={() => setIsPrintVoucherOpen(false)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {isNepali ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyReliefCardDeduplication;

