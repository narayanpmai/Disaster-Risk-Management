import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── ६-तहको राष्ट्रिय विपद् अधिकार ढाँचा (6-Tier Hierarchical Governance Scope) ───
export interface GovernanceTier {
  id: string;
  tierLevel: 1 | 2 | 3 | 4 | 5 | 6;
  nameNepali: string;
  nameEn: string;
  badgeLabel: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  permissions: string[];
  entityScope: 'ward' | 'palika' | 'district' | 'security_forces' | 'province' | 'federal';
}

export interface PalikaJurisdiction {
  id: string;
  subdomain: string;
  nameNepali: string;
  nameEn: string;
  district: string;
  province: string;
  totalWards: number;
  activeRiverBasin: string;
  headquarters: string;
  emergencyContact: string;
}

export const NATIONAL_PALIKAS: PalikaJurisdiction[] = [
  {
    id: 'f07c2bcc-81ad-4e27-aeff-1a65f04e9f06',
    subdomain: 'panchpokhari',
    nameNepali: 'पाँचपोखरी थाङपाल गाउँपालिका',
    nameEn: 'Panchpokhari Thangpal Rural Municipality',
    district: 'सिन्धुपाल्चोक',
    province: 'बागमती प्रदेश',
    totalWards: 8,
    activeRiverBasin: 'मेलम्ची तथा याङ्ग्री-लार्के जलाधार',
    headquarters: 'थाङपालधाप',
    emergencyContact: '०११-६९०१२३',
  },
  {
    id: 'a18b3cde-92be-5f38-bf00-2b76f15fa017',
    subdomain: 'helambu',
    nameNepali: 'हेलम्बु गाउँपालिका',
    nameEn: 'Helambu Rural Municipality',
    district: 'सिन्धुपाल्चोक',
    province: 'बागमती प्रदेश',
    totalWards: 7,
    activeRiverBasin: 'मेलम्ची मुहान भेग',
    headquarters: 'हेलम्बु',
    emergencyContact: '०११-६९०४५६',
  },
  {
    id: 'b29c4def-03cf-6a49-cf11-3c87f26ab128',
    subdomain: 'melamchi',
    nameNepali: 'मेलम्ची नगरपालिका',
    nameEn: 'Melamchi Municipality',
    district: 'सिन्धुपाल्चोक',
    province: 'बागमती प्रदेश',
    totalWards: 12,
    activeRiverBasin: 'मेलम्ची-इन्द्रावती दोभान',
    headquarters: 'मेलम्ची बजार',
    emergencyContact: '०११-६९०७८९',
  },
  {
    id: 'c30d5ef0-14d0-7b5a-d022-4d98a37bc239',
    subdomain: 'indrawati',
    nameNepali: 'इन्द्रावती गाउँपालिका',
    nameEn: 'Indrawati Rural Municipality',
    district: 'सिन्धुपाल्चोक',
    province: 'बागमती प्रदेश',
    totalWards: 12,
    activeRiverBasin: 'इन्द्रावती मुख्य बहाव',
    headquarters: 'भिमटार/नवलपुर',
    emergencyContact: '०११-६९०९००',
  },
  {
    id: 'd41e6fa1-25e1-8c6b-e133-5ea9b48cd340',
    subdomain: 'kathmandu',
    nameNepali: 'काठमाडौँ महानगरपालिका',
    nameEn: 'Kathmandu Metropolitan City',
    district: 'काठमाडौँ',
    province: 'बागमती प्रदेश',
    totalWards: 32,
    activeRiverBasin: 'बागमती तथा विष्णुमती जलाधार',
    headquarters: 'सुन्धरा/टेकु',
    emergencyContact: '११८०',
  },
  {
    id: 'e52f7ab2-36f2-9d7c-f244-6fb0c59de451',
    subdomain: 'barpak',
    nameNepali: 'बारपाक सुलिकोट गाउँपालिका',
    nameEn: 'Barpak Sulikot Rural Municipality',
    district: 'गोरखा',
    province: 'गण्डकी प्रदेश',
    totalWards: 8,
    activeRiverBasin: 'दरौँदी तथा बुढीगण्डकी जलाधार (भूकम्प केन्द्रविन्दु)',
    headquarters: 'ताकुकोट',
    emergencyContact: '०६४-४२०१११',
  },
];

export const GOVERNANCE_TIERS: GovernanceTier[] = [
  {
    id: 'tier_1_ward',
    tierLevel: 1,
    nameNepali: 'तह १: वडा स्तर (Ward Officer / वडाध्यक्ष / प्राविधिक)',
    nameEn: 'Tier 1: Ward Level Field Unit',
    badgeLabel: 'वडा स्तर',
    badgeColor: '#0284c7',
    bgColor: '#f0f9ff',
    borderColor: '#bae6fd',
    textColor: '#0369a1',
    description: 'आफ्नो वडाको मात्र ५,८०५ घरधुरी, सुत्केरी, अपाङ्गता, ज्येष्ठ नागरिक र द्रुत क्षति (RDRA) दर्ता अधिकार।',
    permissions: [
      'आफ्नो वडाको विवरण मात्र हेर्ने/दर्ता गर्ने',
      'अति-संवेदनशील नागरिक पहिचान (Micro-Vulnerability)',
      'फिल्ड फोटो तथा जीपीएस क्षति दर्ता',
      'वडास्तरीय स्वयंसेवक परिचालन',
    ],
    entityScope: 'ward',
  },
  {
    id: 'tier_2_leoc',
    tierLevel: 2,
    nameNepali: 'तह २: स्थानीय आपत्कालीन केन्द्र (LEOC - पालिका प्रमुख / विपद् अधिकृत)',
    nameEn: 'Tier 2: Local EOC / Mayor / Disaster Officer',
    badgeLabel: 'LEOC पालिका स्तर',
    badgeColor: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    textColor: '#15803d',
    description: 'पालिकाभरिको कमान्ड, LoRa सौर्य साइरन सक्रियता, IVR कल प्रसारण, डोजर परिचालन, र रु ५ लाख DBT राहत भौचर अनुमोदन।',
    permissions: [
      'सम्पूर्ण पालिकाभरिका सबै ८ वडाको पूर्ण नियन्त्रण',
      'LoRa सौर्य मेश साइरन बजाउने अधिकार (Siren Trigger)',
      'स्वचालित नेपाली IVR भ्वाइस कल प्रसारण',
      'हेभी इक्युपमेन्ट तथा डोजर परिचालन आदेश',
      'गृह मन्त्रालय २०७७ राहत दर अनुसार DBT बैंक भुक्तानी अनुमोदन',
    ],
    entityScope: 'palika',
  },
  {
    id: 'tier_3_deoc',
    tierLevel: 3,
    nameNepali: 'तह ३: जिल्ला आपत्कालीन केन्द्र (DEOC - प्रमुख जिल्ला अधिकारी / CDO)',
    nameEn: 'Tier 3: District EOC / Chief District Officer',
    badgeLabel: 'DEOC जिल्ला स्तर',
    badgeColor: '#ea580c',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    textColor: '#c2410c',
    description: 'जिल्लाभरिका १२ वटै स्थानीय तहको अनुगमन, अन्तर-पालिका डोजर समन्वय र जिल्ला राहत गोदाम व्यवस्थापन।',
    permissions: [
      'जिल्लाभरिका सबै स्थानीय तहको विपद् तथ्याङ्क एकीकृत हेर्ने',
      'अन्तर-पालिका डोजर तथा हेभी उपकरण रिक्विजिशन',
      'जिल्ला विपद् व्यवस्थापन कोष परिचालन',
      'रेडक्रस तथा गैरसरकारी संस्था राहत समन्वय',
    ],
    entityScope: 'district',
  },
  {
    id: 'tier_4_security',
    tierLevel: 4,
    nameNepali: 'तह ४: सुरक्षा निकाय कमान्ड (First Responders - नेपाल प्रहरी / APF / सेना)',
    nameEn: 'Tier 4: Security Forces & First Responders Command',
    badgeLabel: 'सुरक्षा कमान्ड',
    badgeColor: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#b91c1c',
    description: 'खोज तथा उद्धार (SAR), र्‍याफ्टिङ डुङ्गा, लाइफ ज्याकेट, टोली जीपीएस ट्र्याकिङ, र आपत्कालीन VHF/HF फ्रिक्वेन्सी।',
    permissions: [
      'खोज तथा उद्धार (SAR) लाइभ अपरेशन्स कमान्ड',
      'उद्धारकर्मी तथा र्‍याफ्टिङ डुङ्गा लाइभ ट्र्याकिङ',
      'नेपाल प्रहरी, सशस्त्र र सेनाका आपत्कालीन VHF/HF फ्रिक्वेन्सी निगरानी',
      'घटनास्थल तत्काल सिल र उद्धार मार्ग खाली गर्ने अधिकार',
    ],
    entityScope: 'security_forces',
  },
  {
    id: 'tier_5_peoc',
    tierLevel: 5,
    nameNepali: 'तह ५: प्रादेशिक आपत्कालीन केन्द्र (PEOC - बागमती प्रदेश मन्त्रालय)',
    nameEn: 'Tier 5: Provincial EOC / Ministry of Internal Affairs',
    badgeLabel: 'PEOC प्रदेश स्तर',
    badgeColor: '#7c3aed',
    bgColor: '#faf5ff',
    borderColor: '#e9d5ff',
    textColor: '#6d28d9',
    description: 'प्रदेशभरिका १३ जिल्लाको विपद् बजेट रकमान्तर, प्रादेशिक राहत भण्डार, र हेलिकप्टर उद्धार सिफारिस।',
    permissions: [
      'प्रदेशभरिका सबै जिल्लाहरूको विपद् क्षति तुलनात्मक समीक्षा',
      'प्रादेशिक विपद् राहत कोषबाट बजेट निकासा',
      'ठूला हेभी उपकरण र बेलिब्रीज अन्तर-जिल्ला ढुवानी',
      'गृह मन्त्रालयसँग हेलिकप्टर एयरलिफ्ट सिफारिस',
    ],
    entityScope: 'province',
  },
  {
    id: 'tier_6_neoc',
    tierLevel: 6,
    nameNepali: 'तह ६: राष्ट्रिय आपत्कालीन केन्द्र (NEOC - गृह मन्त्रालय / NDRRMA सिंहदरबार)',
    nameEn: 'Tier 6: National EOC / MoHA / NDRRMA Singhadurbar',
    badgeLabel: 'NEOC राष्ट्रिय स्तर',
    badgeColor: '#4338ca',
    bgColor: '#eef2ff',
    borderColor: '#c7d2fe',
    textColor: '#3730a3',
    description: 'नेपालभरका ७५३ वटै स्थानीय तहको एकीकृत BIPAD पोर्टल डाटा सिंक, विपद् संकटग्रस्त क्षेत्र घोषणा र अन्तर्राष्ट्रिय आह्वान।',
    permissions: [
      'नेपालभरिका ७५३ वटै स्थानीय तहको केन्द्रीय कमान्ड',
      'BIPAD Portal v2.0 राष्ट्रिय डाटाबेस पूर्ण आबद्धता',
      'जल तथा मौसम विज्ञान विभाग (DHM) राष्ट्रिय बाढी चेतावनी जारी',
      'विपद् संकटग्रस्त क्षेत्र घोषणा (Disaster Emergency Declaration)',
      'अन्तर्राष्ट्रिय मानवीय सहायता समन्वय (UN, Red Cross, Bilateral)',
    ],
    entityScope: 'federal',
  },
];

interface DisasterScopeContextType {
  activePalika: PalikaJurisdiction;
  activeTier: GovernanceTier;
  selectedWardNumber: number; // For Tier 1
  isScopeModalOpen: boolean;
  setIsScopeModalOpen: (open: boolean) => void;
  switchPalika: (palikaId: string) => void;
  switchTier: (tierId: string) => void;
  setWardNumber: (ward: number) => void;
  hasPermission: (permissionKeyword: string) => boolean;
}

const DisasterScopeContext = createContext<DisasterScopeContextType | undefined>(undefined);

export const DisasterScopeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePalika, setActivePalika] = useState<PalikaJurisdiction>(NATIONAL_PALIKAS[0]);
  const [activeTier, setActiveTier] = useState<GovernanceTier>(GOVERNANCE_TIERS[1]); // Default: Tier 2 LEOC
  const [selectedWardNumber, setSelectedWardNumber] = useState<number>(3); // Default: Ward 3 Bhotang
  const [isScopeModalOpen, setIsScopeModalOpen] = useState<boolean>(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const storedPalika = localStorage.getItem('drm_national_palika');
      if (storedPalika) {
        const found = NATIONAL_PALIKAS.find((p) => p.id === storedPalika || p.subdomain === storedPalika);
        if (found) setActivePalika(found);
      }

      const storedTier = localStorage.getItem('drm_governance_tier');
      if (storedTier) {
        const found = GOVERNANCE_TIERS.find((t) => t.id === storedTier);
        if (found) setActiveTier(found);
      }

      const storedWard = localStorage.getItem('drm_selected_ward');
      if (storedWard) {
        setSelectedWardNumber(Number(storedWard));
      }
    } catch (e) {
      console.warn('Failed to restore disaster scope from localStorage', e);
    }
  }, []);

  const switchPalika = useCallback((palikaId: string) => {
    const found = NATIONAL_PALIKAS.find((p) => p.id === palikaId || p.subdomain === palikaId);
    if (found) {
      setActivePalika(found);
      localStorage.setItem('drm_national_palika', found.id);
      localStorage.setItem('p5_tenant_id', found.subdomain);
      // Log scope change to console & localStorage for audit trail
      console.log(`[AUDIT EVENT] Jurisdiction switched to: ${found.nameNepali}`);
    }
  }, []);

  const switchTier = useCallback((tierId: string) => {
    const found = GOVERNANCE_TIERS.find((t) => t.id === tierId);
    if (found) {
      setActiveTier(found);
      localStorage.setItem('drm_governance_tier', found.id);
      console.log(`[AUDIT EVENT] Governance Tier switched to: ${found.nameNepali}`);
    }
  }, []);

  const setWardNumber = useCallback((ward: number) => {
    setSelectedWardNumber(ward);
    localStorage.setItem('drm_selected_ward', String(ward));
  }, []);

  const hasPermission = useCallback(
    (keyword: string) => {
      // Tier 6 NEOC has all permissions
      if (activeTier.tierLevel === 6) return true;
      return activeTier.permissions.some((p) => p.toLowerCase().includes(keyword.toLowerCase()));
    },
    [activeTier]
  );

  return (
    <DisasterScopeContext.Provider
      value={{
        activePalika,
        activeTier,
        selectedWardNumber,
        isScopeModalOpen,
        setIsScopeModalOpen,
        switchPalika,
        switchTier,
        setWardNumber,
        hasPermission,
      }}
    >
      {children}
    </DisasterScopeContext.Provider>
  );
};

export const useDisasterScope = (): DisasterScopeContextType => {
  const context = useContext(DisasterScopeContext);
  if (!context) {
    throw new Error('useDisasterScope must be used within a DisasterScopeProvider');
  }
  return context;
};

