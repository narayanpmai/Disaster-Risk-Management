import React from 'react';
import {
  useDisasterScope,
  NATIONAL_PALIKAS,
  GOVERNANCE_TIERS,
} from '../../context/DisasterScopeContext';
import {
  Shield,
  Building2,
  MapPin,
  CheckCircle2,
  X,
  Phone,
  Layers,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Flame,
  Radio,
  Clock,
} from 'lucide-react';

export const NationalScopeModal: React.FC = () => {
  const {
    activePalika,
    activeTier,
    selectedWardNumber,
    isScopeModalOpen,
    setIsScopeModalOpen,
    switchPalika,
    switchTier,
    setWardNumber,
  } = useDisasterScope();

  if (!isScopeModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={() => setIsScopeModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0d2757 0%, #1e40af 100%)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={24} color="#60a5fa" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                राष्ट्रिय विपद् अधिकार तथा बहु-स्थानीय तह क्षेत्राधिकार व्यवस्थापन
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
                National Multi-Tenant Architecture & 6-Tier Hierarchical Governance Scope (NEOC / PEOC / DEOC / LEOC / वडा)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScopeModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Jurisdiction Status Banner */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: activeTier.bgColor,
              border: `2px solid ${activeTier.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: activeTier.badgeColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  boxShadow: `0 4px 12px ${activeTier.borderColor}`,
                }}
              >
                T{activeTier.tierLevel}
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: activeTier.textColor, textTransform: 'uppercase' }}>
                  वर्तमान सक्रिय अधिकार क्षेत्र (Current Active Scope)
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {activePalika.nameNepali} ({activePalika.district})
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px', fontWeight: 600 }}>
                  {activeTier.nameNepali}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  backgroundColor: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: `1px solid ${activeTier.borderColor}`,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: activeTier.textColor,
                }}
              >
                ● क्षेत्राधिकार: {activeTier.entityScope.toUpperCase()}
              </span>
              <span
                style={{
                  backgroundColor: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Clock size={12} />
                <span>अडिट लग सक्रिय</span>
              </span>
            </div>
          </div>

          {/* Section 1: Multi-Tenant Palika Selection */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} color="#0284c7" />
                <span>१. स्थानीय तह क्षेत्राधिकार छनोट (Multi-Tenant Local Governments)</span>
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                प्रत्येक स्थानीय तहको तथ्याङ्क Row-Level Isolation मा सुरक्षित
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {NATIONAL_PALIKAS.map((palika) => {
                const isSelected = activePalika.id === palika.id;
                return (
                  <div
                    key={palika.id}
                    onClick={() => switchPalika(palika.id)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '0.92rem', color: isSelected ? '#0369a1' : '#0f172a' }}>
                        {palika.nameNepali}
                      </strong>
                      {isSelected && <CheckCircle2 size={18} color="#0284c7" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {palika.district} | {palika.province} ({palika.totalWards} वडा)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '4px', fontWeight: 600 }}>
                      🌊 {palika.activeRiverBasin}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                      सम्पर्क: {palika.emergencyContact}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: 6-Tier Hierarchical Governance Scope */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="#16a34a" />
                <span>२. ६-तहको राष्ट्रिय अधिकार स्तर (6-Tier Governance & Role Hierarchy)</span>
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                नेपाल सरकारको कार्यसञ्चालन तथा सुरक्षा निकाय प्रोटोकल बमोजिम
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {GOVERNANCE_TIERS.map((tier) => {
                const isSelected = activeTier.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => switchTier(tier.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${tier.badgeColor}` : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? tier.bgColor : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? `0 4px 14px ${tier.borderColor}` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span
                          style={{
                            backgroundColor: tier.badgeColor,
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {tier.badgeLabel}
                        </span>
                        <strong style={{ fontSize: '0.98rem', color: '#0f172a' }}>
                          {tier.nameNepali}
                        </strong>
                      </div>
                      {isSelected ? (
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: tier.badgeColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={16} /> सक्रिय अधिकार
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          क्लिक गरी यो अधिकार प्रयोग गर्नुहोस् &rarr;
                        </span>
                      )}
                    </div>

                    <p style={{ margin: '0.4rem 0', fontSize: '0.8rem', color: '#334155', lineHeight: '1.45' }}>
                      {tier.description}
                    </p>

                    {/* Permissions tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                      {tier.permissions.map((p, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? '#ffffff' : '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            fontWeight: 600,
                          }}
                        >
                          ✓ {p}
                        </span>
                      ))}
                    </div>

                    {/* If Tier 1 Ward, show ward selector */}
                    {tier.tierLevel === 1 && isSelected && (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.6rem',
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #bae6fd',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1' }}>
                          📍 वडा छनोट गर्नुहोस्:
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {Array.from({ length: activePalika.totalWards }, (_, i) => i + 1).map((w) => (
                            <button
                              key={w}
                              onClick={() => setWardNumber(w)}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: selectedWardNumber === w ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                                backgroundColor: selectedWardNumber === w ? '#0284c7' : '#ffffff',
                                color: selectedWardNumber === w ? '#ffffff' : '#0f172a',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                              }}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          (अहिले वडा नं. {selectedWardNumber} को डेटा मात्र सम्पादन हुनेछ)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16a34a" />
            <span>परिवर्तन तुरुन्तै प्रणालीको Audit Trail मा सुरक्षित हुनेछ।</span>
          </div>

          <button
            onClick={() => setIsScopeModalOpen(false)}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.55rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
            }}
          >
            लागू गर्नुहोस् (Apply Scope)
          </button>
        </div>
      </div>
    </div>
  );
};
