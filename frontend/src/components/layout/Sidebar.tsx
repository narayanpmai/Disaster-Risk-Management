import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  AlertTriangle,
  FolderGit2,
  Settings,
  Shield,
  ShieldCheck,
  Sprout,
  Compass,
  Layers,
  Inbox,
  MapPin,
  PieChart,
  Bot,
  HeartPulse,
  GraduationCap,
  BookOpen,
  Landmark,
  FileCheck,
  HeartHandshake,
  Database,
  Menu,
  X,
  HelpCircle,
  TrendingUp,
  Globe,
  Camera,
  Scale,
  MonitorPlay,
  Briefcase,
  ClipboardList,
  Building2,
  ChevronDown,
  Pill,
  Store,
  CloudLightning,
  UserCircle,
  Trash2,
  MonitorCheck,
  BookMarked,
  QrCode,
  BarChart3,
  Gavel,
  Calendar,
  Activity,
  ShieldAlert,
  HardHat,
  Mountain,
  Waves,
  Radio,
  Tent,
  Video,
  ChevronRight,
  Coins,
  Truck,
  PhoneCall,
  WifiOff,
} from 'lucide-react';

// ── Dark Sidebar Design Tokens ──────────────────────────────────────
const S = {
  bg: '#0d1f3c',
  bgHover: '#1a3260',
  bgActive: '#1e4d9b',
  border: 'rgba(255,255,255,0.08)',
  sectionLabel: '#7ba3d4',
  text: '#c8daf5',
  textActive: '#ffffff',
  accent: '#3b82f6',
  accentLight: 'rgba(59,130,246,0.15)',
  shadow: '4px 0 24px rgba(0,0,0,0.25)',
};

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  roles?: string[];
  comingSoon?: boolean;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const adminNavSections: NavSection[] = [
  {
    title: '१. मुख्य कमान्ड तथा इन्टेलिजेन्स (Command & Intelligence)',
    items: [
      {
        label: 'एकीकृत कमान्ड ड्यासबोर्ड',
        path: '/app',
        icon: <LayoutDashboard size={16} style={{ color: '#f59e0b' }} />,
        badge: 'Real-time BI',
        badgeColor: '#f59e0b',
        roles: ['super_admin', 'admin', 'cao', 'it_admin', 'planning_officer', 'disaster_officer'],
      },
      {
        label: 'एआई पालिका सहायक',
        path: '/app/ai-assistant',
        icon: <Bot size={16} style={{ color: '#ec4899' }} />,
        badge: 'AI Copilot',
        badgeColor: '#ec4899',
      },
      {
        label: 'कार्यक्रम क्यालेन्डर',
        path: '/app/event-calendar',
        icon: <Calendar size={16} />,
      },
    ],
  },
  {
    title: '२. विपद् तथा वातावरण नियमन (Disaster & Environment)',
    items: [
      {
        label: 'विपद् जोखिम व्यवस्थापन',
        path: '/app/disaster',
        icon: <AlertTriangle size={16} style={{ color: '#ef4444' }} />,
        badge: 'DRRM Hub',
        badgeColor: '#ef4444',
        children: [
          {
            label: 'नदी जलसतह तथा ३D डुबान सिमुलेटर',
            path: '/app/disaster?tab=sensors',
            icon: <Waves size={14} style={{ color: '#0284c7' }} />,
            badge: '३D Twin',
            badgeColor: '#0284c7',
          },
          {
            label: 'पहिरो जोखिम तथा इन्क्लिनोमिटर',
            path: '/app/disaster?tab=vulnerable_settlements',
            icon: <Mountain size={14} style={{ color: '#eab308' }} />,
            badge: 'पूर्वसूचना',
            badgeColor: '#eab308',
          },
          {
            label: 'स्वचालित IVR कल र मेश-साइरन',
            path: '/app/disaster?tab=broadcast',
            icon: <Radio size={14} style={{ color: '#ef4444' }} />,
            badge: 'Last-Mile',
            badgeColor: '#ef4444',
          },
          {
            label: 'अति-संवेदनशील नागरिक (५,८०५ घरधुरी)',
            path: '/app/disaster?tab=micro_vulnerability',
            icon: <Users size={14} style={{ color: '#ec4899' }} />,
            badge: 'उद्धार सूची',
            badgeColor: '#ec4899',
          },
          {
            label: 'डिजिटल क्षति मूल्याङ्कन (RDRA राहत)',
            path: '/app/disaster?tab=rdra_damage',
            icon: <Coins size={14} style={{ color: '#10b981' }} />,
            badge: 'मापदण्ड २०७७',
            badgeColor: '#10b981',
          },
          {
            label: 'खोज-उद्धार (SAR) र डोजर डाइरेक्टरी',
            path: '/app/disaster?tab=heavy_equipment',
            icon: <Truck size={14} style={{ color: '#f59e0b' }} />,
            badge: 'स्ट्यान्डबाइ',
            badgeColor: '#f59e0b',
          },
          {
            label: 'अफलाइन सञ्चालन र VHF रेडियो',
            path: '/app/disaster?tab=offline_mesh',
            icon: <WifiOff size={14} style={{ color: '#6366f1' }} />,
            badge: 'PWA/VHF',
            badgeColor: '#6366f1',
          },
          {
            label: 'सुरक्षित आश्रयस्थल र राहत मौज्दात',
            path: '/app/disaster?tab=shelters',
            icon: <Tent size={14} style={{ color: '#10b981' }} />,
            badge: '६ वटा',
            badgeColor: '#10b981',
          },
          {
            label: 'CCTV क्यामेरा लाइभ सर्भिलेन्स',
            path: '/app/disaster?tab=cameras',
            icon: <Video size={14} style={{ color: '#8b5cf6' }} />,
            badge: 'लाइभ',
            badgeColor: '#8b5cf6',
          },
        ],
      },
      {
        label: 'वातावरण तथा नदीजन्य खानी नियमन IEE/वन',
        path: '/app/environmental-mining',
        icon: <Mountain size={16} style={{ color: '#10b981' }} />,
        badge: 'IEE/खानी',
        badgeColor: '#10b981',
      },
      {
        label: 'नागरिक गुनासो व्यवस्थापन',
        path: '/app/complaints',
        icon: <ShieldAlert size={16} style={{ color: '#f97316' }} />,
        badge: 'उजुरी/सूचना',
        badgeColor: '#f97316',
      },
    ],
  },
  {
    title: '३. स्थानिक ट्विन तथा पूर्वाधार (Spatial Twin & Projects)',
    items: [
      {
        label: '३डी/जीआईएस डिजिटल ट्विन',
        path: '/app/gis-map',
        icon: <MapPin size={16} style={{ color: '#6366f1' }} />,
        badge: '3D GIS',
        badgeColor: '#6366f1',
      },
      {
        label: 'सम्पूर्ण आयोजना जीवनचक्र ३६०',
        path: '/app/projects',
        icon: <FolderGit2 size={16} style={{ color: '#eab308' }} />,
        badge: 'PPIS/जोखिम',
        badgeColor: '#eab308',
        roles: ['super_admin', 'admin', 'cao', 'planning_officer', 'engineer', 'accountant'],
      },
    ],
  },
  {
    title: '४. प्रोफाइल, जनप्रतिनिधि तथा जनसांख्यिकी (Profile & Demographics)',
    items: [
      {
        label: 'पालिका डिजिटल प्रोफाइल',
        path: '/app/profile',
        icon: <Building2 size={16} />,
      },
      {
        label: 'जनप्रतिनिधि विवरण',
        path: '/app/representatives',
        icon: <Users size={16} />,
      },
      {
        label: 'घरधुरी तथा जनसांख्यिकी ३६०',
        path: '/app/demographics',
        icon: <Home size={16} style={{ color: '#0ea5e9' }} />,
        badge: 'C360/SVI',
        badgeColor: '#0ea5e9',
      },
    ],
  },
  {
    title: '५. खुला तथ्याङ्क तथा नागरिक सहायता (Open Data & Support)',
    items: [
      {
        label: 'खुला तथ्याङ्क तथा नागरिक सहायता',
        path: '/app/open-data',
        icon: <Database size={16} style={{ color: '#0284c7' }} />,
        badge: 'Open Data',
        badgeColor: '#0284c7',
      },
      {
        label: 'मद्दत तथा प्रयोगकर्ता पुस्तिका',
        path: '/app/faq-help',
        icon: <HelpCircle size={16} />,
      },
    ],
  },
  {
    title: '६. प्रणाली नियन्त्रण (System Admin)',
    items: [
      {
        label: 'पालिका प्रणाली कन्फिगरेसन',
        path: '/app/palika-settings',
        icon: <Settings size={16} />,
        roles: ['super_admin', 'admin', 'it_admin'],
      },
      {
        label: 'सुपर एडमिन कन्सोल',
        path: '/super-admin',
        icon: <Shield size={16} style={{ color: '#ef4444' }} />,
        badge: 'Super Admin',
        badgeColor: '#ef4444',
        roles: ['super_admin', 'it_admin'],
      },
    ],
  },
];

export const publicNavSections: NavSection[] = [
  {
    title: '१. मुख्य कमान्ड तथा इन्टेलिजेन्स (Command & Intelligence)',
    items: [
      {
        label: 'एकीकृत कमान्ड ड्यासबोर्ड',
        path: '/',
        icon: <LayoutDashboard size={16} style={{ color: '#f59e0b' }} />,
      },
      {
        label: 'एआई पालिका सहायक',
        path: '/ai-assistant',
        icon: <Bot size={16} style={{ color: '#ec4899' }} />,
        badge: 'AI Copilot',
        badgeColor: '#ec4899',
      },
      {
        label: 'कार्यक्रम क्यालेन्डर',
        path: '/event-calendar',
        icon: <Calendar size={16} />,
      },
    ],
  },
  {
    title: '२. विपद् तथा वातावरण नियमन (Disaster & Environment)',
    items: [
      {
        label: 'विपद् जोखिम व्यवस्थापन',
        path: '/disaster',
        icon: <AlertTriangle size={16} style={{ color: '#ef4444' }} />,
        badge: 'DRRM Hub',
        badgeColor: '#ef4444',
        children: [
          {
            label: 'नदी जलसतह तथा ३D डुबान सिमुलेटर',
            path: '/disaster?tab=river_twin',
            icon: <Waves size={14} style={{ color: '#0284c7' }} />,
            badge: '३D Twin',
            badgeColor: '#0284c7',
          },
          {
            label: 'राष्ट्रिय तथ्याङ्क मापदण्ड तथा DHM/BIPAD',
            path: '/disaster?tab=national_gateway',
            icon: <Globe size={14} style={{ color: '#0284c7' }} />,
            badge: 'DHM/BIPAD',
            badgeColor: '#0284c7',
          },
          {
            label: 'पहिरो जोखिम तथा इन्क्लिनोमिटर',
            path: '/disaster?tab=landslide',
            icon: <Mountain size={14} style={{ color: '#eab308' }} />,
            badge: 'पूर्वसूचना',
            badgeColor: '#eab308',
          },
          {
            label: 'स्वचालित IVR कल र मेश-साइरन',
            path: '/disaster?tab=siren',
            icon: <Radio size={14} style={{ color: '#ef4444' }} />,
            badge: 'Last-Mile',
            badgeColor: '#ef4444',
          },
          {
            label: 'अति-संवेदनशील नागरिक (५,८०५ घरधुरी)',
            path: '/disaster?tab=micro_vulnerability',
            icon: <Users size={14} style={{ color: '#ec4899' }} />,
            badge: 'उद्धार सूची',
            badgeColor: '#ec4899',
          },
          {
            label: 'डिजिटल क्षति मूल्याङ्कन (RDRA राहत)',
            path: '/disaster?tab=rdra_damage',
            icon: <Coins size={14} style={{ color: '#10b981' }} />,
            badge: 'मापदण्ड २०७७',
            badgeColor: '#10b981',
          },
          {
            label: 'खोज-उद्धार (SAR) र डोजर डाइरेक्टरी',
            path: '/disaster?tab=heavy_equipment',
            icon: <Truck size={14} style={{ color: '#f59e0b' }} />,
            badge: 'स्ट्यान्डबाइ',
            badgeColor: '#f59e0b',
          },
          {
            label: 'अफलाइन सञ्चालन र VHF रेडियो',
            path: '/disaster?tab=offline_mesh',
            icon: <WifiOff size={14} style={{ color: '#6366f1' }} />,
            badge: 'PWA/VHF',
            badgeColor: '#6366f1',
          },
          {
            label: 'सुरक्षित आश्रयस्थल र राहत मौज्दात',
            path: '/disaster?tab=shelters',
            icon: <Tent size={14} style={{ color: '#10b981' }} />,
            badge: '६ वटा',
            badgeColor: '#10b981',
          },
          {
            label: 'CCTV क्यामेरा लाइभ सर्भिलेन्स',
            path: '/disaster?tab=cameras',
            icon: <Video size={14} style={{ color: '#8b5cf6' }} />,
            badge: 'लाइभ',
            badgeColor: '#8b5cf6',
          },
        ],
      },
      {
        label: 'वातावरण तथा नदीजन्य खानी नियमन IEE/वन',
        path: '/environmental-mining',
        icon: <Mountain size={16} style={{ color: '#10b981' }} />,
        badge: 'IEE/खानी',
        badgeColor: '#10b981',
      },
      {
        label: 'नागरिक गुनासो व्यवस्थापन',
        path: '/complaints',
        icon: <ShieldAlert size={16} style={{ color: '#f97316' }} />,
        badge: 'उजुरी/सूचना',
        badgeColor: '#f97316',
      },
      {
        label: 'प्रणाली अडिट ट्रेल तथा सुरक्षा लग (Audit Log)',
        path: '/app/audit-logs',
        icon: <ShieldCheck size={16} style={{ color: '#38bdf8' }} />,
        badge: 'Audit & RBAC',
        badgeColor: '#0284c7',
      },
    ],
  },
  {
    title: '३. स्थानिक ट्विन तथा पूर्वाधार (Spatial Twin & Projects)',
    items: [
      {
        label: '३डी/जीआईएस डिजिटल ट्विन',
        path: '/gis-map',
        icon: <Layers size={16} style={{ color: '#6366f1' }} />,
        badge: '3D GIS',
        badgeColor: '#6366f1',
      },
      {
        label: 'सम्पूर्ण आयोजना जीवनचक्र ३६०',
        path: '/projects',
        icon: <FolderGit2 size={16} style={{ color: '#eab308' }} />,
        badge: 'PPIS/जोखिम',
        badgeColor: '#eab308',
      },
    ],
  },
  {
    title: '४. प्रोफाइल, जनप्रतिनिधि तथा जनसांख्यिकी (Profile & Demographics)',
    items: [
      {
        label: 'पालिका डिजिटल प्रोफाइल',
        path: '/profile',
        icon: <Building2 size={16} />,
      },
      {
        label: 'जनप्रतिनिधि विवरण',
        path: '/representatives',
        icon: <Users size={16} />,
      },
      {
        label: 'घरधुरी तथा जनसांख्यिकी ३६०',
        path: '/demographics',
        icon: <Home size={16} style={{ color: '#0ea5e9' }} />,
      },
    ],
  },
  {
    title: '५. खुला तथ्याङ्क तथा नागरिक सहायता (Open Data & Support)',
    items: [
      {
        label: 'खुला तथ्याङ्क तथा नागरिक सहायता',
        path: '/open-data',
        icon: <Database size={16} style={{ color: '#0284c7' }} />,
        badge: 'Open Data',
        badgeColor: '#0284c7',
      },
      {
        label: 'मद्दत तथा प्रयोगकर्ता पुस्तिका',
        path: '/faq-help',
        icon: <HelpCircle size={16} />,
      },
    ],
  },
];

interface SidebarProps {
  isPublic?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isPublic = false }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentSections = useMemo(() => {
    if (isPublic) return publicNavSections;
    const userRole = user?.role || 'admin';
    const isSuper = userRole === 'super_admin' || userRole === 'it_admin' || userRole === 'admin';

    return adminNavSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          if (!item.roles || item.roles.length === 0 || isSuper) return true;
          return item.roles.includes(userRole);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [isPublic, user?.role]);

  // Track expanded state for sections (all open by default, expandable/collapsible)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    currentSections.forEach((sec) => {
      initial[sec.title] = true;
    });
    return initial;
  });

  // Track expanded state for nested submenus (e.g. /disaster or /app/disaster)
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/disaster') || path.startsWith('/app/disaster')) {
        initial['/disaster'] = true;
        initial['/app/disaster'] = true;
      }
    }
    return initial;
  });

  const toggleSubmenu = (path: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenSubmenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  useEffect(() => {
    setIsMobileOpen(false);
    // Ensure section with active route stays open
    currentSections.forEach((sec) => {
      const isCurrentActive = sec.items.some((item) =>
        item.path === '/' || item.path === '/app'
          ? location.pathname === item.path
          : location.pathname.startsWith(item.path.split('?')[0])
      );
      if (isCurrentActive) {
        setOpenSections((prev) => ({ ...prev, [sec.title]: true }));
      }
      // Auto-open child submenus if current path matches
      sec.items.forEach((item) => {
        if (item.children && item.children.length > 0) {
          if (location.pathname.startsWith(item.path.split('?')[0])) {
            setOpenSubmenus((prev) => ({ ...prev, [item.path]: true }));
          }
        }
      });
    });
  }, [location.pathname, location.search, isPublic]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: prev[title] === undefined ? false : !prev[title],
    }));
  };

  const navContent = (
    <>
      {/* Brand Header */}
      <div
        style={{
          padding: '1.25rem 1rem',
          borderBottom: `1px solid ${S.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1565C0, #0284c7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.9rem',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(2,132,199,0.4)',
          }}
        >
          P5
        </div>
        <div>
          <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3 }}>
            Municipal Digital Twins
          </div>
          <div style={{ color: S.sectionLabel, fontSize: '0.72rem', marginTop: '1px' }}>
            v2.0-ts
          </div>
        </div>
      </div>

      {/* Nav Sections with Collapsible Accordion */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.625rem' }}>
        {currentSections.map((section) => {
          const isOpen = openSections[section.title] ?? true;
          const hasActiveItem = section.items.some((item) =>
            item.path === '/' || item.path === '/app'
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)
          );

          return (
            <div key={section.title} style={{ marginBottom: '0.75rem' }}>
              {/* Section Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.35rem 0.5rem',
                  marginBottom: '0.2rem',
                  borderRadius: '6px',
                  transition: 'background 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: hasActiveItem ? '#60a5fa' : S.sectionLabel,
                    }}
                  >
                    {section.title}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 5px',
                      borderRadius: '10px',
                      backgroundColor: hasActiveItem ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.08)',
                      color: hasActiveItem ? '#93c5fd' : S.sectionLabel,
                      fontWeight: 600,
                    }}
                  >
                    {section.items.length}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  style={{
                    color: hasActiveItem ? '#60a5fa' : S.sectionLabel,
                    transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                    opacity: 0.85,
                  }}
                />
              </button>

              {/* Nav Items */}
              {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {section.items.map((item) => {
                    if (item.comingSoon) {
                      return (
                        <div
                          key={item.path}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.5rem 0.625rem',
                            borderRadius: '8px',
                            fontSize: '0.825rem',
                            fontWeight: 400,
                            color: 'rgba(200,218,245, 0.4)',
                            backgroundColor: 'transparent',
                            cursor: 'not-allowed',
                          }}
                          title="यो सुविधा निर्माण हुँदैछ"
                        >
                          <span style={{ opacity: 0.4, flexShrink: 0 }}>{item.icon}</span>
                          <span style={{ flex: 1, lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {item.label}
                            <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                              Coming Soon
                            </span>
                          </span>
                        </div>
                      );
                    }

                    const hasChildren = Boolean(item.children && item.children.length > 0);
                    const isSubmenuOpen = Boolean(openSubmenus[item.path]);
                    const isParentActive = item.path === '/' || item.path === '/app'
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path.split('?')[0]);

                    if (hasChildren && item.children) {
                      return (
                        <div key={item.path} style={{ display: 'flex', flexDirection: 'column' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderRadius: '8px',
                              backgroundColor: isParentActive ? S.bgActive : 'transparent',
                              transition: 'all 0.15s ease',
                              padding: '0.15rem 0.35rem 0.15rem 0',
                            }}
                            onMouseEnter={(e) => {
                              if (!isParentActive) {
                                e.currentTarget.style.backgroundColor = S.bgHover;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isParentActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <NavLink
                              to={item.path}
                              onClick={() => {
                                setOpenSubmenus((prev) => ({ ...prev, [item.path]: true }));
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                padding: '0.45rem 0.5rem',
                                textDecoration: 'none',
                                fontSize: '0.825rem',
                                fontWeight: isParentActive ? 600 : 400,
                                color: isParentActive ? S.textActive : S.text,
                                flex: 1,
                              }}
                            >
                              <span style={{ opacity: 0.9, flexShrink: 0 }}>{item.icon}</span>
                              <span style={{ flex: 1, lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                                <span>{item.label}</span>
                                {item.badge && (
                                  <span
                                    style={{
                                      fontSize: '0.58rem',
                                      padding: '1px 5px',
                                      borderRadius: '4px',
                                      backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'rgba(255,255,255,0.08)',
                                      color: item.badgeColor || '#93c5fd',
                                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'rgba(255,255,255,0.15)'}`,
                                      fontWeight: 700,
                                      whiteSpace: 'nowrap',
                                      letterSpacing: '0.02em',
                                    }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </span>
                            </NavLink>
                            <button
                              type="button"
                              onClick={(e) => toggleSubmenu(item.path, e)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: isParentActive ? '#ffffff' : S.text,
                                cursor: 'pointer',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.8,
                                borderRadius: '4px',
                              }}
                              title={isSubmenuOpen ? 'उप-मेनु बन्द गर्नुहोस्' : 'उप-मेनु खोल्नुहोस्'}
                            >
                              <ChevronDown
                                size={14}
                                style={{
                                  transform: isSubmenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s ease',
                                }}
                              />
                            </button>
                          </div>

                          {/* Accordion Sub-items */}
                          {isSubmenuOpen && (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                marginLeft: '0.9rem',
                                paddingLeft: '0.6rem',
                                borderLeft: '2px solid rgba(59, 130, 246, 0.45)',
                                marginTop: '0.2rem',
                                marginBottom: '0.35rem',
                              }}
                            >
                              {item.children.map((child) => {
                                const currentFull = `${location.pathname}${location.search}`;
                                const isChildActive = currentFull === child.path || (location.pathname === child.path.split('?')[0] && !location.search && (child.path.includes('tab=river_twin') || child.path.includes('tab=sensors')));

                                return (
                                  <NavLink
                                    key={child.path}
                                    to={child.path}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.35rem 0.5rem',
                                      borderRadius: '6px',
                                      textDecoration: 'none',
                                      fontSize: '0.78rem',
                                      fontWeight: isChildActive ? 600 : 400,
                                      color: isChildActive ? '#ffffff' : S.text,
                                      backgroundColor: isChildActive ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isChildActive) {
                                        e.currentTarget.style.backgroundColor = S.bgHover;
                                        e.currentTarget.style.color = '#ffffff';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isChildActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = S.text;
                                      }
                                    }}
                                  >
                                    <span style={{ opacity: isChildActive ? 1 : 0.8, flexShrink: 0 }}>{child.icon}</span>
                                    <span style={{ flex: 1, lineHeight: 1.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{child.label}</span>
                                      {child.badge && (
                                        <span
                                          style={{
                                            fontSize: '0.55rem',
                                            padding: '1px 4px',
                                            borderRadius: '3px',
                                            backgroundColor: child.badgeColor ? `${child.badgeColor}22` : 'rgba(255,255,255,0.08)',
                                            color: child.badgeColor || '#93c5fd',
                                            border: `1px solid ${child.badgeColor ? `${child.badgeColor}44` : 'rgba(255,255,255,0.15)'}`,
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {child.badge}
                                        </span>
                                      )}
                                    </span>
                                  </NavLink>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/' || item.path === '/app'}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          padding: '0.5rem 0.625rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.825rem',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? S.textActive : S.text,
                          backgroundColor: isActive ? S.bgActive : 'transparent',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        })}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget;
                          if (!el.classList.contains('active')) {
                            el.style.backgroundColor = S.bgHover;
                            el.style.color = '#ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget;
                          if (!el.classList.contains('active')) {
                            el.style.backgroundColor = 'transparent';
                            el.style.color = S.text;
                          }
                        }}
                      >
                        <span style={{ opacity: 0.85, flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ flex: 1, lineHeight: 1.3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem' }}>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '0.58rem',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                backgroundColor: item.badgeColor ? `${item.badgeColor}22` : 'rgba(255,255,255,0.08)',
                                color: item.badgeColor || '#93c5fd',
                                border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'rgba(255,255,255,0.15)'}`,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '0.875rem 1rem',
          borderTop: `1px solid ${S.border}`,
          fontSize: '0.72rem',
          color: S.sectionLabel,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Settings size={13} />
        <span>पाँचपोखरी थाङपाल डिजिटल ट्विन</span>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 1000,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: '#0284c7',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(2,132,199,0.4)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="sidebar-mobile-toggle"
        aria-label="Toggle navigation menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 900,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        style={{
          width: '256px',
          backgroundColor: S.bg,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: '64px',
          flexShrink: 0,
          boxShadow: S.shadow,
        }}
        className="sidebar-desktop"
      >
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '280px',
          height: '100vh',
          backgroundColor: S.bg,
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
          zIndex: 950,
          flexDirection: 'column',
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto',
        }}
        className="sidebar-mobile"
      >
        <div
          style={{
            padding: '1rem',
            borderBottom: `1px solid ${S.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
            🏛️ पालिका डिजिटल ट्विन
          </span>
          <button
            onClick={() => setIsMobileOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.sectionLabel, padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
};
