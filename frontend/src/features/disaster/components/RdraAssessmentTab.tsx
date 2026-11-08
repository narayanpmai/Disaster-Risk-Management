import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Building,
  Home,
  Users,
  Camera,
  MapPin,
  Printer,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RdraRecord {
  id: string;
  voucherNo: string;
  incidentType: string;
  beneficiaryName: string;
  matrixHouseNo: string;
  wardNo: number;
  citizenshipNo: string;
  bankName: string;
  bankAccountNo: string;
  damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)' | 'आंशिक क्षति (प्रवलीकरण)' | 'अस्थायी आवास' | 'पशुधन/बाली क्षति';
  houseType: string;
  immediateFoodReliefNPR: number;
  reconstructionGrantNPR: number;
  livestockLossNPR: number;
  totalReliefNPR: number;
  gpsCoords: string;
  surveyorName: string;
  surveyDateBs: string;
  status: 'मन्त्रिपरिषद्/शाखा सिफारिस' | 'बैंक खातामा निकासा सम्पन्न' | 'प्रक्रियामा';
  hasPhotoProof: boolean;
}

const INITIAL_RDRA_RECORDS: RdraRecord[] = [
  {
    id: 'rdra-1',
    voucherNo: 'RDRA-२०८१-W5-००१',
    incidentType: 'मानेखर्क पहिरो',
    beneficiaryName: 'राम बहादुर तामाङ',
    matrixHouseNo: 'THP-W5-0219',
    wardNo: 5,
    citizenshipNo: '२७-०१-७२-०३४२१',
    bankName: 'राष्ट्रिय वाणिज्य बैंक, नवलपुर शाखा',
    bankAccountNo: '१४२०१०००२९३४५००१',
    damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)',
    houseType: 'काँचो ढुङ्गा-माटो',
    immediateFoodReliefNPR: 20000,
    reconstructionGrantNPR: 500000,
    livestockLossNPR: 30000,
    totalReliefNPR: 550000,
    gpsCoords: '27.9741° N, 85.6432° E',
    surveyorName: 'सुरेश श्रेष्ठ (प्राविधिक सहायक)',
    surveyDateBs: '२०८१-०५-०२',
    status: 'बैंक खातामा निकासा सम्पन्न',
    hasPhotoProof: true,
  },
  {
    id: 'rdra-2',
    voucherNo: 'RDRA-२०८१-W2-००२',
    incidentType: 'तिम्बु खोला बाढी कटान',
    beneficiaryName: 'फुर्बा शेर्पा',
    matrixHouseNo: 'THP-W2-0084',
    wardNo: 2,
    citizenshipNo: '२७-०१-६८-०९१२३',
    bankName: 'कृषि विकास बैंक, मेलम्ची शाखा',
    bankAccountNo: '०२१०४०००५६७८९००२',
    damageCategory: 'आंशिक क्षति (प्रवलीकरण)',
    houseType: 'अर्ध-पक्की (टिन छाना)',
    immediateFoodReliefNPR: 15000,
    reconstructionGrantNPR: 50000,
    livestockLossNPR: 10000,
    totalReliefNPR: 75000,
    gpsCoords: '27.9412° N, 85.6189° E',
    surveyorName: 'इ. नवराज पौडेल',
    surveyDateBs: '२०८१-०५-०६',
    status: 'मन्त्रिपरिषद्/शाखा सिफारिस',
    hasPhotoProof: true,
  },
  {
    id: 'rdra-3',
    voucherNo: 'RDRA-२०८१-W7-००३',
    incidentType: 'गुन्सा बाढी डुबान',
    beneficiaryName: 'पेम्बा दोर्जे लामा',
    matrixHouseNo: 'THP-W7-0103',
    wardNo: 7,
    citizenshipNo: '२७-०१-७०-१४३२१',
    bankName: 'ग्लोबल आईएमई बैंक, सिन्धुपाल्चोक',
    bankAccountNo: '३१०१०००९८७६५४००३',
    damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)',
    houseType: 'काँचो ढुङ्गा-माटो',
    immediateFoodReliefNPR: 20000,
    reconstructionGrantNPR: 500000,
    livestockLossNPR: 60000,
    totalReliefNPR: 580000,
    gpsCoords: '27.9892° N, 85.6812° E',
    surveyorName: 'सुरेश श्रेष्ठ (प्राविधिक सहायक)',
    surveyDateBs: '२०८१-०५-१०',
    status: 'प्रक्रियामा',
    hasPhotoProof: true,
  }
];

export const RdraAssessmentTab: React.FC = () => {
  const [records, setRecords] = useState<RdraRecord[]>(INITIAL_RDRA_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');

  // Form State
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    matrixHouseNo: '',
    wardNo: 2,
    citizenshipNo: '',
    bankName: 'राष्ट्रिय वाणिज्य बैंक',
    bankAccountNo: '',
    damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)' as RdraRecord['damageCategory'],
    deadCattleCount: 0,
    deadSmallAnimalCount: 0,
    deadHumanCount: 0,
  });

  // Calculate Relief based on "विपद् राहत मापदण्ड २०७७"
  const calculateRelief = () => {
    let grant = 0;
    let immediate = 15000;
    if (formData.damageCategory === 'पूर्ण क्षति (पुनर्निर्माण)') {
      grant = 500000;
      immediate = 20000;
    } else if (formData.damageCategory === 'आंशिक क्षति (प्रवलीकरण)') {
      grant = 50000;
      immediate = 15000;
    } else if (formData.damageCategory === 'अस्थायी आवास') {
      grant = 50000;
      immediate = 15000;
    }

    const cattleLoss = (formData.deadCattleCount * 30000) + (formData.deadSmallAnimalCount * 5000);
    const humanLoss = formData.deadHumanCount * 200000;
    const total = grant + immediate + cattleLoss + humanLoss;

    return { grant, immediate, cattleLoss, humanLoss, total };
  };

  const { grant, immediate, cattleLoss, total } = calculateRelief();

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beneficiaryName || !formData.citizenshipNo) {
      toast.error('कृपया पीडितको नाम र नागरिकता नम्बर अनिवार्य भर्नुहोस्।');
      return;
    }

    const newRecord: RdraRecord = {
      id: `rdra-${Date.now()}`,
      voucherNo: `RDRA-२०८१-W${formData.wardNo}-${Math.floor(100 + Math.random() * 900)}`,
      incidentType: 'मनसुन बाढी तथा पहिरो',
      beneficiaryName: formData.beneficiaryName,
      matrixHouseNo: formData.matrixHouseNo || `THP-W${formData.wardNo}-0999`,
      wardNo: formData.wardNo,
      citizenshipNo: formData.citizenshipNo,
      bankName: formData.bankName,
      bankAccountNo: formData.bankAccountNo || 'खाता उपलब्ध नभएको',
      damageCategory: formData.damageCategory,
      houseType: formData.damageCategory.includes('पूर्ण') ? 'काँचो ढुङ्गा-माटो' : 'अर्ध-पक्की',
      immediateFoodReliefNPR: immediate,
      reconstructionGrantNPR: grant,
      livestockLossNPR: cattleLoss,
      totalReliefNPR: total,
      gpsCoords: '27.9736° N, 85.6425° E (Field Verified)',
      surveyorName: 'वडा सचिव तथा प्राविधिक टोली',
      surveyDateBs: '२०८१-०५-१८',
      status: 'मन्त्रिपरिषद्/शाखा सिफारिस',
      hasPhotoProof: true,
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    toast.success('डिजिटल क्षति मूल्याङ्कन र राहत सिफारिस सफलतापूर्वक दर्ता भयो!');
  };

  const filtered = records.filter((r) => {
    if (selectedWard !== 'all' && r.wardNo !== selectedWard) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.beneficiaryName.toLowerCase().includes(q) ||
        r.voucherNo.toLowerCase().includes(q) ||
        r.matrixHouseNo.toLowerCase().includes(q) ||
        r.citizenshipNo.includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(4, 120, 87, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <FileText size={14} color="#6ee7b7" /> गृह मन्त्रालय "विपद् राहत मापदण्ड २०७७" आधारित
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coins size={24} color="#a7f3d0" /> द्रुत क्षति मूल्याङ्कन (Mobile RDRA) र प्रत्यक्ष बैंक राहत (DBT)
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            विपद् लगत्तै वडा सचिव वा प्राविधिकले घटनास्थलमै गई फोटो, GPS र क्षति विवरण मोबाइलबाटै दर्ता गर्ने र
            सरकारी दर (पूर्ण क्षति रु ५ लाख, आंशिक रु ५० हजार) अनुसार स्वतः हिसाब भई सिधै बैंक खातामा क्षतिपूर्ति निकासा सिफारिस हुने प्रणाली।
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#ffffff',
            color: '#065f46',
            border: 'none',
            padding: '0.65rem 1.1rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <Plus size={16} />
          <span>➕ नयाँ क्षति मूल्याङ्कन दर्ता गर्नुहोस्</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>कुल सिफारिस राहत रकम</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#047857' }}>
            रु. {(records.reduce((acc, r) => acc + r.totalReliefNPR, 0) / 100000).toFixed(1)} लाख
          </div>
          <div style={{ fontSize: '0.7rem', color: '#065f46' }}>{records.length} पीडित परिवार</div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 600 }}>पुनर्निर्माण अनुदान (पूर्ण क्षति)</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1d4ed8' }}>रु. ५ लाख / परिवार</div>
          <div style={{ fontSize: '0.7rem', color: '#1e40af' }}>३ किस्तामा भुक्तानी सिफारिस</div>
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>प्रवलीकरण (आंशिक क्षति)</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#b45309' }}>रु. ५०,००० / घर</div>
          <div style={{ fontSize: '0.7rem', color: '#92400e' }}>मर्मत तथा सुरक्षा सुधार</div>
        </div>

        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>बैंक खाता भुक्तानी (DBT) दर</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#7e22ce' }}>१००% पारदर्शी</div>
          <div style={{ fontSize: '0.7rem', color: '#6b21a8' }}>बिचौलिया शून्य, प्रत्यक्ष निकासा</div>
        </div>
      </div>

      {/* Filter and Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0.85rem 1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="पीडितको नाम, भौचर नं, वा नागरिकता नम्बर खोज्नुहोस्..."
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

        <button
          onClick={() => window.print()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Printer size={15} /> <span>सिफारिस प्रतिवेदन प्रिन्ट</span>
        </button>
      </div>

      {/* Records Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>भौचर / घटना</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>पीडित घरधुरी विवरण</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>क्षति श्रेणी / संरचना</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#475569', fontWeight: 700 }}>सिफारिस राहत रकम</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>बैंक खाता (DBT)</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#475569', fontWeight: 700 }}>निकासा स्थिति</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <div style={{ fontWeight: 700, color: '#047857', fontFamily: 'monospace' }}>{r.voucherNo}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{r.incidentType} (वडा {r.wardNo})</div>
                  <div style={{ fontSize: '0.68rem', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                    <MapPin size={11} /> {r.gpsCoords.split('(')[0]}
                  </div>
                </td>

                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.beneficiaryName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    ना.प्र.नं: {r.citizenshipNo} | घर नं: {r.matrixHouseNo}
                  </div>
                </td>

                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: r.damageCategory.includes('पूर्ण') ? '#fee2e2' : '#fef3c7',
                      color: r.damageCategory.includes('पूर्ण') ? '#b91c1c' : '#b45309',
                    }}
                  >
                    {r.damageCategory}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>घर प्रकार: {r.houseType}</div>
                </td>

                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#047857' }}>
                    रु. {r.totalReliefNPR.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    अनुदान: रु. {r.reconstructionGrantNPR.toLocaleString()} + राहत: रु. {r.immediateFoodReliefNPR.toLocaleString()}
                  </div>
                </td>

                <td style={{ padding: '0.65rem 0.85rem' }}>
                  <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.bankName}</div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#2563eb' }}>{r.bankAccountNo}</div>
                </td>

                <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: r.status === 'बैंक खातामा निकासा सम्पन्न' ? '#dcfce7' : '#eff6ff',
                      color: r.status === 'बैंक खातामा निकासा सम्पन्न' ? '#15803d' : '#1d4ed8',
                    }}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Assessment Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
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
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Coins size={22} color="#047857" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  डिजिटल विपद् क्षति मूल्याङ्कन (RDRA मापदण्ड २०७७)
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    पीडित / घरमुलीको नाम *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: दावा साङ्गे शेर्पा"
                    value={formData.beneficiaryName}
                    onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    वडा नम्बर *
                  </label>
                  <select
                    value={formData.wardNo}
                    onChange={(e) => setFormData({ ...formData, wardNo: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                      <option key={w} value={w}>वडा नं. {w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    नागरिकता नम्बर *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: २७-०१-७५-१२३४५"
                    value={formData.citizenshipNo}
                    onChange={(e) => setFormData({ ...formData, citizenshipNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    घरधुरी नम्बर (Matrix House No)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: THP-W2-0142"
                    value={formData.matrixHouseNo}
                    onChange={(e) => setFormData({ ...formData, matrixHouseNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  घर क्षतिको वर्गीकरण (MOHA Standard 2077) *
                </label>
                <select
                  value={formData.damageCategory}
                  onChange={(e) => setFormData({ ...formData, damageCategory: e.target.value as any })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="पूर्ण क्षति (पुनर्निर्माण)">पूर्ण क्षति — रु. ५ लाख पुनर्निर्माण अनुदान + रु. २० हजार राहत</option>
                  <option value="आंशिक क्षति (प्रवलीकरण)">आंशिक क्षति — रु. ५० हजार प्रवलीकरण अनुदान + रु. १५ हजार राहत</option>
                  <option value="अस्थायी आवास">अस्थायी आवास निर्माण — रु. ५० हजार अनुदान</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    मरेका ठूला पशु (गाई, भैँसी - रु ३०,०००/पशु)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.deadCattleCount}
                    onChange={(e) => setFormData({ ...formData, deadCattleCount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    मरेका साना पशु (बाख्रा, सुँगुर - रु ५,०००/पशु)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.deadSmallAnimalCount}
                    onChange={(e) => setFormData({ ...formData, deadSmallAnimalCount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    बैंकको नाम
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    बैंक खाता नम्बर (DBT Account No)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: १४२०१०००२९३४५००१"
                    value={formData.bankAccountNo}
                    onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Real-time Calculated Total Box */}
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '10px', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#065f46', fontWeight: 700 }}>स्वतः हिसाब गरिएको कुल राहत रकम:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857' }}>
                    रु. {total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#065f46' }}>
                    घर अनुदान: रु. {grant.toLocaleString()} | खाद्यान्न: रु. {immediate.toLocaleString()} | पशुधन: रु. {cattleLoss.toLocaleString()}
                  </div>
                </div>
                <Coins size={32} color="#059669" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#047857', color: '#ffffff', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                >
                  सिफारिस सुरक्षित गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RdraAssessmentTab;

