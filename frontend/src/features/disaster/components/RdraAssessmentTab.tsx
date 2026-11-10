import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Coins,
  CheckCircle2,
  AlertTriangle,
  Building,
  Home,
  Users,
  Camera,
  MapPin,
  Printer,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  X,
  Heart,
  Sprout,
  UserX,
  FileCheck2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../../context/LanguageContext';

// ── Housing Damage Record ──────────────────────────────────────────
export interface RdraRecord {
  id: string;
  voucherNo: string;
  incidentType: string;
  beneficiaryName: string;
  matrixHouseNo: string;
  wardNo: number;
  citizenshipNo: string;
  bankName: string;
  bankAccountNo: string;
  damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)' | 'आंशिक क्षति (प्रवलीकरण)' | 'अस्थायी आवास';
  houseType: string;
  immediateFoodReliefNPR: number;
  reconstructionGrantNPR: number;
  totalReliefNPR: number;
  gpsCoords: string;
  surveyorName: string;
  surveyDateBs: string;
  status: 'मन्त्रिपरिषद्/शाखा सिफारिस' | 'बैंक खातामा निकासा सम्पन्न' | 'प्रक्रियामा';
  hasPhotoProof: boolean;
}

// ── Casualty / Missing Claim Record (MoHA 2077) ────────────────────
export interface CasualtyClaimRecord {
  id: string;
  voucherNo: string;
  incidentType: string;
  incidentDateBs: string;
  casualtyName: string;
  casualtyAge: number;
  casualtyGender: 'पुरुष' | 'महिला' | 'बालबालिका';
  casualtyType: 'मृतक (Deceased)' | 'बेपत्ता (Missing)';
  incidentLocation: string;
  wardNo: number;
  legalHeirName: string;
  heirRelation: 'हकवाला पति/पत्नी' | 'हकवाला छोरा/छोरी' | 'हकवाला बाबु/आमा';
  heirCitizenshipNo: string;
  heirContactPhone: string;
  heirBankName: string;
  heirBankAccountNo: string;
  compensationAmountNPR: number; // Statutory Rs. 200,000 (Rs. 300,000 for multiple)
  policeSarzaminDone: boolean;
  wardMuchulkaDone: boolean;
  status: 'जिल्ला विपद् कोष (DDMC) निकासा' | 'वडा मुचुल्का प्रमाणित' | 'कागजात प्रमाणीकरण चरण';
}

// ── Livestock & Crops Loss Record ──────────────────────────────────
export interface LivestockCropsLossRecord {
  id: string;
  voucherNo: string;
  farmerName: string;
  wardNo: number;
  citizenshipNo: string;
  bankName: string;
  bankAccountNo: string;
  milchCattleCount: number; // Cattle/Buffalo @ Rs. 30,000
  chauriCount: number; // Mountain Yak @ Rs. 30,000
  smallLivestockCount: number; // Goat/Sheep @ Rs. 5,000
  troutFisheryDamaged: boolean; // Trout ponds loss @ Rs. 50,000
  cropsRopaniLoss: number; // Agricultural land wash-out @ Rs. 10,000 / ropani
  totalReliefNPR: number;
  verifiedByVetOfficer: boolean;
  status: 'कृषि/पशु सेवा प्रमाणित' | 'बैंक निकासा सम्पन्न' | 'प्रक्रियामा';
}

// ── Initial Mock Data ──────────────────────────────────────────────
const INITIAL_RDRA_RECORDS: RdraRecord[] = [
  {
    id: 'rdra-1',
    voucherNo: 'RDRA-२०८१-W5-००१',
    incidentType: 'मानेखर्क पहिरो',
    beneficiaryName: 'राम बहादुर तामाङ',
    matrixHouseNo: 'THP-W5-0219',
    wardNo: 5,
    citizenshipNo: '२७-०१-७२-०३४२१',
    bankName: 'राष्ट्रिय वाणिज्य बैंक, नवलपुर शाखा',
    bankAccountNo: '१४२०१०००२९३४५००१',
    damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)',
    houseType: 'काँचो ढुङ्गा-माटो',
    immediateFoodReliefNPR: 20000,
    reconstructionGrantNPR: 500000,
    totalReliefNPR: 520000,
    gpsCoords: '27.9741° N, 85.6432° E',
    surveyorName: 'सुरेश श्रेष्ठ (प्राविधिक सहायक)',
    surveyDateBs: '२०८१-०५-०२',
    status: 'बैंक खातामा निकासा सम्पन्न',
    hasPhotoProof: true,
  },
  {
    id: 'rdra-2',
    voucherNo: 'RDRA-२०८१-W2-००२',
    incidentType: 'तिम्बु खोला बाढी कटान',
    beneficiaryName: 'फुर्बा शेर्पा',
    matrixHouseNo: 'THP-W2-0084',
    wardNo: 2,
    citizenshipNo: '२७-०१-६८-०९१२३',
    bankName: 'कृषि विकास बैंक, मेलम्ची शाखा',
    bankAccountNo: '०२१०४०००५६७८९००२',
    damageCategory: 'आंशिक क्षति (प्रवलीकरण)',
    houseType: 'अर्ध-पक्की (टिन छाना)',
    immediateFoodReliefNPR: 15000,
    reconstructionGrantNPR: 50000,
    totalReliefNPR: 65000,
    gpsCoords: '27.9412° N, 85.6189° E',
    surveyorName: 'इ. नवराज पौडेल',
    surveyDateBs: '२०८१-०५-०६',
    status: 'मन्त्रिपरिषद्/शाखा सिफारिस',
    hasPhotoProof: true,
  },
  {
    id: 'rdra-3',
    voucherNo: 'RDRA-२०८१-W7-००३',
    incidentType: 'गुन्सा बाढी डुबान',
    beneficiaryName: 'पेम्बा दोर्जे लामा',
    matrixHouseNo: 'THP-W7-0103',
    wardNo: 7,
    citizenshipNo: '२७-०१-७०-१४३२१',
    bankName: 'ग्लोबल आईएमई बैंक, सिन्धुपाल्चोक',
    bankAccountNo: '३१०१०००९८७६५४००३',
    damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)',
    houseType: 'काँचो ढुङ्गा-माटो',
    immediateFoodReliefNPR: 20000,
    reconstructionGrantNPR: 500000,
    totalReliefNPR: 520000,
    gpsCoords: '27.9892° N, 85.6812° E',
    surveyorName: 'सुरेश श्रेष्ठ (प्राविधिक सहायक)',
    surveyDateBs: '२०८१-०५-१०',
    status: 'प्रक्रियामा',
    hasPhotoProof: true,
  },
];

const INITIAL_CASUALTIES: CasualtyClaimRecord[] = [
  {
    id: 'cas-1',
    voucherNo: 'CAS-२०८१-W2-०१',
    incidentType: 'मेलम्ची बाढी आकस्मिक भल',
    incidentDateBs: '२०८१-०३-१५',
    casualtyName: 'स्व. ग्याल्जेन शेर्पा',
    casualtyAge: 48,
    casualtyGender: 'पुरुष',
    casualtyType: 'मृतक (Deceased)',
    incidentLocation: 'तिम्बु बजार किनार, वडा २',
    wardNo: 2,
    legalHeirName: 'ल्हाक्पा डोल्मा शेर्पा',
    heirRelation: 'हकवाला पति/पत्नी',
    heirCitizenshipNo: '२७-०१-७१-०४५६२',
    heirContactPhone: '९८४१२२८८०१',
    heirBankName: 'राष्ट्रिय वाणिज्य बैंक, नवलपुर',
    heirBankAccountNo: '१४२०१०००७८२३०००१',
    compensationAmountNPR: 200000,
    policeSarzaminDone: true,
    wardMuchulkaDone: true,
    status: 'जिल्ला विपद् कोष (DDMC) निकासा',
  },
  {
    id: 'cas-2',
    voucherNo: 'CAS-२०८१-W4-०२',
    incidentType: 'मानेखर्क लेदो पहिरो',
    incidentDateBs: '२०८१-०४-०२',
    casualtyName: 'कामी तामाङ',
    casualtyAge: 32,
    casualtyGender: 'पुरुष',
    casualtyType: 'बेपत्ता (Missing)',
    incidentLocation: 'डाँडागाउँ पाखो, वडा ४',
    wardNo: 4,
    legalHeirName: 'सुन्तली तामाङ',
    heirRelation: 'हकवाला पति/पत्नी',
    heirCitizenshipNo: '२७-०१-७५-०८९२१',
    heirContactPhone: '९८५११४४२२३',
    heirBankName: 'कृषि विकास बैंक',
    heirBankAccountNo: '०२१०४०००३४५६०००२',
    compensationAmountNPR: 200000,
    policeSarzaminDone: true,
    wardMuchulkaDone: true,
    status: 'वडा मुचुल्का प्रमाणित',
  },
];

const INITIAL_LIVESTOCK: LivestockCropsLossRecord[] = [
  {
    id: 'live-1',
    voucherNo: 'AGR-२०८१-W3-०१',
    farmerName: 'दावा ङिमा शेर्पा',
    wardNo: 3,
    citizenshipNo: '२७-०१-६६-१२३४५',
    bankName: 'राष्ट्रिय वाणिज्य बैंक',
    bankAccountNo: '१४२०१०००४५६७००१२',
    milchCattleCount: 2, // 60k
    chauriCount: 1, // 30k
    smallLivestockCount: 6, // 30k
    troutFisheryDamaged: false,
    cropsRopaniLoss: 3, // 30k
    totalReliefNPR: 150000,
    verifiedByVetOfficer: true,
    status: 'बैंक निकासा सम्पन्न',
  },
  {
    id: 'live-2',
    voucherNo: 'AGR-२०८१-W2-०२',
    farmerName: 'सुर्य बहादुर बस्नेत',
    wardNo: 2,
    citizenshipNo: '२७-०१-६९-०९८७६',
    bankName: 'ग्लोबल आईएमई बैंक',
    bankAccountNo: '३१०१०००१२३४५०००४',
    milchCattleCount: 1, // 30k
    chauriCount: 0,
    smallLivestockCount: 4, // 20k
    troutFisheryDamaged: true, // 50k
    cropsRopaniLoss: 2, // 20k
    totalReliefNPR: 120000,
    verifiedByVetOfficer: true,
    status: 'कृषि/पशु सेवा प्रमाणित',
  },
];

export const RdraAssessmentTab: React.FC = () => {
  const { isNepali } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'housing' | 'casualties' | 'livestock'>('housing');
  const [records, setRecords] = useState<RdraRecord[]>(INITIAL_RDRA_RECORDS);
  const [casualties, setCasualties] = useState<CasualtyClaimRecord[]>(INITIAL_CASUALTIES);
  const [livestock, setLivestock] = useState<LivestockCropsLossRecord[]>(INITIAL_LIVESTOCK);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');

  // Modals
  const [isHousingModalOpen, setIsHousingModalOpen] = useState(false);
  const [isCasualtyModalOpen, setIsCasualtyModalOpen] = useState(false);
  const [isLivestockModalOpen, setIsLivestockModalOpen] = useState(false);
  const [printableVoucher, setPrintableVoucher] = useState<{ title: string; payload: any } | null>(null);

  // Form: Housing
  const [housingForm, setHousingForm] = useState({
    beneficiaryName: '',
    matrixHouseNo: '',
    wardNo: 2,
    citizenshipNo: '',
    bankName: 'राष्ट्रिय वाणिज्य बैंक',
    bankAccountNo: '',
    damageCategory: 'पूर्ण क्षति (पुनर्निर्माण)' as RdraRecord['damageCategory'],
  });

  // Form: Casualty
  const [casualtyForm, setCasualtyForm] = useState({
    casualtyName: '',
    casualtyAge: 40,
    casualtyGender: 'पुरुष' as const,
    casualtyType: 'मृतक (Deceased)' as const,
    wardNo: 2,
    incidentLocation: 'मेलम्ची नदी किनार',
    legalHeirName: '',
    heirRelation: 'हकवाला पति/पत्नी' as const,
    heirCitizenshipNo: '',
    heirContactPhone: '',
    heirBankName: 'राष्ट्रिय वाणिज्य बैंक',
    heirBankAccountNo: '',
  });

  // Form: Livestock & Crops
  const [livestockForm, setLivestockForm] = useState({
    farmerName: '',
    wardNo: 2,
    citizenshipNo: '',
    bankName: 'राष्ट्रिय वाणिज्य बैंक',
    bankAccountNo: '',
    milchCattleCount: 1,
    chauriCount: 0,
    smallLivestockCount: 4,
    troutFisheryDamaged: false,
    cropsRopaniLoss: 2,
  });

  // Submit Housing
  const handleAddHousing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!housingForm.beneficiaryName || !housingForm.citizenshipNo) {
      toast.error(isNepali ? 'कृपया पीडितको नाम र नागरिकता नम्बर भर्नुहोस्।' : 'Please provide name and citizenship.');
      return;
    }

    const grant = housingForm.damageCategory.includes('पूर्ण') ? 500000 : 50000;
    const immediate = housingForm.damageCategory.includes('पूर्ण') ? 20000 : 15000;

    const newRecord: RdraRecord = {
      id: `rdra-${Date.now()}`,
      voucherNo: `RDRA-२०८१-W${housingForm.wardNo}-${Math.floor(100 + Math.random() * 900)}`,
      incidentType: 'मनसुन बाढी तथा पहिरो',
      beneficiaryName: housingForm.beneficiaryName,
      matrixHouseNo: housingForm.matrixHouseNo || `THP-W${housingForm.wardNo}-0999`,
      wardNo: housingForm.wardNo,
      citizenshipNo: housingForm.citizenshipNo,
      bankName: housingForm.bankName,
      bankAccountNo: housingForm.bankAccountNo || 'खाता नम्बर प्रक्रियामा',
      damageCategory: housingForm.damageCategory,
      houseType: housingForm.damageCategory.includes('पूर्ण') ? 'काँचो ढुङ्गा-माटो' : 'अर्ध-पक्की (टिन)',
      immediateFoodReliefNPR: immediate,
      reconstructionGrantNPR: grant,
      totalReliefNPR: grant + immediate,
      gpsCoords: '27.9736° N, 85.6425° E (Field Verified)',
      surveyorName: 'वडा सचिव तथा प्राविधिक टोली',
      surveyDateBs: '२०८१-०१-२१',
      status: 'मन्त्रिपरिषद्/शाखा सिफारिस',
      hasPhotoProof: true,
    };

    setRecords([newRecord, ...records]);
    setIsHousingModalOpen(false);
    toast.success(isNepali ? 'आवास क्षति मूल्याङ्कन दर्ता भयो!' : 'Housing damage recorded successfully!');
  };

  // Submit Casualty Claim
  const handleAddCasualty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!casualtyForm.casualtyName || !casualtyForm.legalHeirName) {
      toast.error(isNepali ? 'कृपया मृतकको नाम र हकवालाको नाम भर्नुहोस्।' : 'Please fill casualty and legal heir names.');
      return;
    }

    const newCas: CasualtyClaimRecord = {
      id: `cas-${Date.now()}`,
      voucherNo: `CAS-२०८१-W${casualtyForm.wardNo}-${Math.floor(10 + Math.random() * 90)}`,
      incidentType: 'मनसुन बाढी/पहिरो दुर्घटना',
      incidentDateBs: '२०८१-०१-२०',
      casualtyName: casualtyForm.casualtyName,
      casualtyAge: Number(casualtyForm.casualtyAge),
      casualtyGender: casualtyForm.casualtyGender,
      casualtyType: casualtyForm.casualtyType,
      incidentLocation: casualtyForm.incidentLocation,
      wardNo: casualtyForm.wardNo,
      legalHeirName: casualtyForm.legalHeirName,
      heirRelation: casualtyForm.heirRelation,
      heirCitizenshipNo: casualtyForm.heirCitizenshipNo || '२७-०१-७५-०००००',
      heirContactPhone: casualtyForm.heirContactPhone || '९८५११०००००',
      heirBankName: casualtyForm.heirBankName,
      heirBankAccountNo: casualtyForm.heirBankAccountNo || 'खाता रुजु हुँदै',
      compensationAmountNPR: 200000,
      policeSarzaminDone: true,
      wardMuchulkaDone: true,
      status: 'वडा मुचुल्का प्रमाणित',
    };

    setCasualties([newCas, ...casualties]);
    setIsCasualtyModalOpen(false);
    toast.success(isNepali ? 'मृतक/बेपत्ता राहत दाबी (रु २ लाख) दर्ता भयो!' : 'Casualty claim (NPR 200,000) recorded!');
  };

  // Submit Livestock & Crops
  const handleAddLivestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!livestockForm.farmerName || !livestockForm.citizenshipNo) {
      toast.error(isNepali ? 'कृपया कृषकको नाम र नागरिकता नम्बर भर्नुहोस्।' : 'Please fill farmer name & citizenship.');
      return;
    }

    const cattleLoss = livestockForm.milchCattleCount * 30000;
    const chauriLoss = livestockForm.chauriCount * 30000;
    const smallLoss = livestockForm.smallLivestockCount * 5000;
    const troutLoss = livestockForm.troutFisheryDamaged ? 50000 : 0;
    const cropsLoss = livestockForm.cropsRopaniLoss * 10000;
    const total = cattleLoss + chauriLoss + smallLoss + troutLoss + cropsLoss;

    const newLive: LivestockCropsLossRecord = {
      id: `live-${Date.now()}`,
      voucherNo: `AGR-२०८१-W${livestockForm.wardNo}-${Math.floor(10 + Math.random() * 90)}`,
      farmerName: livestockForm.farmerName,
      wardNo: livestockForm.wardNo,
      citizenshipNo: livestockForm.citizenshipNo,
      bankName: livestockForm.bankName,
      bankAccountNo: livestockForm.bankAccountNo || 'खाता उपलब्ध',
      milchCattleCount: livestockForm.milchCattleCount,
      chauriCount: livestockForm.chauriCount,
      smallLivestockCount: livestockForm.smallLivestockCount,
      troutFisheryDamaged: livestockForm.troutFisheryDamaged,
      cropsRopaniLoss: livestockForm.cropsRopaniLoss,
      totalReliefNPR: total,
      verifiedByVetOfficer: true,
      status: 'कृषि/पशु सेवा प्रमाणित',
    };

    setLivestock([newLive, ...livestock]);
    setIsLivestockModalOpen(false);
    toast.success(isNepali ? 'पशुधन तथा बाली क्षति मुचुल्का दर्ता भयो!' : 'Livestock & crops loss registered!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #0f766e 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(4, 120, 87, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <FileText size={14} color="#6ee7b7" />
            <span>{isNepali ? 'गृह मन्त्रालय "विपद् राहत मापदण्ड २०७७" आधारित डिजिटल मुचुल्का' : 'MoHA Relief Standards 2077 Standardized Loss Module'}</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coins size={24} color="#a7f3d0" />
            <span>{isNepali ? 'द्रुत क्षति मूल्याङ्कन (RDRA), मृतक राहत दाबी तथा पशुधन मुचुल्का' : 'RDRA Housing, Casualty Claims & Livestock Loss'}</span>
          </h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.86rem', opacity: 0.9, maxWidth: '780px', lineHeight: 1.5 }}>
            {isNepali
              ? 'आवास पुनर्निर्माण (रु ५ लाख), मृतक राहत (रु २ लाख प्रति व्यक्ति), चौँरी/गाईभैँसी र बालीनाली क्षतिको सरकारी मापदण्ड अनुसार प्रत्यक्ष बैंक खाता (DBT) सिफारिस।'
              : 'Statutory direct-to-bank compensation under MoHA 2077: Housing reconstruction (NPR 500k), Casualty death relief (NPR 200k/person), and Livestock/Crops compensation.'}
          </p>
        </div>

        {/* Action Button for Active Tab */}
        <div>
          {activeSubTab === 'housing' && (
            <button
              onClick={() => setIsHousingModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                color: '#065f46',
                border: 'none',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Plus size={16} />
              <span>{isNepali ? '➕ आवास क्षति मूल्याङ्कन' : '➕ Housing Assessment'}</span>
            </button>
          )}

          {activeSubTab === 'casualties' && (
            <button
              onClick={() => setIsCasualtyModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              }}
            >
              <Plus size={16} />
              <span>{isNepali ? '➕ मृतक/बेपत्ता राहत दाबी (रु २ लाख)' : '➕ Casualty Claim (200k)'}</span>
            </button>
          )}

          {activeSubTab === 'livestock' && (
            <button
              onClick={() => setIsLivestockModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#f59e0b',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <Plus size={16} />
              <span>{isNepali ? '➕ पशुधन तथा बाली मुचुल्का' : '➕ Livestock/Crops Loss'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveSubTab('housing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeSubTab === 'housing' ? '#047857' : 'transparent',
            color: activeSubTab === 'housing' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          <Home size={16} />
          <span>{isNepali ? '🏠 घरधुरी आवास क्षति मूल्याङ्कन' : '🏠 Housing Damage Assessment'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('casualties')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeSubTab === 'casualties' ? '#dc2626' : 'transparent',
            color: activeSubTab === 'casualties' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          <UserX size={16} />
          <span>{isNepali ? '🕊️ मृतक तथा बेपत्ता राहत दाबी (MoHA २०७७)' : '🕊️ Casualty & Missing Claims (MoHA 2077)'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('livestock')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeSubTab === 'livestock' ? '#d97706' : 'transparent',
            color: activeSubTab === 'livestock' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
          }}
        >
          <Sprout size={16} />
          <span>{isNepali ? '🌾 पशुपन्छी, गोठ तथा बालीनाली क्षति' : '🌾 Livestock & Agricultural Loss'}</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 600 }}>{isNepali ? 'आवास पुनर्निर्माण अनुदान' : 'Housing Reconstruction'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#047857' }}>
            रु. {(records.reduce((acc, r) => acc + r.totalReliefNPR, 0) / 100000).toFixed(1)} लाख
          </div>
          <div style={{ fontSize: '0.7rem', color: '#065f46' }}>{records.length} घरधुरी सिफारिस</div>
        </div>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>{isNepali ? 'मृतक/बेपत्ता राहत कोष (MoHA)' : 'Casualty Relief Fund'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#dc2626' }}>
            रु. {(casualties.reduce((acc, c) => acc + c.compensationAmountNPR, 0) / 100000).toFixed(1)} लाख
          </div>
          <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>{casualties.length} व्यक्ति • रु २ लाख/व्यक्ति</div>
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>{isNepali ? 'पशुधन तथा बाली क्षति' : 'Livestock & Crops Loss'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#b45309' }}>
            रु. {(livestock.reduce((acc, l) => acc + l.totalReliefNPR, 0) / 100000).toFixed(1)} लाख
          </div>
          <div style={{ fontSize: '0.7rem', color: '#92400e' }}>{livestock.length} कृषक परिवार मुचुल्का</div>
        </div>

        <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 600 }}>{isNepali ? 'प्रत्यक्ष बैंक भुक्तानी (DBT)' : 'Direct Bank Transfer'}</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#7e22ce' }}>१००% पारदर्शी</div>
          <div style={{ fontSize: '0.7rem', color: '#6b21a8' }}>बिचौलिया शून्य, लेखापरीक्षण सुरक्षित</div>
        </div>
      </div>

      {/* ─── SUB-TAB 1: HOUSING DAMAGE TABLE ─── */}
      {activeSubTab === 'housing' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'भौचर नं / घटना' : 'Voucher & Hazard'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'पीडित / नागरिकता' : 'Beneficiary & ID'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'क्षति वर्गीकरण' : 'Damage Category'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'बैंक खाता (DBT)' : 'Bank Account'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#475569', fontWeight: 700 }}>{isNepali ? 'सिफारिस राहत' : 'Total Relief'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#475569', fontWeight: 700 }}>{isNepali ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.voucherNo}</div>
                    <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>{r.incidentType} (वडा {r.wardNo})</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{r.beneficiaryName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ना.नं: {r.citizenshipNo}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: r.damageCategory.includes('पूर्ण') ? '#b91c1c' : '#b45309' }}>
                      {r.damageCategory}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{r.houseType}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{r.bankName}</div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#0369a1' }}>{r.bankAccountNo}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 800, color: '#047857', fontSize: '0.9rem' }}>
                      रु. {r.totalReliefNPR.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      अनुदान: रु {r.reconstructionGrantNPR.toLocaleString()} + खाद्यान्न: रु {r.immediateFoodReliefNPR.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: r.status === 'बैंक खातामा निकासा सम्पन्न' ? '#dcfce7' : '#eff6ff',
                        color: r.status === 'बैंक खातामा निकासा सम्पन्न' ? '#15803d' : '#1d4ed8',
                      }}
                    >
                      ● {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── SUB-TAB 2: CASUALTY & MISSING CLAIMS TABLE ─── */}
      {activeSubTab === 'casualties' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead style={{ background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
              <tr>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#991b1b', fontWeight: 700 }}>{isNepali ? 'भौचर नं / दुर्घटना' : 'Voucher & Hazard'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#991b1b', fontWeight: 700 }}>{isNepali ? 'मृतक / बेपत्ता व्यक्ति' : 'Casualty Name & Age'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#991b1b', fontWeight: 700 }}>{isNepali ? 'हकवाला (Legal Heir)' : 'Legal Heir'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#991b1b', fontWeight: 700 }}>{isNepali ? 'हकवाला बैंक खाता (DBT)' : 'Heir Bank Account'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#991b1b', fontWeight: 700 }}>{isNepali ? 'राहत मापदण्ड (MoHA 2077)' : 'Statutory Grant'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#991b1b', fontWeight: 700 }}>{isNepali ? 'मुचुल्का स्थिति' : 'Verification Status'}</th>
              </tr>
            </thead>
            <tbody>
              {casualties.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.voucherNo}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.incidentType} • {c.incidentDateBs}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 800, color: '#dc2626' }}>{c.casualtyName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                      {c.casualtyType} • {c.casualtyAge} वर्ष • {c.casualtyGender} (वडा {c.wardNo})
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{c.legalHeirName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#0369a1' }}>{c.heirRelation}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>ना.नं: {c.heirCitizenshipNo}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 600, color: '#334155' }}>{c.heirBankName}</div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#0369a1' }}>{c.heirBankAccountNo}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>मो: {c.heirContactPhone}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '0.92rem' }}>
                      रु. {c.compensationAmountNPR.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                      ✓ प्रहरी सर्जमिन तथा वडा मुचुल्का संलग्न
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: c.status.includes('निकासा') ? '#dcfce7' : '#fee2e2',
                        color: c.status.includes('निकासा') ? '#15803d' : '#b91c1c',
                      }}
                    >
                      ● {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── SUB-TAB 3: LIVESTOCK & CROPS LOSS TABLE ─── */}
      {activeSubTab === 'livestock' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
              <tr>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>{isNepali ? 'भौचर नं / वडा' : 'Voucher & Ward'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>{isNepali ? 'कृषकको नाम / ना.नं.' : 'Farmer & Citizenship'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>{isNepali ? 'पशुधन विवरण (क्षति संख्या)' : 'Livestock Breakdown'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>{isNepali ? 'माछा / बाली कटान' : 'Fishery & Crops'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>{isNepali ? 'कुल क्षतिपूर्ति (NPR)' : 'Total Compensation'}</th>
                <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#92400e', fontWeight: 700 }}>{isNepali ? 'प्रमाणीकरण' : 'Verification'}</th>
              </tr>
            </thead>
            <tbody>
              {livestock.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{l.voucherNo}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>वडा नं. {l.wardNo}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{l.farmerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ना.नं: {l.citizenshipNo}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#334155' }}>
                      गाई/भैँसी: <strong>{l.milchCattleCount}</strong> | चौँरी: <strong>{l.chauriCount}</strong> | बाख्रा: <strong>{l.smallLivestockCount}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#334155' }}>
                      बाली जमिन कटान: <strong>{l.cropsRopaniLoss} रोपनी</strong>
                    </div>
                    {l.troutFisheryDamaged && (
                      <span style={{ fontSize: '0.68rem', background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                        ✓ ट्राउट माछा पोखरी क्षति
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem' }}>
                    <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.9rem' }}>
                      रु. {l.totalReliefNPR.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{l.bankName}</div>
                  </td>
                  <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: l.status.includes('सम्पन्न') ? '#dcfce7' : '#fef3c7',
                        color: l.status.includes('सम्पन्न') ? '#15803d' : '#b45309',
                      }}
                    >
                      ● {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── MODAL 1: ADD HOUSING DAMAGE ─── */}
      {isHousingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {isNepali ? 'डिजिटल आवास क्षति मूल्याङ्कन दर्ता (RDRA)' : 'Register Housing Damage RDRA'}
              </h3>
              <button onClick={() => setIsHousingModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleAddHousing} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>पीडितको नाम *</label>
                  <input
                    type="text"
                    required
                    value={housingForm.beneficiaryName}
                    onChange={(e) => setHousingForm({ ...housingForm, beneficiaryName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>वडा नं *</label>
                  <select
                    value={housingForm.wardNo}
                    onChange={(e) => setHousingForm({ ...housingForm, wardNo: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                      <option key={w} value={w}>वडा नं. {w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>नागरिकता नम्बर *</label>
                  <input
                    type="text"
                    required
                    value={housingForm.citizenshipNo}
                    onChange={(e) => setHousingForm({ ...housingForm, citizenshipNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>घरधुरी कोड (Matrix No)</label>
                  <input
                    type="text"
                    placeholder="THP-W2-0084"
                    value={housingForm.matrixHouseNo}
                    onChange={(e) => setHousingForm({ ...housingForm, matrixHouseNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>घर क्षतिको वर्गीकरण *</label>
                <select
                  value={housingForm.damageCategory}
                  onChange={(e) => setHousingForm({ ...housingForm, damageCategory: e.target.value as any })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="पूर्ण क्षति (पुनर्निर्माण)">पूर्ण क्षति — रु. ५ लाख पुनर्निर्माण अनुदान + रु. २० हजार राहत</option>
                  <option value="आंशिक क्षति (प्रवलीकरण)">आंशिक क्षति — रु. ५० हजार प्रवलीकरण अनुदान + रु. १५ हजार राहत</option>
                  <option value="अस्थायी आवास">अस्थायी आवास — रु. ५० हजार अनुदान</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>बैंकको नाम</label>
                  <input
                    type="text"
                    value={housingForm.bankName}
                    onChange={(e) => setHousingForm({ ...housingForm, bankName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>बैंक खाता नम्बर (DBT)</label>
                  <input
                    type="text"
                    value={housingForm.bankAccountNo}
                    onChange={(e) => setHousingForm({ ...housingForm, bankAccountNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsHousingModalOpen(false)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9' }}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#047857', color: '#ffffff', fontWeight: 700 }}>
                  सिफारिस सुरक्षित गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: ADD CASUALTY CLAIM ─── */}
      {isCasualtyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserX size={20} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {isNepali ? 'मृतक तथा बेपत्ता राहत दाबी फाराम (MoHA २०७७ मापदण्ड)' : 'Casualty Compensation Claim Form'}
                </h3>
              </div>
              <button onClick={() => setIsCasualtyModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleAddCasualty} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.65rem', fontSize: '0.75rem', color: '#991b1b' }}>
                🏛️ <strong>गृह मन्त्रालय मापदण्ड:</strong> मृतक वा बेपत्ता व्यक्तिको नजिकको हकवालालाई प्रति मृतक <strong>रु. २,००,००० (दुई लाख रुपैयाँ)</strong> सिधै बैंक खातामा भुक्तानी हुनेछ।
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>मृतक/बेपत्ताको नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: स्व. पेम्बा शेर्पा"
                    value={casualtyForm.casualtyName}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, casualtyName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>उमेर *</label>
                  <input
                    type="number"
                    value={casualtyForm.casualtyAge}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, casualtyAge: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>प्रकृति *</label>
                  <select
                    value={casualtyForm.casualtyType}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, casualtyType: e.target.value as any })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="मृतक (Deceased)">मृतक (Deceased)</option>
                    <option value="बेपत्ता (Missing)">बेपत्ता (Missing)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>हकवालाको नाम (Legal Heir) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: ल्हाक्पा डोल्मा शेर्पा"
                    value={casualtyForm.legalHeirName}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, legalHeirName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>हकवाला नाता *</label>
                  <select
                    value={casualtyForm.heirRelation}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, heirRelation: e.target.value as any })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    <option value="हकवाला पति/पत्नी">हकवाला पति/पत्नी</option>
                    <option value="हकवाला छोरा/छोरी">हकवाला छोरा/छोरी</option>
                    <option value="हकवाला बाबु/आमा">हकवाला बाबु/आमा</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>हकवाला नागरिकता नं *</label>
                  <input
                    type="text"
                    required
                    placeholder="२७-०१-७५-१२३४५"
                    value={casualtyForm.heirCitizenshipNo}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, heirCitizenshipNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>हकवाला फोन नं</label>
                  <input
                    type="text"
                    placeholder="९८५११४४०२१"
                    value={casualtyForm.heirContactPhone}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, heirContactPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>हकवाला बैंक नाम</label>
                  <input
                    type="text"
                    value={casualtyForm.heirBankName}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, heirBankName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>हकवाला बैंक खाता (DBT)</label>
                  <input
                    type="text"
                    placeholder="१४२०१०००..."
                    value={casualtyForm.heirBankAccountNo}
                    onChange={(e) => setCasualtyForm({ ...casualtyForm, heirBankAccountNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsCasualtyModalOpen(false)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9' }}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 700 }}>
                  दाबी सुरक्षित गर्नुहोस् (रु. २,००,०००)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: ADD LIVESTOCK & CROPS LOSS ─── */}
      {isLivestockModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sprout size={20} color="#d97706" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {isNepali ? 'पशुधन तथा बाली क्षति मुचुल्का (Livestock Loss Form)' : 'Livestock & Crops Loss Assessment'}
                </h3>
              </div>
              <button onClick={() => setIsLivestockModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleAddLivestock} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>कृषकको नाम *</label>
                  <input
                    type="text"
                    required
                    value={livestockForm.farmerName}
                    onChange={(e) => setLivestockForm({ ...livestockForm, farmerName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>वडा नं *</label>
                  <select
                    value={livestockForm.wardNo}
                    onChange={(e) => setLivestockForm({ ...livestockForm, wardNo: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                      <option key={w} value={w}>वडा नं. {w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>नागरिकता नं *</label>
                  <input
                    type="text"
                    required
                    value={livestockForm.citizenshipNo}
                    onChange={(e) => setLivestockForm({ ...livestockForm, citizenshipNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>बैंक खाता नम्बर</label>
                  <input
                    type="text"
                    value={livestockForm.bankAccountNo}
                    onChange={(e) => setLivestockForm({ ...livestockForm, bankAccountNo: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem', borderRadius: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700 }}>गाई/भैँसी (रु ३०k)</label>
                  <input
                    type="number"
                    min="0"
                    value={livestockForm.milchCattleCount}
                    onChange={(e) => setLivestockForm({ ...livestockForm, milchCattleCount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700 }}>चौँरी गाई (रु ३०k)</label>
                  <input
                    type="number"
                    min="0"
                    value={livestockForm.chauriCount}
                    onChange={(e) => setLivestockForm({ ...livestockForm, chauriCount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700 }}>बाख्रा/भेडा (रु ५k)</label>
                  <input
                    type="number"
                    min="0"
                    value={livestockForm.smallLivestockCount}
                    onChange={(e) => setLivestockForm({ ...livestockForm, smallLivestockCount: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.25rem' }}>बाली जमिन कटान (रोपनी - रु १०k/रोपनी)</label>
                  <input
                    type="number"
                    min="0"
                    value={livestockForm.cropsRopaniLoss}
                    onChange={(e) => setLivestockForm({ ...livestockForm, cropsRopaniLoss: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    id="trout"
                    checked={livestockForm.troutFisheryDamaged}
                    onChange={(e) => setLivestockForm({ ...livestockForm, troutFisheryDamaged: e.target.checked })}
                  />
                  <label htmlFor="trout" style={{ fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                    ट्राउट माछा पोखरी क्षति (रु. ५०,०००)
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsLivestockModalOpen(false)} style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9' }}>
                  रद्द गर्नुहोस्
                </button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#d97706', color: '#ffffff', fontWeight: 700 }}>
                  मुचुल्का सुरक्षित गर्नुहोस्
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RdraAssessmentTab;
