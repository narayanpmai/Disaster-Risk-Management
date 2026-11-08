import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bipadApi,
  type BipadStatusResponse,
  type NationalAlertsResponse,
  type DhmTelemetryResponse,
  type SecurityForcesResponse,
  type DataStandardComplianceResponse,
} from '../../../api/bipad';
import { useDisasterScope } from '../../../context/DisasterScopeContext';
import {
  Globe,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Shield,
  ShieldAlert,
  Layers,
  FileCheck,
  Send,
  CloudRain,
  Radio,
  Building2,
  Clock,
  Sparkles,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Check,
  PhoneCall,
  Flame,
  Truck,
  Anchor,
  Navigation,
  Code2,
} from 'lucide-react';

export const NationalDataStandardGatewayTab: React.FC = () => {
  const queryClient = useQueryClient();
  const { activePalika, activeTier } = useDisasterScope();

  // Active sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<'standard' | 'dhm' | 'bipad' | 'security' | 'cap'>('standard');
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [dispatchAgency, setDispatchAgency] = useState('सशस्त्र प्रहरी बल (APF) विपद् शिक्षालय');
  const [dispatchHazard, setDispatchHazard] = useState('बाढी डुबान तथा तटीय कटान');
  const [dispatchMission, setDispatchMission] = useState('मेलम्ची-इन्द्रावती दोभानमा स्विफ्ट वाटर बोट टोली तुरुन्त परिचालन');
  const [showJsonInspector, setShowJsonInspector] = useState(false);

  // Queries
  const { data: statusData, isLoading: isStatusLoading } = useQuery<BipadStatusResponse>({
    queryKey: ['bipad-status'],
    queryFn: () => bipadApi.getStatus(),
  });

  const { data: alertsData } = useQuery<NationalAlertsResponse>({
    queryKey: ['bipad-national-alerts'],
    queryFn: () => bipadApi.getNationalAlerts(),
  });

  const { data: dhmData, isLoading: isDhmLoading, refetch: refetchDhm } = useQuery<DhmTelemetryResponse>({
    queryKey: ['dhm-telemetry'],
    queryFn: () => bipadApi.getDhmTelemetry(),
    refetchInterval: 60000,
  });

  const { data: securityData, isLoading: isSecurityLoading, refetch: refetchSecurity } = useQuery<SecurityForcesResponse>({
    queryKey: ['security-forces'],
    queryFn: () => bipadApi.getSecurityForces(),
  });

  const { data: complianceData } = useQuery<DataStandardComplianceResponse>({
    queryKey: ['data-standard-compliance'],
    queryFn: () => bipadApi.getDataStandardCompliance(),
  });

  const { data: capData } = useQuery({
    queryKey: ['cap-alerts'],
    queryFn: () => bipadApi.getCapAlerts(),
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: () => bipadApi.syncIncidents(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['bipad-status'] });
      setSyncToast(`✅ ${res.message} (कुल सिङ्क अभिलेख: ${res.syncedRecordsCount} वटा)`);
      setTimeout(() => setSyncToast(null), 5000);
    },
    onError: () => {
      setSyncToast('❌ सिङ्क असफल भयो। कृपया BIPAD Gateway जडान जाँच गर्नुहोस्।');
      setTimeout(() => setSyncToast(null), 5000);
    },
  });

  // Security Dispatch Mutation
  const dispatchMutation = useMutation({
    mutationFn: (payload: any) => bipadApi.requestSecurityDispatch(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['security-forces'] });
      setSyncToast(`🚨 ${res.message}`);
      setTimeout(() => setSyncToast(null), 6000);
    },
  });

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatchMutation.mutate({
      requesting_tier: `T${activeTier.tierLevel}: ${activeTier.nameNepali} (${activePalika.nameNepali})`,
      target_agency: dispatchAgency,
      hazard_type: dispatchHazard,
      mission: dispatchMission,
      units_deployed: 'तत्काल खोज तथा उद्धार टोली (QRT Dispatch)',
    });
  };

  const handleExportGeoJson = async () => {
    try {
      const geojson = await bipadApi.exportGeoJson();
      const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bipad_disaster_standard_${activePalika.id}_${new Date().toISOString().split('T')[0]}.geojson`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert('GeoJSON डाउनलोड गर्न सकिएन।');
    }
  };

  const handleExportCapXml = () => {
    if (!capData) return;
    const blob = new Blob([JSON.stringify(capData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oasis_cap_alert_feed_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const syncState = statusData?.syncState;
  const config = statusData?.config;
  const advisories = alertsData?.advisories || [];
  const stations = dhmData?.stations || [];
  const securityUnits = securityData?.units || [];
  const dispatches = securityData?.recent_dispatches || [];
  const complianceModules = complianceData?.modules || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Header Banner ────────────────────────────────────────── */}
      <div
        className="dt-card"
        style={{
          background: 'linear-gradient(135deg, #091e3a 0%, #173b6c 50%, #0369a1 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          borderRadius: '14px',
          boxShadow: '0 8px 24px rgba(3, 105, 161, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Globe size={32} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  backgroundColor: '#f59e0b',
                  color: '#78350f',
                }}
              >
                NDRRMA • DHM • त्रिपक्षीय सुरक्षा निकाय
              </span>
              <span style={{ fontSize: '0.8rem', color: '#bae6fd' }}>
                केन्द्रीकृत राष्ट्रिय विपद् तथ्याङ्क मापदण्ड v२.४ | सक्रिय क्षेत्र:{' '}
                <strong>{activePalika.nameNepali}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0.35rem 0 0.2rem', color: '#ffffff' }}>
              राष्ट्रिय विपद् तथ्याङ्क मापदण्ड तथा DHM/सुरक्षा निकाय API अन्तरआबद्धता
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#e0f2fe' }}>
              Centralized National Data Standard (CAP 1.2, RFC 7946 GeoJSON, RDRA 2077) & Live Hydromet Telemetry Gateways
            </p>
          </div>
        </div>

        {/* Global Action Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="dt-btn"
            style={{
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            <RefreshCw size={16} className={syncMutation.isPending ? 'spin' : ''} />
            {syncMutation.isPending ? 'BIPAD सिङ्क हुँदैछ...' : '🔄 BIPAD राष्ट्रिय सिङ्क'}
          </button>

          <button
            onClick={handleExportGeoJson}
            className="dt-btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              cursor: 'pointer',
            }}
            title="राष्ट्रिय मापदण्ड GeoJSON डाउनलोड"
          >
            <Download size={15} /> GeoJSON निर्यात
          </button>

          <button
            onClick={handleExportCapXml}
            className="dt-btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              cursor: 'pointer',
            }}
            title="OASIS CAP 1.2 टेलिकम ब्रोडकास्ट फिड डाउनलोड"
          >
            <Radio size={15} /> CAP 1.2 फिड
          </button>
        </div>
      </div>

      {/* ── Toast Feedback ─────────────────────────────────────────── */}
      {syncToast && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: syncToast.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
            color: syncToast.startsWith('✅') ? '#065f46' : '#991b1b',
            border: `1.5px solid ${syncToast.startsWith('✅') ? '#a7f3d0' : '#fecaca'}`,
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          {syncToast}
        </div>
      )}

      {/* ── Sub-Navigation Pill Tabs ─────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.45rem',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
        }}
      >
        <button
          onClick={() => setActiveSubTab('standard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeSubTab === 'standard' ? '#0284c7' : 'transparent',
            color: activeSubTab === 'standard' ? '#ffffff' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <FileCheck size={16} />
          १. राष्ट्रिय तथ्याङ्क मापदण्ड प्रमाणीकरण (Standard Compliance)
        </button>

        <button
          onClick={() => setActiveSubTab('dhm')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeSubTab === 'dhm' ? '#0284c7' : 'transparent',
            color: activeSubTab === 'dhm' ? '#ffffff' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <CloudRain size={16} />
          २. जल तथा मौसम विज्ञान (DHM) प्रत्यक्ष टेलिमेट्री
          <span
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              padding: '1px 6px',
              borderRadius: '999px',
              marginLeft: '4px',
            }}
          >
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('bipad')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeSubTab === 'bipad' ? '#0284c7' : 'transparent',
            color: activeSubTab === 'bipad' ? '#ffffff' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <Globe size={16} />
          ३. NDRRMA BIPAD पोर्टल दुई-तर्फी एकीकरण
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeSubTab === 'security' ? '#0284c7' : 'transparent',
            color: activeSubTab === 'security' ? '#ffffff' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <ShieldAlert size={16} />
          ४. त्रिपक्षीय सुरक्षा निकाय (SAR Dispatch Protocol)
        </button>

        <button
          onClick={() => setActiveSubTab('cap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.55rem 1.1rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: activeSubTab === 'cap' ? '#0284c7' : 'transparent',
            color: activeSubTab === 'cap' ? '#ffffff' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <Radio size={16} />
          ५. टेलिकम CAP १.२ पूर्वसूचना फिड
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          SUB-TAB 1: CENTRALIZED DATA STANDARD COMPLIANCE
      ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'standard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Compliance Meter Card */}
          <div
            className="dt-card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  ✓ राष्ट्रिय मापदण्ड प्रमाणित
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  मानक: {complianceData?.standard_version || 'NDRRMA Unified Disaster Data Standard v2.4'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                केन्द्रीकृत एकीकृत विपद् तथ्याङ्क मापदण्ड अनुपालन (Data Schema Compliance)
              </h3>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                नेपाल सरकारको विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन ऐन २०७४ र राष्ट्रिय विपद् प्राधिकरण (NDRRMA) को मापदण्ड
                अनुसार सबै ७५३ वटै स्थानीय तहको डाटा एउटै संरचनामा स्वचालित प्रमाणीकरण।
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#f0fdf4',
                padding: '1rem 1.4rem',
                borderRadius: '12px',
                border: '1.5px solid #86efac',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#15803d', lineHeight: 1 }}>
                  {complianceData?.overall_compliance_score || 98.8}%
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', marginTop: '3px' }}>
                  कुल अनुपालन दर (Score)
                </div>
              </div>
              <CheckCircle2 size={38} color="#16a34a" />
            </div>
          </div>

          {/* Compliance Modules Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {complianceModules.map((mod, idx) => (
              <div
                key={idx}
                className="dt-card"
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                    {mod.module_name}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '4px',
                      backgroundColor: '#ecfdf5',
                      color: '#047857',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    {mod.compliance_pct}% अनुपालन
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>
                  मापदण्ड: {mod.standard}
                </div>

                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${mod.compliance_pct}%`,
                      backgroundColor: '#10b981',
                      borderRadius: '999px',
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                  {mod.notes}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Schema Inspector Toggle */}
          <div
            className="dt-card"
            style={{
              padding: '1.25rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Code2 size={18} color="#0284c7" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1e293b' }}>
                  राष्ट्रिय विपद् डाटा स्कीमा संरचना (Standard JSON Schema Definition)
                </h4>
              </div>
              <button
                onClick={() => setShowJsonInspector(!showJsonInspector)}
                className="dt-btn"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#e2e8f0',
                  color: '#334155',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {showJsonInspector ? 'स्कीमा बन्द गर्नुहोस्' : 'स्कीमा हेर्नुहोस् (Inspect)'}
              </button>
            </div>

            {showJsonInspector && (
              <pre
                style={{
                  marginTop: '0.85rem',
                  padding: '1rem',
                  backgroundColor: '#0f172a',
                  color: '#38bdf8',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  overflowX: 'auto',
                  maxHeight: '260px',
                }}
              >
                {JSON.stringify(
                  {
                    $schema: 'https://json-schema.org/draft/2020-12/schema',
                    title: 'NDRRMA_Unified_Disaster_Standard_v2.4',
                    required_fields: [
                      'palika_code_iso',
                      'bipad_incident_id',
                      'hazard_category',
                      'severity_level_cap',
                      'spatial_geometry_wgs84',
                      'vulnerability_micro_index',
                      'relief_dbt_calculated_npr',
                      'audit_event_hash',
                    ],
                    spatial_crs: 'EPSG:4326 (WGS84) RFC 7946 GeoJSON',
                    telemetry_rate_hz: '0.016 (60-sec streaming)',
                    security_clearance_levels: ['T1_WARD', 'T2_LEOC', 'T3_DEOC', 'T4_SECURITY', 'T5_PEOC', 'T6_NEOC'],
                  },
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SUB-TAB 2: DHM LIVE HYDROMET TELEMETRY
      ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'dhm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Controls */}
          <div
            className="dt-card"
            style={{
              padding: '1rem 1.4rem',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CloudRain size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  जल तथा मौसम विज्ञान विभाग (DHM) प्रत्यक्ष नदी जलसतह तथा वर्षा टेलिमेट्री
                </h3>
              </div>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                स्रोत: hydrology.gov.np | स्वचालित राडार जलमापन, २४ घण्टे संकलित वर्षा र खतरा विन्दु अनुगमन
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                प्रत्येक ६० सेकेन्डमा स्वतः अद्यावधिक
              </span>
              <button
                onClick={() => refetchDhm()}
                className="dt-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} className={isDhmLoading ? 'spin' : ''} />
                अहिले ताजा गर्नुहोस्
              </button>
            </div>
          </div>

          {/* Stations Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {stations.map((station) => {
              const isWarning = station.status === 'warning';
              const isDanger = station.status === 'danger';
              const waterPct = Math.min(
                100,
                Math.round((station.current_water_level_m / station.danger_level_m) * 100)
              );

              return (
                <div
                  key={station.station_id}
                  className="dt-card"
                  style={{
                    padding: '1.4rem',
                    borderRadius: '12px',
                    border: `2px solid ${isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}`,
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    boxShadow: isWarning
                      ? '0 4px 18px rgba(245, 158, 11, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {/* Station Title & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                          }}
                        >
                          {station.station_id}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          उचाइ: {station.elevation_m}m
                        </span>
                      </div>
                      <h4 style={{ margin: '0.3rem 0 0.1rem', fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                        {station.station_name_np}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>
                        {station.basin}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 9px',
                        borderRadius: '6px',
                        backgroundColor: isDanger ? '#dc2626' : isWarning ? '#f59e0b' : '#10b981',
                        color: '#ffffff',
                      }}
                    >
                      {station.status_label_np}
                    </span>
                  </div>

                  {/* Water Level Gauge Big Numbers */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      backgroundColor: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        वर्तमान जलसतह (WATER LEVEL)
                      </div>
                      <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
                        {station.current_water_level_m}{' '}
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>मिटर</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                        वहाव प्रवृत्ति (TREND)
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color:
                            station.trend === 'rising'
                              ? '#dc2626'
                              : station.trend === 'falling'
                              ? '#16a34a'
                              : '#64748b',
                        }}
                      >
                        {station.trend === 'rising' && <ArrowUpRight size={16} />}
                        {station.trend === 'falling' && <ArrowDownRight size={16} />}
                        {station.trend === 'steady' && <Minus size={16} />}
                        {station.trend === 'rising'
                          ? `बढ्दो (+${station.trend_speed_cm_hr} cm/h)`
                          : station.trend === 'falling'
                          ? `घट्दो (${station.trend_speed_cm_hr} cm/h)`
                          : 'स्थिर'}
                      </div>
                    </div>
                  </div>

                  {/* Thresholds Bar */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '4px',
                      }}
                    >
                      <span>सतर्कता तह: {station.warning_level_m}m</span>
                      <span>खतरा तह: {station.danger_level_m}m</span>
                    </div>
                    <div
                      style={{
                        height: '10px',
                        width: '100%',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${waterPct}%`,
                          backgroundColor: isDanger ? '#dc2626' : isWarning ? '#f59e0b' : '#38bdf8',
                          borderRadius: '999px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* 24-hr Rainfall & Telemetry Specs */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '0.65rem',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b' }}>२४ घण्टे वर्षा: </span>
                      <strong style={{ color: station.rainfall_24h_mm > 80 ? '#dc2626' : '#0f172a' }}>
                        {station.rainfall_24h_mm} mm
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>१ घण्टे तीव्रता: </span>
                      <strong style={{ color: station.rainfall_1h_mm > 15 ? '#ea580c' : '#0f172a' }}>
                        {station.rainfall_1h_mm} mm/h
                      </strong>
                    </div>
                    <div style={{ gridColumn: 'span 2', fontSize: '0.72rem', color: '#64748b' }}>
                      📡 प्रसारण: <strong>{station.transmission_type}</strong> | {station.last_reading_bs}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SUB-TAB 3: NDRRMA BIPAD PORTAL INTEGRATION
      ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'bipad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Status KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="dt-card" style={{ borderLeft: '4px solid #10b981', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>BIPAD सिङ्क भएका घटनाहरू</span>
                <CheckCircle2 size={20} color="#10b981" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {syncState?.totalSyncedIncidents || 14}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>घटना</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
                ✓ NDRRMA केन्द्रीय सर्भरमा प्रमाणित
              </div>
            </div>

            <div className="dt-card" style={{ borderLeft: '4px solid #f59e0b', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>सिङ्क हुन बाँकी (Pending)</span>
                <Clock size={20} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {syncState?.pendingSync || 0}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>विवरण</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                स्थानीय प्रविष्टि तुरुन्तै सिङ्क हुन्छ
              </div>
            </div>

            <div className="dt-card" style={{ borderLeft: '4px solid #0284c7', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>पछिल्लो सिङ्क समय</span>
                <RefreshCw size={18} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
                {syncState?.lastSyncedBs || '२०८१/०६/०८ १३:००'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                स्थिति: <strong>{syncState?.lastHttpStatus || '200 OK'}</strong>
              </div>
            </div>

            <div className="dt-card" style={{ borderLeft: '4px solid #ef4444', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>राष्ट्रिय पूर्वसूचना बुलेटिन</span>
                <AlertTriangle size={20} color="#ef4444" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b91c1c', marginTop: '0.3rem' }}>
                {advisories.length}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>सक्रिय सतर्कता</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.2rem' }}>
                मेलम्ची / सिन्धुपाल्चोक बेसिन विशेष
              </div>
            </div>
          </div>

          {/* National Advisories Feed */}
          <div className="dt-card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              गृह मन्त्रालय राष्ट्रिय विपद् पोर्टल (bipadportal.gov.np) प्रत्यक्ष सतर्कता बुलेटिन
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: adv.risk_level_code.includes('RED') ? '#fef2f2' : '#fffbeb',
                    border: `1.5px solid ${adv.risk_level_code.includes('RED') ? '#fca5a5' : '#fde68a'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: adv.risk_level_code.includes('RED') ? '#dc2626' : '#d97706',
                        color: '#ffffff',
                      }}
                    >
                      {adv.severity}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      मान्य मिति: {adv.valid_until_bs}
                    </span>
                  </div>
                  <h5 style={{ margin: '0.4rem 0 0.2rem', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                    {adv.headline_np}
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: '#334155', lineHeight: 1.5 }}>
                    {adv.description_np}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SUB-TAB 4: TRI-SERVICES SECURITY FORCES SAR PROTOCOL
      ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Dispatch Form and Battalion Directory */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {/* Rapid Dispatch Dispatcher Box */}
            <div
              className="dt-card"
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <ShieldAlert size={20} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                  सुरक्षा निकाय आपतकालीन परिचालन (SAR Callout Dispatch)
                </h3>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#64748b' }}>
                नेपाली सेना, सशस्त्र प्रहरी बल तथा नेपाल प्रहरीका विपद् कमान्ड सेन्टरमा आधिकारिक परिचालन अनुरोध पठाउनुहोस्।
              </p>

              <form onSubmit={handleDispatchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    लक्ष्य सुरक्षा निकाय (Target Agency)
                  </label>
                  <select
                    value={dispatchAgency}
                    onChange={(e) => setDispatchAgency(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <option value="सशस्त्र प्रहरी बल (APF) विपद् शिक्षालय">
                      सशस्त्र प्रहरी बल (APF) - कुरीनटार शिक्षालय / २२ नं. गण
                    </option>
                    <option value="नेपाली सेना (NA) श्री नं. १ विपद् व्यवस्थापन गण">
                      नेपाली सेना (NA) - श्री नं. १ विपद् व्यवस्थापन गण (सुन्दरीजल)
                    </option>
                    <option value="नेपाल प्रहरी (NP) कमान्ड कन्ट्रोल १००">
                      नेपाल प्रहरी (NP) - सिन्धुपाल्चोक / मेलम्ची कमान्ड
                    </option>
                    <option value="संयुक्त सुरक्षा कमान्ड (Joint Tri-Services)">
                      संयुक्त सुरक्षा कमान्ड (Joint Tri-Services Taskforce)
                    </option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    जोखिम वा घटना प्रकार (Hazard Type)
                  </label>
                  <input
                    type="text"
                    value={dispatchHazard}
                    onChange={(e) => setDispatchHazard(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    खोज तथा उद्धार मिसन विवरण (Mission Scope & Coordinates)
                  </label>
                  <textarea
                    rows={3}
                    value={dispatchMission}
                    onChange={(e) => setDispatchMission(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={dispatchMutation.isPending}
                  className="dt-btn"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 800,
                    padding: '0.7rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.3rem',
                  }}
                >
                  <Send size={16} />
                  {dispatchMutation.isPending ? 'परिचालन अनुरोध सम्प्रेषित हुँदैछ...' : 'आधिकारिक SAR परिचालन आदेश पठाउनुहोस्'}
                </button>
              </form>
            </div>

            {/* Security Forces Directory Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {securityUnits.map((unit) => (
                <div
                  key={unit.unit_id}
                  className="dt-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                        }}
                      >
                        {unit.agency}
                      </span>
                      <h4 style={{ margin: '0.3rem 0 0', fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>
                        {unit.battalion}
                      </h4>
                    </div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      {unit.readiness_level}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    📞 कलगण / हटलाइन: <strong>{unit.hotline}</strong> ({unit.contact_callsign})
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>
                    🚁 हवाई: {unit.air_assets} <br />
                    🚤 जल उद्धार: {unit.water_assets} <br />
                    📍 कमान्ड ग्रिड: <code style={{ color: '#0284c7' }}>{unit.grid_location}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Dispatches Log */}
          <div className="dt-card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', borderRadius: '10px' }}>
            <h4 style={{ margin: '0 0 0.85rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              हालका आधिकारिक सुरक्षा परिचालन अभिलेखहरू (Recent SAR Dispatch Logs)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#475569' }}>डिसप्याच ID</th>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#475569' }}>समय (BS)</th>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#475569' }}>अनुरोध गर्ने तह</th>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#475569' }}>लक्ष्य सुरक्षा निकाय</th>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#475569' }}>मिसन विवरण</th>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#475569' }}>स्थिति</th>
                  </tr>
                </thead>
                <tbody>
                  {dispatches.map((disp) => (
                    <tr key={disp.dispatch_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: '#0284c7' }}>
                        {disp.dispatch_id}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#64748b' }}>{disp.timestamp_bs}</td>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>
                        {disp.requesting_tier}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#334155' }}>{disp.target_agency}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#475569' }}>{disp.mission}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#ecfdf5',
                            color: '#065f46',
                          }}
                        >
                          {disp.status_label_np}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SUB-TAB 5: OASIS CAP 1.2 TELECOM FEED
      ══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'cap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="dt-card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Radio size={20} color="#0284c7" />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                    OASIS CAP १.२ (Common Alerting Protocol) टेलिकम ब्रोडकास्ट फिड
                  </h3>
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  नेपाल टेलिकम (NTC), एनसेल (Ncell) र गृह मन्त्रालयको सेल-ब्रोडकास्ट आपतकालीन SMS प्रणालीसँग अन्तरआबद्धता।
                </p>
              </div>

              <button
                onClick={handleExportCapXml}
                className="dt-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Download size={15} />
                CAP १.२ JSON डाउनलोड
              </button>
            </div>

            <pre
              style={{
                padding: '1.25rem',
                backgroundColor: '#0f172a',
                color: '#4ade80',
                borderRadius: '8px',
                fontSize: '0.8rem',
                overflowX: 'auto',
                lineHeight: 1.5,
                maxHeight: '400px',
              }}
            >
              {JSON.stringify(capData || { message: 'लोड हुँदैछ...' }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default NationalDataStandardGatewayTab;

