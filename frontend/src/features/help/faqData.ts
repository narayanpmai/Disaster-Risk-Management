export interface FaqItem {
  id: string;
  category: 'all' | 'incident' | 'telemetry' | 'sar' | 'relief' | 'pwa' | 'gis';
  questionNp: string;
  questionEn: string;
  answerNp: string;
  answerEn: string;
  keywords: string[];
}

export interface UserGuideItem {
  id: string;
  titleNp: string;
  titleEn: string;
  categoryNp: string;
  categoryEn: string;
  readTimeNp: string;
  readTimeEn: string;
  steps: {
    stepNo: number;
    titleNp: string;
    titleEn: string;
    descNp: string;
    descEn: string;
    tipNp?: string;
    tipEn?: string;
  }[];
}

export const FAQ_CATEGORIES = [
  { id: 'all', labelNp: 'सबै प्रश्नहरू', labelEn: 'All Questions' },
  { id: 'incident', labelNp: 'विपद् घटना तथा प्रमाणीकरण', labelEn: 'Incidents & Verification' },
  { id: 'telemetry', labelNp: 'जलसतह तथा पूर्वसूचना साइरन', labelEn: 'Flood Telemetry & Siren' },
  { id: 'sar', labelNp: 'खोज-उद्धार तथा हेभी इक्युपमेन्ट', labelEn: 'SAR & Heavy Equipment' },
  { id: 'relief', labelNp: 'राहत वितरण तथा क्षति मूल्याङ्कन', labelEn: 'Relief & Damage Assessment' },
  { id: 'pwa', labelNp: 'अफलाइन PWA तथा VHF सञ्चार', labelEn: 'Offline PWA & VHF Radio' },
  { id: 'gis', labelNp: '३D नक्सा तथा डाटा ब्याकअप', labelEn: '3D GIS & Data Backup' },
] as const;

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'incident',
    questionNp: '१. नयाँ विपद् घटना कसरी दर्ता गर्ने र वडा तहबाट स्थलगत प्रमाणीकरण कसरी हुन्छ?',
    questionEn: '1. How to report a disaster incident and conduct ward-level field verification?',
    answerNp: 'विपद् व्यवस्थापन हबमा गई "+ नयाँ विपद् घटना दर्ता" बटनमा क्लिक गर्नुहोस्। विपद् प्रकार (बाढी, पहिरो, आगलागी), वडा नम्बर, प्रभावित घरधुरी संख्या, र GPS ठेगाना प्रविष्ट गरी सुरक्षित गर्नुहोस्। वडा सचिव वा प्राविधिक टोलीले घटनास्थल पुगी तस्वीर र वस्तुस्थिति जाँच गरी प्रणालीमा "प्रमाणित" (Verified) गर्दछन्।',
    answerEn: 'Navigate to Disaster Hub and click "+ Report New Incident". Select hazard type (flood, landslide, fire), ward number, affected households, and GPS location. The ward secretary or technical inspector inspects the field site, attaches geo-tagged photos, and marks it "Verified".',
    keywords: ['घटना', 'दर्ता', 'प्रमाणीकरण', 'incident', 'report', 'verification', 'ward'],
  },
  {
    id: 'faq-2',
    category: 'telemetry',
    questionNp: '२. मेलम्ची नदीको जलसतह खतरा विन्दु नाघेमा स्वचालित अलर्ट कसरी जारी हुन्छ?',
    questionEn: '2. How are automated alerts triggered when Melamchi river water level exceeds danger threshold?',
    answerNp: 'मेलम्ची खोला (SEN-MEL-01) र भोताङ वर्षा मापन केन्द्रबाट प्रत्येक १० सेकेन्डमा रियल-टाइम टेलिमेट्री प्राप्त हुन्छ। जलसतह ५.५ मिटर खतरा विन्दु पार हुनासाथ प्रणालीले तटीय बासिन्दालाई स्वचालित IVR फोन कल, SMS र सौर्य-साइरन स्वतः सक्रिय गर्दछ।',
    answerEn: 'Telemetry is ingested every 10 seconds from Melamchi River gauge (SEN-MEL-01) and Bhotang rainfall station. When water level exceeds the 5.5m danger threshold, automated outbound IVR voice calls, emergency SMS, and 5-10km mesh sirens are triggered automatically.',
    keywords: ['जलसतह', 'बाढी', 'साइरन', 'ivr', 'telemetry', 'melamchi', 'flood'],
  },
  {
    id: 'faq-3',
    category: 'telemetry',
    questionNp: '३. पहिरो जोखिमयुक्त बस्तीको इन्क्लिनोमिटर सेन्सर तथा पूर्वसूचना कसरी हेर्ने?',
    questionEn: '3. How to monitor landslide inclinometer sensors and slope displacement alerts?',
    answerNp: 'विपद् हबको "पहिरो जोखिम तथा इन्क्लिनोमिटर" ट्याबमा जानुहोस्। मानेखर्क, सेर्माथाङ र भोताङका लेकाली भिरहरूमा जडान गरिएका डिजिटल इन्क्लिनोमिटरको मिलिमिटर चाल, वर्षा थ्रेसहोल्ड र विस्थापित हुनुपर्ने बस्तीहरूको प्राथमिकता सूची प्रत्यक्ष हेर्न सकिन्छ।',
    answerEn: 'Open the "Landslide Sensors" tab under Disaster Hub. View real-time millimeter slope displacement, rainfall saturation thresholds, and prioritized evacuation lists for vulnerable steep settlements like Manekharka and Bhotang.',
    keywords: ['पहिरो', 'इन्क्लिनोमिटर', 'सेन्सर', 'landslide', 'inclinometer', 'displacement'],
  },
  {
    id: 'faq-4',
    category: 'sar',
    questionNp: '४. खोज-उद्धार (SAR) हेभी इक्युपमेन्ट र स्वयंसेवक कार्यदल कसरी परिचालन गरिन्छ?',
    questionEn: '4. How are SAR heavy equipment (dozers, excavators) and volunteers dispatched?',
    answerNp: '"खोज-उद्धार (SAR)" ट्याबमा पालिका तथा निजी क्षेत्रका डोजर, एक्साभेटर, लाइफ ज्याकेट, र्याफ्टिङ डुङ्गा र ६४ प्रमाणित स्वयंसेवकहरूको प्रत्यक्ष सम्पर्क र उपलब्धता स्थिति हुन्छ। आपतकालीन अवस्थामा सिधै कलिङ वा एक-क्लिक SAR Dispatch आदेश पठाउन सकिन्छ।',
    answerEn: 'Open the "SAR Directory" tab to inspect availability of municipal & private dozers, excavators, rescue boats, and 64 certified local SAR volunteers. Authorized EOC commanders can transmit direct dispatch orders with one click.',
    keywords: ['खोज-उद्धार', 'डोजर', 'स्वयंसेवक', 'sar', 'dozer', 'excavator', 'rescue'],
  },
  {
    id: 'faq-5',
    category: 'relief',
    questionNp: '५. सुरक्षित आश्रयस्थल र राहत सामग्री जिन्सी मौज्दात कसरी व्यवस्थापन गर्ने?',
    questionEn: '5. How to manage certified evacuation shelters and relief inventory stocks?',
    answerNp: 'पालिकाका ८ वटै वडामा १,३१० जना क्षमताका ६ वटा प्रमाणित आश्रयस्थलहरू (सामुदायिक भवन, विद्यालय, कभर्ड हल) सूचीकृत छन् जसमा खानेपानी, सौर्य ऊर्जा र शौचालयको व्यवस्था छ। जिन्सी शाखाबाट त्रिपाल, कम्बल, औषधि किट र खाद्यान्न मौज्दात प्रत्यक्ष ट्र्याक गरिन्छ।',
    answerEn: '6 certified shelters across 8 wards provide 1,310 person capacity equipped with solar power, drinking water, and sanitation. Municipal relief warehouses track tarpaulins, blankets, first-aid kits, and food rations in real time.',
    keywords: ['आश्रयस्थल', 'राहत', 'त्रिपाल', 'shelters', 'relief', 'inventory', 'warehouse'],
  },
  {
    id: 'faq-6',
    category: 'relief',
    questionNp: '६. गृहमन्त्रालय राहत मापदण्ड २०७७ अनुसार डिजिटल क्षति मूल्याङ्कन (RDRA) कसरी प्रविष्टि गर्ने?',
    questionEn: '6. How to conduct Rapid Damage Assessment (RDRA) under MoHA Relief Standard 2077?',
    answerNp: '"क्षति मूल्याङ्कन (RDRA मापदण्ड २०७७)" ट्याबमा फिल्ड प्राविधिकले पूर्ण क्षति, आंशिक क्षति र सामान्य क्षतिको वर्गीकरण गरी घरधुरी विवरण प्रविष्ट गर्दछन्। प्रणालीले गृहमन्त्रालय मापदण्ड बमोजिम तत्काल राहत रकम र DBT बैंक सिफारिस स्वतः गणना गर्दछ।',
    answerEn: 'In the RDRA Damage Assessment tab, field engineers record complete, partial, or minor structural damage per household. The system automatically calculates cash relief entitlement and generates DBT bank vouchers per MoHA 2077 guidelines.',
    keywords: ['क्षति मूल्याङ्कन', 'rdra', 'राहत मापदण्ड', 'damage', 'assessment', 'moha'],
  },
  {
    id: 'faq-7',
    category: 'pwa',
    questionNp: '७. इन्टरनेट नहुँदा अफलाइन PWA र VHF रेडियो सञ्चार कसरी प्रयोग गर्ने?',
    questionEn: '7. How does offline PWA field reporting and VHF emergency radio mesh work without internet?',
    answerNp: 'नागरिक तथा उद्धारकर्ताले मोवाइलमा `/pwa` खोलेर इन्टरनेट बिना नै घटना विवरण स्थानीय IndexedDB भण्डारमा सुरक्षित गर्न सक्छन्। इन्टरनेट पुनः जोडिएपछि स्वतः सिङ्क हुन्छ। नेटवर्क पूर्ण अवरुद्ध हुँदा VHF आपतकालीन च्यानल १६ (१४८.५ MHz) बाट सूचना आदानप्रदान गरिन्छ।',
    answerEn: 'Field personnel can open `/pwa` on mobile to record incidents offline into local browser IndexedDB. Upon network restoration, queued records synchronize automatically. In total telecom blackouts, VHF Radio Channel 16 (148.5 MHz) operates as an off-grid voice mesh.',
    keywords: ['अफलाइन', 'pwa', 'vhf', 'रेडियो', 'offline', 'radio', 'indexeddb'],
  },
  {
    id: 'faq-8',
    category: 'telemetry',
    questionNp: '८. राष्ट्रिय BIPAD पोर्टल र जल तथा मौसम विज्ञान विभाग (DHM) तथ्याङ्क कसरी सिङ्क हुन्छ?',
    questionEn: '8. How does NIDRMS synchronize data with the National BIPAD Portal and DHM telemetry?',
    answerNp: '"राष्ट्रिय विपद् पोर्टल (BIPAD Sync)" ट्याबमा DHM, विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरण (NDRRMA) को BIPAD पोर्टल, नेपाली सेना र सशस्त्र प्रहरीको गेटवेसँग वास्तविक समयमा API मार्फत तथ्याङ्क आदानप्रदान हुन्छ।',
    answerEn: 'Under the "National BIPAD Gateway" tab, two-way automated REST synchronization exchanges live river telemetry, incident verification logs, and damage matrices with NDRRMA BIPAD and DHM national databases.',
    keywords: ['bipad', 'dhm', 'गेटवे', 'gateway', 'ndrrma', 'sync'],
  },
  {
    id: 'faq-9',
    category: 'relief',
    questionNp: '९. विपद् कोषबाट लाभग्राहीको बैंक खातामा नगद राहत (DBT) कसरी निकासा हुन्छ?',
    questionEn: '9. How are direct cash relief grants disbursed via Direct Bank Transfer (DBT)?',
    answerNp: '"पालिका विपद् कोष राहत वितरण" ट्याबमा प्रमाणित पीडित परिवारको नागरिकता, बैंक खाता र भौचर नम्बर प्रविष्टि गरी प्रत्यक्ष बैंक स्थानान्तरण (DBT) मार्फत पारदर्शी रूपमा रकम निकासा हुन्छ र प्रत्येक भुक्तानी अडिट ट्रेलमा सुरक्षित रहन्छ।',
    answerEn: 'Under "Disaster Relief Funds", validated beneficiary citizenship numbers, bank accounts, and payment vouchers are recorded for transparent Direct Bank Transfers (DBT), fully locked into immutable audit logs.',
    keywords: ['राहत कोष', 'dbt', 'बैंक', 'नगद', 'funds', 'cash', 'transfer'],
  },
  {
    id: 'faq-10',
    category: 'gis',
    questionNp: '१०. PostGIS डाटाबेस ब्याकअप र आपतकालीन DR रिकभरी कसरी परीक्षण गरिन्छ?',
    questionEn: '10. How are PostGIS spatial backups and disaster recovery drills executed?',
    answerNp: '`/backup-dr` पृष्ठमा गई २४ घण्टे स्वचालित PostGIS spatial ब्याकअप, SHA-256 चेकसम प्रमाणीकरण, र प्रत्यक्ष डिजास्टर रिकभरी ड्रिल चलाउन सकिन्छ। प्रणालीले RPO < १५ मिनेट र RTO < ५ मिनेटको गतिमा पुनःस्थापनाको ग्यारेन्टी गर्दछ।',
    answerEn: 'Visit `/backup-dr` to inspect daily automated PostGIS spatial snapshots, SHA-256 integrity checksums, and execute live disaster recovery drills guaranteeing RPO < 15 minutes and RTO < 5 minutes.',
    keywords: ['ब्याकअप', 'dr', 'रिकभरी', 'backup', 'postgis', 'recovery', 'drill'],
  },
];

export const USER_GUIDES: UserGuideItem[] = [
  {
    id: 'guide-1',
    titleNp: '१. विपद् घटना दर्ता, स्थलगत प्रमाणीकरण तथा आपतकालीन साइरन प्रवाह',
    titleEn: '1. Incident Reporting, Field Inspection & Emergency Siren Broadcast',
    categoryNp: 'विपद् कमाण्ड तथा प्रतिकार्य',
    categoryEn: 'Disaster Command & Response',
    readTimeNp: '३ मिनेट',
    readTimeEn: '3 min read',
    steps: [
      {
        stepNo: 1,
        titleNp: 'विपद् कमाण्ड ड्यासबोर्ड खोल्नुहोस्',
        titleEn: 'Open Disaster Command Dashboard',
        descNp: 'बायाँ साइडबारबाट "विपद् व्यवस्थापन" मा गई रातो रङ्गको "+ नयाँ विपद् घटना दर्ता" बटनमा क्लिक गर्नुहोस्।',
        descEn: 'Navigate to "Disaster Management" from sidebar and click the red "+ Report New Incident" button.',
        tipNp: 'प्रणालीले घटना ID (जस्तै DIS-२०८१-००५) स्वतः सिफारिस गर्दछ।',
        tipEn: 'The system automatically generates a unique Incident ID (e.g., DIS-2081-005).',
      },
      {
        stepNo: 2,
        titleNp: 'विपद् विवरण तथा GPS स्थान भर्नुहोस्',
        titleEn: 'Enter Hazard Details & GPS Coordinates',
        descNp: 'विपद् प्रकार (बाढी/पहिरो), वडा नम्बर, प्रभावित घरधुरी संख्या, र GPS अक्षांश-देशान्तर स्पष्ट रूपमा प्रविष्ट गर्नुहोस्।',
        descEn: 'Select hazard type (flood/landslide), affected ward, households at risk, and precise GPS lat/lng coordinates.',
      },
      {
        stepNo: 3,
        titleNp: 'स्थलगत प्राविधिक प्रमाणीकरण गर्नुहोस्',
        titleEn: 'Perform On-Site Technical Verification',
        descNp: 'वडा प्राविधिक टोलीले घटनास्थल पुगेर तस्वीर, क्षति विवरण र वस्तुस्थिति जाँच गरी घटनालाई "प्रमाणित" स्थितिमा राख्नुहोस्।',
        descEn: 'Ward emergency inspector visits the ground site with mobile GPS, inspects damages, and marks incident "Verified".',
      },
      {
        stepNo: 4,
        titleNp: 'आवश्यक परेमा IVR तथा साइरन सक्रिय गर्नुहोस्',
        titleEn: 'Trigger IVR Voice Calls & Sirens if Critical',
        descNp: 'उच्च जोखिम भएमा "स्वचालित IVR कल र साइरन" ट्याबबाट तटीय बासिन्दालाई एक-क्लिकमा चेतावनी सन्देश पठाउनुहोस्।',
        descEn: 'For critical escalation, navigate to Broadcast tab to initiate outbound phone calls and 5-10km solar sirens.',
      },
    ],
  },
  {
    id: 'guide-2',
    titleNp: '२. खोज-उद्धार (SAR) हेभी इक्युपमेन्ट परिचालन तथा स्वयंसेवक समन्वय',
    titleEn: '2. SAR Heavy Equipment Mobilization & Volunteer Coordination',
    categoryNp: 'खोज तथा उद्धार अपरेसन',
    categoryEn: 'Search & Rescue (SAR) Operations',
    readTimeNp: '२ मिनेट',
    readTimeEn: '2 min read',
    steps: [
      {
        stepNo: 1,
        titleNp: 'SAR हेभी इक्युपमेन्ट डाइरेक्टरी खोल्नुहोस्',
        titleEn: 'Open SAR Equipment Directory',
        descNp: 'विपद् हबको ट्याब १५ "खोज-उद्धार (SAR) र डोजर डाइरेक्टरी" मा जानुहोस्।',
        descEn: 'Open Tab 15 "SAR Directory" inside Disaster Hub to view ready machinery.',
      },
      {
        stepNo: 2,
        titleNp: 'नजिकको डोजर, एक्साभेटर वा डुङ्गा पहिचान गर्नुहोस्',
        titleEn: 'Locate Nearest Dozer, Excavator, or Rescue Boat',
        descNp: 'घटना भएको वडा नजिक स्ट्यान्डबाइ अवस्थामा रहेका मेशिन र अपरेटरको प्रत्यक्ष फोन नम्बर हेर्नुहोस्।',
        descEn: 'Filter standby machinery near the impacted ward and identify operator contact numbers.',
      },
      {
        stepNo: 3,
        titleNp: 'आधिकारिक SAR परिचालन आदेश जारी गर्नुहोस्',
        titleEn: 'Transmit Formal SAR Dispatch Order',
        descNp: '"आदेश पठाउनुहोस्" बटन थिची अपरेटर तथा वडा स्वयंसेवक कार्यदललाई घटनास्थलमा तत्काल खटाउनुहोस्।',
        descEn: 'Click "Transmit Dispatch" to issue authorized deployment instructions to operators and volunteer teams.',
      },
    ],
  },
  {
    id: 'guide-3',
    titleNp: '३. गृहमन्त्रालय राहत मापदण्ड २०७७ अनुसार क्षति मूल्याङ्कन तथा राहत वितरण',
    titleEn: '3. MoHA Standard 2077 Damage Audits & Relief DBT Disbursement',
    categoryNp: 'राहत तथा पुनःलाभ',
    categoryEn: 'Relief & Recovery Administration',
    readTimeNp: '३ मिनेट',
    readTimeEn: '3 min read',
    steps: [
      {
        stepNo: 1,
        titleNp: 'RDRA डिजिटल फाराम भर्नुहोस्',
        titleEn: 'Complete Field RDRA Form',
        descNp: 'विपद् हबको ट्याब १४ मा गई प्रभावित घरधुरीको पूर्ण वा आंशिक क्षति विवरण र नागरिकता नम्बर प्रविष्ट गर्नुहोस्।',
        descEn: 'Navigate to Tab 14 in Disaster Hub to record structured household damages and citizenship numbers.',
      },
      {
        stepNo: 2,
        titleNp: 'मापदण्ड अनुसार राहत रकम प्रमाणीकरण',
        titleEn: 'Verify Relief Entitlement per Standard',
        descNp: 'प्रणालीले गृहमन्त्रालय २०७७ मापदण्ड बमोजिम तत्काल राहत रकम स्वतः गणना गर्दछ।',
        descEn: 'The automated rules engine computes statutory cash grants according to MoHA Standard 2077.',
      },
      {
        stepNo: 3,
        titleNp: 'बैंक खातामा प्रत्यक्ष भुक्तानी (DBT) निकासा गर्नुहोस्',
        titleEn: 'Disburse via Direct Bank Transfer (DBT)',
        descNp: 'ट्याब ३ "पालिका विपद् कोष राहत वितरण" मा बैंक भौचर नम्बर प्रविष्ट गरी भुक्तानी सम्पन्न गर्नुहोस्।',
        descEn: 'In Tab 3 Relief Funds, disburse grants directly into beneficiary bank accounts with voucher tracking.',
      },
    ],
  },
];

export const IT_SUPPORT_INFO = {
  municipalityNp: 'पाँचपोखरी थाङपाल गाउँपालिका — आपतकालीन कार्यसञ्चालन केन्द्र (LEOC)',
  municipalityEn: 'Panchpokhari Thangpal Rural Municipality — Local EOC (LEOC)',
  headquartersNp: 'थाङपालधाप, सिन्धुपाल्चोक, बागमती प्रदेश, नेपाल',
  headquartersEn: 'Thangpaldhap, Sindhupalchok, Bagmati Province, Nepal',
  itOfficerNp: 'विपद् व्यवस्थापन तथा सूचना प्रविधि शाखा (EOC कमाण्ड)',
  itOfficerEn: 'Disaster Management & IT Section (EOC Command)',
  email: 'disaster@panchpokharimun.gov.np',
  phone: '०११-४६०१११ / ९८४१२२३३४४',
  tollFreeNp: '१६६०-०१-४४४४४ (निःशुल्क विपद् टोल-फ्री)',
  tollFreeEn: '1660-01-44444 (Toll-Free Disaster Helpline)',
  emergencyHotlineNp: '११४४ (२४/७ आपतकालीन EOC हटलाइन) · VHF Ch. 16',
  emergencyHotlineEn: '1144 (24/7 Emergency EOC Hotline) · VHF Ch. 16',
  officeHoursNp: 'आपतकालीन नियन्त्रण कक्ष (EOC): २४ घण्टा ७ दिन खुला (24/7)',
  officeHoursEn: 'Emergency Operations Centre (LEOC): 24 Hours / 7 Days Live',
};
