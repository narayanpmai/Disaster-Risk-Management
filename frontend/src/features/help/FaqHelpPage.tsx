import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Headphones,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { FAQ_ITEMS, FAQ_CATEGORIES, USER_GUIDES, IT_SUPPORT_INFO } from './faqData';

export const FaqHelpPage: React.FC = () => {
  const { isNepali } = useLanguage();
  const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'support'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Support inquiry state
  const [ticketForm, setTicketForm] = useState({
    name: '',
    department: 'विपद् व्यवस्थापन तथा LEOC शाखा',
    email: '',
    phone: '',
    subject: '',
    message: '',
    priority: 'सामान्य',
  });
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Filtered FAQ Items
  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const question = (isNepali ? item.questionNp : item.questionEn).toLowerCase();
      const answer = (isNepali ? item.answerNp : item.answerEn).toLowerCase();
      return (
        question.includes(q) ||
        answer.includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory, isNepali]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setTicketForm({
        name: '',
        department: isNepali ? 'विपद् व्यवस्थापन तथा LEOC शाखा' : 'Disaster Management & LEOC Section',
        email: '',
        phone: '',
        subject: '',
        message: '',
        priority: isNepali ? 'सामान्य' : 'Normal',
      });
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
      {/* ─── HERO HEADER BANNER ─── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%)',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background ambient decor */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '180px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.18)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            <Sparkles size={14} />
            <span>{isNepali ? 'विपद् कमाण्ड तथा प्रतिकार्य सहायता केन्द्र' : 'Disaster EOC & Response Help Desk'}</span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            {isNepali ? 'प्रायः सोधिने प्रश्नहरू तथा प्रयोगकर्ता सहायता (FAQ & Help)' : 'Frequently Asked Questions & User Guides (FAQ & Help)'}
          </h1>
          <p style={{ fontSize: '0.95rem', opacity: 0.92, margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
            {isNepali
              ? 'विपद् जोखिम व्यवस्थापन, नदी जलसतह पूर्वसूचना, पहिरो सेन्सर, खोज-उद्धार (SAR), राहत वितरण तथा अफलाइन PWA सञ्चालन सम्बन्धी सम्पूर्ण कार्यविधि (SOP) र सहयोग।'
              : 'Standard Operating Procedures (SOPs), real-time river flood telemetry, landslide slope sensors, SAR rescue dispatch, and offline field PWA sync instructions.'}
          </p>

          {/* Quick Search Bar */}
          <div style={{ position: 'relative', maxWidth: '620px' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              className="dt-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isNepali
                ? 'कुनै पनि विपद् प्रक्रिया, पूर्वसूचना, साइरन, खोज-उद्धार वा राहत सम्बन्धी खोज्नुहोस्...'
                : 'Search disaster SOPs, flood alerts, SAR rescue protocols, offline PWA...'}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '12px',
                paddingLeft: '48px',
                paddingRight: '16px',
                fontSize: '0.95rem',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: 'none',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── NAVIGATION TABS ─── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          padding: '0.5rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('faq')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'faq' ? '#2563eb' : 'transparent',
            color: activeTab === 'faq' ? '#ffffff' : '#475569',
            boxShadow: activeTab === 'faq' ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <HelpCircle size={18} />
          <span>{isNepali ? 'प्रायः सोधिने प्रश्नहरू (FAQ)' : 'Frequently Asked Questions (FAQ)'}</span>
          <span style={{ backgroundColor: activeTab === 'faq' ? 'rgba(255,255,255,0.22)' : '#e2e8f0', padding: '1px 8px', borderRadius: '10px', fontSize: '0.74rem' }}>
            {filteredFaqs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guides')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'guides' ? '#059669' : 'transparent',
            color: activeTab === 'guides' ? '#ffffff' : '#475569',
            boxShadow: activeTab === 'guides' ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={18} />
          <span>{isNepali ? 'प्रयोगकर्ता निर्देशिका (User Guides)' : 'Standard Operating Procedures (User Guides)'}</span>
          <span style={{ backgroundColor: activeTab === 'guides' ? 'rgba(255,255,255,0.22)' : '#e2e8f0', padding: '1px 8px', borderRadius: '10px', fontSize: '0.74rem' }}>
            {USER_GUIDES.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            backgroundColor: activeTab === 'support' ? '#7c3aed' : 'transparent',
            color: activeTab === 'support' ? '#ffffff' : '#475569',
            boxShadow: activeTab === 'support' ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Headphones size={18} />
          <span>{isNepali ? 'आपतकालीन EOC सहायता डेस्क (IT Support)' : 'Emergency EOC Helpdesk (IT Support)'}</span>
        </button>
      </div>

      {/* ─── TAB 1: FAQ ACCORDIONS ─── */}
      {activeTab === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
              {isNepali ? 'वर्ग छान्नुहोस्:' : 'Filter Category:'}
            </span>
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: isActive ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: isActive ? '#eff6ff' : '#ffffff',
                    color: isActive ? '#1d4ed8' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isNepali ? cat.labelNp : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion List */}
          {filteredFaqs.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                color: '#64748b',
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Search size={22} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.25rem 0' }}>
                {isNepali ? 'कुनै प्रश्न फेला परेन' : 'No matching questions found'}
              </h3>
              <p style={{ fontSize: '0.88rem', margin: 0 }}>
                {isNepali ? 'कृपया खोज शब्द सच्याउनुहोस् वा अन्य वर्ग चयन गर्नुहोस्।' : 'Please check your search terms or select another category.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                const questionText = isNepali ? faq.questionNp : faq.questionEn;
                const answerText = isNepali ? faq.answerNp : faq.answerEn;

                return (
                  <div
                    key={faq.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: isExpanded ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                      boxShadow: isExpanded ? '0 4px 14px rgba(37, 99, 235, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      style={{
                        width: '100%',
                        padding: '1.1rem 1.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        background: isExpanded ? '#f8fafc' : '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ fontSize: '0.98rem', fontWeight: 800, color: isExpanded ? '#1d4ed8' : '#1e293b', lineHeight: 1.4 }}>
                        {questionText}
                      </span>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isExpanded ? '#eff6ff' : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isExpanded ? '#2563eb' : '#64748b',
                          flexShrink: 0,
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div
                        style={{
                          padding: '0.85rem 1.35rem 1.35rem',
                          fontSize: '0.92rem',
                          color: '#334155',
                          lineHeight: 1.7,
                          borderTop: '1px solid #f1f5f9',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {answerText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: STEP-BY-STEP USER GUIDES ─── */}
      {activeTab === 'guides' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {USER_GUIDES.map((guide) => (
              <div
                key={guide.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                      {isNepali ? guide.categoryNp : guide.categoryEn}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', margin: '0.4rem 0 0 0' }}>
                      {isNepali ? guide.titleNp : guide.titleEn}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    <Clock size={12} /> {isNepali ? guide.readTimeNp : guide.readTimeEn}
                  </span>
                </div>

                {/* Steps List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {guide.steps.map((step) => (
                    <div key={step.stepNo} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        {step.stepNo}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                          {isNepali ? step.titleNp : step.titleEn}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginTop: '2px' }}>
                          {isNepali ? step.descNp : step.descEn}
                        </div>
                        {(isNepali ? step.tipNp : step.tipEn) && (
                          <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#0284c7', backgroundColor: '#f0f9ff', padding: '3px 8px', borderRadius: '4px' }}>
                            💡 <strong>{isNepali ? 'सुझाव:' : 'Tip:'}</strong> {isNepali ? step.tipNp : step.tipEn}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: IT SUPPORT & HELPDESK ─── */}
      {activeTab === 'support' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {/* Left Column: Support Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
              boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#faf5ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Headphones size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  {isNepali ? 'प्राविधिक समस्या वा जिज्ञासा दर्ता गर्नुहोस्' : 'Submit Technical Inquiry or Issue Ticket'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  {isNepali
                    ? 'प्रणाली सञ्चालन सम्बन्धी कुनै प्राविधिक समस्या भएमा तुरुन्त सन्देश पठाउनुहोस्।'
                    : 'Submit telemetry errors, VHF radio communications faults, or user inquiries.'}
                </p>
              </div>
            </div>

            {ticketSuccess ? (
              <div style={{ padding: '2rem 1.5rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: '0 0 4px 0' }}>
                  {isNepali ? 'तपाईंको जिज्ञासा सफलतापूर्वक दर्ता भयो!' : 'Your ticket has been successfully registered!'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#15803d', margin: 0 }}>
                  {isNepali
                    ? 'सूचना प्रविधि तथा EOC शाखाले यसलाई प्राथमिकताका साथ हेरेर शीघ्र सम्पर्क गर्नेछ।'
                    : 'The IT & LEOC Command Desk will review your submission and contact you shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {isNepali ? 'तपाईंको नाम *' : 'Your Full Name *'}
                    </label>
                    <input
                      className="dt-input"
                      placeholder={isNepali ? 'उदा. राम बहादुर थापा' : 'e.g. Ram Bahadur Thapa'}
                      value={ticketForm.name}
                      onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                      required
                      style={{ height: '36px', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {isNepali ? 'शाखा / पद *' : 'Section / Role *'}
                    </label>
                    <input
                      className="dt-input"
                      value={ticketForm.department}
                      onChange={(e) => setTicketForm({ ...ticketForm, department: e.target.value })}
                      required
                      style={{ height: '36px', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {isNepali ? 'सम्पर्क फोन / मोबाइल *' : 'Phone / Mobile *'}
                    </label>
                    <input
                      className="dt-input"
                      placeholder={isNepali ? '९८xxxxxxxx' : '98xxxxxxxx'}
                      value={ticketForm.phone}
                      onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                      required
                      style={{ height: '36px', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {isNepali ? 'प्राथमिकता' : 'Priority'}
                    </label>
                    <select
                      className="dt-select"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      style={{ height: '36px', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                    >
                      <option value={isNepali ? 'सामान्य' : 'Normal'}>{isNepali ? 'सामान्य (Normal)' : 'Normal'}</option>
                      <option value={isNepali ? 'जरुरी' : 'Urgent'}>{isNepali ? 'जरुरी (Urgent)' : 'Urgent'}</option>
                      <option value={isNepali ? 'अति जरुरी' : 'Critical'}>{isNepali ? 'अति जरुरी (Critical Issue)' : 'Critical Issue'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    {isNepali ? 'समस्याको विषय (Subject) *' : 'Subject *'}
                  </label>
                  <input
                    className="dt-input"
                    placeholder={isNepali ? 'उदा. जलसतह सेन्सर अफलाइन भएको सम्बन्धी...' : 'e.g. Telemetry sensor offline alert issue...'}
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    required
                    style={{ height: '36px', fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 10px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    {isNepali ? 'विस्तृत विवरण (Description) *' : 'Detailed Description *'}
                  </label>
                  <textarea
                    className="dt-input"
                    rows={4}
                    placeholder={isNepali ? 'समस्याको पूर्ण विवरण यहाँ लेख्नुहोस्...' : 'Describe the exact issue or question here...'}
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem', width: '100%', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '8px 10px' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    backgroundColor: '#7c3aed',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                    marginTop: '0.5rem',
                  }}
                >
                  <Send size={16} />
                  <span>{isNepali ? 'सहायता अनुरोध पठाउनुहोस्' : 'Submit Support Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: IT Office Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {isNepali ? 'आधिकारिक आपतकालीन सम्पर्क केन्द्र' : 'Official Emergency Command Center'}
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: '0 0 1rem 0' }}>
                {isNepali ? IT_SUPPORT_INFO.municipalityNp : IT_SUPPORT_INFO.municipalityEn}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', color: '#334155' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <MapPin size={16} color="#2563eb" />
                  <span>{isNepali ? IT_SUPPORT_INFO.headquartersNp : IT_SUPPORT_INFO.headquartersEn}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} color="#059669" />
                  <span>{isNepali ? 'फोन' : 'Phone'}: <strong>{IT_SUPPORT_INFO.phone}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Mail size={16} color="#dc2626" />
                  <span>{isNepali ? 'ईमेल' : 'Email'}: <strong>{IT_SUPPORT_INFO.email}</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Clock size={16} color="#d97706" />
                  <span>{isNepali ? 'समय' : 'Hours'}: {isNepali ? IT_SUPPORT_INFO.officeHoursNp : IT_SUPPORT_INFO.officeHoursEn}</span>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                borderRadius: '16px',
                border: '1.5px solid #fca5a5',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
                <AlertCircle size={18} />
                <span>{isNepali ? 'निःशुल्क हटलाइन तथा आपतकालीन च्यानलहरू' : 'Toll-Free Hotlines & Emergency Channels'}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#7f1d1d', lineHeight: 1.6 }}>
                <div>{isNepali ? 'टोल-फ्री नम्बर' : 'Toll-Free'}: <strong>{isNepali ? IT_SUPPORT_INFO.tollFreeNp : IT_SUPPORT_INFO.tollFreeEn}</strong></div>
                <div>{isNepali ? 'विपद् व्यवस्थापन हटलाइन' : 'EOC Hotline'}: <strong>{isNepali ? IT_SUPPORT_INFO.emergencyHotlineNp : IT_SUPPORT_INFO.emergencyHotlineEn}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqHelpPage;
