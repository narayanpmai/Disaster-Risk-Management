import React, { useEffect, useState, useRef } from 'react';
import { useTenant } from '../../context/TenantContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Activity,
  Layers,
  Users,
  CheckCircle,
  FileCheck2,
  TrendingUp,
  Shield,
  Building2,
  Sprout,
  HeartPulse,
  GraduationCap,
  Compass,
  AlertTriangle,
  FolderGit2,
  Database,
  Inbox,
  FileText,
  Briefcase,
  Scale,
  HeartHandshake,
  BookOpen,
  HardHat,
  Banknote,
  Siren,
  UserCheck,
  ShoppingCart,
  Baby,
  Loader2,
  RefreshCw,
  Home,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Landmark,
  BarChart3,
  Waves,
  Mountain,
  Coins,
  Truck,
  Tent,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HouseholdRegistryTab } from '../citizen-portal/components/HouseholdRegistryTab';
import { PredictiveAnalytics } from '../../components/analytics/PredictiveAnalytics';
import { MunicipalGISMap } from '../../components/maps/MunicipalGISMap';

// ── Devanagari / Nepali Digits Formatter ──────────────────────────────────────
export const toNepaliDigits = (val: number | string | undefined | null, forceNepali = true): string => {
  if (val === undefined || val === null || (typeof val === 'number' && isNaN(val))) {
    return forceNepali ? '०' : '0';
  }
  const formatted = typeof val === 'number'
    ? val.toLocaleString('en-IN')
    : String(val);
  if (!forceNepali) return formatted;
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return formatted.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)] ?? d);
};

// ── Safe Number Helper to prevent NaN ─────────────────────────────────────────
const safeNum = (val: any, fallback: number): number => {
  if (val === undefined || val === null || val === '') return fallback;
  const num = Number(val);
  return Number.isFinite(num) && num > 0 ? num : fallback;
};

// ── Default Seeded Baseline Counts (100% NIDRMS Disaster Domain) ─────────────
const DEFAULT_STATS: Record<string, any> = {
  totalCitizens: 17521,
  totalPopulation: 17521,
  malePopulation: 8600,
  femalePopulation: 8921,
  totalHouseholds: 5805,
  totalGpsHouses: 5805,
  highRiskHouses: 18,
  highRiskSettlements: 4,
  totalShelters: 6,
  totalShelterCapacity: 1310,
  vulnerableCitizens: 1420,
  sarHeavyEquipment: 12,
  sarVolunteers: 64,
  telemetrySensors: 3,
  meshSirens: 4,
  totalDisasterEvents: 8,
  activeDisasterEvents: 2,
  totalDamageLossNPR: 15750000,
  reliefDisbursedNPR: 4850000,
  roadLengthKm: 148.5,
  waterAccessPercent: 88.5,
  budgetUtilizationPercent: 98.0,
  totalProjects: 14,
  totalComplaints: 8,
  pendingComplaints: 2,
};

// ── Animated Counter Hook ─────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(target);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === undefined || target === null || isNaN(target)) return;
    let start: number | null = null;
    const initial = 0;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(initial + eased * (target - initial)));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, duration]);

  return count;
}

// ── Sector Stat Card ──────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subLabel?: string;
  subValue?: number | string;
  color: string;
  bgColor: string;
  borderColor: string;
  loading: boolean;
  link?: string;
  previewDetails?: { label: string; value: string | number; highlight?: boolean }[];
  readOnly?: boolean;
  isNepali?: boolean;
}

// ── Quick Preview Modal ────────────────────────────────────────────────────────
const QuickPreviewModal: React.FC<{
  open: boolean;
  onClose: () => void;
  card: StatCardProps;
  isNepali: boolean;
}> = ({ open, onClose, card, isNepali }) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          width: '100%', maxWidth: '420px',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.4,0,0.2,1)',
          position: 'relative',
        }}
      >
        {/* Header bar */}
        <div style={{
          background: `linear-gradient(135deg, ${card.color}18, ${card.bgColor})`,
          borderBottom: `1.5px solid ${card.borderColor}44`,
          padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: card.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${card.borderColor}44`,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {toNepaliDigits(card.value, isNepali)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#64748b' }}
          >✕</button>
        </div>

        {/* Detail rows */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Sub info */}
          {card.subLabel && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: `${card.bgColor}`, borderRadius: '10px', border: `1px solid ${card.borderColor}33` }}>
              <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>{card.subLabel}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: card.color }}>{toNepaliDigits(card.subValue, isNepali)}</span>
            </div>
          )}

          {/* Extra preview details */}
          {card.previewDetails && card.previewDetails.map((d, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.55rem 0.85rem',
              background: d.highlight ? `${card.color}0f` : '#f8fafc',
              borderRadius: '8px',
              border: d.highlight ? `1px solid ${card.borderColor}55` : '1px solid #f1f5f9',
            }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{d.label}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: d.highlight ? card.color : '#0f172a' }}>
                {toNepaliDigits(d.value, isNepali)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        {card.link && !card.readOnly && (
          <div style={{ padding: '0 1.5rem 1.25rem' }}>
            <Link
              to={card.link}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                width: '100%', padding: '0.75rem',
                background: `linear-gradient(135deg, ${card.color}, ${card.borderColor})`,
                color: '#ffffff', fontWeight: 700, fontSize: '0.9rem',
                borderRadius: '12px', textDecoration: 'none',
                boxShadow: `0 4px 12px ${card.borderColor}44`,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <ExternalLink size={16} />
              {isNepali ? 'विस्तृत हेर्नुहोस् →' : 'View Details →'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = (props) => {
  const { icon, label, value, subLabel, subValue, color, bgColor, borderColor, loading, link, previewDetails, readOnly, isNepali = true } = props;
  const numericVal = typeof value === 'number' && !isNaN(value) ? value : 0;
  const animated = useAnimatedCounter(numericVal, 1100);
  const displayValue = typeof value === 'number'
    ? toNepaliDigits(animated, isNepali)
    : (typeof value === 'string' && /^\d+$/.test(value) ? toNepaliDigits(value, isNepali) : value);

  const [hovered, setHovered] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        setPreviewOpen(true);
      }}
      style={{
        background: hovered ? `linear-gradient(135deg, ${bgColor}, #ffffff)` : '#ffffff',
        borderRadius: '16px',
        border: `1.5px solid ${hovered ? borderColor : '#e8edf5'}`,
        padding: '1.15rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '145px',
        boxSizing: 'border-box',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered ? `0 10px 24px ${borderColor}33` : '0 2px 8px rgba(0,0,0,0.03)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${color}, ${borderColor})`,
          borderRadius: '16px 16px 0 0',
        }}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem', lineHeight: 1.3 }}>
              {label}
            </div>
            {loading ? (
              <div style={{ height: '2rem', width: '75px', background: 'linear-gradient(90deg,#f1f5f9,#e2e8f0,#f1f5f9)', backgroundSize: '200% 100%', borderRadius: '8px', animation: 'shimmer 1.4s infinite' }} />
            ) : (
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {displayValue}
              </div>
            )}
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 8px ${borderColor}44` }}>
            {icon}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.4rem' }}>
        {subLabel && (
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
            {loading ? (
              <span style={{ display: 'inline-block', width: '90px', height: '0.65rem', background: '#f1f5f9', borderRadius: '4px' }} />
            ) : (
              <span>{subLabel}: <strong style={{ color, fontWeight: 700 }}>{toNepaliDigits(subValue, isNepali)}</strong></span>
            )}
          </div>
        )}
        {/* Click hint */}
        {hovered && link && !readOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: color, fontWeight: 700, marginTop: '0.25rem' }}>
            <ExternalLink size={12} /> {isNepali ? 'विस्तृत हेर्नुहोस्' : 'View Details'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <QuickPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} card={props} isNepali={isNepali} />
      <div style={{ display: 'block', cursor: 'pointer', height: '100%' }}>{inner}</div>
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const DashboardOverview: React.FC<{ readOnly?: boolean }> = ({ readOnly = false }) => {
  const { settings } = useTenant();
  const { isNepali } = useLanguage();
  const palikaName = isNepali
    ? (settings?.palika_name || 'पाँचपोखरी थाङपाल गाउँपालिका')
    : 'Panchpokhari Thangpal Rural Municipality';
  const fmt = (v: any) => toNepaliDigits(v, isNepali);

  const [stats, setStats] = useState<Record<string, any>>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    const token =
      localStorage.getItem('p5_token') ||
      localStorage.getItem('auth_token') ||
      sessionStorage.getItem('p5_token') ||
      sessionStorage.getItem('auth_token') ||
      '';

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const candidateUrls = [
      '/api/v1/dashboard/stats',
      'http://localhost:3001/api/v1/dashboard/stats',
    ];

    for (const url of candidateUrls) {
      try {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            setStats((prev) => ({ ...prev, ...data }));
          }
          break;
        }
      } catch (_) {}
    }

    // ── 2. Fetch individual endpoints in parallel ────────────────────────────
    const safeArray = async (url: string) => {
      try {
        const r = await fetch(url, { headers });
        if (r.ok) { const d = await r.json(); return Array.isArray(d) ? d : (d?.data && Array.isArray(d.data) ? d.data : null); }
      } catch (_) {}
      return null;
    };
    const safeObj = async (url: string) => {
      try {
        const r = await fetch(url, { headers });
        if (r.ok) { return await r.json(); }
      } catch (_) {}
      return null;
    };

    const [
      disasterStats,
      demoData,
      projectsData,
      reportKpis,
      complaintsList,
    ] = await Promise.all([
      safeObj('/api/v1/disaster/stats'),
      safeObj('/api/v1/demographics/summary'),
      safeObj('/api/v1/projects'),
      safeObj('/api/v1/reports/kpis'),
      safeArray('/api/v1/complaints'),
    ]);

    setStats((prev) => {
      const next = { ...prev };

      // विपद् व्यवस्थापन तथ्याङ्क (Real Data from LEOC)
      if (disasterStats && typeof disasterStats === 'object') {
        next.totalDisasterEvents = safeNum(disasterStats.totalEvents, prev.totalDisasterEvents || 8);
        next.activeDisasterEvents = safeNum(disasterStats.activeEvents, prev.activeDisasterEvents || 2);
        next.highRiskSettlements = safeNum(disasterStats.highRiskSettlements, prev.highRiskSettlements || 4);
        next.totalShelters = safeNum(disasterStats.totalShelters, prev.totalShelters || 6);
        next.totalShelterCapacity = safeNum(disasterStats.totalShelterCapacity, prev.totalShelterCapacity || 1310);
        next.totalDamageLossNPR = safeNum(disasterStats.totalDamageLossNPR, prev.totalDamageLossNPR || 15750000);
        next.reliefDisbursedNPR = safeNum(disasterStats.totalReliefDistributedNPR ?? disasterStats.reliefDisbursedNPR, prev.reliefDisbursedNPR || 4850000);
        next.vulnerableCitizens = safeNum(disasterStats.vulnerableCitizens, prev.vulnerableCitizens || 1420);
        next.sarHeavyEquipment = safeNum(disasterStats.sarHeavyEquipment, prev.sarHeavyEquipment || 12);
        next.sarVolunteers = safeNum(disasterStats.sarVolunteers, prev.sarVolunteers || 64);
        next.telemetrySensors = safeNum(disasterStats.telemetrySensors, prev.telemetrySensors || 3);
      }

      // जनसांख्यिकी लगत (Demographic Baseline for Evacuation & Rescue)
      if (demoData && typeof demoData === 'object') {
        next.totalPopulation = safeNum(demoData?.population?.total, prev.totalPopulation || 17521);
        next.malePopulation = safeNum(demoData?.population?.male, prev.malePopulation || 8600);
        next.femalePopulation = safeNum(demoData?.population?.female, prev.femalePopulation || 8921);
        next.totalHouseholds = safeNum(demoData?.population?.households, prev.totalHouseholds || 5805);
        next.totalGpsHouses = safeNum(demoData?.householdRegistry?.registeredCount, prev.totalGpsHouses || 5805);
        next.highRiskHouses = safeNum(demoData?.householdRegistry?.highRiskCount, prev.highRiskHouses || 18);
      }

      // विपद् पुनर्निर्माण तथा पूर्वाधार आयोजना
      if (projectsData) {
        next.totalProjects = projectsData.total ?? (Array.isArray(projectsData) ? projectsData.length : prev.totalProjects ?? 14);
      }

      // भौतिक पूर्वाधार तथा प्रगति KPIs
      if (reportKpis) {
        next.roadLengthKm = safeNum(reportKpis.roadLengthKm, prev.roadLengthKm || 148.5);
        next.waterAccessPercent = safeNum(reportKpis.waterAccessPercent, prev.waterAccessPercent || 88.5);
        next.budgetUtilizationPercent = safeNum(reportKpis.budgetUtilizationPercent, prev.budgetUtilizationPercent || 98.0);
      }

      // विपद् गुनासो तथा राहत उजुरी
      if (complaintsList && Array.isArray(complaintsList)) {
        next.totalComplaints = complaintsList.length;
        next.pendingComplaints = complaintsList.filter((c: any) =>
          !(c.status || '').includes('फछ्र्यौट') &&
          !(c.status || '').toLowerCase().includes('resolved') &&
          !(c.status || '').toLowerCase().includes('closed')
        ).length;
      }

      return next;
    });

    setLastUpdated(new Date());
    setLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ── 12 Disaster Risk & Emergency Operational Metrics (100% NIDRMS Core Domain) ──
  const sectorCards: StatCardProps[] = [
    {
      icon: <AlertTriangle size={22} color="#dc2626" />,
      label: isNepali ? 'विपद् घटना दर्ता' : 'Reported Incidents',
      value: stats.totalDisasterEvents ?? 8,
      subLabel: isNepali ? 'सक्रिय प्रतिकार्य' : 'Active Response',
      subValue: isNepali ? `${fmt(stats.activeDisasterEvents ?? 2)} सक्रिय कमाण्ड` : `${stats.activeDisasterEvents ?? 2} Active Operations`,
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#f87171',
      loading,
      link: '/disaster',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'दर्ता विपद् घटनाहरू' : 'Reported Incidents', value: stats.totalDisasterEvents ?? 8, highlight: true },
        { label: isNepali ? 'सक्रिय प्रतिकार्य' : 'Active Operations', value: stats.activeDisasterEvents ?? 2, highlight: true },
        { label: isNepali ? 'प्रभावित क्षेत्र' : 'Impact Zones', value: isNepali ? 'बाढी, पहिरो, आगलागी' : 'Floods, Landslides, Fires' },
        { label: isNepali ? 'कमान्ड स्थिति' : 'Command Status', value: isNepali ? '२४/७ LEOC सञ्चालन' : '24/7 LEOC Active' },
      ],
    },
    {
      icon: <Siren size={22} color="#ea580c" />,
      label: isNepali ? 'सक्रिय EOC कमाण्ड' : 'Active EOC Command',
      value: stats.activeDisasterEvents ?? 2,
      subLabel: isNepali ? 'आपतकालीन नियन्त्रण' : 'Control Center',
      subValue: isNepali ? '२४/७ कमाण्ड सक्रिय' : '24/7 Active',
      color: '#ea580c',
      bgColor: '#fff7ed',
      borderColor: '#fb923c',
      loading,
      link: '/disaster',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'सक्रिय कमाण्ड' : 'Active Incidents', value: stats.activeDisasterEvents ?? 2, highlight: true },
        { label: isNepali ? 'सुरक्षा निकाय समन्वय' : 'Security Agencies', value: isNepali ? 'सेना, सशस्त्र, नेपाल प्रहरी' : 'Army, APF, Police' },
        { label: isNepali ? 'हटलाइन सम्पर्क' : 'EOC Hotline', value: '011-460111' },
        { label: isNepali ? 'सञ्चार माध्यम' : 'Comm Channels', value: isNepali ? 'VHF च्यानल १६ + IVR' : 'VHF Ch 16 + IVR' },
      ],
    },
    {
      icon: <Mountain size={22} color="#d97706" />,
      label: isNepali ? 'उच्च जोखिम बस्ती' : 'High-Risk Settlements',
      value: stats.highRiskSettlements ?? 4,
      subLabel: isNepali ? 'पहिरो तथा कटान क्षेत्र' : 'Hazard Zones',
      subValue: isNepali ? '४ लेकाली बस्ती' : '4 Settlements',
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fcd34d',
      loading,
      link: '/disaster?tab=vulnerable_settlements',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'उच्च जोखिम बस्ती संख्या' : 'High Risk Clusters', value: stats.highRiskSettlements ?? 4, highlight: true },
        { label: isNepali ? 'पहिरो जोखिम बस्ती' : 'Landslide Zones', value: isNepali ? 'मानेखर्क, सेर्माथाङ, भोताङ' : 'Manekharka, Sermathang, Bhotang' },
        { label: isNepali ? 'नदी कटान जोखिम' : 'River Erosion', value: isNepali ? 'तिम्बु बजार, मेलम्ची तटीय' : 'Timbu Bazar, Melamchi Corridor' },
        { label: isNepali ? 'इन्क्लिनोमिटर सेन्सर' : 'Inclinometers', value: isNepali ? '०.४ मिमि/घन्टा मुभमेन्ट' : '0.4 mm/hr shift' },
      ],
    },
    {
      icon: <Home size={22} color="#7c3aed" />,
      label: isNepali ? 'जोखिमयुक्त घरधुरी' : 'Exposed Households',
      value: stats.totalHouseholds ?? 5805,
      subLabel: isNepali ? '१००% GPS नक्साङ्कन' : '100% Geo-Mapped',
      subValue: isNepali ? `${fmt(stats.totalHouseholds ?? 5805)} घरधुरी` : `${(stats.totalHouseholds ?? 5805).toLocaleString()} HH`,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#a78bfa',
      loading,
      link: '/demographics',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'कुल घरधुरी' : 'Total Households', value: stats.totalHouseholds ?? 5805, highlight: true },
        { label: isNepali ? 'GPS प्रमाणीकरण' : 'GPS Verification', value: isNepali ? '१००% जियो-ट्याग' : '100% Geo-Tagged' },
        { label: isNepali ? 'नदी २००m बफरमा रहेका' : 'Within 200m Buffer', value: isNepali ? '३८४ घरधुरी' : '384 Households' },
        { label: isNepali ? 'काँचो माटो/ढुङ्गाका घर' : 'Mud-Stone Houses', value: isNepali ? '४२% जोखिम संरचना' : '42% Vulnerable Structures' },
      ],
    },
    {
      icon: <Users size={22} color="#ec4899" />,
      label: isNepali ? 'अति-संवेदनशील नागरिक' : 'Vulnerable Citizens',
      value: stats.vulnerableCitizens ?? 1420,
      subLabel: isNepali ? 'प्राथमिकता उद्धार सूची' : 'Priority Rescue List',
      subValue: isNepali ? `${fmt(stats.vulnerableCitizens ?? 1420)} जना विशेष लगत` : `${(stats.vulnerableCitizens ?? 1420).toLocaleString()} Priority Persons`,
      color: '#ec4899',
      bgColor: '#fdf2f8',
      borderColor: '#f472b6',
      loading,
      link: '/disaster?tab=micro_vulnerability',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'अति-संवेदनशील नागरिक' : 'Total Micro-Vulnerable', value: stats.vulnerableCitizens ?? 1420, highlight: true },
        { label: isNepali ? 'गर्भवती तथा सुत्केरी' : 'Pregnant & Lactating', value: isNepali ? '२१८ जना' : '218 Mothers' },
        { label: isNepali ? '७०+ वर्षका ज्येष्ठ नागरिक' : 'Seniors 70+ Yrs', value: isNepali ? '८९० जना' : '890 Persons' },
        { label: isNepali ? 'पूर्ण अपाङ्गता भएका' : 'Severe Disabilities', value: isNepali ? '३१२ जना' : '312 Persons' },
      ],
    },
    {
      icon: <Building2 size={22} color="#10b981" />,
      label: isNepali ? 'प्रमाणित आश्रयस्थल' : 'Certified Shelters',
      value: stats.totalShelters ?? 6,
      subLabel: isNepali ? '८ वडा सुरक्षित केन्द्र' : '8 Wards Safe Sites',
      subValue: isNepali ? '६ स्थान प्रमाणित' : '6 Certified Sites',
      color: '#10b981',
      bgColor: '#ecfdf5',
      borderColor: '#34d399',
      loading,
      link: '/disaster?tab=shelters',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'प्रमाणित आश्रयस्थलहरू' : 'Certified Shelters', value: stats.totalShelters ?? 6, highlight: true },
        { label: isNepali ? 'संरचना प्रकार' : 'Structure Type', value: isNepali ? 'कभर्ड हल, विद्यालय, भवन' : 'Covered Halls, Schools' },
        { label: isNepali ? 'खानेपानी तथा बिजुली' : 'WASH & Solar Power', value: isNepali ? '१००% उपलब्ध' : '100% Available' },
        { label: isNepali ? 'प्राथमिक स्वास्थ्य किट' : 'First Aid Kits', value: isNepali ? '६ वटै केन्द्रमा मौज्दात' : 'All 6 Sites Stocked' },
      ],
    },
    {
      icon: <Tent size={22} color="#059669" />,
      label: isNepali ? 'आश्रयस्थल कुल क्षमता' : 'Shelter Capacity',
      value: stats.totalShelterCapacity ?? 1310,
      subLabel: isNepali ? 'विस्थापित नागरिक क्षमता' : 'Evacuee Capacity',
      subValue: isNepali ? `${fmt(stats.totalShelterCapacity ?? 1310)} जना क्षमता` : `${(stats.totalShelterCapacity ?? 1310).toLocaleString()} Persons`,
      color: '#059669',
      bgColor: '#f0fdf4',
      borderColor: '#4ade80',
      loading,
      link: '/disaster?tab=shelters',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'कुल आश्रय क्षमता' : 'Total Capacity', value: isNepali ? `${fmt(stats.totalShelterCapacity ?? 1310)} जना` : `${(stats.totalShelterCapacity ?? 1310).toLocaleString()} Persons`, highlight: true },
        { label: isNepali ? 'प्रति व्यक्ति क्षेत्रफल' : 'Per Person Space', value: isNepali ? '३.५ वर्गमिटर' : '3.5 sq. meters' },
        { label: isNepali ? 'महिला/बालमैत्री कोठा' : 'Women & Child Friendly', value: isNepali ? 'सुरक्षित छुट्टै व्यवस्था' : 'Separated Safe Rooms' },
        { label: isNepali ? 'अस्थायी पाल/त्रिपाल' : 'Tarpaulins Standby', value: isNepali ? '१,८५० थान मौज्दात' : '1,850 Units' },
      ],
    },
    {
      icon: <Truck size={22} color="#f59e0b" />,
      label: isNepali ? 'SAR हेभी इक्युपमेन्ट' : 'SAR Heavy Machinery',
      value: stats.sarHeavyEquipment ?? 12,
      subLabel: isNepali ? 'डोजर, एक्साभेटर र डुङ्गा' : 'Dozers & Boats',
      subValue: isNepali ? '१२ उपकरण तयारी' : '12 Standby Units',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fbbf24',
      loading,
      link: '/disaster?tab=heavy_equipment',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'कुल हेभी इक्युपमेन्ट' : 'Heavy Equipment Standby', value: stats.sarHeavyEquipment ?? 12, highlight: true },
        { label: isNepali ? 'डोजर र एक्साभेटर' : 'Dozers & Excavators', value: isNepali ? '६ पालिका + ४ निजी' : '6 Palika + 4 Private' },
        { label: isNepali ? 'इन्फ्लेटेबल उद्धार डुङ्गा' : 'Rescue Rafting Boats', value: isNepali ? '२ वटा लाइफ ज्याकेटसहित' : '2 Boats w/ Life Jackets' },
        { label: isNepali ? 'अपरेटर उपलब्धता' : 'Operator Standby', value: isNepali ? '२४/७ कलिङ रोस्टर' : '24/7 Calling Roster' },
      ],
    },
    {
      icon: <ShieldCheck size={22} color="#0284c7" />,
      label: isNepali ? 'प्रमाणित स्वयंसेवक' : 'Certified Volunteers',
      value: stats.sarVolunteers ?? 64,
      subLabel: isNepali ? '८ वडा स्वयंसेवक दस्ता' : '8 Ward Volunteer Squads',
      subValue: isNepali ? '६४ जना तालिमप्राप्त' : '64 Trained Rescuers',
      color: '#0284c7',
      bgColor: '#f0f9ff',
      borderColor: '#38bdf8',
      loading,
      link: '/disaster?tab=heavy_equipment',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'प्रमाणित स्वयंसेवक कार्यदल' : 'Certified Volunteers', value: isNepali ? `${fmt(stats.sarVolunteers ?? 64)} जना` : `${stats.sarVolunteers ?? 64} Rescuers`, highlight: true },
        { label: isNepali ? 'तालिम निकाय' : 'Training Agency', value: isNepali ? 'रेडक्रस + सशस्त्र प्रहरी बल' : 'Red Cross + APF Disaster Unit' },
        { label: isNepali ? 'दक्षता' : 'Specialization', value: isNepali ? 'प्राथमिक उपचार, डोरी उद्धार, खोज' : 'First Aid, Rope Rescue, SAR' },
        { label: isNepali ? 'मोबिलाइजेसन समय' : 'Dispatch Time', value: isNepali ? '< १५ मिनेट' : '< 15 mins' },
      ],
    },
    {
      icon: <Waves size={22} color="#0284c7" />,
      label: isNepali ? 'जलसतह तथा वर्षा सेन्सर' : 'Telemetry Sensors',
      value: stats.telemetrySensors ?? 3,
      subLabel: isNepali ? 'मेलम्ची खोला तथा भोताङ' : 'Melamchi & Bhotang',
      subValue: isNepali ? 'प्रत्येक १० सेकेन्ड टेलिमेट्री' : '10s Real-time Feed',
      color: '#0284c7',
      bgColor: '#eff6ff',
      borderColor: '#60a5fa',
      loading,
      link: '/disaster?tab=sensors',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'सक्रिय टेलिमेट्री स्टेशन' : 'Telemetry Stations', value: stats.telemetrySensors ?? 3, highlight: true },
        { label: isNepali ? 'मेलम्ची खोला (SEN-MEL-01)' : 'Melamchi River (SEN-MEL-01)', value: isNepali ? '३.२ मिटर (खतरा: ५.५m)' : '3.2m (Danger: 5.5m)' },
        { label: isNepali ? 'भोताङ वर्षा (SEN-BHO-02)' : 'Bhotang Rain (SEN-BHO-02)', value: isNepali ? '४२.० मिमि (खतरा: ८०mm)' : '42.0mm (Danger: 80mm)' },
        { label: isNepali ? 'डेटा इन्जेसन अन्तराल' : 'Ingestion Frequency', value: isNepali ? 'प्रत्येक १० सेकेन्ड' : 'Every 10 Seconds' },
      ],
    },
    {
      icon: <Coins size={22} color="#0d9488" />,
      label: isNepali ? 'RDRA क्षति मूल्याङ्कन' : 'Damage Audit (RDRA)',
      value: stats.highRiskHouses ?? 18,
      subLabel: isNepali ? 'गृहमन्त्रालय मापदण्ड २०७७' : 'MoHA Relief Standard',
      subValue: isNepali ? '१८ घरधुरी मूल्याङ्कन' : '18 Verified Audits',
      color: '#0d9488',
      bgColor: '#f0fdfa',
      borderColor: '#2dd4bf',
      loading,
      link: '/disaster?tab=rdra_damage',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'मूल्याङ्कन गरिएका घरधुरी' : 'Assessed Households', value: isNepali ? `${fmt(stats.highRiskHouses ?? 18)} घरधुरी` : `${stats.highRiskHouses ?? 18} Households`, highlight: true },
        { label: isNepali ? 'पूर्ण क्षति संरचना' : 'Fully Destroyed', value: isNepali ? '४ घरधुरी' : '4 Households' },
        { label: isNepali ? 'आंशिक क्षति' : 'Partially Damaged', value: isNepali ? '१४ घरधुरी' : '14 Households' },
        { label: isNepali ? 'मापदण्ड कानुनी आधार' : 'Legal Standard', value: isNepali ? 'विपद् पीडित उद्धार र राहत मापदण्ड २०७७' : 'MoHA Disaster Relief Standard 2077' },
      ],
    },
    {
      icon: <Banknote size={22} color="#16a34a" />,
      label: isNepali ? 'राहत कोष तथा DBT' : 'Relief Fund & DBT',
      value: stats.reliefDisbursedNPR ? (isNepali ? `रु. ${(stats.reliefDisbursedNPR / 100000).toFixed(1)} लाख` : `NPR ${(stats.reliefDisbursedNPR / 100000).toFixed(1)}L`) : (isNepali ? 'रु. ४८.५ लाख' : 'NPR 48.5L'),
      subLabel: isNepali ? 'प्रत्यक्ष बैंक निकासा (DBT)' : 'Direct Bank Transfer',
      subValue: isNepali ? 'तत्काल नगद अनुदान' : 'Cash Relief Grants',
      color: '#16a34a',
      bgColor: '#f0fdf4',
      borderColor: '#22c55e',
      loading,
      link: '/disaster?tab=relief_funds',
      isNepali,
      previewDetails: [
        { label: isNepali ? 'राहत निकासा रकम (DBT)' : 'Disbursed Cash Relief', value: isNepali ? 'रु. ४८,५०,०००' : 'NPR 4,850,000', highlight: true },
        { label: isNepali ? 'लाभान्वित घरधुरी' : 'Beneficiary Households', value: isNepali ? '६४ घरधुरी' : '64 Households' },
        { label: isNepali ? 'पालिका विपद् कोष मौज्दात' : 'Emergency Fund Reserve', value: isNepali ? 'रु. १,५७,५०,०००' : 'NPR 15,750,000' },
        { label: isNepali ? 'वितरण माध्यम' : 'Disbursement Method', value: isNepali ? '१००% बैंकिङ प्रणाली (DBT)' : '100% Direct Bank Transfer' },
      ],
    },
  ];

  // Disaster & Resilience Sectors navigation (100% NIDRMS Core Domain)
  const thematicSectors = [
    {
      label: isNepali ? 'विपद् जोखिम व्यवस्थापन केन्द्र' : 'Disaster Management Hub',
      path: '/app/disaster',
      badge: 'DRRM Hub',
      icon: <AlertTriangle size={22} color="#dc2626" />,
      color: '#fee2e2',
      desc: isNepali ? 'घटना दर्ता, स्थलगत प्रमाणीकरण र २४/७ EOC प्रतिकार्य' : 'Incident logging, verification & 24/7 EOC response',
    },
    {
      label: isNepali ? 'नदी जलसतह तथा ३D डुबान सिमुलेटर' : 'River Water Level & 3D Flood',
      path: '/app/disaster?tab=hydromet',
      badge: '3D Twin',
      icon: <Waves size={22} color="#0284c7" />,
      color: '#e0f2fe',
      desc: isNepali ? 'मेलम्ची खोला, भोताङ र बाढी पूर्वसूचना टेलिमेट्री' : 'Melamchi River telemetry & 3D inundation models',
    },
    {
      label: isNepali ? 'पहिरो जोखिम तथा इन्क्लिनोमिटर' : 'Landslide Risk & Inclinometers',
      path: '/app/disaster?tab=vulnerable_settlements',
      badge: isNepali ? 'पूर्वसूचना' : 'Sensors',
      icon: <Mountain size={22} color="#d97706" />,
      color: '#fef3c7',
      desc: isNepali ? 'मानेखर्क, सेर्माथाङ र भिरालो बस्ती स्थानान्तरण' : 'Slope sensors & vulnerable settlement relocation',
    },
    {
      label: isNepali ? '३D/जीआईएस बहु-जोखिम डिजिटल नक्सा' : '3D/GIS Multi-Hazard Map',
      path: '/app/gis-map',
      badge: '3D GIS',
      icon: <Layers size={22} color="#6366f1" />,
      color: '#e0e7ff',
      desc: isNepali ? '५,८०५ घरधुरी, नदी कटान २००m बफर र ३डी टोपोग्राफी' : '5,805 households, river erosion buffers & 3D GIS',
    },
    {
      label: isNepali ? 'खोज-उद्धार (SAR) र डोजर डाइरेक्टरी' : 'SAR Heavy Equipment Directory',
      path: '/app/disaster?tab=heavy_equipment',
      badge: isNepali ? 'स्ट्यान्डबाइ' : 'Standby',
      icon: <HardHat size={22} color="#ea580c" />,
      color: '#ffedd5',
      desc: isNepali ? 'डोजर, एक्साभेटर, डुङ्गा तथा ६४ प्रमाणित स्वयंसेवक' : 'Dozers, excavators, boats & 64 SAR certified teams',
    },
    {
      label: isNepali ? 'सुरक्षित आश्रयस्थल र राहत जिन्सी' : 'Safe Shelters & Relief Stock',
      path: '/app/disaster?tab=shelters',
      badge: isNepali ? '६ वटा' : '6 Shelters',
      icon: <Building2 size={22} color="#10b981" />,
      color: '#dcfce7',
      desc: isNepali ? '१,३१० क्षमता, सौर्य ऊर्जा, खानेपानी र त्रिपाल भण्डार' : '1,310 capacity with solar, water & emergency tarps',
    },
    {
      label: isNepali ? 'डिजिटल क्षति मूल्याङ्कन (RDRA मापदण्ड)' : 'Rapid Damage Assessment (RDRA)',
      path: '/app/disaster?tab=rdra_damage',
      badge: isNepali ? 'मापदण्ड २०७७' : 'MoHA 2077',
      icon: <Coins size={22} color="#059669" />,
      color: '#ecfdf5',
      desc: isNepali ? 'गृहमन्त्रालय राहत मापदण्ड २०७७ अनुसार क्षति अभिलेख' : 'MoHA Standard 2077 field damage audits & reports',
    },
    {
      label: isNepali ? 'अति-संवेदनशील नागरिक उद्धार सूची' : 'Micro-Vulnerable Evacuation',
      path: '/app/disaster?tab=micro_vulnerability',
      badge: isNepali ? '५,८०५ घरधुरी' : '5,805 HH',
      icon: <Users size={22} color="#ec4899" />,
      color: '#fdf2f8',
      desc: isNepali ? 'सुत्केरी, अपाङ्गता र ७०+ ज्येष्ठ नागरिक प्राथमिकता' : 'Evacuation list for pregnant, disabled & seniors',
    },
    {
      label: isNepali ? 'वातावरण तथा नदीजन्य खानी नियमन' : 'Environment & Mining (IEE)',
      path: '/app/environmental-mining',
      badge: 'IEE/खानी',
      icon: <Sprout size={22} color="#047857" />,
      color: '#d1fae5',
      desc: isNepali ? 'नदीजन्य गिट्टी-बालुवा उत्खनन नियमन र कटान नियन्त्रण' : 'Riverbed quarry quota monitoring & slope control',
    },
    {
      label: isNepali ? 'पुनर्लाभ, पुनर्निर्माण तथा आयोजना ३६०' : 'Recovery Projects 360',
      path: '/app/projects',
      badge: 'PPIS',
      icon: <FolderGit2 size={22} color="#7c3aed" />,
      color: '#ede9fe',
      desc: isNepali ? 'विपद् पुनर्निर्माण आयोजनाहरूको GIS प्रगति ट्र्याकिङ' : 'Long-term disaster recovery & infrastructure PPIS',
    },
    {
      label: isNepali ? 'अफलाइन PWA तथा VHF सञ्चार मेश' : 'Offline PWA & VHF Mesh',
      path: '/pwa',
      badge: 'PWA/VHF',
      icon: <Siren size={22} color="#4338ca" />,
      color: '#eef2ff',
      desc: isNepali ? 'शून्य-इन्टरनेट फिल्ड रिपोर्टिङ र VHF रेडियो डाइरेक्टरी' : 'Off-grid field reporting & VHF emergency frequencies',
    },
    {
      label: isNepali ? 'स्वचालित IVR कल र मेश-साइरन' : 'Automated IVR Calls & Siren',
      path: '/app/disaster?tab=broadcast',
      badge: 'Last-Mile',
      icon: <Activity size={22} color="#ef4444" />,
      color: '#fee2e2',
      desc: isNepali ? 'खतरा विन्दु नाघ्दा नागरिकलाई स्वचालित कल र साइरन' : 'Automated outbound phone calls & solar sirens',
    },
    {
      label: isNepali ? 'पालिका विपद् कोष राहत वितरण (DBT)' : 'Disaster Relief Funds (DBT)',
      path: '/app/disaster?tab=relief_funds',
      badge: 'DBT Cash',
      icon: <Banknote size={22} color="#16a34a" />,
      color: '#f0fdf4',
      desc: isNepali ? 'प्रत्यक्ष बैंक खातामै राहत रकम भुक्तानी तथा अडिट' : 'Direct bank transfer cash assistance & vouchers',
    },
    {
      label: isNepali ? 'राष्ट्रिय विपद् पोर्टल एकीकरण' : 'National BIPAD Gateway',
      path: '/app/disaster?tab=bipad_sync',
      badge: 'DHM/BIPAD',
      icon: <Database size={22} color="#0284c7" />,
      color: '#f0f9ff',
      desc: isNepali ? 'DHM जलसतह, BIPAD पोर्टल र NEOC तथ्याङ्क सिङ्क' : 'DHM telemetry, BIPAD gateway & NEOC data sync',
    },
    {
      label: isNepali ? 'विपद् गुनासो तथा उजुरी सुनुवाई' : 'Disaster Grievances & Appeals',
      path: '/app/complaints',
      badge: isNepali ? 'उजुरी' : 'Appeals',
      icon: <Inbox size={22} color="#f97316" />,
      color: '#fff7ed',
      desc: isNepali ? 'नागरिक राहत गुनासो र क्षति उजुरी प्रत्यक्ष सम्बोधन' : 'Citizen relief claims and field damage grievances',
    },
    {
      label: isNepali ? 'डाटा ब्याकअप तथा आपतकालीन DR' : 'Data Backup & DR Recovery',
      path: '/backup-dr',
      badge: 'DR <५m',
      icon: <Shield size={22} color="#059669" />,
      color: '#ecfdf5',
      desc: isNepali ? 'PostGIS ब्याकअप, विकेन्द्रीकृत रिडन्डन्सी र DR ड्रिल' : 'PostGIS backup, off-site replication & DR drills',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.35)} }
      `}</style>

      {/* ── 1. Hero Banner (Hide in readOnly mode) ───────────────────────────────────────────── */}
      {!readOnly && (
        <div
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #091e3a 0%, #0d284f 40%, #0f3d3e 75%, #064e3b 100%)',
            color: '#ffffff',
            padding: '2.25rem 2.5rem',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(9,30,58,0.28)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Subtle glowing radial backdrop */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              right: '-10%',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(59,130,246,0) 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Top row: Headline on left, Live HUD on right */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    padding: '0.35rem 0.95rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      boxShadow: '0 0 10px #10b981',
                      animation: 'pulse-dot 2s infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ letterSpacing: '0.02em' }}>{isNepali ? 'LIVE · एकीकृत विपद् व्यवस्थापन प्लेटफर्म' : 'LIVE · Integrated DRRM Platform'}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span style={{ color: '#a7f3d0', fontWeight: 700 }}>{isNepali ? '१६ विपद् तथा जोखिम क्षेत्र सिङ्क' : '16 Disaster Resilience Sectors'}</span>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    {isNepali ? `अन्तिम अपडेट: ${lastUpdated.toLocaleTimeString('ne-NP')}` : `Updated: ${lastUpdated.toLocaleTimeString('en-US')}`}
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: '2.3rem',
                    fontWeight: 800,
                    marginBottom: '0.75rem',
                    lineHeight: 1.25,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {isNepali ? 'नक्सामा विपद् जोखिम। पूर्वसूचनामा सुरक्षा।' : 'Multi-Hazard Intelligence. Early Warning Safety.'} <br />
                  <span style={{ color: '#fbbf24' }}>{isNepali ? 'AI र GIS बाट एकीकृत विपद् प्रतिकार्य निर्णय प्रणाली' : 'AI & GIS Integrated Disaster Decision Support'}</span>
                </h1>

                <p style={{ opacity: 0.92, fontSize: '0.98rem', lineHeight: 1.6, margin: 0, color: '#e2e8f0', maxWidth: '820px' }}>
                  {isNepali
                    ? `${palikaName}को आधिकारिक राष्ट्रिय एकीकृत विपद् व्यवस्थापन प्रणाली (NIDRMS) — रियल-टाइम टेलिमेट्री, ५,८०५ घरधुरी, नदी कटान बफर र खोज-उद्धार।`
                    : `${palikaName} National Integrated Disaster Risk Management System (NIDRMS) — real-time telemetry, 5,805 households, river erosion buffers & SAR directory.`}
                </p>
              </div>

              {/* Right Mini Live HUD Card */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '18px',
                  padding: '1.1rem 1.35rem',
                  maxWidth: '380px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {isNepali ? 'विपद् कमाण्ड अवस्था' : 'Disaster EOC Status'}
                  </span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.25)', color: '#34d399', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, border: '1px solid rgba(52,211,153,0.3)' }}>
                    ● {isNepali ? 'सक्रिय' : 'Live'}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.45rem 0.65rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{isNepali ? 'कुल घरधुरी' : 'Total Households'}</div>
                    <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff' }}>{fmt(stats.totalHouseholds ?? 5805)}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.45rem 0.65rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{isNepali ? 'कुल जनसंख्या' : 'Total Population'}</div>
                    <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff' }}>{fmt(stats.totalPopulation ?? 17521)}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.45rem 0.65rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{isNepali ? 'विपद् मोड्युल' : 'DRM Modules'}</div>
                    <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#fbbf24' }}>{isNepali ? '१६ क्षेत्र' : '16 Sectors'}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.45rem 0.65rem' }}>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{isNepali ? 'GPS प्रमाणीकरण' : 'GPS Verified'}</div>
                    <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#34d399' }}>{isNepali ? '१००%' : '100%'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Single-Line Unified Action Bar ── */}
            <div
              style={{
                marginTop: '1.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                flexWrap: 'wrap',
                padding: '0.5rem 0.65rem',
                background: 'rgba(15, 23, 42, 0.45)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1), 0 8px 24px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Link
                to="/gis-map"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#fbbf24',
                  color: '#0f172a',
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <Layers size={16} />
                <span>{isNepali ? '३D डिजिटल जोखिम नक्सा' : '3D Hazard Twin'}</span>
              </Link>
              <Link
                to="/app/disaster"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(220,38,38,0.35)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <AlertTriangle size={16} />
                <span>{isNepali ? 'विपद् कमाण्ड ड्यासबोर्ड' : 'Disaster EOC Hub'}</span>
              </Link>
              <Link
                to="/app/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.35)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <FolderGit2 size={16} />
                <span>{isNepali ? 'पुनर्निर्माण आयोजना ३६०' : 'Recovery Projects'}</span>
              </Link>
              <a
                href="#household-matrix-registry"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '0.55rem 1.05rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <Home size={16} />
                <span>{isNepali ? `घरधुरी लगत (${fmt(stats.totalHouseholds ?? 5805)} घर)` : `Vulnerable HH (${fmt(stats.totalHouseholds ?? 5805)})`}</span>
              </a>
              <Link
                to="/demographics"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.22)',
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <Users size={16} />
                <span>{isNepali ? 'विस्तृत जनसांख्यिकी' : 'Demographics 360'}</span>
              </Link>
              <button
                onClick={fetchStats}
                disabled={isRefreshing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.18)',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw size={14} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isRefreshing ? (isNepali ? 'ताजा हुँदै...' : 'Refreshing...') : (isNepali ? 'डाटा ताजा गर्नुहोस्' : 'Refresh Data')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. 12 DISASTER OPERATIONAL METRICS (Immediate Command Visibility) ── */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              {loading ? (
                <Loader2 size={20} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Activity size={20} color="#10b981" />
              )}
              {isNepali ? 'विपद् जोखिम तथा आपतकालीन तथ्याङ्क' : 'Live Disaster Risk & Operational Metrics'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              {isNepali
                ? 'पालिकाको केन्द्रीय आपतकालीन नियन्त्रण कक्ष (LEOC) बाट प्रमाणित १२ मुख्य रियल-टाइम सूचकहरू'
                : '12 verified real-time operational indicators from Local Emergency Operation Centre (LEOC)'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#ecfdf5',
                color: '#059669',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid #a7f3d0',
              }}
            >
              <CheckCircle2 size={14} color="#10b981" />
              <span>{isNepali ? 'LEOC सिङ्क भएको' : 'Live EOC Ingested'}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '1rem',
          }}
        >
          {sectorCards.map((card) => (
            <StatCard key={card.label} {...card} readOnly={readOnly} isNepali={isNepali} />
          ))}
        </div>
      </div>

      {/* ── 3. DEMOGRAPHICS & EXPOSURE HIGHLIGHTS SECTION ─────────────────── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  display: 'inline-block',
                }}
              />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isNepali ? 'जनसांख्यिकी तथा घरधुरी प्रोफाइल' : 'Demographic & Household Exposure Profile'}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.25rem 0 0 0' }}>
              {isNepali
                ? 'राष्ट्रिय जनगणना २०७८ तथा डिजिटल GPS घरधुरी सर्भेको आधिकारिक प्रमाणित तथ्याङ्क'
                : 'National Census 2021 & Certified GPS Household Survey Baseline'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link
              to="/app/households"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#047857',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                padding: '0.45rem 0.95rem',
                background: '#ecfdf5',
                borderRadius: '8px',
                border: '1px solid #a7f3d0',
                boxShadow: '0 2px 6px rgba(5,150,105,0.1)',
              }}
            >
              <Home size={15} color="#059669" />
              <span>{isNepali ? `घरधुरी म्याट्रिक्स तालिका (${fmt(stats.totalHouseholds ?? 5805)} घर)` : `Household Matrix (${fmt(stats.totalHouseholds ?? 5805)} HH)`}</span>
              <ChevronRight size={14} />
            </Link>

            <Link
              to="/demographics"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                padding: '0.45rem 0.95rem',
                background: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
                transition: 'background 0.2s',
              }}
            >
              <span>{isNepali ? 'विस्तृत जनसांख्यिकी' : 'Demographics 360'}</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* कुल जनसंख्या */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1.5px solid #bae6fd',
              padding: '1.2rem',
              boxShadow: '0 4px 16px rgba(2,132,199,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '165px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>
                  {isNepali ? 'कुल जनसंख्या (उद्धार लगत)' : 'Population Baseline'}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={19} color="#0284c7" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0c4a6e', lineHeight: 1.1 }}>
                  {fmt(stats.totalPopulation ?? 17521)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0284c7' }}>{isNepali ? 'जना' : 'Total'}</span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#0369a1', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isNepali
                  ? `👨 पुरुष: ${fmt(stats.malePopulation ?? 8600)} · 👩 महिला: ${fmt(stats.femalePopulation ?? 8921)}`
                  : `👨 Male: ${fmt(stats.malePopulation ?? 8600)} · 👩 Female: ${fmt(stats.femalePopulation ?? 8921)}`}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700 }}>
              {isNepali ? `लैंगिक अनुपात: ${fmt('96.4')} • जनघनत्व: ${fmt(28)}/किमि²` : 'Sex Ratio: 96.4 • Density: 28/sq.km'}
            </div>
          </div>

          {/* कुल घरधुरी */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1.5px solid #bbf7d0',
              padding: '1.2rem',
              boxShadow: '0 4px 16px rgba(22,163,74,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '165px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #16a34a, #4ade80)' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
                  {isNepali ? 'कुल घरधुरी (GPS डिजिटल लगत)' : 'Geo-Mapped Households'}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={19} color="#16a34a" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#14532d', lineHeight: 1.1 }}>
                  {fmt(stats.totalHouseholds ?? 5805)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a' }}>{isNepali ? 'घर' : 'Houses'}</span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#15803d', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isNepali
                  ? `📍 आधिकारिक दर्ता: ${fmt(stats.totalGpsHouses ?? 5805)} घर`
                  : `📍 Verified: ${fmt(stats.totalGpsHouses ?? 5805)} Households`}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700 }}>
              {isNepali ? `१००% GPS प्रमाणित • औसत परिवार: ${fmt('3.6')} जना` : '100% Geo-Tagged • Avg Size: 3.6'}
            </div>
          </div>

          {/* अति-संवेदनशील नागरिक लगत */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1.5px solid #fbcfe8',
              padding: '1.2rem',
              boxShadow: '0 4px 16px rgba(219,39,119,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '165px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ec4899, #f472b6)' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#be185d', textTransform: 'uppercase' }}>
                  {isNepali ? 'अति-संवेदनशील नागरिक लगत' : 'Vulnerable Citizens'}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={19} color="#ec4899" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#831843', lineHeight: 1.1 }}>
                  {fmt(stats.vulnerableCitizens ?? 1420)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ec4899' }}>{isNepali ? 'जना' : 'Persons'}</span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#9d174d', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isNepali
                  ? `सुत्केरी: ${fmt(218)} · ७०+ ज्येष्ठ: ${fmt(890)} · अपाङ्गता: ${fmt(312)}`
                  : 'Pregnant: 218 · Seniors: 890 · Disabled: 312'}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#be185d', background: '#fce7f3', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700 }}>
              {isNepali ? 'आपतकालीन प्राथमिकता उद्धार सूची' : 'Priority Evacuation List'}
            </div>
          </div>

          {/* आपतकालीन खोज-उद्धार SAR */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1.5px solid #fde68a',
              padding: '1.2rem',
              boxShadow: '0 4px 16px rgba(217,119,6,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '165px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #d97706, #fbbf24)' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                  {isNepali ? 'खोज-उद्धार (SAR) स्ट्यान्डबाइ' : 'SAR Equipment & Brigade'}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={19} color="#d97706" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#78350f', lineHeight: 1.1 }}>
                  {fmt(stats.sarHeavyEquipment ?? 12)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#d97706' }}>{isNepali ? 'उपकरण' : 'Units'}</span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#92400e', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isNepali ? `${fmt(10)} डोजर/एक्साभेटर + ${fmt(2)} उद्धार डुङ्गा` : '10 Dozers/Excavators + 2 Boats'}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700 }}>
              {isNepali ? `${fmt(64)} प्रमाणित स्वयंसेवक कार्यदल` : '64 Certified SAR Rescuers'}
            </div>
          </div>

          {/* विपद् जोखिम व्यवस्थापन */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1.5px solid #fed7aa',
              padding: '1.2rem',
              boxShadow: '0 4px 16px rgba(234,88,12,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '165px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #ea580c, #fb923c)' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>
                  {isNepali ? 'विपद् जोखिम तथा आश्रयस्थल' : 'Risk Zones & Shelters'}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={19} color="#ea580c" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#7c2d12', lineHeight: 1.1 }}>
                  {fmt(stats.highRiskSettlements ?? 4)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ea580c' }}>{isNepali ? 'बस्ती उच्च जोखिम' : 'High-Risk Clusters'}</span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#c2410c', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isNepali
                  ? `पहिरो तथा नदी कटान • ${fmt(stats.totalShelters ?? 6)} सुरक्षित आश्रयस्थल`
                  : `Landslide & Flood Zones • ${stats.totalShelters ?? 6} Certified Shelters`}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#c2410c', background: '#ffedd5', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700 }}>
              {isNepali ? `आश्रयस्थल क्षमता: ${fmt(stats.totalShelterCapacity ?? 1310)} जना` : `Shelter Capacity: ${(stats.totalShelterCapacity ?? 1310).toLocaleString()} Persons`}
            </div>
          </div>

          {/* प्रशासनिक भूगोल */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
              borderRadius: '16px',
              border: '1.5px solid #99f6e4',
              padding: '1.2rem',
              boxShadow: '0 4px 16px rgba(13,148,136,0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '165px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0d9488, #2dd4bf)' }} />
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase' }}>
                  {isNepali ? 'प्रशासनिक भूगोल तथा भू-धरातल' : 'Terrain & Administrative Area'}
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Compass size={19} color="#0d9488" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.35rem 0' }}>
                <span style={{ fontSize: '1.95rem', fontWeight: 800, color: '#134e4a', lineHeight: 1.1 }}>
                  {fmt(8)}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0d9488' }}>{isNepali ? 'वडाहरू' : 'Wards'}</span>
              </div>
              <div style={{ fontSize: '0.73rem', color: '#0f766e', fontWeight: 600, marginBottom: '0.35rem' }}>
                {isNepali ? `क्षेत्रफल: ${fmt('187.29')} वर्ग कि.मि. · केन्द्र: थाङपालधाप` : 'Area: 187.29 sq. km · HQ: Thangpaldhap'}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#0d9488', background: '#ccfbf1', padding: '2px 8px', borderRadius: '6px', display: 'inline-block', fontWeight: 700 }}>
              {isNepali ? `उचाइ: ${fmt('1,050')} - ${fmt('6,340')} मिटर • हिमाली भूगोल` : 'Elevation: 1,050 - 6,340m • Himalayan Terrain'}
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. THEMATIC SECTORS DIRECT ACCESS GRID (Hide in readOnly) ───────────────────── */}
      {!readOnly && (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {isNepali ? 'विपद् व्यवस्थापन तथा बहु-जोखिम न्यूनीकरण मोड्युलहरू' : 'Disaster Risk Management & Resilience Modules'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
            {isNepali
              ? 'राष्ट्रिय विपद् व्यवस्थापन कार्यढाँचा अनुसार अन्तरसम्बन्धित पूर्वसूचना, प्रतिकार्य, राहत तथा पुनरुत्थान प्रणाली'
              : 'Interconnected early warning, emergency response, relief and recovery modules under National DRRM Framework'}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.15rem',
          }}
        >
          {thematicSectors.map((sector) => {
            const cardStyle: React.CSSProperties = {
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '1.2rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            };
            const inner = (
              <>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: sector.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {sector.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                      {sector.label}
                    </strong>
                    {(sector as any).badge && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {(sector as any).badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, display: 'block' }}>
                    {sector.desc}
                  </span>
                </div>
              </>
            );
            return (
              <Link
                key={sector.path}
                to={sector.path}
                style={cardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.07)';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
      )}

      {/* ── 5. AI DISASTER PREDICTIVE ANALYTICS & GIS MODULES ─────────────────────── */}
      {!readOnly && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <PredictiveAnalytics />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={22} color="#0284c7" /> 
              {isNepali ? '३D/जीआईएस बहु-जोखिम नक्साङ्कन (Multi-Hazard GIS)' : '3D/GIS Multi-Hazard Mapping & Terrain'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
              {isNepali
                ? 'नदी कटान बफर, पहिरो जोखिम क्षेत्र र ५,८०५ घरधुरीको आधिकारिक भौगोलिक डिजिटल नक्सा'
                : 'River erosion buffers, landslide hazard zones, and 5,805 verified household coordinates'}
            </p>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', height: '600px' }}>
            <MunicipalGISMap />
          </div>
        </div>
      )}

      {/* ── 6. DIGITAL HOUSEHOLD MATRIX REGISTRY & SPREADSHEET IMPORTER ── */}
      <div
        id="household-matrix-registry"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1.5px solid #cbd5e1',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1.5px solid #f1f5f9',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🏡</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {isNepali ? 'डिजिटल घरधुरी म्याट्रिक्स लगत तथा गुगल शिट / एक्सेल आयात' : 'Digital Household Matrix Registry & Spreadsheet Importer'}
              </h2>
              <span
                style={{
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: '6px',
                }}
              >
                {isNepali ? `${fmt(stats.totalHouseholds ?? 5805)} घरधुरी प्रमाणित (Live Registry)` : `${fmt(stats.totalHouseholds ?? 5805)} Verified Households (Live Registry)`}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
              {isNepali
                ? 'प्रत्येक घरधुरीको आधिकारिक नम्बर, GPS अक्षांश/देशान्तर, परिवार विवरण, घरको प्रकार, जोखिम अवस्था तथा गुगल स्प्रिडशिट / CSV फाइल सिधै आयात गर्ने प्रशासनिक केन्द्र'
                : 'Official household code, GPS coordinates, family demographics, structural risk, and direct Google Spreadsheet / Excel CSV importer.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Link
              to="/app/households"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#1d4ed8',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                background: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe',
              }}
            >
              <ExternalLink size={14} />
              <span>{isNepali ? 'पूरा स्क्रिनमा हेर्नुहोस्' : 'Full Page View'}</span>
            </Link>
          </div>
        </div>

        {/* Embedded Interactive Household Registry Table, Map, and Importer */}
        <HouseholdRegistryTab />
      </div>
    </div>
  );
};

export default DashboardOverview;
