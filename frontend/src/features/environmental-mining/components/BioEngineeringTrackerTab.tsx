import React, { useState } from 'react';
import {
  Trees,
  Mountain,
  Waves,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Ruler,
  TrendingUp,
  Activity,
  Plus,
  Compass
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MiningBufferSite {
  id: string;
  name: string;
  riverBasin: string;
  wardNo: number;
  contractor: string;
  approvedDepthMeters: number;
  actualDepthMeters: number;
  depthStatus: 'स्वीकृत सिमाभित्र (Safe)' | 'अवैध गहिरो दोहन अलर्ट (Violation)';
  gpsBoundaryStatus: 'स्वीकृत सिमाभित्र (Within Boundary)' | 'सिमा उल्लंघन (Out of Bounds)';
  approvedQuotaCuM: number;
  extractedCuM: number;
  royaltyNPR: number;
  riskWarning: string;
}

const MINING_SITES_MONITORING: MiningBufferSite[] = [
  {
    id: 'mb-1',
    name: 'तिम्बु खोला बालुवा/गिट्टी खानी (ब्लक क)',
    riverBasin: 'मेलम्ची खोला बेसिन',
    wardNo: 2,
    contractor: 'पाँचपोखरी कन्स्ट्रक्सन प्रा.लि.',
    approvedDepthMeters: 1.0,
    actualDepthMeters: 0.8,
    depthStatus: 'स्वीकृत सिमाभित्र (Safe)',
    gpsBoundaryStatus: 'स्वीकृत सिमाभित्र (Within Boundary)',
    approvedQuotaCuM: 25000,
    extractedCuM: 14200,
    royaltyNPR: 1850000,
    riskWarning: 'नदीको प्राकृतिक धार सुरक्षित, दैनिक उत्खनन लग अनुगमन'
  },
  {
    id: 'mb-2',
    name: 'गाम्चेत बगर ढुङ्गा/बालुवा खानी (ब्लक ख)',
    riverBasin: 'इन्द्रावती नदी बेसिन',
    wardNo: 4,
    contractor: 'सिन्धु एग्रिगेट सप्लायर्स',
    approvedDepthMeters: 1.0,
    actualDepthMeters: 1.45,
    depthStatus: 'अवैध गहिरो दोहन अलर्ट (Violation)',
    gpsBoundaryStatus: 'सिमा उल्लंघन (Out of Bounds)',
    approvedQuotaCuM: 30000,
    extractedCuM: 28500,
    royaltyNPR: 2400000,
    riskWarning: '🚨 नदीको सतह १.४५ मिटर गहिरो खनिएको र स्वीकृत पोलिगोनभन्दा ६० मिटर बाहिर गएको। तुरुन्त काम रोक्का पत्र जारी!'
  },
  {
    id: 'mb-3',
    name: 'गुन्सा दोभान नदीजन्य ढुङ्गा संकलन केन्द्र',
    riverBasin: 'याङ्ग्री/इन्द्रावती दोभान',
    wardNo: 7,
    contractor: 'स्थानीय उपभोक्ता समूह',
    approvedDepthMeters: 1.0,
    actualDepthMeters: 0.6,
    depthStatus: 'स्वीकृत सिमाभित्र (Safe)',
    gpsBoundaryStatus: 'स्वीकृत सिमाभित्र (Within Boundary)',
    approvedQuotaCuM: 12000,
    extractedCuM: 5400,
    royaltyNPR: 900000,
    riskWarning: 'वर्षायामका लागि गेग्रान बहाव रोक्न चेक ड्याम निर्माण'
  }
];

const BIO_ENGINEERING_PROJECTS = [
  {
    id: 'bio-1',
    siteName: 'मानेखर्क डाँडागाउँ पहिरो रोकथाम जैविक इन्जिनियरिङ',
    wardNo: 5,
    plantType: 'बेतिभर घाँस (Vetiver Grass) + अम्रिसो',
    plantsPlanted: 14500,
    survivalRate: '९२%',
    gabionWallMeters: 180,
    landslideRiskReduction: '४२% कमी (माटो कटान नियन्त्रण)',
    fundedBy: 'गाउँपालिका विपद् कोष तथा वन मन्त्रालय',
    status: 'सफल - हरियाली कायम'
  },
  {
    id: 'bio-2',
    siteName: 'तिम्बु खोला तटीय बाँस तथा बायो-डाइक तटबन्धन',
    wardNo: 2,
    plantType: 'बाँसको झ्याङ (Bamboo Clumps) + सिमल',
    plantsPlanted: 3200,
    survivalRate: '८६%',
    gabionWallMeters: 250,
    landslideRiskReduction: 'नदी कटान ५५% रोकथाम',
    fundedBy: 'नदी नियन्त्रण आयोजना',
    status: 'सक्रिय - नियमित हेरचाह'
  },
  {
    id: 'bio-3',
    siteName: 'थाङपालकोट कृषि सडक भिरालो अम्रिसो वृक्षारोपण',
    wardNo: 6,
    plantType: 'अम्रिसो (Broom Grass) + नेपियर',
    plantsPlanted: 8000,
    survivalRate: '८८%',
    gabionWallMeters: 90,
    landslideRiskReduction: 'सडक ढिस्को खस्न रोकिएको',
    fundedBy: 'कृषि तथा वातावरण शाखा',
    status: 'सफल - स्थानीय आम्दानीमा वृद्धि'
  }
];

export const BioEngineeringTrackerTab: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #15803d 50%, #166534 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(22, 101, 52, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Trees size={14} color="#86efac" /> नदीजन्य खानी IEE अनुगमन र जैविक इन्जिनियरिङ (Bio-Engineering)
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Mountain size={24} color="#86efac" /> अवैध दोहन नियन्त्रण (IEE GPS Buffer) र पहिरो रोकथाम बायो-ट्र्याकर
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            मेलम्ची र इन्द्रावती नदीमा १ मिटरभन्दा गहिरो खनेमा वा तोकिएको सिमाना नाघेमा स्वचालित रातो अलर्ट तथा
            पहिरो रोक्न बाँस, बेतिभर घाँस (Vetiver), अम्रिसो रोपिएका र ग्याबियन पर्खाल लगाइएका क्षेत्रहरूको डिजिटल अनुगमन।
          </p>
        </div>

        <button
          onClick={() => toast.error('🚨 गाम्चेत खानी (ब्लक ख) मा १.४५ मिटर गहिरो खनिएकाले स्थलगत निरिक्षण टोली र काम रोक्का आदेश जारी भयो!')}
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
          <AlertTriangle size={16} />
          <span>१ वटा खानीमा गहिरो दोहन अलर्ट (Action)</span>
        </button>
      </div>

      {/* Mining Sites Buffer & Depth Monitoring Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Waves size={20} color="#0284c7" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              नदीजन्य खानी उत्खनन सिमा (IEE GPS Polygon) र गहिराइ टेलिमेट्री
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>अधिकतम स्वीकृत उत्खनन गहिराइ: १.० मिटर</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {MINING_SITES_MONITORING.map((m) => (
            <div
              key={m.id}
              style={{
                border: `1.5px solid ${m.depthStatus.includes('Violation') ? '#fca5a5' : '#e2e8f0'}`,
                borderRadius: '10px',
                padding: '1rem',
                background: m.depthStatus.includes('Violation') ? '#fff1f2' : '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    नदी: <strong>{m.riverBasin}</strong> (वडा {m.wardNo}) | ठेकेदार: {m.contractor}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: m.depthStatus.includes('Violation') ? '#dc2626' : '#ecfdf5',
                      color: m.depthStatus.includes('Violation') ? '#ffffff' : '#059669',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    गहिराइ: {m.actualDepthMeters}m (स्वीकृत १.०m)
                  </span>

                  <span
                    style={{
                      background: m.gpsBoundaryStatus.includes('Out') ? '#fee2e2' : '#eff6ff',
                      color: m.gpsBoundaryStatus.includes('Out') ? '#b91c1c' : '#1d4ed8',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {m.gpsBoundaryStatus}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', fontSize: '0.76rem', color: m.depthStatus.includes('Violation') ? '#991b1b' : '#334155', fontWeight: m.depthStatus.includes('Violation') ? 700 : 400 }}>
                {m.riskWarning}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px dashed #cbd5e1', fontSize: '0.72rem', color: '#64748b' }}>
                <div>स्वीकृत परिमाण: <strong>{m.approvedQuotaCuM.toLocaleString()} घ.मि.</strong></div>
                <div>निकासी भएको: <strong>{m.extractedCuM.toLocaleString()} घ.मि.</strong></div>
                <div>राजस्व आम्दानी: <strong>रु. {m.royaltyNPR.toLocaleString()}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bio-Engineering Tracker */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trees size={20} color="#16a34a" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>
              जैविक इन्जिनियरिङ (Bio-Engineering) ट्र्याकर: बाँस, बेतिभर घाँस र ग्याबियन पर्खाल
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>औसत जीवित दर: ८८.६%</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.85rem' }}>
          {BIO_ENGINEERING_PROJECTS.map((b) => (
            <div key={b.id} style={{ border: '1px solid #a7f3d0', borderRadius: '10px', padding: '1rem', background: '#f0fdf4' }}>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#065f46' }}>{b.siteName}</div>
              <div style={{ fontSize: '0.74rem', color: '#166534', marginTop: '0.2rem' }}>वडा नं. {b.wardNo} | स्रोत: {b.fundedBy}</div>

              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.74rem', color: '#334155' }}>
                <div>🌿 बिरुवा प्रजाति: <strong>{b.plantType}</strong></div>
                <div>🌱 रोपिएको संख्या: <strong>{b.plantsPlanted.toLocaleString()} वटा</strong> (जीवित दर: <strong style={{ color: '#059669' }}>{b.survivalRate}</strong>)</div>
                <div>🧱 ग्याबियन चेकड्याम: <strong>{b.gabionWallMeters} मिटर</strong></div>
                <div style={{ color: '#047857', fontWeight: 700 }}>🛡️ प्रभावकारिता: {b.landslideRiskReduction}</div>
              </div>

              <div style={{ marginTop: '0.6rem', paddingTop: '0.4rem', borderTop: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                <span style={{ color: '#15803d', fontWeight: 700 }}>● {b.status}</span>
                <span style={{ color: '#64748b' }}>नियमित स्थलगत अडिट जारी</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BioEngineeringTrackerTab;
