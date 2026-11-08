import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  HardDrive,
  UploadCloud,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  FileText,
  MapPin,
  Trash2,
  Send,
  ShieldAlert,
  Server,
  Layers,
  FileCheck,
  ChevronRight,
  Share2,
  Activity,
  User,
  Phone,
  HelpCircle,
  FolderSync
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNetworkSync } from '../../../hooks/useNetworkSync';
import { useLanguage } from '../../../context/LanguageContext';
import { useDisasterScope } from '../../../context/DisasterScopeContext';

export const OfflineVaultSyncManager: React.FC = () => {
  const { t, isNepali } = useLanguage();
  const { currentPalika } = useDisasterScope();
  const {
    isOnline,
    queuedItems,
    pendingCount,
    isSyncing,
    lastSyncTime,
    cachedBundle,
    storageInfo,
    enqueueItem,
    triggerManualSync,
    clearSyncedRecords,
    deleteRecord,
    downloadOfflineBundle,
    exportVaultData,
    importVaultData,
  } = useNetworkSync();

  const [activeSubTab, setActiveSubTab] = useState<'form' | 'queue' | 'bundle' | 'transfer'>('form');

  // Form State
  const [recordType, setRecordType] = useState<'INCIDENT_REPORT' | 'DAMAGE_REPORT' | 'VULNERABILITY_SURVEY'>('INCIDENT_REPORT');
  const [hazardType, setHazardType] = useState<string>('पहिरो (Landslide)');
  const [wardNumber, setWardNumber] = useState<number>(4);
  const [reporterName, setReporterName] = useState<string>('');
  const [reporterPhone, setReporterPhone] = useState<string>('');
  const [priority, setPriority] = useState<string>('उच्च (High)');
  const [casualties, setCasualties] = useState<number>(0);
  const [injured, setInjured] = useState<number>(0);
  const [estimatedLoss, setEstimatedLoss] = useState<string>('५००००');
  const [recommendedRelief, setRecommendedRelief] = useState<string>('आपतकालीन त्रिपाल तथा खाद्यान्न');
  const [description, setDescription] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({ lat: 27.952, lng: 85.584 });
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any | null>(null);

  // Auto detect GPS
  const handleDetectGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          setCoordinates({
            lat: parseFloat(pos.coords.latitude.toFixed(6)),
            lng: parseFloat(pos.coords.longitude.toFixed(6)),
          });
          toast.success(`GPS स्थान पत्ता लाग्यो: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        (err) => {
          setIsDetectingGps(false);
          toast.error(`GPS पत्ता लागेन (${err.message})। पूर्वनिर्धारित स्थान प्रयोग गरिएको छ।`);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      toast.error('यस डिभाइसमा GPS उपलब्ध छैन।');
    }
  };

  // Submit offline form
  const handleSubmitOfflineForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('कृपया घटना वा क्षतिको संक्षिप्त विवरण भर्नुहोस्।');
      return;
    }

    const title = `${hazardType} - वडा नं ${wardNumber} (${reporterName || 'नागरिक रिपोर्ट'})`;
    const formData = {
      hazard_type: hazardType,
      incident_type: hazardType,
      ward_number: wardNumber,
      ward_id: String(wardNumber),
      priority,
      severity: priority,
      reporter_name: reporterName,
      reporter_phone: reporterPhone,
      human_casualties: casualties,
      injured_count: injured,
      estimated_loss: parseFloat(estimatedLoss) || 0,
      relief_type: recommendedRelief,
      description,
      coordinates,
      offline_device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 30) : 'Offline PWA',
      palika_tenant: currentPalika?.id || 'panchpokhari',
    };

    try {
      const queued = await enqueueItem(recordType, title, wardNumber, formData);
      toast.success(
        isOnline
          ? 'रेकर्ड स्थानीय भण्डारमा सुरक्षित भई केन्द्रीय सर्भरमा सिङ्क भयो!'
          : `रेकर्ड सुरक्षित भयो! (ID: ${queued.localId})। इन्टरनेट आउनासाथ स्वतः सिङ्क हुनेछ।`,
        { duration: 5000 }
      );

      // Reset fields
      setDescription('');
      setReporterName('');
      setReporterPhone('');
      setActiveSubTab('queue');
    } catch (err: any) {
      toast.error(`स्थानीय भण्डारमा राख्न सकिएन: ${err?.message}`);
    }
  };

  // Handle file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importVaultData(file);
      e.target.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── 1. Top Network & Offline Vault Banner ── */}
      <div
        style={{
          background: isOnline
            ? 'linear-gradient(135deg, #091e3a 0%, #1e3a5f 60%, #0f172a 100%)'
            : 'linear-gradient(135deg, #7c2d12 0%, #9a3412 60%, #431407 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          transition: 'all 0.4s ease',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: isOnline ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.3)',
              border: `1px solid ${isOnline ? '#22c55e' : '#f87171'}`,
              padding: '0.3rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.55rem',
            }}
          >
            {isOnline ? (
              <>
                <Wifi size={15} color="#4ade80" />
                <span style={{ color: '#4ade80' }}>
                  {isNepali ? 'अनलाइन मोड (केन्द्रीय सर्भर प्रत्यक्ष सम्पर्क)' : 'Online Mode (Direct Server Link)'}
                </span>
              </>
            ) : (
              <>
                <WifiOff size={15} color="#fca5a5" />
                <span style={{ color: '#fca5a5' }}>
                  {isNepali ? 'अफलाइन मोड (इन्टरनेट विच्छेद - स्थानीय भण्डार सक्रिय)' : 'Offline Mode (Local Vault Active)'}
                </span>
              </>
            )}
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={24} color="#38bdf8" />
            {isNepali ? 'अफलाइन मोबाइल सञ्चालन तथा स्थानीय सिङ्क भण्डार' : 'Offline-first Mobile Vault & Background Sync'}
          </h2>
          <p style={{ margin: '0.45rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '820px', lineHeight: 1.5 }}>
            {isNepali
              ? 'बाढी, पहिरो वा आँधीले अप्टिकल फाइबर, एनसेल/एनटिसी मोबाइल टावर तथा बिजुली विच्छेद गरे पनि फिल्ड कर्मचारी र वडा सचिवले घटनास्थलमै बिना इन्टरनेट फारम भर्न, फोटो जोड्न र स्थानीय IndexedDB मा सुरक्षित गर्न सक्नेछन्। इन्टरनेट पुनः जोडिएपछि वा स्थानीय वाइफाइ पाएपछि प्रणालीले स्वतः केन्द्रीय सर्भरमा डेटा सिङ्क गर्दछ।'
              : 'Empowers field officers and ward responders to record rapid disaster damages, emergency incidents, and vulnerability updates completely off-grid without internet. All data persists safely in local IndexedDB and automatically syncs to the central EOC upon reconnect.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {pendingCount > 0 && (
            <div
              style={{
                background: '#ea580c',
                color: '#ffffff',
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                animation: 'pulse 2s infinite',
              }}
            >
              <Clock size={16} />
              {isNepali ? `${pendingCount} वटा सिङ्क बाँकी` : `${pendingCount} Pending Sync`}
            </div>
          )}

          <button
            onClick={triggerManualSync}
            disabled={isSyncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: isOnline ? '#0284c7' : '#475569',
              color: '#ffffff',
              border: 'none',
              padding: '0.65rem 1.15rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            }}
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing
              ? isNepali ? 'सिङ्क हुँदैछ...' : 'Syncing...'
              : isNepali ? 'अहिले सिङ्क गर्नुहोस्' : 'Sync All Now'}
          </button>
        </div>
      </div>

      {/* ── 2. Metric KPI Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
        }}
      >
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              {isNepali ? 'स्थानीय कतार रेकर्डहरू' : 'Local Queued Records'}
            </span>
            <Database size={16} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
            {queuedItems.length} {isNepali ? 'रेकर्ड' : 'Items'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.2rem' }}>
            {pendingCount > 0 ? `${pendingCount} ${isNepali ? 'सिङ्क हुन बाँकी' : 'pending sync'}` : isNepali ? 'सबै सिङ्क सम्पन्न' : 'All synced'}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              {isNepali ? 'अफलाइन क्यास बन्डल' : 'Pre-cached Bundle'}
            </span>
            <FolderSync size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#15803d' }}>
            {cachedBundle ? `${cachedBundle.totalRecords} ${isNepali ? 'डाटा' : 'records'}` : isNepali ? 'तयार छ' : 'Ready'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16a34a', marginTop: '0.2rem' }}>
            {isNepali ? 'आश्रयस्थल, सम्पर्क र VHF फ्रिक्वेन्सी' : 'Shelters, Contacts & VHF Radio'}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              {isNepali ? 'स्थानीय IndexedDB भण्डारण' : 'Device Storage Usage'}
            </span>
            <HardDrive size={16} color="#7c3aed" />
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#6d28d9' }}>
            {storageInfo.usageMB} MB
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6b21a8', marginTop: '0.2rem' }}>
            {isNepali ? `सुरक्षित कोटा: ${storageInfo.quotaMB} MB` : `IndexedDB quota: ${storageInfo.quotaMB} MB`}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              {isNepali ? 'अन्तिम सफल सिङ्क' : 'Last Synced'}
            </span>
            <CheckCircle2 size={16} color="#059669" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            {lastSyncTime || (isNepali ? 'भर्खरै' : 'Just now')}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '0.2rem' }}>
            {isNepali ? 'पृष्ठभूमि अटो-सिङ्क सक्रिय' : 'Background auto-sync active'}
          </div>
        </div>
      </div>

      {/* ── 3. Sub-Tab Navigation Bar ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveSubTab('form')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'form' ? '#0284c7' : '#f1f5f9',
            color: activeSubTab === 'form' ? '#ffffff' : '#334155',
            transition: 'all 0.2s',
          }}
        >
          <FileText size={16} />
          {isNepali ? '१. द्रुत अफलाइन रिपोर्टिङ फारम' : '1. Rapid Offline Form'}
        </button>

        <button
          onClick={() => setActiveSubTab('queue')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'queue' ? '#0284c7' : '#f1f5f9',
            color: activeSubTab === 'queue' ? '#ffffff' : '#334155',
            transition: 'all 0.2s',
          }}
        >
          <Database size={16} />
          {isNepali ? `२. सिङ्क कतार (${queuedItems.length})` : `2. Sync Queue (${queuedItems.length})`}
          {pendingCount > 0 && (
            <span
              style={{
                backgroundColor: '#ea580c',
                color: '#fff',
                fontSize: '0.7rem',
                padding: '0.1rem 0.45rem',
                borderRadius: '10px',
                fontWeight: 800,
              }}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('bundle')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'bundle' ? '#0284c7' : '#f1f5f9',
            color: activeSubTab === 'bundle' ? '#ffffff' : '#334155',
            transition: 'all 0.2s',
          }}
        >
          <Radio size={16} />
          {isNepali ? '३. अफलाइन निर्देशिका र VHF च्यानलहरू' : '3. Offline Directory & VHF Radio'}
        </button>

        <button
          onClick={() => setActiveSubTab('transfer')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            backgroundColor: activeSubTab === 'transfer' ? '#0284c7' : '#f1f5f9',
            color: activeSubTab === 'transfer' ? '#ffffff' : '#334155',
            transition: 'all 0.2s',
          }}
        >
          <Share2 size={16} />
          {isNepali ? '४. डाटा स्थानान्तरण (USB/VHF ब्याकअप)' : '4. Data Portability (USB/VHF)'}
        </button>
      </div>

      {/* ── SubTab 1: Rapid Offline Field Reporting Form ── */}
      {activeSubTab === 'form' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} color="#dc2626" />
                {isNepali ? 'फिल्ड विपद् घटना तथा द्रुत क्षति मूल्याङ्कन (RDRA) फारम' : 'Field Disaster Incident & Rapid Damage Assessment (RDRA) Form'}
              </h3>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                {isNepali
                  ? 'यो फारम पूर्णतया इन्टरनेट बिना काम गर्दछ। पेश गरिएका सबै विवरणहरू स्थानीय यन्त्रमा भण्डारण भई नेटवर्क आउनासाथ सिङ्क हुन्छन्।'
                  : 'Works completely without internet connection. Submissions are stored locally in IndexedDB and queued for auto-sync.'}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isOnline ? '#15803d' : '#c2410c',
                background: isOnline ? '#f0fdf4' : '#fff7ed',
                border: `1px solid ${isOnline ? '#bbf7d0' : '#ffedd5'}`,
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
              }}
            >
              {isOnline ? (isNepali ? 'प्रत्यक्ष सिङ्क मोड' : 'Direct Sync Mode') : (isNepali ? 'स्थानीय अफलाइन मोड' : 'Local Offline Mode')}
            </span>
          </div>

          <form onSubmit={handleSubmitOfflineForm}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'प्रतिवेदन प्रकार (Record Type)' : 'Record Type'}
                </label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as any)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="INCIDENT_REPORT">{isNepali ? 'आपतकालीन विपद् घटना (Disaster Incident)' : 'Emergency Incident Report'}</option>
                  <option value="DAMAGE_REPORT">{isNepali ? 'गृह मन्त्रालय मापदण्ड द्रुत क्षति मूल्याङ्कन (RDRA Damage)' : 'RDRA Damage Assessment'}</option>
                  <option value="VULNERABILITY_SURVEY">{isNepali ? 'अति-संवेदनशील नागरिक सर्वेक्षण (Micro-Vulnerability)' : 'Micro-Vulnerability Survey'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'विपद्को प्रकार (Hazard Type)' : 'Hazard Type'}
                </label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="पहिरो (Landslide)">{isNepali ? 'पहिरो (Landslide)' : 'Landslide'}</option>
                  <option value="बाढी तथा गेग्रान बहाव (Flash Flood & Debris)">{isNepali ? 'बाढी तथा गेग्रान बहाव (Flash Flood & Debris)' : 'Flash Flood & Debris'}</option>
                  <option value="सडक अवरोध तथा पहिरो (Roadblock)">{isNepali ? 'सडक अवरोध तथा पहिरो (Roadblock)' : 'Roadblock'}</option>
                  <option value="घर भत्किएको / पूर्ण क्षति (House Collapse)">{isNepali ? 'घर भत्किएको / पूर्ण क्षति (House Collapse)' : 'House Collapse'}</option>
                  <option value="आगलागी (Fire Disaster)">{isNepali ? 'आगलागी (Fire Disaster)' : 'Fire Disaster'}</option>
                  <option value="नदी कटान (Riverbank Erosion)">{isNepali ? 'नदी कटान (Riverbank Erosion)' : 'Riverbank Erosion'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'प्रभावित वडा (Ward Number)' : 'Affected Ward'}
                </label>
                <select
                  value={wardNumber}
                  onChange={(e) => setWardNumber(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                    <option key={w} value={w}>
                      {isNepali ? `वडा नं. ${w}` : `Ward No. ${w}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'प्राथमिकता (Priority Level)' : 'Priority Level'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="अति-आपतकालीन (Critical Rescue)">{isNepali ? 'अति-आपतकालीन (Critical Rescue)' : 'Critical Rescue'}</option>
                  <option value="उच्च (High)">{isNepali ? 'उच्च (High)' : 'High'}</option>
                  <option value="मध्यम (Medium)">{isNepali ? 'मध्यम (Medium)' : 'Medium'}</option>
                  <option value="सामान्य अनुगमन (Low)">{isNepali ? 'सामान्य अनुगमन (Low)' : 'Low'}</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'प्रभावित परिवारको मुख्य व्यक्ति / प्रतिवेदक' : 'Head of Affected Household / Reporter'}
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 12 }} />
                  <input
                    type="text"
                    required
                    placeholder={isNepali ? 'उदा: राम बहादुर तामाङ' : 'e.g., Ram Bahadur Tamang'}
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.55rem 0.55rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'सम्पर्क फोन नम्बर' : 'Contact Phone'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 12 }} />
                  <input
                    type="text"
                    placeholder="९८५१xxxxxx"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.55rem 0.55rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'मानवीय हताहती / घाइते संख्या' : 'Human Casualties / Injured'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="0"
                    placeholder={isNepali ? 'मृतक' : 'Casualties'}
                    value={casualties}
                    onChange={(e) => setCasualties(parseInt(e.target.value) || 0)}
                    style={{ width: '50%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder={isNepali ? 'घाइते' : 'Injured'}
                    value={injured}
                    onChange={(e) => setInjured(parseInt(e.target.value) || 0)}
                    style={{ width: '50%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  {isNepali ? 'अनुमानित क्षति रकम (रु.)' : 'Estimated Loss Amount (NPR)'}
                </label>
                <input
                  type="text"
                  placeholder="५०,०००"
                  value={estimatedLoss}
                  onChange={(e) => setEstimatedLoss(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* GPS & Description */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                  {isNepali ? 'घटनास्थल GPS निर्देशांक (GPS Coordinates)' : 'Incident GPS Coordinates'}
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isDetectingGps}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                  }}
                >
                  <MapPin size={13} />
                  {isDetectingGps ? (isNepali ? 'पत्ता लगाउँदै...' : 'Detecting...') : (isNepali ? 'अहिलेको GPS पत्ता लगाउनुहोस्' : 'Detect GPS Now')}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="number"
                  step="0.000001"
                  value={coordinates.lat}
                  onChange={(e) => setCoordinates({ ...coordinates, lat: parseFloat(e.target.value) || 0 })}
                  placeholder="Latitude"
                  style={{ width: '50%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
                <input
                  type="number"
                  step="0.000001"
                  value={coordinates.lng}
                  onChange={(e) => setCoordinates({ ...coordinates, lng: parseFloat(e.target.value) || 0 })}
                  placeholder="Longitude"
                  style={{ width: '50%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                {isNepali ? 'घटना तथा क्षतिको विस्तृत विवरण र तत्काल राहत सिफारिस' : 'Detailed Field Observations & Recommended Immediate Relief'}
              </label>
              <textarea
                rows={3}
                required
                placeholder={isNepali ? 'उदा: अविरल वर्षाका कारण माथिबाट आएको पहिरोले घरको पछिल्लो भाग पुरेको, गोठ भत्किएर १ गाई घाइते। बाटो अवरुद्ध भएकोले डोजर र त्रिपाल तत्काल आवश्यक।' : 'Describe incident, current ground reality, and immediate relief equipment needed...'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                }}
              >
                <Send size={16} />
                {isNepali ? 'अफलाइन भण्डारमा सुरक्षित गर्नुहोस् (Save to Offline Vault)' : 'Save to Offline Vault (IndexedDB)'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── SubTab 2: Sync Queue Explorer ── */}
      {activeSubTab === 'queue' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} color="#0284c7" />
                {isNepali ? 'अफलाइन सिङ्क कतार (IndexedDB Queue)' : 'Offline Sync Queue (IndexedDB)'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {isNepali ? `कुल ${queuedItems.length} वटा रेकर्ड स्थानीय मेमोरीमा उपलब्ध छन्।` : `Total ${queuedItems.length} records available locally.`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={clearSyncedRecords}
                disabled={queuedItems.filter((i) => i.syncStatus === 'SYNCED').length === 0}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.8rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={14} />
                {isNepali ? 'सिङ्क भइसकेका हटाउनुहोस्' : 'Purge Synced'}
              </button>

              <button
                onClick={triggerManualSync}
                disabled={isSyncing}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: isSyncing ? 'not-allowed' : 'pointer',
                }}
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                {isNepali ? 'सबै सिङ्क गर्नुहोस्' : 'Flush Queue'}
              </button>
            </div>
          </div>

          {queuedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <Database size={48} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#64748b' }}>
                {isNepali ? 'कुनै पनि अफलाइन रेकर्ड कतारमा छैन।' : 'No records currently in offline queue.'}
              </div>
              <p style={{ fontSize: '0.8rem', margin: '0.35rem 0 1rem' }}>
                {isNepali ? 'फारमबाट भरिएका प्रतिवेदनहरू यहाँ देखिनेछन्।' : 'Reports filed offline will appear here.'}
              </p>
              <button
                onClick={() => setActiveSubTab('form')}
                style={{
                  background: '#0284c7',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {isNepali ? '+ नयाँ अफलाइन रिपोर्ट भर्नुहोस्' : '+ File New Offline Report'}
              </button>
            </div>
          ) : (
            <div className="dt-responsive-table">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isNepali ? 'स्थानीय ID' : 'Local ID'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isNepali ? 'प्रकार' : 'Type'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isNepali ? 'शीर्षक / वडा' : 'Title / Ward'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isNepali ? 'दर्ता मिति' : 'Timestamp'}</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>{isNepali ? 'सिङ्क स्थिति' : 'Sync Status'}</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>{isNepali ? 'कार्य' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {queuedItems.map((item) => (
                    <tr key={item.localId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                        {item.localId}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <span
                          style={{
                            background: item.recordType === 'INCIDENT_REPORT' ? '#eff6ff' : '#fef2f2',
                            color: item.recordType === 'INCIDENT_REPORT' ? '#1d4ed8' : '#dc2626',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                          }}
                        >
                          {item.recordType}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {item.data.description?.slice(0, 50)}...
                        </div>
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#64748b', fontSize: '0.75rem' }}>
                        {new Date(item.offlineTimestamp).toLocaleTimeString('ne-NP')}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        {item.syncStatus === 'SYNCED' && (
                          <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={14} /> {isNepali ? 'सिङ्क भयो' : 'Synced'}
                          </span>
                        )}
                        {item.syncStatus === 'PENDING' && (
                          <span style={{ color: '#ea580c', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={14} /> {isNepali ? 'कतारमा बाँकी' : 'Pending'}
                          </span>
                        )}
                        {item.syncStatus === 'SYNCING' && (
                          <span style={{ color: '#0284c7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <RefreshCw size={14} className="animate-spin" /> {isNepali ? 'सिङ्क हुँदै' : 'Syncing'}
                          </span>
                        )}
                        {item.syncStatus === 'FAILED' && (
                          <span style={{ color: '#dc2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <AlertTriangle size={14} /> {isNepali ? 'त्रुटि' : 'Failed'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => setSelectedItemDetails(item)}
                            title="विवरण हेर्नुहोस्"
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.72rem' }}
                          >
                            JSON
                          </button>
                          <button
                            onClick={() => deleteRecord(item.localId)}
                            title="कतारबाट हटाउनुहोस्"
                            style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', padding: '0.3rem 0.55rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* JSON Inspector Modal */}
          {selectedItemDetails && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  width: '100%',
                  maxWidth: '560px',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                    {selectedItemDetails.localId}
                  </h4>
                  <button
                    onClick={() => setSelectedItemDetails(null)}
                    style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: '#64748b' }}
                  >
                    ✕
                  </button>
                </div>
                <pre
                  style={{
                    background: '#0f172a',
                    color: '#38bdf8',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                  }}
                >
                  {JSON.stringify(selectedItemDetails, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SubTab 3: Offline Palika Directory & VHF Frequencies ── */}
      {activeSubTab === 'bundle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderSync size={18} color="#16a34a" />
                {isNepali ? 'पालिका अफलाइन डाटाबन्डल क्यास' : 'Palika Offline Data Bundle Cache'}
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                {isNepali
                  ? 'फिल्डमा निस्कनु अघि यो बन्डल डाउनलोड गर्दा सम्पूर्ण आश्रयस्थल, हटलाइन र आपतकालीन रेडियो फ्रिक्वेन्सीहरू स्थानीय डिभाइसमा सुरक्षित हुन्छन्।'
                  : 'Download this bundle before heading into the mountains to ensure all emergency contacts, shelters and VHF channels are cached offline.'}
              </p>
            </div>

            <button
              onClick={downloadOfflineBundle}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.15rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              }}
            >
              <DownloadCloud size={16} />
              {isNepali ? 'डाटाबन्डल डाउनलोड / अद्यावधिक' : 'Download / Update Bundle'}
            </button>
          </div>

          {/* VHF Frequency Cards */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Radio size={16} color="#0284c7" />
              {isNepali ? 'आधिकारिक आपतकालीन VHF/LoRa रेडियो च्यानलहरू (इन्टरनेट बिना सञ्चार)' : 'Emergency VHF/LoRa Radio Frequencies (Off-grid Comm)'}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {(cachedBundle?.vhfFrequencies || [
                {
                  id: 'rf-1',
                  agency: 'नेपाल प्रहरी (जिल्ला प्रहरी कार्यालय सिन्धुपाल्चोक)',
                  call_sign: 'सिन्धु-कमाण्ड (Sindhu-1)',
                  frequency_mhz: '142.125 MHz',
                  repeater: 'आमा याङ्ग्री पिक (३,७७१ मि)',
                  contact: '९८५११००१००',
                },
                {
                  id: 'rf-2',
                  agency: 'सशस्त्र प्रहरी बल (APF नं. २२ गण विपद् उद्धार)',
                  call_sign: 'मुक्तिनाथ-रेस्क्यु (Muktinath-EOC)',
                  frequency_mhz: '148.550 MHz',
                  repeater: 'चौतारा डाँडा तथा थाङपाल टावर',
                  contact: '९८५१२१२१२१',
                },
                {
                  id: 'rf-3',
                  agency: 'गाउँपालिका आपतकालीन कमाण्ड कक्ष (LEOC)',
                  call_sign: 'थाङपाल-कन्ट्रोल (Thangpal-EOC)',
                  frequency_mhz: '156.800 MHz',
                  repeater: 'थाङपालधाप प्रशासनिक भवन टावर',
                  contact: '९८५११२३४५६',
                },
                {
                  id: 'rf-4',
                  agency: 'सौर्य साइरन तथा सेन्सर टेलिमेट्री मेश (LoRa RF)',
                  call_sign: 'LORA-MESH-DRM',
                  frequency_mhz: '433.920 MHz',
                  repeater: 'तिम्बु, थाङपालधाप र गुन्सा रिले',
                  contact: 'प्राविधिक कक्ष',
                },
              ]).map((rf: any) => (
                <div
                  key={rf.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{rf.agency}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                      रिपिटर: <strong>{rf.repeater}</strong>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      कल साइन: <strong>{rf.call_sign}</strong> | सम्पर्क: <strong>{rf.contact}</strong>
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      textAlign: 'center',
                    }}
                  >
                    {rf.frequency_mhz}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SubTab 4: Data Portability (Export & Import for VHF/USB) ── */}
      {activeSubTab === 'transfer' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={20} color="#7c3aed" />
              {isNepali ? 'भौतिक डाटा स्थानान्तरण तथा सुरक्षा ब्याकअप (USB / VHF Dump)' : 'Data Portability & Off-grid Bridge (USB / VHF Dump)'}
            </h3>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              {isNepali
                ? 'यदि कुनै वडामा हप्तौंसम्म मोबाइल नेटवर्क नआएमा, फिल्ड प्राविधिकहरूले यस सुविधाबाट पूरै अफलाइन डाटा पेनड्राइभ (USB) वा VHF प्याकेटमार्फत जिल्ला वा गाउँपालिका EOC मा ल्याएर सिङ्क गर्न सक्नेछन्।'
                : 'If network outage lasts for days, field surveyors can export encrypted JSON dumps to USB thumb drives or transmit via VHF packet radio to the municipal EOC.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Export Box */}
            <div
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#faf5ff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7c3aed', fontWeight: 800, fontSize: '0.95rem' }}>
                  <DownloadCloud size={18} />
                  {isNepali ? 'अफलाइन डाटा JSON निर्यात' : 'Export Offline Vault JSON'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.5rem 0 1rem' }}>
                  {isNepali
                    ? `यस डिभाइसमा रहेका ${queuedItems.length} वटा घटना तथा क्षति रेकर्डहरू JSON ढाँचामा डाउनलोड गर्नुहोस्।`
                    : `Download all ${queuedItems.length} local records as standard JSON for manual transport.`}
                </p>
              </div>

              <button
                onClick={exportVaultData}
                style={{
                  background: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)',
                }}
              >
                <DownloadCloud size={16} />
                {isNepali ? 'JSON फाइल डाउनलोड गर्नुहोस्' : 'Download JSON Dump'}
              </button>
            </div>

            {/* Import Box */}
            <div
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#f0fdf4',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 800, fontSize: '0.95rem' }}>
                  <UploadCloud size={18} />
                  {isNepali ? 'फिल्ड ब्याकअप JSON आयात' : 'Import Field JSON File'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.5rem 0 1rem' }}>
                  {isNepali
                    ? 'अन्य फिल्ड कर्मचारी वा मोबाइलबाट ल्याइएको JSON फाइल यस प्रणालीमा लोड गरी सिङ्क कतारमा थप्नुहोस्।'
                    : 'Import external JSON dumps collected by field workers into this browser vault to sync.'}
                </p>
              </div>

              <label
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                }}
              >
                <UploadCloud size={16} />
                {isNepali ? 'JSON फाइल छान्नुहोस्' : 'Select JSON File'}
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineVaultSyncManager;
