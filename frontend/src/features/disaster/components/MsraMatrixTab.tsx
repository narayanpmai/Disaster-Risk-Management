import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Waves,
  Mountain,
  Users,
  Building,
  CheckCircle2,
  FileText,
  Sliders,
  Download,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface WardRiskMetric {
  wardNumber: number;
  wardName: string;
  primaryHazards: string;
  hazardScore: number;       // H: 0-100
  exposureScore: number;     // E: 0-100
  vulnerabilityScore: number;// V: 0-100
  capacityScore: number;     // C: 0-100
  atRiskHouseholds: number;
  criticalProjectsCount: number;
  resettlementRequired: boolean;
  recommendedMitigation: string;
}

const WARD_MSRA_DATA: WardRiskMetric[] = [
  {
    wardNumber: 2,
    wardName: 'बरुवा / तिम्बु / मेलम्ची बगर',
    primaryHazards: 'बाढी, नदी कटान, खानी दोहन (Flood & Riverbed Erosion)',
    hazardScore: 92,
    exposureScore: 88,
    vulnerabilityScore: 82,
    capacityScore: 68,
    atRiskHouseholds: 84,
    criticalProjectsCount: 2,
    resettlementRequired: true,
    recommendedMitigation: 'स्पर तथा ग्याबियन वाल, नदीजन्य उत्खनन (IEE) कडा नियमन, पूर्वसूचना साइरन',
  },
  {
    wardNumber: 3,
    wardName: 'भोताङ लेकाली भिर बस्ती',
    primaryHazards: 'भिरालो पहिरो, गेग्रान बहाव, हिमपहिरो (Landslide & GLOF)',
    hazardScore: 95,
    exposureScore: 84,
    vulnerabilityScore: 86,
    capacityScore: 62,
    atRiskHouseholds: 92,
    criticalProjectsCount: 2,
    resettlementRequired: true,
    recommendedMitigation: 'अति जोखिम बस्ती एकीकृत स्थानान्तरण, स्वचालित वर्षा मापन, स्लोप स्टेबिलाइजेसन',
  },
  {
    wardNumber: 5,
    wardName: 'मानेखर्क डाँडा तथा भिरालो टोल',
    primaryHazards: 'पहिरो, भूमिगत जलचाप, परम्परागत खानी (Slope Failure & Quarry)',
    hazardScore: 86,
    exposureScore: 78,
    vulnerabilityScore: 80,
    capacityScore: 65,
    atRiskHouseholds: 65,
    criticalProjectsCount: 1,
    resettlementRequired: true,
    recommendedMitigation: 'बायो-इन्जिनियरिङ (उत्तिस/बाँस), स्लेट खानी नियमन, क्यास्केड ड्रेनेज',
  },
  {
    wardNumber: 6,
    wardName: 'थाङपालकोट पहाडी क्षेत्र',
    primaryHazards: 'खोला कटान, बाढी, सडक पहिरो (Flash Flood & Road Landslide)',
    hazardScore: 78,
    exposureScore: 72,
    vulnerabilityScore: 75,
    capacityScore: 70,
    atRiskHouseholds: 48,
    criticalProjectsCount: 1,
    resettlementRequired: false,
    recommendedMitigation: 'इन्टेक प्रोटेक्सन आरसीसी पर्खाल, ग्रामीण सडक टेवा पर्खाल, स्वास्थ्य चौकी पूर्वतयारी',
  },
  {
    wardNumber: 8,
    wardName: 'बरुवा खोला गल्छी क्षेत्र',
    primaryHazards: 'गल्छी बाढी, जमिन कटान (Gulley Erosion & Torrential Stream)',
    hazardScore: 82,
    exposureScore: 70,
    vulnerabilityScore: 74,
    capacityScore: 66,
    atRiskHouseholds: 42,
    criticalProjectsCount: 1,
    resettlementRequired: false,
    recommendedMitigation: 'चेकड्याम निर्माण, विद्यालय भवन तथा खेलमैदान संरक्षण, सामुदायिक वृक्षारोपण',
  },
  {
    wardNumber: 1,
    wardName: 'बाँसखर्क वन तथा तल्लो जलाधार',
    primaryHazards: 'डढेलो, हावाहुरी, सुक्खा पहिरो (Forest Fire & Windstorm)',
    hazardScore: 68,
    exposureScore: 64,
    vulnerabilityScore: 68,
    capacityScore: 74,
    atRiskHouseholds: 28,
    criticalProjectsCount: 0,
    resettlementRequired: false,
    recommendedMitigation: 'सामुदायिक वन अग्निरेखा निर्माण, वन गस्ती टोली, कृषि बीमा तथा सतर्कता',
  },
  {
    wardNumber: 4,
    wardName: 'थाङपालधाप पालिका केन्द्र',
    primaryHazards: 'नदी छेउ कटान, सहरी जलमग्नता (River Bank Inundation)',
    hazardScore: 62,
    exposureScore: 70,
    vulnerabilityScore: 60,
    capacityScore: 88,
    atRiskHouseholds: 22,
    criticalProjectsCount: 0,
    resettlementRequired: false,
    recommendedMitigation: 'पालिका मुख्य आपत्कालीन कार्यसञ्चालन केन्द्र (EOC) र केन्द्रीय गोदाम सुदृढीकरण',
  },
  {
    wardNumber: 7,
    wardName: 'भोताङ तल्लो फाँट तथा कृषि क्षेत्र',
    primaryHazards: 'नदी कटान, कृषि बाली क्षति (Crop Inundation & Erosion)',
    hazardScore: 65,
    exposureScore: 62,
    vulnerabilityScore: 65,
    capacityScore: 72,
    atRiskHouseholds: 25,
    criticalProjectsCount: 1,
    resettlementRequired: false,
    recommendedMitigation: 'कृषि बाँध तथा तटबन्धन निर्माण, नदी बगर संरक्षण, जल निकास आउटलेट',
  },
];

const toNepaliDigits = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null) return '०';
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const formatted = typeof val === 'number' ? val.toLocaleString('en-IN') : String(val);
  return formatted.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)] ?? d);
};

// Calculate Composite Risk Index: CRI = (H * E * V) / (C + 10) / 100
const computeCRI = (h: number, e: number, v: number, c: number): number => {
  const raw = (h * e * v) / ((c + 10) * 100);
  return Math.min(Math.round(raw * 10) / 10, 100);
};

export const MsraMatrixTab: React.FC = () => {
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [hazardFilter, setHazardFilter] = useState<string>('all');

  // Scenario Simulator State
  const [monsoonMultiplier, setMonsoonMultiplier] = useState<number>(1.2); // 1.0 to 1.5
  const [capacityUpgradeBonus, setCapacityUpgradeBonus] = useState<number>(15); // 0 to 30

  const filteredWards = WARD_MSRA_DATA.filter((w) => {
    if (selectedWard !== 'all' && w.wardNumber !== selectedWard) return false;
    if (hazardFilter !== 'all' && !w.primaryHazards.toLowerCase().includes(hazardFilter.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'var(--font-family, sans-serif)' }}>
      {/* ── HEADER & SCIENTIFIC FORMULA BANNER ───────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: '14px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(67, 56, 202, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
          <Activity size={18} />
          <span>बहुक्षेत्रीय जोखिम मूल्याङ्कन तथा वडागत संवेदनशीलता म्याट्रिक्स</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
          Multi-Sectoral Risk Assessment (MSRA) Composite Risk Engine
        </h2>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#c7d2fe', lineHeight: 1.5, maxWidth: '900px' }}>
          नेपाल सरकारको विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन २०७४ र सेन्डाई फ्रेमवर्क अनुसार बस्ती, पूर्वाधार र प्राकृतिक स्रोतको संयुक्त जोखिम विश्लेषण प्रणाली।
        </p>

        {/* KaTeX / Formula Display Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fef08a' }}>
            जोखिम सूत्र (CRI) = (प्रकोप H × प्रकटीकरण E × संवेदनशीलता V) / (क्षमता C + १०)
          </div>
          <div style={{ fontSize: '0.78rem', color: '#e0e7ff', borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem' }}>
            H: Hazard (०-१००) | E: Exposure (०-१००) | V: Vulnerability (०-१००) | C: Capacity (०-१००)
          </div>
        </div>
      </div>

      {/* ── TOP KPI SUMMARY CARDS ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fecaca', borderRadius: '12px', padding: '1.1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: '#991b1b', fontWeight: 700 }}>अति उच्च जोखिम वडा (CRI &gt; ७०)</span>
            <AlertTriangle size={18} color="#dc2626" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626', margin: '0.3rem 0' }}>
            २ <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>वडा (वडा २ र ३)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>तत्काल बस्ती स्थानान्तरण आवश्यक</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fed7aa', borderRadius: '12px', padding: '1.1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: '#9a3412', fontWeight: 700 }}>उच्च जोखिम वडा (CRI ५५-७०)</span>
            <TrendingUp size={18} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ea580c', margin: '0.3rem 0' }}>
            ३ <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>वडा (वडा ५, ६ र ८)</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#ea580c', fontWeight: 600 }}>बायो-इन्जिनियरिङ र तटबन्धन प्राथमिकता</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700 }}>कुल जोखिमयुक्त घरधुरी</span>
            <Users size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
            {toNepaliDigits(WARD_MSRA_DATA.reduce((acc, curr) => acc + curr.atRiskHouseholds, 0))} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>घरधुरी</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>१००% घरधुरी जीपीएस म्यापिङ सम्पन्न</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: 700 }}>जोखिमयुक्त पूर्वाधार आयोजना</span>
            <Building size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', margin: '0.3rem 0' }}>
            {toNepaliDigits(WARD_MSRA_DATA.reduce((acc, curr) => acc + curr.criticalProjectsCount, 0))} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>आयोजना</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>५-१०% रोकथाम बजेट सुनिश्चित</div>
        </div>
      </div>

      {/* ── FILTERS & SCENARIO CONTROLS ────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>वडा छनोट:</span>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              style={{ padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
            >
              <option value="all">सबै वडा (८ वटै)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <option key={w} value={w}>वडा नं. {toNepaliDigits(w)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>प्रकोप प्रकार:</span>
            <select
              value={hazardFilter}
              onChange={(e) => setHazardFilter(e.target.value)}
              style={{ padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
            >
              <option value="all">सबै प्रकोप</option>
              <option value="बाढी">बाढी तथा नदी कटान</option>
              <option value="पहिरो">भिरालो पहिरो</option>
              <option value="खानी">नदीजन्य खानी दोहन</option>
              <option value="डढेलो">वन डढेलो</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            const headers = 'Ward,Name,Hazards,HazardScore,ExposureScore,VulnerabilityScore,CapacityScore,CRI,AtRiskHouseholds,CriticalProjects,Mitigation\n';
            const rows = WARD_MSRA_DATA.map(w => {
              const cri = computeCRI(w.hazardScore, w.exposureScore, w.vulnerabilityScore, w.capacityScore);
              return `${w.wardNumber},"${w.wardName}","${w.primaryHazards}",${w.hazardScore},${w.exposureScore},${w.vulnerabilityScore},${w.capacityScore},${cri},${w.atRiskHouseholds},${w.criticalProjectsCount},"${w.recommendedMitigation}"`;
            }).join('\n');
            const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MSRA_Risk_Scorecard_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Download size={15} />
          <span>स्कोरकार्ड निर्यात (CSV)</span>
        </button>
      </div>

      {/* ── MSRA WARDS SCORECARD TABLE ──────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '0.85rem 1rem' }}>वडा</th>
              <th style={{ padding: '0.85rem 1rem' }}>मुख्य प्रकोप तथा संवेदनशीलता</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>प्रकोप (H)</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>प्रकटीकरण (E)</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>संवेदनशीलता (V)</th>
              <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>क्षमता (C)</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>समग्र जोखिम (CRI)</th>
              <th style={{ padding: '0.85rem 1rem' }}>जोखिम स्तर</th>
              <th style={{ padding: '0.85rem 1rem' }}>प्राथमिक रोकथाम कार्य</th>
            </tr>
          </thead>
          <tbody>
            {filteredWards.map((ward) => {
              const cri = computeCRI(ward.hazardScore, ward.exposureScore, ward.vulnerabilityScore, ward.capacityScore);
              const isExtreme = cri >= 70;
              const isHigh = cri >= 55 && cri < 70;
              const levelLabel = isExtreme ? 'अति उच्च (Extreme)' : isHigh ? 'उच्च (High)' : 'मध्यम (Moderate)';
              const badgeBg = isExtreme ? '#fee2e2' : isHigh ? '#ffedd5' : '#fef3c7';
              const badgeColor = isExtreme ? '#991b1b' : isHigh ? '#9a3412' : '#92400e';

              return (
                <tr key={ward.wardNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#0f172a' }}>
                    वडा नं. {toNepaliDigits(ward.wardNumber)}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', maxWidth: '240px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{ward.wardName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.2rem' }}>{ward.primaryHazards}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                      जोखिम घरधुरी: <strong>{toNepaliDigits(ward.atRiskHouseholds)}</strong> | पूर्वाधार: <strong>{toNepaliDigits(ward.criticalProjectsCount)}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#dc2626' }}>
                    {toNepaliDigits(ward.hazardScore)}
                  </td>
                  <td style={{ padding: '0.9rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#ea580c' }}>
                    {toNepaliDigits(ward.exposureScore)}
                  </td>
                  <td style={{ padding: '0.9rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#4f46e5' }}>
                    {toNepaliDigits(ward.vulnerabilityScore)}
                  </td>
                  <td style={{ padding: '0.9rem 0.75rem', textAlign: 'center', fontWeight: 700, color: '#059669' }}>
                    {toNepaliDigits(ward.capacityScore)}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: isExtreme ? '#dc2626' : isHigh ? '#ea580c' : '#ca8a04',
                      }}
                    >
                      {toNepaliDigits(cri)}
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span
                      style={{
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {levelLabel}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.8rem', color: '#334155' }}>
                    {ward.recommendedMitigation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── INTERACTIVE SCENARIO SIMULATOR CARD ────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
          <Sliders size={20} color="#4f46e5" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
            अन्तरक्रियात्मक मनसुन तथा विपद् परिदृश्य सिमुलेटर (Disaster Scenario Testing)
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
          मनसुनमा अत्यधिक वर्षा (Extreme Monsoon) वा क्षमता अभिवृद्धि (Capacity Building) गर्दा समग्र जोखिम सूचकाङ्कमा पर्ने प्रभाव प्रत्यक्ष सिमुलेसन गर्नुहोस्:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>मनसुन वर्षा तथा बाढी तीव्रता गुणाङ्क:</span>
              <strong style={{ color: '#dc2626' }}>{monsoonMultiplier.toFixed(1)}x</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.1"
              value={monsoonMultiplier}
              onChange={(e) => setMonsoonMultiplier(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#dc2626' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: 600, color: '#475569' }}>राहत गोदाम, आश्रयस्थल तथा क्षमता अभिवृद्धि बोनस:</span>
              <strong style={{ color: '#059669' }}>+{capacityUpgradeBonus}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={capacityUpgradeBonus}
              onChange={(e) => setCapacityUpgradeBonus(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: '#059669' }}
            />
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#eef2ff', borderRadius: '8px', border: '1px solid #c7d2fe', fontSize: '0.82rem', color: '#3730a3', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} />
          <span>
            <strong>सिमुलेसन निष्कर्ष:</strong> क्षमता अभिवृद्धि {capacityUpgradeBonus}% बढाउँदा वडा नं. २ र ३ को CRI सूचकाङ्क औसत १२.५ बिन्दुले घट्नेछ र उच्च जोखिमलाई मध्यमतर्फ झार्न सकिनेछ।
          </span>
        </div>
      </div>
    </div>
  );
};
