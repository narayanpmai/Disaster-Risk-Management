import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { useAuth } from '../../context/AuthContext';
import { useDisasterScope } from '../../context/DisasterScopeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Search,
  Bell,
  ExternalLink,
  LogOut,
  HelpCircle,
  ChevronDown,
  Calendar,
  Shield,
  User,
  Building2,
  Briefcase,
  Coins,
  Landmark,
  WifiOff,
} from 'lucide-react';
import { adToBs } from '../../utils/nepaliCalendar';

// ── Navbar Design Tokens ────────────────────────────────────────────
const N = {
  bg: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
  primary: '#0284c7',
  primaryLight: '#e0f2fe',
  height: '64px',
};

interface NavbarProps {
  isPublic?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isPublic = false }) => {
  const { settings, tenantId } = useTenant();
  const { user, logout } = useAuth();
  const { activePalika, activeTier, selectedWardNumber, setIsScopeModalOpen } = useDisasterScope();
  const { t, isNepali } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);
  const portalMenuRef = useRef<HTMLDivElement>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Palika name
  let tenantPalikaName = settings?.palika_name;
  if (!tenantPalikaName) {
    try {
      const storedTenants = JSON.parse(localStorage.getItem('p5_tenants_list') || '[]');
      const match = storedTenants.find((t: any) => t.id === tenantId || t.code === tenantId);
      if (match && match.name) tenantPalikaName = match.name;
    } catch (e) {}
  }
  const palikaName = tenantPalikaName || (isNepali
    ? 'विपद् जोखिम व्यवस्थापन तथा बहुक्षेत्रीय जोखिम मूल्याङ्कन प्रणाली'
    : 'Disaster Risk Management & Multi-Sectoral Risk Assessment System');
  const slogan = settings?.slogan || (isNepali
    ? 'नेपालका जोखिमयुक्त बस्ती, पूर्वाधार आयोजना पहिचान तथा विपद् न्यूनीकरण प्लेटफर्म'
    : 'National Platform for Vulnerable Settlements, Infrastructure & Disaster Mitigation');

  // Today's Nepali date
  const todayAD = new Date();
  const todayAdStr = todayAD.toISOString().split('T')[0];
  const nepaliDateStr = (() => {
    try {
      return adToBs(todayAdStr);
    } catch {
      return null;
    }
  })();
  const nepaliParts = nepaliDateStr ? nepaliDateStr.split('-') : null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (portalMenuRef.current && !portalMenuRef.current.contains(e.target as Node)) {
        setPortalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Role display
  const roleLabel: Record<string, string> = {
    super_admin: isNepali ? 'सुपर एडमिन' : 'Super Admin',
    admin: isNepali ? 'पालिका एडमिन' : 'Palika Admin',
    cao: isNepali ? 'प्रमुख प्रशासकीय' : 'Chief Officer',
    planning_officer: isNepali ? 'योजना अधिकृत' : 'Planning Officer',
    revenue_officer: isNepali ? 'राजस्व अधिकृत' : 'Revenue Officer',
    ward_user: isNepali ? 'वडा सचिव' : 'Ward Secretary',
    it_admin: isNepali ? 'IT अधिकृत' : 'IT Admin',
    disaster_officer: isNepali ? 'विपद् अधिकृत' : 'Disaster Officer',
  };
  const roleColor: Record<string, string> = {
    super_admin: '#dc2626',
    admin: '#2563eb',
    cao: '#7c3aed',
    it_admin: '#4f46e5',
    ward_user: '#0891b2',
  };

  const userRole = user?.role || 'admin';
  const roleBadgeColor = roleColor[userRole] || '#0284c7';
  const roleBadgeLabel = roleLabel[userRole] || userRole.toUpperCase();

  return (
    <header
      style={{
        height: N.height,
        backgroundColor: N.bg,
        borderBottom: `1px solid ${N.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        gap: '1rem',
      }}
    >
      {/* ── Left: Brand ────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        {settings?.logo_url ? (
          <img
            src={settings.logo_url}
            alt="Logo"
            style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '8px' }}
          />
        ) : (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d2757, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(2,132,199,0.35)',
            }}
          >
            DRM
          </div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: N.text, lineHeight: 1.2 }}>
            {palikaName}
          </div>
          <div className="dt-hide-on-mobile" style={{ fontSize: '0.7rem', color: N.textMuted, lineHeight: 1.3 }}>
            {slogan}
          </div>
        </div>
      </div>

      {/* ── Center: Search + Date ───────────────────────────── */}
      <div className="dt-navbar-search" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '520px' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: N.textMuted,
            }}
          />
          <input
            type="text"
            placeholder={isNepali ? "सेवा, संस्था, योजना खोज्नुहोस्..." : "Search services, projects, flood alerts..."}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2rem',
              border: `1px solid ${N.border}`,
              borderRadius: '8px',
              fontSize: '0.825rem',
              color: N.text,
              backgroundColor: '#f8fafc',
              outline: 'none',
            }}
          />
        </div>

        {/* Nepali Date Badge */}
        {nepaliParts && (
          <div
            className="dt-hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              fontSize: '0.775rem',
              color: '#0369a1',
              fontWeight: 600,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <Calendar size={13} />
            <span>वि.सं. {nepaliParts[0]}/{nepaliParts[1]}/{nepaliParts[2]}</span>
          </div>
        )}
      </div>

      {/* ── Right: Actions ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

        {/* Offline Vault Status Indicator when off-grid */}
        {!isOnline && (
          <Link
            to="/disaster?tab=offline_mesh"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: '#fff7ed',
              border: '1.5px solid #ea580c',
              color: '#c2410c',
              fontSize: '0.74rem',
              fontWeight: 800,
              textDecoration: 'none',
              animation: 'pulse 2s infinite',
            }}
            title="इन्टरनेट विच्छेद - स्थानीय IndexedDB भण्डार सक्रिय"
          >
            <WifiOff size={14} color="#ea580c" />
            <span>{isNepali ? 'अफलाइन भण्डार' : 'Offline Vault'}</span>
          </Link>
        )}

        {/* National Governance & 6-Tier Scope Switcher Pill */}
        <button
          onClick={() => setIsScopeModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            backgroundColor: activeTier.bgColor,
            border: `1.5px solid ${activeTier.borderColor}`,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: `0 2px 6px ${activeTier.borderColor}`,
          }}
          title="राष्ट्रिय विपद् अधिकार तथा बहु-स्थानीय तह क्षेत्राधिकार व्यवस्थापन (NEOC / DEOC / LEOC / वडा)"
        >
          <span
            style={{
              backgroundColor: activeTier.badgeColor,
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 900,
              padding: '1px 5px',
              borderRadius: '4px',
            }}
          >
            T{activeTier.tierLevel}
          </span>
          <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
            <div className="dt-scope-palika-name" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
              {isNepali ? activePalika.nameNepali : activePalika.nameEnglish}
            </div>
            <div className="dt-scope-subtext" style={{ fontSize: '0.68rem', color: activeTier.textColor, fontWeight: 700, whiteSpace: 'nowrap' }}>
              {isNepali ? activeTier.badgeLabel : activeTier.tierLevel === 6 ? 'NEOC National' : activeTier.nameEnglish} {activeTier.tierLevel === 1 ? `(${isNepali ? 'वडा' : 'Ward'} ${selectedWardNumber})` : ''}
            </div>
          </div>
          <ChevronDown size={13} color={activeTier.textColor} />
        </button>

        {/* Bilingual Language Switcher (नेपाली / English) */}
        <LanguageSwitcher />

        {/* Notification Bell */}
        <button
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            backgroundColor: 'transparent', border: `1px solid ${N.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: N.textMuted, position: 'relative',
            transition: 'all 0.15s ease',
          }}
          title="सूचनाहरू"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <Bell size={16} />
          {/* Unread dot */}
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#ef4444', border: '2px solid white',
          }} />
        </button>

        {/* FAQ Help */}
        <Link
          to="/faq-help"
          className="dt-hide-on-mobile"
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            backgroundColor: 'transparent', border: `1px solid ${N.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: N.textMuted, textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
          title="मद्दत तथा FAQ"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
        >
          <HelpCircle size={16} />
        </Link>

        {/* Admin / Public Portal Switcher */}
        {isPublic && (
          <Link
            to="/pwa"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              border: '1.5px solid #38bdf8',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#0369a1',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              backgroundColor: '#f0f9ff',
            }}
            title={isNepali ? "नागरिक मोबाइल एप (PWA: अफलाइन बडापत्र र SOS साइरन)" : "Citizen Mobile App (Offline PWA & SOS Siren)"}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#e0f2fe';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff';
            }}
          >
            <span>📱</span>
            <span>{isNepali ? 'नागरिक एप (PWA)' : 'Citizen PWA'}</span>
          </Link>
        )}
        {/* Integrated Digital Portals Dropdown */}
        {isPublic && (
          <div style={{ position: 'relative' }} ref={portalMenuRef}>
            <button
              onClick={() => setPortalMenuOpen(!portalMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1e293b',
                backgroundColor: portalMenuOpen ? '#f1f5f9' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={isNepali ? "विपद् तथा जोखिम व्यवस्थापन मोड्युलहरू" : "Disaster & Hazard Modules"}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#94a3b8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = portalMenuOpen ? '#f1f5f9' : '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
            >
              <Building2 size={14} color="#0284c7" />
              <span>{isNepali ? 'विपद् तथा जोखिम मोड्युल' : 'Disaster Modules'}</span>
              <ChevronDown
                size={14}
                style={{
                  color: '#64748b',
                  transform: portalMenuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {portalMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '290px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  zIndex: 250,
                  padding: '0.45rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <Link
                  to="/disaster"
                  onClick={() => setPortalMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    <Building2 size={15} />
                  </div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>
                      {isNepali ? 'विपद् जोखिम व्यवस्थापन' : 'Disaster Risk Management'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {isNepali ? 'घटना, पूर्वसूचना, राहत तथा आश्रयस्थल' : 'Incidents, Early Warning & Shelters'}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/gis-map"
                  onClick={() => setPortalMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#eff6ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: '#dbeafe', color: '#2563eb' }}>
                    <Coins size={15} />
                  </div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>
                      {isNepali ? '३डी/जीआईएस विपद् नक्सा' : '3D/GIS Hazard Twin'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {isNepali ? 'जोखिम क्षेत्र, बफर तथा बस्ती म्यापिङ' : 'Hazard Zones, 200m Buffers & GIS'}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/environmental-mining"
                  onClick={() => setPortalMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                    <Briefcase size={15} />
                  </div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>
                      {isNepali ? 'वातावरण तथा नदीजन्य खानी (IEE)' : 'Environment & Mining (IEE)'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {isNepali ? 'गिट्टी, बालुवा खानी तथा कटान नियन्त्रण' : 'Quarry Quotas & River Erosion'}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/projects"
                  onClick={() => setPortalMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fefce8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: '#fef08a', color: '#ca8a04' }}>
                    <Landmark size={15} />
                  </div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>
                      {isNepali ? 'पुनर्निर्माण तथा आयोजना चक्र' : 'Recovery Projects 360'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {isNepali ? 'विपद् पुनर्निर्माण तथा पूर्वाधार आयोजना' : 'Disaster Reconstruction & Projects'}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/backup-dr"
                  onClick={() => setPortalMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0fdf4'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                    <Shield size={15} />
                  </div>
                  <div>
                    <div style={{ color: '#0f172a', fontWeight: 700 }}>
                      {isNepali ? 'डाटा ब्याकअप तथा DR रिकभरी' : 'Data Backup & DR Recovery'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {isNepali ? 'PostGIS ब्याकअप तथा RPO/RTO ड्रिल' : 'PostGIS Backups & DR Drills'}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}
        {isPublic && user && (
          <Link
            to="/app"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              border: '1px solid #93c5fd',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#1d4ed8',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              backgroundColor: '#eff6ff',
            }}
            title={isNepali ? "प्रशासन ड्यासबोर्ड खोल्नुहोस्" : "Open Admin Dashboard"}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#dbeafe';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#eff6ff';
            }}
          >
            <Shield size={14} color="#1d4ed8" />
            <span>{isNepali ? 'प्रशासन ड्यासबोर्ड' : 'Admin Dashboard'}</span>
          </Link>
        )}
        {!isPublic && (
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              border: `1px solid ${N.border}`,
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: N.text,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              backgroundColor: '#f8fafc',
            }}
            title={isNepali ? "सार्वजनिक पोर्टल हेर्नुहोस्" : "View Public Portal"}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
            }}
          >
            <ExternalLink size={14} color="#0284c7" />
            <span>{isNepali ? 'सार्वजनिक पोर्टल' : 'Public Portal'}</span>
          </Link>
        )}

        {/* User Menu */}
        {user && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.75rem 0.4rem 0.5rem',
                backgroundColor: userMenuOpen ? '#f0f9ff' : 'transparent',
                border: `1px solid ${userMenuOpen ? '#bae6fd' : N.border}`,
                borderRadius: '10px', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={`${user.email} (${user.role})`}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: `linear-gradient(135deg, ${roleBadgeColor}, #0284c7)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {(user.fullName || user.email).charAt(0).toUpperCase()}
              </div>
              {/* Name + Role */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: N.text, lineHeight: 1.2 }}>
                  {user.fullName || user.email.split('@')[0]}
                </div>
                <div style={{ fontSize: '0.68rem', color: roleBadgeColor, fontWeight: 600, lineHeight: 1.2 }}>
                  {roleBadgeLabel}
                </div>
              </div>
              <ChevronDown size={14} style={{ color: N.textMuted, transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  width: '220px',
                  backgroundColor: '#ffffff',
                  border: `1px solid ${N.border}`,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  zIndex: 200,
                  overflow: 'hidden',
                  animation: 'slideDown 0.15s ease',
                }}
              >
                {/* User Info Header */}
                <div style={{ padding: '0.875rem 1rem', borderBottom: `1px solid ${N.border}` }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: N.text }}>
                    {user.fullName || 'Admin User'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: N.textMuted, marginTop: '2px' }}>
                    {user.email}
                  </div>
                  <div
                    style={{
                      display: 'inline-block', marginTop: '6px',
                      padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem',
                      fontWeight: 700, backgroundColor: `${roleBadgeColor}18`,
                      color: roleBadgeColor,
                    }}
                  >
                    {roleBadgeLabel}
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '0.5rem' }}>
                  <Link
                    to="/palika-settings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.625rem',
                      padding: '0.55rem 0.75rem', borderRadius: '8px',
                      textDecoration: 'none', fontSize: '0.825rem', color: N.text,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    <User size={15} style={{ color: N.textMuted }} />
                    {isNepali ? 'प्रोफाइल सेटिङ' : 'Profile Settings'}
                  </Link>

                  {user.role === 'super_admin' && (
                    <Link
                      to="/super-admin"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.55rem 0.75rem', borderRadius: '8px',
                        textDecoration: 'none', fontSize: '0.825rem', color: '#2563eb',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#eff6ff'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <Shield size={15} />
                      {isNepali ? 'सुपर एडमिन कन्सोल' : 'Super Admin Console'}
                    </Link>
                  )}

                  <div style={{ borderTop: `1px solid ${N.border}`, marginTop: '4px', paddingTop: '4px' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.55rem 0.75rem', borderRadius: '8px', width: '100%',
                        fontSize: '0.825rem', fontWeight: 500, color: '#ef4444',
                        backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                        transition: 'background 0.15s', textAlign: 'left',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#fef2f2'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                    >
                      <LogOut size={15} />
                      {isNepali ? 'लगआउट गर्नुहोस्' : 'Logout'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Login Button for Public */}
        {isPublic && !user && (
          <Link
            to="/login"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '8px',
              background: '#0284c7', color: '#ffffff',
              fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(2,132,199,0.3)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#026ca3'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#0284c7'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <User size={14} />
            {isNepali ? 'कर्मचारी लगइन' : 'Staff Login'}
          </Link>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};
