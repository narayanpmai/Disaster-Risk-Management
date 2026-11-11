import panchpokhariWardsData from './panchpokhariWardsGeojson.json';

export interface PalikaBoundaryMetadata {
  id: string;
  subdomain: string;
  nameNepali: string;
  nameEn: string;
  typeNepali: string;
  typeEn: string;
  district: string;
  districtEn: string;
  province: string;
  provinceEn: string;
  headquarters: string;
  totalWards: number;
  center: [number, number]; // [lat, lng]
  defaultZoom: number;
  bounds?: [[number, number], [number, number]]; // [[south, west], [north, east]]
  areaSqKm: number;
  population: number;
  emergencyPhone: string;
  primaryHazards: string[];
  color: string;
}

// ── 1. PALIKA REGISTRY (All supported / active tenant palikas) ──
export const PALIKA_METADATA_REGISTRY: Record<string, PalikaBoundaryMetadata> = {
  panchpokhari: {
    id: 'f07c2bcc-81ad-4e27-aeff-1a65f04e9f06',
    subdomain: 'panchpokhari',
    nameNepali: 'पाँचपोखरी थाङपाल गाउँपालिका',
    nameEn: 'Panchpokhari Thangpal Rural Municipality',
    typeNepali: 'गाउँपालिका',
    typeEn: 'Rural Municipality',
    district: 'सिन्धुपाल्चोक',
    districtEn: 'Sindhupalchok',
    province: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    headquarters: 'थाङपालधाप, मानेखर्क',
    totalWards: 8,
    center: [27.9736, 85.6425],
    defaultZoom: 12,
    bounds: [
      [27.8540, 85.5450],
      [28.1250, 85.7450],
    ],
    areaSqKm: 187.29,
    population: 21102,
    emergencyPhone: '०११-६९०१२३',
    primaryHazards: ['बाढी (Flood)', 'पहिरो (Landslide)', 'हिमपहिरो (Avalanche)', 'भूकम्प (Earthquake)'],
    color: '#dc2626',
  },
  helambu: {
    id: 'a18b3cde-92be-5f38-bf00-2b76f15fa017',
    subdomain: 'helambu',
    nameNepali: 'हेलम्बु गाउँपालिका',
    nameEn: 'Helambu Rural Municipality',
    typeNepali: 'गाउँपालिका',
    typeEn: 'Rural Municipality',
    district: 'सिन्धुपाल्चोक',
    districtEn: 'Sindhupalchok',
    province: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    headquarters: 'हेलम्बु / तिम्बु',
    totalWards: 7,
    center: [28.0321, 85.5512],
    defaultZoom: 12,
    bounds: [
      [27.9200, 85.4500],
      [28.1500, 85.6300],
    ],
    areaSqKm: 287.26,
    population: 17671,
    emergencyPhone: '०११-६९०४५६',
    primaryHazards: ['गल्छी बाढी (Flash Flood)', 'पहिरो (Landslide)', 'हिमपात (Heavy Snowfall)'],
    color: '#0284c7',
  },
  melamchi: {
    id: 'b29c4def-03cf-6a49-cf11-3c87f26ab128',
    subdomain: 'melamchi',
    nameNepali: 'मेलम्ची नगरपालिका',
    nameEn: 'Melamchi Municipality',
    typeNepali: 'नगरपालिका',
    typeEn: 'Municipality',
    district: 'सिन्धुपाल्चोक',
    districtEn: 'Sindhupalchok',
    province: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    headquarters: 'मेलम्ची बजार',
    totalWards: 12,
    center: [27.8284, 85.5776],
    defaultZoom: 12,
    bounds: [
      [27.7500, 85.5000],
      [27.9100, 85.6500],
    ],
    areaSqKm: 160.00,
    population: 45479,
    emergencyPhone: '०११-६९०७८९',
    primaryHazards: ['नदी कटान (River Erosion)', 'बाढी (Melamchi Flood)', 'सहरी आगलागी (Urban Fire)'],
    color: '#d97706',
  },
  indrawati: {
    id: 'c30d5ef0-14d0-7b5a-d022-4d98a37bc239',
    subdomain: 'indrawati',
    nameNepali: 'इन्द्रावती गाउँपालिका',
    nameEn: 'Indrawati Rural Municipality',
    typeNepali: 'गाउँपालिका',
    typeEn: 'Rural Municipality',
    district: 'सिन्धुपाल्चोक',
    districtEn: 'Sindhupalchok',
    province: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    headquarters: 'नवलपुर / भिमटार',
    totalWards: 12,
    center: [27.7651, 85.5923],
    defaultZoom: 12,
    bounds: [
      [27.7000, 85.5200],
      [27.8300, 85.6700],
    ],
    areaSqKm: 105.09,
    population: 25345,
    emergencyPhone: '०११-६९०९००',
    primaryHazards: ['इन्द्रावती बाढी (Flood)', 'सुक्खा खडेरी (Drought)', 'पहिरो (Landslide)'],
    color: '#059669',
  },
  kathmandu: {
    id: 'd41e6fa1-25e1-8c6b-e133-5ea9b48cd340',
    subdomain: 'kathmandu',
    nameNepali: 'काठमाडौँ महानगरपालिका',
    nameEn: 'Kathmandu Metropolitan City',
    typeNepali: 'महानगरपालिका',
    typeEn: 'Metropolitan City',
    district: 'काठमाडौँ',
    districtEn: 'Kathmandu',
    province: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    headquarters: 'सुन्धरा / बागदरबार',
    totalWards: 32,
    center: [27.7172, 85.3240],
    defaultZoom: 12,
    bounds: [
      [27.6700, 85.2700],
      [27.7600, 85.3800],
    ],
    areaSqKm: 49.45,
    population: 862400,
    emergencyPhone: '११८०',
    primaryHazards: ['सहरी बाढी (Urban Inundation)', 'भूकम्प (Earthquake)', 'आगलागी (Fire)'],
    color: '#7c3aed',
  },
  barpak: {
    id: 'e52f7ab2-36f2-9d7c-f244-6fb0c59de451',
    subdomain: 'barpak',
    nameNepali: 'बारपाक सुलिकोट गाउँपालिका',
    nameEn: 'Barpak Sulikot Rural Municipality',
    typeNepali: 'गाउँपालिका',
    typeEn: 'Rural Municipality',
    district: 'गोरखा',
    districtEn: 'Gorkha',
    province: 'गण्डकी प्रदेश',
    provinceEn: 'Gandaki Province',
    headquarters: 'ताकुकोट, बारपाक',
    totalWards: 8,
    center: [28.2145, 84.7456],
    defaultZoom: 12,
    bounds: [
      [28.1100, 84.6500],
      [28.3200, 84.8500],
    ],
    areaSqKm: 200.63,
    population: 25389,
    emergencyPhone: '०६४-४४०१२३',
    primaryHazards: ['भूकम्पीय धक्का (Epicenter Seismic)', 'पहिरो (Mass Movement)'],
    color: '#ca8a04',
  },
};

// Export Panchpokhari Ward GeoJSON
export const PANCHPOKHARI_WARDS_GEOJSON = panchpokhariWardsData;

// ── 2. SINDHUPALCHOK DISTRICT & 12 MUNICIPALITIES BOUNDARIES ──
export const SINDHUPALCHOK_PALIKAS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'palika-panchpokhari',
      properties: {
        code: '30201',
        nameNepali: 'पाँचपोखरी थाङपाल गाउँपालिका',
        nameEn: 'Panchpokhari Thangpal Rural Municipality',
        type: 'गाउँपालिका',
        wards: 8,
        headquarters: 'थाङपालधाप',
        riskLevel: 'अति उच्च (Critical Multi-Hazard)',
        color: '#dc2626',
        center: [27.9736, 85.6425],
        isActiveTenant: true,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.5840, 27.8730],
          [85.5450, 27.8820],
          [85.5700, 27.9940],
          [85.5730, 28.0150],
          [85.6030, 28.0140],
          [85.6370, 28.0030],
          [85.6830, 27.9930],
          [85.7130, 27.9740],
          [85.7330, 27.9620],
          [85.7270, 27.9490],
          [85.7040, 27.8960],
          [85.6710, 27.8600],
          [85.6170, 27.8860],
          [85.5840, 27.8730],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-helambu',
      properties: {
        code: '30202',
        nameNepali: 'हेलम्बु गाउँपालिका',
        nameEn: 'Helambu Rural Municipality',
        type: 'गाउँपालिका',
        wards: 7,
        headquarters: 'हेलम्बु / तिम्बु',
        riskLevel: 'उच्च (High Flash Flood/Landslide)',
        color: '#0284c7',
        center: [28.0321, 85.5512],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.4500, 27.9700],
          [85.4600, 28.1100],
          [85.5400, 28.1500],
          [85.5800, 28.0600],
          [85.5730, 28.0150],
          [85.5700, 27.9940],
          [85.5450, 27.8820],
          [85.4800, 27.9100],
          [85.4500, 27.9700],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-melamchi',
      properties: {
        code: '30203',
        nameNepali: 'मेलम्ची नगरपालिका',
        nameEn: 'Melamchi Municipality',
        type: 'नगरपालिका',
        wards: 12,
        headquarters: 'मेलम्ची बजार',
        riskLevel: 'उच्च (High Flood/Riparian Inundation)',
        color: '#d97706',
        center: [27.8284, 85.5776],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.5000, 27.8100],
          [85.5200, 27.8700],
          [85.5840, 27.8730],
          [85.6170, 27.8860],
          [85.6710, 27.8600],
          [85.6600, 27.7900],
          [85.5800, 27.7600],
          [85.5200, 27.7800],
          [85.5000, 27.8100],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-indrawati',
      properties: {
        code: '30204',
        nameNepali: 'इन्द्रावती गाउँपालिका',
        nameEn: 'Indrawati Rural Municipality',
        type: 'गाउँपालिका',
        wards: 12,
        headquarters: 'नवलपुर / भिमटार',
        riskLevel: 'मध्यम (Moderate Flood/Drought)',
        color: '#059669',
        center: [27.7651, 85.5923],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.5200, 27.7800],
          [85.5800, 27.7600],
          [85.6600, 27.7900],
          [85.6700, 27.7300],
          [85.6200, 27.7100],
          [85.5500, 27.7200],
          [85.5200, 27.7800],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-chautara',
      properties: {
        code: '30205',
        nameNepali: 'चौतारा साँगाचोकगढी नगरपालिका',
        nameEn: 'Chautara Sangachokgadhi Municipality',
        type: 'नगरपालिका (सदरमुकाम)',
        wards: 14,
        headquarters: 'चौतारा बजार',
        riskLevel: 'मध्यम (Moderate Landslide)',
        color: '#4338ca',
        center: [27.7782, 85.7145],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.6710, 27.8600],
          [85.7040, 27.8960],
          [85.7600, 27.8600],
          [85.7800, 27.7700],
          [85.7400, 27.7300],
          [85.6700, 27.7300],
          [85.6600, 27.7900],
          [85.6710, 27.8600],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-jugal',
      properties: {
        code: '30206',
        nameNepali: 'जुगल गाउँपालिका',
        nameEn: 'Jugal Rural Municipality',
        type: 'गाउँपालिका',
        wards: 7,
        headquarters: 'बराम्बा / ढाँड',
        riskLevel: 'अति उच्च (Critical Landslide - लिदी पहिरो क्षेत्र)',
        color: '#b91c1c',
        center: [27.9124, 85.7981],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.7130, 27.9740],
          [85.7500, 28.0800],
          [85.8600, 28.1200],
          [85.8800, 27.9500],
          [85.8200, 27.8800],
          [85.7600, 27.8600],
          [85.7040, 27.8960],
          [85.7270, 27.9490],
          [85.7330, 27.9620],
          [85.7130, 27.9740],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-bhotekoshi',
      properties: {
        code: '30207',
        nameNepali: 'भोटेकोशी गाउँपालिका',
        nameEn: 'Bhotekoshi Rural Municipality',
        type: 'गाउँपालिका (तातोपानी नाका)',
        wards: 5,
        headquarters: 'फुल्पिङकट्टी / तातोपानी',
        riskLevel: 'अति उच्च (Critical GLOF & Landslide)',
        color: '#991b1b',
        center: [27.9352, 85.8924],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.8600, 28.1200],
          [85.9500, 28.1600],
          [86.0200, 28.0100],
          [85.9400, 27.8800],
          [85.8800, 27.9500],
          [85.8600, 28.1200],
        ]],
      },
    },
    {
      type: 'Feature',
      id: 'palika-barhabise',
      properties: {
        code: '30208',
        nameNepali: 'बाह्रबिसे नगरपालिका',
        nameEn: 'Barhabise Municipality',
        type: 'नगरपालिका',
        wards: 9,
        headquarters: 'बाह्रबिसे बजार',
        riskLevel: 'उच्च (High Bhotekoshi Flood)',
        color: '#ea580c',
        center: [27.7891, 85.9012],
        isActiveTenant: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [85.8200, 27.8800],
          [85.8800, 27.9500],
          [85.9400, 27.8800],
          [85.9600, 27.7800],
          [85.8800, 27.7600],
          [85.8200, 27.8800],
        ]],
      },
    },
  ],
};

// ── 3. SINDHUPALCHOK DISTRICT OUTER BOUNDARY POLYGON ──
export const SINDHUPALCHOK_DISTRICT_BOUNDARY = {
  type: 'Feature',
  properties: {
    districtNameNp: 'सिन्धुपाल्चोक जिल्ला',
    districtNameEn: 'Sindhupalchok District',
    provinceNp: 'बागमती प्रदेश',
    provinceEn: 'Bagmati Province',
    areaSqKm: 2542,
    headquarters: 'चौतारा',
    totalPalikas: 12,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [85.4500, 27.9700],
      [85.4600, 28.1100],
      [85.5400, 28.1500],
      [85.7500, 28.0800],
      [85.8600, 28.1200],
      [85.9500, 28.1600],
      [86.0400, 28.0100],
      [86.0100, 27.8200],
      [85.9600, 27.7000],
      [85.8600, 27.6500],
      [85.7400, 27.6700],
      [85.6200, 27.7100],
      [85.5200, 27.7200],
      [85.4800, 27.8500],
      [85.4500, 27.9700],
    ]],
  },
};

// ── 4. NEPAL PROVINCES & NATIONAL OUTLINE ──
export const NEPAL_PROVINCES_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'prov-1',
      properties: { nameNp: 'कोशी प्रदेश', nameEn: 'Koshi Province', capital: 'विराटनगर', color: '#3b82f6' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[86.5, 27.8], [88.2, 27.9], [88.1, 26.4], [86.7, 26.5], [86.5, 27.8]]],
      },
    },
    {
      type: 'Feature',
      id: 'prov-2',
      properties: { nameNp: 'मधेश प्रदेश', nameEn: 'Madhesh Province', capital: 'जनकपुरधाम', color: '#10b981' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[84.8, 27.1], [86.9, 26.8], [86.8, 26.4], [84.7, 26.7], [84.8, 27.1]]],
      },
    },
    {
      type: 'Feature',
      id: 'prov-3',
      properties: { nameNp: 'बागमती प्रदेश (चालु प्रदेश)', nameEn: 'Bagmati Province (Active)', capital: 'हेटौँडा', color: '#dc2626', isCurrent: true },
      geometry: {
        type: 'Polygon',
        coordinates: [[[84.6, 28.2], [86.4, 28.1], [86.2, 26.9], [84.6, 27.3], [84.6, 28.2]]],
      },
    },
    {
      type: 'Feature',
      id: 'prov-4',
      properties: { nameNp: 'गण्डकी प्रदेश', nameEn: 'Gandaki Province', capital: 'पोखरा', color: '#f59e0b' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[83.1, 29.3], [85.0, 28.5], [84.5, 27.5], [83.3, 27.8], [83.1, 29.3]]],
      },
    },
    {
      type: 'Feature',
      id: 'prov-5',
      properties: { nameNp: 'लुम्बिनी प्रदेश', nameEn: 'Lumbini Province', capital: 'देउखुरी / बुटवल', color: '#8b5cf6' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[81.5, 28.5], [83.5, 28.2], [83.2, 27.4], [81.4, 27.6], [81.5, 28.5]]],
      },
    },
    {
      type: 'Feature',
      id: 'prov-6',
      properties: { nameNp: 'कर्णाली प्रदेश', nameEn: 'Karnali Province', capital: 'वीरेन्द्रनगर', color: '#ec4899' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[81.2, 30.4], [83.4, 29.4], [82.3, 28.3], [81.0, 28.6], [81.2, 30.4]]],
      },
    },
    {
      type: 'Feature',
      id: 'prov-7',
      properties: { nameNp: 'सुदूरपश्चिम प्रदेश', nameEn: 'Sudurpashchim Province', capital: 'गोदावरी', color: '#06b6d4' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[80.0, 30.2], [81.6, 29.8], [81.3, 28.5], [80.1, 28.8], [80.0, 30.2]]],
      },
    },
  ],
};

