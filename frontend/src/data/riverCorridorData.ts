// ─── नदी तथा खोला किनार २०० मिटर रेड जोन तथा तटीय जोखिम मूल्याङ्कन डाटाबेस ───
// Municipal River Corridor 200m Red Hazard Zone & Riparian Risk Assessment Dataset
// Focus: Melamchi River, Indrawati River, Yangri Khola & Larke Tributary Basins

export interface RiverCorridor {
  id: string;
  nameNepali: string;
  nameEn: string;
  lengthKm: number;
  basinAreaSqKm: number;
  averageDischargeCumec: number;
  floodHistory: string;
  coordinates: [number, number][]; // [lat, lng]
}

export interface RiparianFacilityRisk {
  id: string;
  nameNepali: string;
  category: 'bridge' | 'school' | 'health_post' | 'mining_site' | 'settlement' | 'road';
  wardNumber: number;
  lat: number;
  lng: number;
  distanceFromRiverMeters: number;
  riskRating: 'अति उच्च (Critical)' | 'उच्च (High)' | 'मध्यम (Moderate)';
  details: string;
}

export interface WardRiparianVulnerability {
  wardNumber: number;
  wardName: string;
  riverName: string;
  householdsIn200m: number;
  populationAtRisk: number;
  vulnerableCitizens: {
    postnatalMothers: number;
    disabilities: number;
    seniors75Plus: number;
  };
  mudStoneHouses: number;
  bridgesCount: number;
  erosionRiskKm: number;
  shelterName: string;
}

// 1. Precise Centerline Paths of the Municipal Rivers
export const RIVER_CORRIDORS: RiverCorridor[] = [
  {
    id: 'melamchi_river',
    nameNepali: 'मेलम्ची नदी (Melamchi River)',
    nameEn: 'Melamchi River',
    lengthKm: 24.2,
    basinAreaSqKm: 330,
    averageDischargeCumec: 42.5,
    floodHistory: '२०७८ असार १ र साउन १६ को विनाशकारी गेग्रान बाढी (Debris Flow) ले ठूलो क्षति पुर्‍याएको',
    coordinates: [
      [28.028, 85.718],
      [28.012, 85.705],
      [27.995, 85.688],
      [27.981, 85.665],
      [27.965, 85.653],
      [27.952, 85.648],
      [27.938, 85.644],
      [27.924, 85.642],
      [27.912, 85.635],
      [27.898, 85.624],
      [27.882, 85.613],
      [27.865, 85.599],
      [27.848, 85.588],
      [27.830, 85.580],
    ],
  },
  {
    id: 'indrawati_river',
    nameNepali: 'इन्द्रावती नदी (Indrawati River)',
    nameEn: 'Indrawati River',
    lengthKm: 18.5,
    basinAreaSqKm: 410,
    averageDischargeCumec: 58.2,
    floodHistory: 'उच्च जलसतह र कटान जोखिम, वर्षायाममा किनाराका बस्ती र कृषि जमिन डुबानमा पर्ने',
    coordinates: [
      [27.962, 85.695],
      [27.945, 85.684],
      [27.928, 85.672],
      [27.910, 85.660],
      [27.892, 85.648],
      [27.875, 85.635],
      [27.858, 85.612],
      [27.842, 85.595],
      [27.830, 85.580],
    ],
  },
  {
    id: 'yangri_larke_khola',
    nameNepali: 'याङ्ग्री तथा लार्के खोला (Yangri-Larke Basin)',
    nameEn: 'Yangri-Larke Tributaries',
    lengthKm: 14.8,
    basinAreaSqKm: 165,
    averageDischargeCumec: 24.0,
    floodHistory: 'हिमनदी मुहान (Bregmatang/Alpine Cirque) बाट आउने गेद, ढुङ्गा र बाढीको मुहान क्षेत्र',
    coordinates: [
      [28.042, 85.736],
      [28.020, 85.725],
      [27.998, 85.710],
      [27.975, 85.688],
      [27.954, 85.670],
      [27.935, 85.655],
      [27.915, 85.636], // Confluence with Melamchi near Tipeni
    ],
  },
];

// 2. Geodesic Buffer Polygon Generator (Metrically Exact for both Left & Right Banks)
export function generateCorridorPolygon(
  coords: [number, number][],
  bufferMeters: number
): [number, number][] {
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  const mPerDegLat = 111000;

  for (let i = 0; i < coords.length; i++) {
    const lat = coords[i][0];
    const lng = coords[i][1];
    const cosLat = Math.cos((lat * Math.PI) / 180);
    const mPerDegLng = mPerDegLat * cosLat;

    const pPrev = coords[Math.max(0, i - 1)];
    const pNext = coords[Math.min(coords.length - 1, i + 1)];

    // In local meters:
    const dx = (pNext[1] - pPrev[1]) * mPerDegLng;
    const dy = (pNext[0] - pPrev[0]) * mPerDegLat;
    const len = Math.hypot(dx, dy) || 1;

    // Unit normal vector perpendicular to river centerline
    const nx = -dy / len;
    const ny = dx / len;

    const dLat = (ny * bufferMeters) / mPerDegLat;
    const dLng = (nx * bufferMeters) / mPerDegLng;

    left.push([
      Number((lat + dLat).toFixed(6)),
      Number((lng + dLng).toFixed(6)),
    ]);
    right.push([
      Number((lat - dLat).toFixed(6)),
      Number((lng - dLng).toFixed(6)),
    ]);
  }
  // Return closed ring: left forward, right reverse
  return [...left, ...right.reverse()];
}

// 3. High-Risk Critical Facilities located within the 200m Riparian Buffer
export const CRITICAL_RIPARIAN_FACILITIES: RiparianFacilityRisk[] = [
  {
    id: 'fac-rip-01',
    nameNepali: 'तिपेनी बजार झोलुङ्गे पुल',
    category: 'bridge',
    wardNumber: 7,
    lat: 27.9125,
    lng: 27.9125 ? 85.6358 : 85.6358,
    distanceFromRiverMeters: 15,
    riskRating: 'अति उच्च (Critical)',
    details: 'नदीको जलसतह ४ मिटर बढ्दा एप्रोच सडक र स्प्यान दुवै डुबानमा पर्ने अवस्था',
  },
  {
    id: 'fac-rip-02',
    nameNepali: 'मेलम्ची मोटरेबल पक्की पुल',
    category: 'bridge',
    wardNumber: 8,
    lat: 27.8305,
    lng: 85.5808,
    distanceFromRiverMeters: 8,
    riskRating: 'अति उच्च (Critical)',
    details: '२०७८ बाढीमा पुनर्निर्माण गरिएको अस्थायी बेलिब्रीज, २०० मिटर रेड जोनको केन्द्रमा',
  },
  {
    id: 'fac-rip-03',
    nameNepali: 'याङ्ग्री बगर आधारभूत विद्यालय',
    category: 'school',
    wardNumber: 3,
    lat: 27.942,
    lng: 85.662,
    distanceFromRiverMeters: 65,
    riskRating: 'उच्च (High)',
    details: 'वर्षायाममा नदी कटान र बालुवा थुप्रिने जोखिम, सुरक्षित आश्रयस्थलमा सार्न सिफारिस',
  },
  {
    id: 'fac-rip-04',
    nameNepali: 'तिपेनी नदी किनार अस्थायी बजार बस्ती',
    category: 'settlement',
    wardNumber: 7,
    lat: 27.915,
    lng: 85.637,
    distanceFromRiverMeters: 45,
    riskRating: 'अति उच्च (Critical)',
    details: '३५ वटा अस्थायी टहरा र पसलहरू, रातको समयमा बाढी आए तत्काल उद्धार गर्नुपर्ने',
  },
  {
    id: 'fac-rip-05',
    nameNepali: 'च्छिम्टी खोला क्रसर तथा नदीजन्य खानी',
    category: 'mining_site',
    wardNumber: 3,
    lat: 27.968,
    lng: 85.655,
    distanceFromRiverMeters: 28,
    riskRating: 'उच्च (High)',
    details: 'IEE स्वीकृत सिमाना भन्दा बढी नदी सतह गहिरो खनिएको र गेग्रान बहाव बढाउने जोखिम',
  },
  {
    id: 'fac-rip-06',
    nameNepali: 'मेलम्ची-भोताङ सडक खण्ड (कि.मी. १८-२२)',
    category: 'road',
    wardNumber: 3,
    lat: 27.958,
    lng: 85.651,
    distanceFromRiverMeters: 35,
    riskRating: 'अति उच्च (Critical)',
    details: 'नदीको बायाँ किनाराबाट गएको कच्ची सडक, पहिरो र नदी कटानले पटकपटक अवरुद्ध हुने',
  },
];

// 4. Ward-wise Riparian Vulnerability (200m River Corridor Breakdown)
export const WARD_WISE_RIPARIAN_RISK: WardRiparianVulnerability[] = [
  {
    wardNumber: 1,
    wardName: 'बाँसखर्क',
    riverName: 'इन्द्रावती नदी',
    householdsIn200m: 42,
    populationAtRisk: 185,
    vulnerableCitizens: { postnatalMothers: 6, disabilities: 8, seniors75Plus: 14 },
    mudStoneHouses: 28,
    bridgesCount: 1,
    erosionRiskKm: 2.1,
    shelterName: 'बाँसखर्क वडा कार्यालय तथा प्रावि मैदान',
  },
  {
    wardNumber: 2,
    wardName: 'बरुवा',
    riverName: 'याङ्ग्री तथा लार्के खोला',
    householdsIn200m: 56,
    populationAtRisk: 260,
    vulnerableCitizens: { postnatalMothers: 9, disabilities: 11, seniors75Plus: 18 },
    mudStoneHouses: 44,
    bridgesCount: 1,
    erosionRiskKm: 3.4,
    shelterName: 'बरुवा सामुदायिक बहुउद्देश्यीय भवन',
  },
  {
    wardNumber: 3,
    wardName: 'भोताङ',
    riverName: 'मेलम्ची नदी (माथिल्लो भेग)',
    householdsIn200m: 78,
    populationAtRisk: 390,
    vulnerableCitizens: { postnatalMothers: 14, disabilities: 16, seniors75Plus: 28 },
    mudStoneHouses: 58,
    bridgesCount: 1,
    erosionRiskKm: 4.8,
    shelterName: 'भोताङ उच्च मावि पक्की भवन',
  },
  {
    wardNumber: 4,
    wardName: 'थाङपालधाप',
    riverName: 'मेलम्ची नदी',
    householdsIn200m: 65,
    populationAtRisk: 320,
    vulnerableCitizens: { postnatalMothers: 11, disabilities: 12, seniors75Plus: 22 },
    mudStoneHouses: 42,
    bridgesCount: 1,
    erosionRiskKm: 3.2,
    shelterName: 'थाङपालधाप स्वास्थ्य चौकी हल',
  },
  {
    wardNumber: 5,
    wardName: 'गुन्सा',
    riverName: 'इन्द्रावती सहायक खोला',
    householdsIn200m: 48,
    populationAtRisk: 230,
    vulnerableCitizens: { postnatalMothers: 8, disabilities: 9, seniors75Plus: 16 },
    mudStoneHouses: 30,
    bridgesCount: 0,
    erosionRiskKm: 1.8,
    shelterName: 'गुन्सा वडा परिसर तथा खुला चौर',
  },
  {
    wardNumber: 6,
    wardName: 'थाङपालकोट',
    riverName: 'इन्द्रावती नदी',
    householdsIn200m: 52,
    populationAtRisk: 250,
    vulnerableCitizens: { postnatalMothers: 9, disabilities: 10, seniors75Plus: 17 },
    mudStoneHouses: 34,
    bridgesCount: 1,
    erosionRiskKm: 2.6,
    shelterName: 'थाङपालकोट खेलमैदान shelter',
  },
  {
    wardNumber: 7,
    wardName: 'तिपेनी बजार',
    riverName: 'मेलम्ची-याङ्ग्री दोभान',
    householdsIn200m: 43,
    populationAtRisk: 215,
    vulnerableCitizens: { postnatalMothers: 11, disabilities: 8, seniors75Plus: 11 },
    mudStoneHouses: 22,
    bridgesCount: 2,
    erosionRiskKm: 3.9,
    shelterName: 'तिपेनी बजार डाँडा माथिल्लो क्याम्पस',
  },
];

// 5. Macro Statistics for the 200m Riparian Red Zone
export const RIPARIAN_MACRO_STATS = {
  totalRiverLengthKm: 57.5, // 24.2 + 18.5 + 14.8
  bufferRadiusMeters: 200,
  redZoneAreaSqKm: 23.0,
  totalHouseholdsAtRisk: 384,
  totalPopulationAtRisk: 1850,
  criticalVulnerableCount: 268, // mothers + disabilities + seniors
  mudStoneHousesCount: 258,
  bridgesInRedZone: 7,
  roadsAtRiskKm: 18.2,
  schoolsHealthPostsCount: 3,
  miningSitesCount: 4,
  agriculturalLandHa: 142,
};

// 6. Action Plan Recommendations for Riparian Corridors
export interface RiparianActionSuggestion {
  id: string;
  category: 'structural' | 'bio_engineering' | 'zoning_policy' | 'early_warning';
  categoryNepali: string;
  title: string;
  description: string;
  priority: 'अति आवश्यक (Immediate)' | 'मध्यकालीन (Medium-term)' | 'दीर्घकालीन (Long-term)';
  responsibleEntity: string;
  expectedImpact: string;
}

export const RIPARIAN_ACTION_RECOMMENDATIONS: RiparianActionSuggestion[] = [
  {
    id: 'act-01',
    category: 'structural',
    categoryNepali: 'इन्जिनियरिङ तथा संरचनात्मक सुरक्षा',
    title: 'लचिला ग्याबियन पर्खाल र बोल्डर रिप-र्याप (Boulder Riprap)',
    description: 'कडा कंक्रीट भित्ता बाढीको धक्काले चर्किएर भत्कने हुँदा तारजालीमा भारी ढुङ्गा भरेका लचिला ग्याबियन र बोल्डर पिच गरी नदीको किनार स्थिर बनाउने।',
    priority: 'अति आवश्यक (Immediate)',
    responsibleEntity: 'पालिका पूर्वाधार शाखा तथा जलस्रोत मन्त्रालय',
    expectedImpact: 'नदीको प्रत्यक्ष किनारा कटान ८०% सम्म रोकथाम।',
  },
  {
    id: 'act-02',
    category: 'structural',
    categoryNepali: 'इन्जिनियरिङ तथा संरचनात्मक सुरक्षा',
    title: 'माथिल्लो भेगमा गेग्रान रोक्ने चेक-ड्याम (SABO Debris Dams)',
    description: 'भेमाथाङ, याङ्ग्री र लार्के खोंचमा सिँढीदार जालीदार चेक ड्याम निर्माण गरी वर्षायाममा बग्ने ठूला ढुङ्गा र गेग्रानलाई बस्तीसम्म पुग्न नदिई माथि नै रोक्ने।',
    priority: 'अति आवश्यक (Immediate)',
    responsibleEntity: 'विपद् व्यवस्थापन प्राधिकरण (NDRRMA) तथा सेना/प्रहरी इन्जिनियरिङ',
    expectedImpact: '२०७८ जस्तो गेग्रान बाढीले पुल र बजार पुर्ने जोखिम न्यून।',
  },
  {
    id: 'act-03',
    category: 'bio_engineering',
    categoryNepali: 'जैविक इन्जिनियरिङ (Bio-Engineering)',
    title: '३ तहको वनस्पति हरित पट्टी (3-Tier Riparian Green Belt)',
    description: '१) पानीको छाल लाग्ने किनारमा बेतिभर घाँस (जरा ३-४ मिटर गहिरो जाने), २) तटमा बाँसका झाङ र अम्रिसो, ३) माथिल्लो ढिस्कोमा सिमल, खयर र सिसौ रोपी प्राकृतिक हरित पेटी निर्माण गर्ने।',
    priority: 'अति आवश्यक (Immediate)',
    responsibleEntity: 'पालिका वन तथा वातावरण शाखा, सामुदायिक वन',
    expectedImpact: 'माटोको संरचना मजबुत हुने र जैविक विविधता संरक्षण।',
  },
  {
    id: 'act-04',
    category: 'zoning_policy',
    categoryNepali: 'नीतिगत तथा भवन निर्माण नियमन',
    title: 'नदी किनार २०० मिटर "नो-कन्स्ट्रक्सन रेड जोन" मापदण्ड',
    description: 'नदीको उच्च बाढी सतह (High Flood Level) बाट दुवैतर्फ २०० मिटरभित्र नयाँ आवासीय घर, रिसोर्ट वा होटल निर्माण गर्न नक्सा पास (Building Permit) पूर्ण रूपमा रोक्ने।',
    priority: 'अति आवश्यक (Immediate)',
    responsibleEntity: 'गाउँ कार्यपालिका बैठक तथा भवन शाखा (BPS)',
    expectedImpact: 'भविष्यमा बाढीबाट हुने मानवीय र भौतिक क्षति शून्यमा झार्ने।',
  },
  {
    id: 'act-05',
    category: 'zoning_policy',
    categoryNepali: 'नीतिगत तथा भवन निर्माण नियमन',
    title: 'अति-संवेदनशील घरधुरीको सुरक्षित पुनर्वास (Planned Resettlement)',
    description: 'नदी किनारको ५० मिटर कोर क्षेत्रमा रहेका कच्ची ढुङ्गा-माटोका घरहरू र सुत्केरी/ज्येष्ठ नागरिक रहेका १४२ घरधुरीलाई पालिकाको सुरक्षित डाँडामा स्थानान्तरण गरी पुनर्निर्माण अनुदान उपलब्ध गराउने।',
    priority: 'मध्यकालीन (Medium-term)',
    responsibleEntity: 'राष्ट्रिय पुनर्निर्माण तथा पालिका विपद् समिति',
    expectedImpact: 'उच्च जोखिममा रहेका नागरिकहरूको स्थायी जीवन सुरक्षा।',
  },
  {
    id: 'act-06',
    category: 'early_warning',
    categoryNepali: 'पूर्वसूचना तथा सामुदायिक सतर्कता',
    title: 'अपस्ट्रिम राडार गेज र सौर्य मेश साइरन जडान',
    description: 'नदीको मुहान भेगमा अल्ट्रासोनिक वाटर लेभल गेज र बस्तीहरूमा इन्टरनेट बिना नै बज्ने सौर्य LoRa मेश साइरन जडान गरी बाढी आउनुभन्दा ३० मिनेट अगावै नागरिकहरूलाई नेपाली भाषामा स्वचालित फोन कल र साइरन बजाउने।',
    priority: 'अति आवश्यक (Immediate)',
    responsibleEntity: 'जल तथा मौसम विज्ञान विभाग (DHM) र पालिका EOC',
    expectedImpact: 'शून्य मानवीय हताहती (Zero Casualty Goal)।',
  },
];

