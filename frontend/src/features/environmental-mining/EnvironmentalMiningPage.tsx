import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  environmentalMiningApi,
  type MiningSite,
  type IeeComplianceRecord,
  type CommunityForestRecord,
  type EnvironmentalInspection,
  type EnvironmentalMiningStats,
} from '../../api/environmentalMining';
import {
  Mountain,
  Waves,
  Trees,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  MapPin,
  ExternalLink,
  Coins,
  Scale,
  Calendar,
  X,
  RefreshCw,
  TrendingUp,
  FileText,
  Activity,
} from 'lucide-react';

const toNepaliDigits = (val: number | string | undefined | null): string => {
  if (val === undefined || val === null) return '०';
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const formatted = typeof val === 'number' ? val.toLocaleString('en-IN') : String(val);
  return formatted.replace(/[0-9]/g, (d) => nepaliDigits[parseInt(d, 10)] ?? d);
};

export const EnvironmentalMiningPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'mining_sites' | 'iee_compliance' | 'community_forests' | 'inspections'>('mining_sites');
  const [searchQuery, setSearchQuery] = useState('');
  const [wardFilter, setWardFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Modals state
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);
  const [isIeeModalOpen, setIsIeeModalOpen] = useState(false);
  const [isInspModalOpen, setIsInspModalOpen] = useState(false);

  // New site form state
  const [newSite, setNewSite] = useState({
    name: '',
    operatorName: '',
    wardNumber: 2,
    riverBasin: 'मेलम्ची खोला',
    resourceType: 'बालुवा/गिट्टी/ढुङ्गा',
    ieeStatus: 'स्वीकृत (Approved)',
    approvedQuotaCuM: 30000,
    extractedVolumeCuM: 5000,
    royaltyAmountNPR: 2000000,
    riskLevel: 'उच्च (बाढी संवेदनशीलता)',
    monitoringStatus: 'सक्रिय अनुगमन',
    crusherDistanceKm: 1.5,
  });

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useQuery<EnvironmentalMiningStats>({
    queryKey: ['env-mining-stats'],
    queryFn: () => environmentalMiningApi.getStats().then((res: any) => res.data || res),
  });

  const { data: sites = [], isLoading: isSitesLoading } = useQuery<MiningSite[]>({
    queryKey: ['env-mining-sites', wardFilter, statusFilter, riskFilter, searchQuery],
    queryFn: () =>
      environmentalMiningApi.getMiningSites({
        ward: wardFilter !== 'all' ? Number(wardFilter) : undefined,
        status_filter: statusFilter !== 'all' ? statusFilter : undefined,
        risk_level: riskFilter !== 'all' ? riskFilter : undefined,
        search: searchQuery || undefined,
      }).then((res: any) => (Array.isArray(res) ? res : res.data || [])),
  });

  const { data: ieeRecords = [] } = useQuery<IeeComplianceRecord[]>({
    queryKey: ['env-iee-records'],
    queryFn: () => environmentalMiningApi.getIeeRecords().then((res: any) => (Array.isArray(res) ? res : res.data || [])),
  });

  const { data: communityForests = [] } = useQuery<CommunityForestRecord[]>({
    queryKey: ['env-community-forests'],
    queryFn: () => environmentalMiningApi.getCommunityForests().then((res: any) => (Array.isArray(res) ? res : res.data || [])),
  });

  const { data: inspections = [] } = useQuery<EnvironmentalInspection[]>({
    queryKey: ['env-inspections'],
    queryFn: () => environmentalMiningApi.getInspections().then((res: any) => (Array.isArray(res) ? res : res.data || [])),
  });

  // Mutations
  const createSiteMutation = useMutation({
    mutationFn: (data: Partial<MiningSite>) => environmentalMiningApi.createMiningSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['env-mining-sites'] });
      queryClient.invalidateQueries({ queryKey: ['env-mining-stats'] });
      setIsSiteModalOpen(false);
      alert('नयाँ नदीजन्य खानी उत्खनन बिन्दु सफलतापूर्वक दर्ता भयो!');
    },
  });

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    createSiteMutation.mutate({
      ...newSite,
      wardNumber: Number(newSite.wardNumber),
      approvedQuotaCuM: Number(newSite.approvedQuotaCuM),
      extractedVolumeCuM: Number(newSite.extractedVolumeCuM),
      royaltyAmountNPR: Number(newSite.royaltyAmountNPR),
      crusherDistanceKm: Number(newSite.crusherDistanceKm),
    });
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1440px', margin: '0 auto', fontFamily: 'var(--font-family, sans-serif)' }}>
      {/* ── HEADER & BREADCRUMB ─────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            <Mountain size={16} />
            <span>वातावरण, नदीजन्य खानी तथा प्राकृतिक स्रोत संरक्षण शाखा</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
            वातावरण तथा नदीजन्य खानी नियमन (IEE / वन तथा नदीजन्य पदार्थ)
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            नदीजन्य पदार्थ (ढुङ्गा, गिट्टी, बालुवा) उत्खनन नियमन, IEE वातावरणीय मापदण्ड अनुगमन तथा सामुदायिक वन जलाधार संरक्षण प्रणाली
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsSiteModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Plus size={16} />
            <span>नयाँ खानी बिन्दु दर्ता</span>
          </button>

          <button
            onClick={() => {
              const headers = 'ID,Name,Operator,Ward,RiverBasin,ResourceType,IEEStatus,ApprovedQuota,ExtractedVolume,RoyaltyNPR,RiskLevel\n';
              const rows = sites.map(s => `"${s.id}","${s.name}","${s.operatorName}",${s.wardNumber},"${s.riverBasin}","${s.resourceType}","${s.ieeStatus}",${s.approvedQuotaCuM},${s.extractedVolumeCuM},${s.royaltyAmountNPR},"${s.riskLevel}"`).join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Mining_IEE_Report_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            <span>प्रतिवेदन डाउनलोड (CSV)</span>
          </button>
        </div>
      </div>

      {/* ── TOP KPI METRIC CARDS ────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Card 1: Sites */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Waves size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>स्वीकृत नदीजन्य खानी बिन्दु</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              {toNepaliDigits(stats?.totalMiningSites ?? 4)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>स्थान</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>सक्रिय: {toNepaliDigits(stats?.activeMiningSites ?? 3)} | रोक्का: {toNepaliDigits(stats?.suspendedMiningSites ?? 1)}</div>
          </div>
        </div>

        {/* Card 2: Extraction Volume vs Quota */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mountain size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>उत्खनन परिमाण / स्वीकृत कोटा</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              {toNepaliDigits(stats?.totalExtractedCuM ?? 59600)} / {toNepaliDigits(stats?.totalQuotaCuM ?? 85000)} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>m³</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>कुल प्रगति: {toNepaliDigits(stats?.extractionPercent ?? 70.1)}%</div>
          </div>
        </div>

        {/* Card 3: Royalty NPR */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>राजस्व तथा रोयल्टी संकलन</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              रु. {toNepaliDigits(((stats?.totalRoyaltyNPR ?? 6610000) / 100000).toFixed(1))} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>लाख</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>विपद् राहत तथा वातावरण कोष</div>
          </div>
        </div>

        {/* Card 4: Community Forests */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trees size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>सामुदायिक वन तथा जलाधार</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              {toNepaliDigits(stats?.totalForestAreaHectares ?? 768.5)} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>हेक्टर</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>वृक्षारोपण: {toNepaliDigits(stats?.totalTreesPlanted ?? 7700)} बिरुवा</div>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION TABS ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem', gap: '0.5rem', overflowX: 'auto' }}>
        {[
          { key: 'mining_sites', label: 'नदीजन्य खानी तथा क्रसर अनुगमन', icon: <Waves size={16} />, count: sites.length },
          { key: 'iee_compliance', label: 'IEE वातावरणीय परीक्षण तथा मापदण्ड', icon: <FileCheck size={16} />, count: ieeRecords.length },
          { key: 'community_forests', label: 'सामुदायिक वन तथा जलाधार संरक्षण', icon: <Trees size={16} />, count: communityForests.length },
          { key: 'inspections', label: 'स्थलगत निरीक्षण, अलर्ट तथा कारबाही', icon: <ShieldAlert size={16} />, count: inspections.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.key ? '#059669' : '#64748b',
              borderBottom: activeTab === tab.key ? '3px solid #059669' : '3px solid transparent',
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              style={{
                backgroundColor: activeTab === tab.key ? '#d1fae5' : '#f1f5f9',
                color: activeTab === tab.key ? '#065f46' : '#64748b',
                padding: '0.1rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              {toNepaliDigits(tab.count)}
            </span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: MINING SITES ─────────────────────────────────────────── */}
      {activeTab === 'mining_sites' && (
        <div>
          {/* Filters Bar */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.85rem 1.1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="खानी नाम, ठेकेदार, जलाधार वा स्रोत खोजी..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>वडा:</span>
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="all">सबै वडा</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                  <option key={w} value={w}>वडा नं. {toNepaliDigits(w)}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>जोखिम स्तर:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                style={{ padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="all">सबै जोखिम स्तर</option>
                <option value="अति उच्च">अति उच्च (Critical)</option>
                <option value="उच्च">उच्च (High)</option>
                <option value="मध्यम">मध्यम (Moderate)</option>
              </select>
            </div>
          </div>

          {/* Mining Sites Cards List */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '1.25rem' }}>
            {sites.map((site) => {
              const quotaPercent = site.approvedQuotaCuM > 0 ? Math.round((site.extractedVolumeCuM / site.approvedQuotaCuM) * 100) : 0;
              const isOverLimit = quotaPercent >= 90;
              const isSuspended = site.monitoringStatus.includes('रोक्का') || site.ieeStatus.includes('अस्वीकृत');

              return (
                <div
                  key={site.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: `1.5px solid ${isSuspended ? '#fca5a5' : isOverLimit ? '#fcd34d' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <span
                        style={{
                          backgroundColor: isSuspended ? '#fee2e2' : '#f0fdf4',
                          color: isSuspended ? '#b91c1c' : '#15803d',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                        }}
                      >
                        {site.monitoringStatus}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.4rem 0 0.2rem 0' }}>{site.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>ठेकेदार: <strong>{site.operatorName}</strong></div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          backgroundColor: site.riskLevel.includes('अति उच्च') ? '#dc2626' : site.riskLevel.includes('उच्च') ? '#ea580c' : '#0284c7',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                        }}
                      >
                        {site.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Extraction Progress */}
                  <div style={{ marginBottom: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#64748b' }}>उत्खनन परिमाण: <strong>{toNepaliDigits(site.extractedVolumeCuM)} m³</strong></span>
                      <span style={{ fontWeight: 700, color: isOverLimit ? '#dc2626' : '#0f172a' }}>
                        कोटा: {toNepaliDigits(site.approvedQuotaCuM)} m³ ({toNepaliDigits(quotaPercent)}%)
                      </span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(quotaPercent, 100)}%`,
                          backgroundColor: isSuspended ? '#ef4444' : isOverLimit ? '#f59e0b' : '#10b981',
                        }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '0.75rem' }}>
                    <div>वडा नं.: <strong>{toNepaliDigits(site.wardNumber)}</strong></div>
                    <div>जलाधार: <strong>{site.riverBasin}</strong></div>
                    <div>पदार्थ: <strong>{site.resourceType}</strong></div>
                    <div>IEE दर्ता: <strong>{site.ieeRegistrationNo}</strong></div>
                    <div>रोयल्टी: <strong>रु. {toNepaliDigits(site.royaltyAmountNPR)}</strong></div>
                    <div>क्रसर दूरी: <strong>{toNepaliDigits(site.crusherDistanceKm)} कि.मि.</strong></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                    <div>अन्तिम निरीक्षण: {site.lastInspectedBs}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => alert(`खानी स्थान जीपीएस: Lat: ${site.gpsCoordinates.lat}, Lng: ${site.gpsCoordinates.lng}\n३डी डिजिटल ट्विनमा देखाइँदैछ...`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <MapPin size={13} />
                        <span>नक्सामा हेर्नुहोस्</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: IEE COMPLIANCE ──────────────────────────────────────── */}
      {activeTab === 'iee_compliance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <FileCheck size={22} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#065f46' }}>
              <strong>वातावरण संरक्षण ऐन २०७६ तथा स्थानीय सरकार सञ्चालन ऐन २०७४:</strong> नदीजन्य पदार्थ उत्खनन, ग्रामीण सडक तथा पूर्वाधार आयोजना सञ्चालन पूर्व अनिवार्य प्रारम्भिक वातावरणीय परीक्षण (IEE) प्रतिवेदन स्वीकृत गरी वातावरणीय प्रभाव न्युनिकरण बजेट विनियोजन गर्नुपर्दछ।
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>आयोजना / IEE प्रतिवेदन</th>
                  <th style={{ padding: '0.85rem 1rem' }}>प्रस्तावक तथा परामर्शदाता</th>
                  <th style={{ padding: '0.85rem 1rem' }}>स्वीकृति मिति</th>
                  <th style={{ padding: '0.85rem 1rem' }}>स्थिति</th>
                  <th style={{ padding: '0.85rem 1rem' }}>न्युनिकरण बजेट (रु.)</th>
                  <th style={{ padding: '0.85rem 1rem' }}>वृक्षारोपण प्रगति</th>
                  <th style={{ padding: '0.85rem 1rem' }}>कार्य</th>
                </tr>
              </thead>
              <tbody>
                {ieeRecords.map((iee) => (
                  <tr key={iee.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.9rem 1rem', maxWidth: '280px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{iee.projectTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{iee.keyRecommendations}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div>{iee.proponent}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{iee.consultant}</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>{iee.approvalDateBs}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {iee.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                      रु. {toNepaliDigits(iee.allocatedMitigationBudgetNPR)}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: '#15803d' }}>
                        {toNepaliDigits(iee.treesPlanted)} / {toNepaliDigits(iee.treePlantationTarget)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>बिरुवा रोपिएको</div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <button
                        onClick={() => alert(`IEE प्रतिवेदन: ${iee.projectTitle}\nनियमन तथा अनुगमन निकाय: ${iee.monitoringAuthority}\nसिफारिस: ${iee.keyRecommendations}`)}
                        style={{ padding: '0.35rem 0.65rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        पूर्ण विवरण
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: COMMUNITY FORESTS ───────────────────────────────────── */}
      {activeTab === 'community_forests' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {communityForests.map((cf) => (
            <div
              key={cf.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ padding: '0.6rem', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                  <Trees size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.2rem 0' }}>{cf.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>उपभोक्ता समूह: <strong>{cf.cfugName}</strong> (वडा नं. {toNepaliDigits(cf.wardNumber)})</div>
                </div>
              </div>

              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div>क्षेत्रफल: <strong>{toNepaliDigits(cf.areaHectares)} हेक्टर</strong> | आबद्ध घरधुरी: <strong>{toNepaliDigits(cf.totalHouseholds)}</strong></div>
                <div>विपद् रोकथाम भूमिका: <strong style={{ color: '#059669' }}>{cf.conservationRole}</strong></div>
                <div>डढेलो जोखिम: <strong style={{ color: cf.forestFireRisk.includes('उच्च') ? '#ea580c' : '#0284c7' }}>{cf.forestFireRisk}</strong></div>
                <div>संरक्षण गस्ती टोली: <strong>{toNepaliDigits(cf.patrolTeamCount)} जना स्वयम्सेवक</strong></div>
                <div>मुख्य वनस्पति: {cf.treeSpecies}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, backgroundColor: '#f0fdf4', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  ✓ {cf.status}
                </span>
                <button
                  onClick={() => alert(`सामुदायिक वन: ${cf.name}\nजलाधार तथा पहिरो जोखिम न्यूनीकरण नक्सा लोड गरिँदैछ...`)}
                  style={{ fontSize: '0.75rem', color: '#2563eb', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  जीआईएस सीमा हेर्नुहोस् →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 4: INSPECTIONS & ALERTS ─────────────────────────────────── */}
      {activeTab === 'inspections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>स्थलगत वातावरणीय निरीक्षण तथा कारबाही अभिलेख</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '1rem' }}>
            {inspections.map((insp) => (
              <div
                key={insp.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>निरीक्षण मिति: {insp.inspectionDateBs}</span>
                  <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                    {insp.status}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem 0' }}>{insp.siteName}</h4>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem' }}>
                  निरीक्षक: <strong>{insp.inspectorName}</strong>
                </div>
                <div style={{ fontSize: '0.82rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.6rem', color: '#991b1b', marginBottom: '0.5rem' }}>
                  <strong>कैफियत / उजुरी:</strong> {insp.violationsFound}
                </div>
                <div style={{ fontSize: '0.82rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.6rem', color: '#166534' }}>
                  <strong>कारबाही / निर्देशन:</strong> {insp.actionTaken}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: ADD MINING SITE ───────────────────────────────────────── */}
      {isSiteModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
              maxWidth: '560px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>नयाँ नदीजन्य खानी तथा उत्खनन बिन्दु दर्ता</h3>
              <button onClick={() => setIsSiteModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSite} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>खानी / बगर स्थान नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. मेलम्ची बगर गिट्टी-बालुवा संकलन क्षेत्र"
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>ठेकेदार / सञ्चालक संस्था *</label>
                  <input
                    type="text"
                    required
                    placeholder="कम्पनी वा उपभोक्ता समिति"
                    value={newSite.operatorName}
                    onChange={(e) => setNewSite({ ...newSite, operatorName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>वडा नम्बर</label>
                  <select
                    value={newSite.wardNumber}
                    onChange={(e) => setNewSite({ ...newSite, wardNumber: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                      <option key={w} value={w}>वडा नं. {toNepaliDigits(w)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>जलाधार / नदी नाम</label>
                  <input
                    type="text"
                    value={newSite.riverBasin}
                    onChange={(e) => setNewSite({ ...newSite, riverBasin: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>स्वीकृत IEE कोटा (m³)</label>
                  <input
                    type="number"
                    value={newSite.approvedQuotaCuM}
                    onChange={(e) => setNewSite({ ...newSite, approvedQuotaCuM: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>जोखिम स्तर</label>
                  <select
                    value={newSite.riskLevel}
                    onChange={(e) => setNewSite({ ...newSite, riskLevel: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="अति उच्च (बाढी संवेदनशीलता)">अति उच्च (Critical)</option>
                    <option value="उच्च (बाढी संवेदनशीलता)">उच्च (High)</option>
                    <option value="मध्यम">मध्यम (Moderate)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>अनुगमन स्थिति</label>
                  <select
                    value={newSite.monitoringStatus}
                    onChange={(e) => setNewSite({ ...newSite, monitoringStatus: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    <option value="सक्रिय अनुगमन">सक्रिय अनुगमन</option>
                    <option value="नियमित">नियमित</option>
                    <option value="सतर्कता निर्देशन">सतर्कता निर्देशन</option>
                    <option value="कारबाही तथा रोक्का">कारबाही तथा रोक्का</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsSiteModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={createSiteMutation.isPending}
                  style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', backgroundColor: '#059669', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  {createSiteMutation.isPending ? 'दर्ता हुँदैछ...' : 'दर्ता सुरक्षित गर्नुहोस्'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

