import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, toggleLanguage, isNepali } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: compact ? '0.3rem 0.55rem' : '0.35rem 0.75rem',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        border: '1.5px solid #cbd5e1',
        cursor: 'pointer',
        fontWeight: 800,
        fontSize: '0.78rem',
        color: '#0f172a',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      title={isNepali ? 'Switch interface to English' : 'इन्टरफेस नेपालीमा रूपान्तरण गर्नुहोस्'}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
        e.currentTarget.style.borderColor = '#0284c7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.borderColor = '#cbd5e1';
      }}
    >
      <Globe size={14} color="#0284c7" />
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <span
          style={{
            color: isNepali ? '#dc2626' : '#64748b',
            fontWeight: isNepali ? 900 : 600,
          }}
        >
          नेपाली
        </span>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <span
          style={{
            color: !isNepali ? '#0284c7' : '#64748b',
            fontWeight: !isNepali ? 900 : 600,
          }}
        >
          EN
        </span>
      </span>
    </button>
  );
};

export default LanguageSwitcher;

