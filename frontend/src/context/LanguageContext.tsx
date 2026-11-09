import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'np' | 'en';

interface Translations {
  [key: string]: {
    np: string;
    en: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & General
  'app.name': {
    np: 'नेपाल एकीकृत विपद् जोखिम व्यवस्थापन प्रणाली (NIDRMS)',
    en: 'Nepal Integrated Disaster Risk Management System (NIDRMS)',
  },
  'app.tagline': {
    np: 'जोखिम नक्साङ्कन । पूर्वसूचना तथा प्रतिकार्य । उद्धार र पुनर्निर्माण',
    en: 'Multi-Hazard Risk Mapping | Early Warning & Rapid Response | Rescue & Resilient Reconstruction',
  },

  // Navigation
  'nav.home': { np: 'गृहपृष्ठ', en: 'Home' },
  'nav.command_dashboard': { np: 'एकीकृत कमान्ड ड्यासबोर्ड', en: 'Integrated Command Dashboard' },
  'nav.ai_copilot': { np: 'एआई पालिका सहायक', en: 'AI Palika Copilot' },
  'nav.disaster_mgmt': { np: 'विपद् जोखिम व्यवस्थापन', en: 'Disaster Risk Management' },
  'nav.river_twin': { np: 'नदी जलसतह तथा ३D डुबान सिमुलेटर', en: 'River Water Level & 3D Inundation Twin' },
  'nav.national_gateway': { np: 'राष्ट्रिय तथ्याङ्क मापदण्ड तथा DHM/BIPAD', en: 'National Data Standard & DHM/BIPAD Gateways' },
  'nav.landslide': { np: 'पहिरो जोखिम तथा इन्क्लिनोमिटर', en: 'Landslide Risk & Inclinometers' },
  'nav.siren': { np: 'स्वचालित IVR कल र मेश-साइरन', en: 'Automated IVR Calls & Mesh Siren' },
  'nav.micro_vulnerability': { np: 'अति-संवेदनशील नागरिक (५,८०५ घरधुरी)', en: 'Micro-Vulnerable Citizens (5,805 HH)' },
  'nav.rdra_damage': { np: 'डिजिटल क्षति मूल्याङ्कन (RDRA राहत)', en: 'Rapid Damage Assessment (RDRA Relief)' },
  'nav.heavy_equipment': { np: 'खोज-उद्धार (SAR) र डोजर डाइरेक्टरी', en: 'SAR & Heavy Equipment Directory' },
  'nav.offline_mesh': { np: 'अफलाइन सञ्चालन (PWA) र VHF रेडियो', en: 'Offline-First PWA & VHF Radio' },
  'nav.shelters': { np: 'सुरक्षित आश्रयस्थल र राहत मौज्दात', en: 'Evacuation Shelters & Relief Stock' },
  'nav.cctv': { np: 'CCTV क्यामेरा लाइभ सर्भिलेन्स', en: 'CCTV Live Video Surveillance' },
  'nav.audit_logs': { np: 'प्रणाली अडिट ट्रेल तथा सुरक्षा लग', en: 'Audit Trail & Security Logs' },
  'nav.gis_3d': { np: '३D/जीआईएस विपद् नक्सा', en: '3D/GIS Hazard Map' },
  'nav.pwa': { np: 'नागरिक एप (PWA)', en: 'Citizen PWA App' },
  'nav.login': { np: 'कर्मचारी लगइन', en: 'Staff Login' },
  'nav.logout': { np: 'लगआउट', en: 'Logout' },

  // Tiers & Governance
  'tier.level': { np: 'तह', en: 'Tier' },
  'tier.1': { np: 'तह १: वडा स्तर', en: 'Tier 1: Ward Level' },
  'tier.2': { np: 'तह २: स्थानीय आपत्कालीन केन्द्र (LEOC)', en: 'Tier 2: Local EOC (LEOC)' },
  'tier.3': { np: 'तह ३: जिल्ला आपत्कालीन केन्द्र (DEOC)', en: 'Tier 3: District EOC (DEOC)' },
  'tier.4': { np: 'तह ४: सुरक्षा निकाय (Security Forces)', en: 'Tier 4: Security Forces' },
  'tier.5': { np: 'तह ५: प्रादेशिक आपत्कालीन केन्द्र (PEOC)', en: 'Tier 5: Provincial EOC (PEOC)' },
  'tier.6': { np: 'तह ६: राष्ट्रिय आपत्कालीन केन्द्र (NEOC)', en: 'Tier 6: National EOC (NEOC)' },

  // Disaster Telemetry
  'disaster.river_level': { np: 'मेलम्ची नदी जलसतह', en: 'Melamchi River Water Level' },
  'disaster.rain_24h': { np: 'भोताङ वर्षा (२४ घण्टा)', en: 'Bhotang 24h Rain' },
  'disaster.landslide_speed': { np: 'मानेखर्क पहिरो चाल', en: 'Manekharka Landslide Movement' },
  'disaster.certified_shelters': { np: 'प्रमाणित आश्रयस्थल', en: 'Certified Shelters' },
  'disaster.warning_threshold': { np: 'सतर्कता तह', en: 'Warning Level' },
  'disaster.danger_threshold': { np: 'खतरा तह', en: 'Danger Level' },
  'disaster.normal_status': { np: 'सामान्य बहाव', en: 'Normal Flow' },
  'disaster.warning_status': { np: 'सतर्कता तह', en: 'Warning Watch' },
  'disaster.danger_status': { np: 'उच्च खतरा', en: 'Critical Danger' },
  'disaster.rising': { np: 'बढ्दो क्रम', en: 'Rising' },
  'disaster.falling': { np: 'घट्दो क्रम', en: 'Falling' },
  'disaster.steady': { np: 'स्थिर', en: 'Steady' },

  // Actions & Buttons
  'btn.search': { np: 'खोज्नुहोस्', en: 'Search' },
  'btn.refresh': { np: 'अहिले ताजा गर्नुहोस्', en: 'Refresh Now' },
  'btn.sync': { np: 'सिङ्क गर्नुहोस्', en: 'Sync Gateway' },
  'btn.download': { np: 'डाउनलोड', en: 'Download' },
  'btn.export_geojson': { np: 'GeoJSON निर्यात', en: 'Export GeoJSON' },
  'btn.test_siren': { np: '🚨 आपतकालीन साइरन परीक्षण', en: '🚨 Test Emergency Siren' },
  'btn.sar_dispatch': { np: 'आधिकारिक SAR परिचालन आदेश पठाउनुहोस्', en: 'Transmit SAR Dispatch Order' },
  'btn.change_scope': { np: 'क्षेत्राधिकार परिवर्तन', en: 'Change Jurisdiction' },
  'btn.apply': { np: 'लागू गर्नुहोस्', en: 'Apply Scope' },
  'btn.close': { np: 'बन्द गर्नुहोस्', en: 'Close' },

  // Gateways
  'gateway.dhm': { np: 'जल तथा मौसम विज्ञान विभाग (DHM)', en: 'Dept. of Hydrology & Meteorology (DHM)' },
  'gateway.bipad': { np: 'राष्ट्रिय विपद् पोर्टल (BIPAD)', en: 'National BIPAD Portal (NDRRMA)' },
  'gateway.na': { np: 'नेपाली सेना (NA)', en: 'Nepali Army (NA)' },
  'gateway.apf': { np: 'सशस्त्र प्रहरी बल (APF)', en: 'Armed Police Force (APF)' },
  'gateway.np': { np: 'नेपाल प्रहरी (NP)', en: 'Nepal Police (NP)' },
  'gateway.score': { np: 'राष्ट्रिय मापदण्ड अनुपालन दर', en: 'National Standard Compliance Score' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  isNepali: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('p5_language');
    return saved === 'en' ? 'en' : 'np';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('p5_language', lang);
    document.documentElement.lang = lang === 'np' ? 'ne' : 'en';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'np' ? 'en' : 'np');
  };

  const t = (key: string, fallback?: string): string => {
    const entry = DICTIONARY[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language === 'np' ? 'ne' : 'en';
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isNepali: language === 'np',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

