// Ambulance Fleet & Onboard CCTV Telemetry Dataset for Panchpokhari Thangpal Rural Municipality
// Emergency Operations Center (LEOC) - Rapid Medical Response & Medevac

export interface AmbulanceCctvChannel {
  id: string;
  nameNp: string;
  nameEn: string;
  viewType: 'front_dashcam' | 'cabin_telemedicine' | 'rear_360';
  streamUrl: string;
  resolution: string;
  fps: number;
  bitrateKbps: number;
  isOnline: boolean;
  nightVisionSupported: boolean;
}

export interface PatientTriage {
  patientId: string;
  nameNp: string;
  nameEn: string;
  age: number;
  gender: 'पुरुष (Male)' | 'महिला (Female)' | 'अन्य (Other)';
  conditionSeverity: 'critical' | 'moderate' | 'stable';
  chiefComplaintNp: string;
  chiefComplaintEn: string;
  spo2: number;
  pulseBpm: number;
  bloodPressure: string;
  temperatureF: number;
  respiratoryRate: number;
  onOxygenSupport: boolean;
  ivFluidActive: boolean;
  paramedicNotesNp: string;
}

export interface AmbulanceRecord {
  id: string;
  callSign: string;
  callSignEn: string;
  vehicleNumber: string;
  ambulanceType: 'Class-A (ICU/ALS)' | 'Class-B (BLS)' | 'Class-C (Transport)';
  ambulanceTypeNp: string;
  baseStationNp: string;
  baseStationEn: string;
  wardNo: number;
  driver: {
    nameNp: string;
    nameEn: string;
    phone: string;
    experienceYears: number;
  };
  paramedic: {
    nameNp: string;
    nameEn: string;
    designation: string;
    phone: string;
  };
  status: 'emergency_transit' | 'en_route_patient' | 'standby' | 'maintenance';
  statusNp: string;
  statusEn: string;
  statusColor: string;
  currentLocationNp: string;
  currentLocationEn: string;
  coords: [number, number];
  speedKmH: number;
  headingDegrees: number;
  fuelLevelPercent: number;
  oxygenLevelPercent: number;
  batteryVoltage: string;
  sirenActive: boolean;
  destinationHospital: {
    nameNp: string;
    nameEn: string;
    distanceKm: number;
    etaMinutes: number;
    phone: string;
    emergencyDeptContact: string;
    lat: number;
    lng: number;
  };
  patientTriage?: PatientTriage;
  cctvChannels: AmbulanceCctvChannel[];
  routeWaypoints: [number, number][];
  currentWaypointIdx: number;
}

// Destination Hospitals in Sindhu/Kavre/Kathmandu region
export const REGIONAL_HOSPITALS = [
  {
    id: 'hosp-1',
    nameNp: 'पाँचपोखरी प्राथमिक अस्पताल',
    nameEn: 'Panchpokhari Primary Hospital',
    locationNp: 'थाङपालधाप, वडा ४',
    locationEn: 'Thangpaldhap, Ward 4',
    lat: 27.8728,
    lng: 85.6044,
    phone: '०११-४६०१११',
    type: 'पालिकास्तरीय अस्पताल (Municipal Hospital)',
    icuBeds: 4,
    ventilators: 2,
  },
  {
    id: 'hosp-2',
    nameNp: 'मेलम्ची प्राथमिक स्वास्थ्य केन्द्र',
    nameEn: 'Melamchi Primary Health Center',
    locationNp: 'मेलम्ची बजार, सिन्धुपाल्चोक',
    locationEn: 'Melamchi Bazar, Sindhupalchok',
    lat: 27.8284,
    lng: 85.5776,
    phone: '०११-४०१००४',
    type: 'प्राथमिक स्वास्थ्य केन्द्र (PHC)',
    icuBeds: 2,
    ventilators: 1,
  },
  {
    id: 'hosp-3',
    nameNp: 'धुलिखेल अस्पताल (काभ्रे)',
    nameEn: 'Dhulikhel Hospital (Trauma Center)',
    locationNp: 'धुलिखेल, काभ्रेपलाञ्चोक',
    locationEn: 'Dhulikhel, Kavre',
    lat: 27.6186,
    lng: 85.5539,
    phone: '०११-४९०४९७',
    type: 'तृतीयक स्तर ट्रमा सेन्टर (Tertiary Trauma Center)',
    icuBeds: 30,
    ventilators: 15,
  },
  {
    id: 'hosp-4',
    nameNp: 'त्रिवि शिक्षण अस्पताल (काठमाडौँ)',
    nameEn: 'T.U. Teaching Hospital (Kathmandu)',
    locationNp: 'महाराजगन्ज, काठमाडौँ',
    locationEn: 'Maharajgunj, Kathmandu',
    lat: 27.7368,
    lng: 85.3308,
    phone: '०१-४४१२४०४',
    type: 'केन्द्रीय रेफरल अस्पताल (National Referral Hospital)',
    icuBeds: 60,
    ventilators: 35,
  },
];

// Road coordinates slice from Thangpaldhap through Melamchi towards Dhulikhel/Kathmandu
export const AMBULANCE_ROUTE_PANCHPOKHARI_TO_MELAMCHI: [number, number][] = [
  [27.87286, 85.60439],
  [27.87185, 85.60363],
  [27.87107, 85.60254],
  [27.87043, 85.60146],
  [27.86882, 85.60043],
  [27.86800, 85.59999],
  [27.86611, 85.59913],
  [27.86479, 85.59636],
  [27.86335, 85.59520],
  [27.86198, 85.59361],
  [27.86044, 85.59282],
  [27.85863, 85.59111],
  [27.85664, 85.59159],
  [27.85478, 85.59088],
  [27.85332, 85.58985],
  [27.85067, 85.58801],
  [27.84809, 85.58645],
  [27.84631, 85.58428],
  [27.84366, 85.58318],
  [27.84187, 85.58210],
  [27.83967, 85.58093],
  [27.83859, 85.57967],
  [27.83673, 85.57792],
  [27.83468, 85.57776],
  [27.83306, 85.57819],
  [27.83151, 85.57850],
  [27.82969, 85.57903],
  [27.82842, 85.57823],
  [27.82771, 85.57758],
  [27.82570, 85.57826],
  [27.82438, 85.57359],
  [27.82304, 85.57392],
  [27.82139, 85.57377],
  [27.81909, 85.57241],
  [27.81675, 85.57255],
  [27.81390, 85.57242],
  [27.81067, 85.57302],
  [27.80783, 85.57444],
  [27.80437, 85.57237],
  [27.80146, 85.57178],
  [27.79887, 85.57237],
  [27.79484, 85.57297],
  [27.79166, 85.57350],
  [27.78724, 85.56995],
  [27.78199, 85.56952],
  [27.77726, 85.57372],
  [27.77426, 85.57568],
  [27.77001, 85.57678],
  [27.76612, 85.57903],
  [27.76252, 85.58105],
  [27.75972, 85.57773],
  [27.75683, 85.50131],
  [27.75049, 85.49667],
  [27.74479, 85.47863],
  [27.73881, 85.47163],
  [27.73264, 85.46605],
  [27.72896, 85.43930],
  [27.72466, 85.40169],
  [27.71933, 85.35098],
];

// Initial Municipal Ambulance Fleet Records
export const INITIAL_AMBULANCE_FLEET: AmbulanceRecord[] = [
  {
    id: 'amb-01',
    callSign: 'लाइफ-लाइन ०१ (LifeLine-01)',
    callSignEn: 'LifeLine-01 ICU Ambulance',
    vehicleNumber: 'बागमती प्रदेश ०१-०२६ च ४४५५',
    ambulanceType: 'Class-A (ICU/ALS)',
    ambulanceTypeNp: '"क" वर्ग (ICU / एडभान्स लाइफ सपोर्ट)',
    baseStationNp: 'पाँचपोखरी प्राथमिक अस्पताल, थाङपालधाप',
    baseStationEn: 'Panchpokhari Primary Hospital, Thangpaldhap',
    wardNo: 4,
    driver: {
      nameNp: 'कृष्ण बहादुर तामाङ',
      nameEn: 'Krishna Bahadur Tamang',
      phone: '९८४१०१२३४५',
      experienceYears: 11,
    },
    paramedic: {
      nameNp: 'सुशीला लामिछाने (स्टाफ नर्स)',
      nameEn: 'Sushila Lamichhane (Staff Nurse)',
      designation: 'आकस्मिक प्यारामेडिक (ALS Certified)',
      phone: '९८४१२२३३४४',
    },
    status: 'emergency_transit',
    statusNp: 'आपतकालीन उद्धारमा (In Transit)',
    statusEn: 'Emergency Run (Hospital Transit)',
    statusColor: '#ef4444',
    currentLocationNp: 'थाङपालधाप-मेलम्ची सडक खण्ड (किमी २४)',
    currentLocationEn: 'Thangpaldhap-Melamchi Highway (Km 24)',
    coords: [27.84809, 85.58645],
    speedKmH: 46,
    headingDegrees: 215,
    fuelLevelPercent: 92,
    oxygenLevelPercent: 96,
    batteryVoltage: '१३.८ V (Normal)',
    sirenActive: true,
    destinationHospital: {
      nameNp: 'धुलिखेल अस्पताल (ट्रमा सेन्टर)',
      nameEn: 'Dhulikhel Hospital (Trauma Center)',
      distanceKm: 28.4,
      etaMinutes: 34,
      phone: '०११-४९०४९७',
      emergencyDeptContact: '०११-४९०५००',
      lat: 27.6186,
      lng: 85.5539,
    },
    patientTriage: {
      patientId: 'PT-2083-049',
      nameNp: 'रामेश्वर पण्डित',
      nameEn: 'Rameshwor Pandit',
      age: 48,
      gender: 'पुरुष (Male)',
      conditionSeverity: 'critical',
      chiefComplaintNp: 'पहिरोमा परी टाउको र दाहिने खुट्टामा गम्भीर चोट (Head Trauma & Open Fracture)',
      chiefComplaintEn: 'Severe landslide trauma, head injury & right femur fracture',
      spo2: 95,
      pulseBpm: 104,
      bloodPressure: '११०/७० mmHg',
      temperatureF: 98.6,
      respiratoryRate: 22,
      onOxygenSupport: true,
      ivFluidActive: true,
      paramedicNotesNp: 'रक्तस्राव ब्याण्डेज गरी नियन्त्रणमा। IV Ringer Lactate ड्रिप चालु। धुलिखेल ट्रमा सर्जनलाई सूचना प्रेषित।',
    },
    cctvChannels: [
      {
        id: 'cctv-amb1-front',
        nameNp: 'सडक तथा बाटो दृश्य (Road Dashcam)',
        nameEn: 'Road Ahead HD Dashcam',
        viewType: 'front_dashcam',
        streamUrl: 'http://localhost:8889/ambulance1_front',
        resolution: '1080p FHD (1920x1080)',
        fps: 30,
        bitrateKbps: 2800,
        isOnline: true,
        nightVisionSupported: true,
      },
      {
        id: 'cctv-amb1-cabin',
        nameNp: 'क्याबिन बिरामी/टेलि-मेडिसिन (Patient Cabin)',
        nameEn: 'Patient Cabin Tele-Medicine',
        viewType: 'cabin_telemedicine',
        streamUrl: 'http://localhost:8889/ambulance1_cabin',
        resolution: '1080p FHD (1920x1080)',
        fps: 30,
        bitrateKbps: 2600,
        isOnline: true,
        nightVisionSupported: true,
      },
      {
        id: 'cctv-amb1-rear',
        nameNp: 'पछाडि तथा बाह्य ३६०° (Rear & Exterior)',
        nameEn: 'Rear & 360 Exterior Surveillance',
        viewType: 'rear_360',
        streamUrl: 'http://localhost:8889/ambulance1_rear',
        resolution: '720p HD (1280x720)',
        fps: 25,
        bitrateKbps: 1800,
        isOnline: true,
        nightVisionSupported: false,
      },
    ],
    routeWaypoints: AMBULANCE_ROUTE_PANCHPOKHARI_TO_MELAMCHI,
    currentWaypointIdx: 16,
  },
  {
    id: 'amb-02',
    callSign: 'रेडक्रस ०२ (RedCross-02)',
    callSignEn: 'RedCross-02 4WD Ambulance',
    vehicleNumber: 'बा २ च ८८९०',
    ambulanceType: 'Class-B (BLS)',
    ambulanceTypeNp: '"ख" वर्ग (४WD माउन्टेन रेस्क्यु)',
    baseStationNp: 'तिम्बु बजार सडक डिपो / मेलम्ची बेस',
    baseStationEn: 'Timbu Bazar Depo / Melamchi Base',
    wardNo: 2,
    driver: {
      nameNp: 'पदम बहादुर गुरुङ',
      nameEn: 'Padam Bahadur Gurung',
      phone: '९८५१८८९०१२',
      experienceYears: 14,
    },
    paramedic: {
      nameNp: 'राजु श्रेष्ठ (प्राविधिक)',
      nameEn: 'Raju Shrestha (CMA/First Responder)',
      designation: 'रेडक्रस प्रमाणित उद्धारकर्मी',
      phone: '९८४१७७६६५५',
    },
    status: 'standby',
    statusNp: 'स्ट्यान्डबाइ तयार (Standby Ready)',
    statusEn: 'Standby Ready at Base',
    statusColor: '#10b981',
    currentLocationNp: 'तिम्बु स्वास्थ्य चौकी प्राङ्गण, वडा २',
    currentLocationEn: 'Timbu Health Post Yard, Ward 2',
    coords: [27.9134, 85.6368],
    speedKmH: 0,
    headingDegrees: 45,
    fuelLevelPercent: 95,
    oxygenLevelPercent: 100,
    batteryVoltage: '१२.९ V (Standby)',
    sirenActive: false,
    destinationHospital: {
      nameNp: 'मेलम्ची प्राथमिक स्वास्थ्य केन्द्र',
      nameEn: 'Melamchi Primary Health Center',
      distanceKm: 14.2,
      etaMinutes: 22,
      phone: '०११-४०१००४',
      emergencyDeptContact: '०११-४०१००४',
      lat: 27.8284,
      lng: 85.5776,
    },
    cctvChannels: [
      {
        id: 'cctv-amb2-front',
        nameNp: 'सडक तथा बाटो दृश्य (Road Dashcam)',
        nameEn: 'Road Ahead HD Dashcam',
        viewType: 'front_dashcam',
        streamUrl: 'http://localhost:8889/ambulance2_front',
        resolution: '1080p FHD',
        fps: 30,
        bitrateKbps: 2400,
        isOnline: true,
        nightVisionSupported: true,
      },
      {
        id: 'cctv-amb2-cabin',
        nameNp: 'क्याबिन बिरामी/टेलि-मेडिसिन (Patient Cabin)',
        nameEn: 'Patient Cabin View',
        viewType: 'cabin_telemedicine',
        streamUrl: 'http://localhost:8889/ambulance2_cabin',
        resolution: '1080p FHD',
        fps: 30,
        bitrateKbps: 2400,
        isOnline: true,
        nightVisionSupported: true,
      },
    ],
    routeWaypoints: [
      [27.9134, 85.6368],
      [27.9082, 85.6255],
      [27.8988, 85.6221],
      [27.8837, 85.6140],
      [27.8728, 85.6044],
      [27.8506, 85.5880],
      [27.8284, 85.5776],
    ],
    currentWaypointIdx: 0,
  },
  {
    id: 'amb-03',
    callSign: 'हिमाली ०३ (Himali-03)',
    callSignEn: 'Himali-03 Alpine Ambulance',
    vehicleNumber: 'बागमती प्रदेश ०१-०२८ च १२३४',
    ambulanceType: 'Class-B (BLS)',
    ambulanceTypeNp: '"ख" वर्ग (उच्च हिमाली ४WD)',
    baseStationNp: 'भोताङ स्वास्थ्य चौकी, वडा ३',
    baseStationEn: 'Bhotang Health Post, Ward 3',
    wardNo: 3,
    driver: {
      nameNp: 'पेम्बा दोर्जे शेर्पा',
      nameEn: 'Pemba Dorje Sherpa',
      phone: '९८६०३३४४५५',
      experienceYears: 9,
    },
    paramedic: {
      nameNp: 'डिकी शेर्पा (HA)',
      nameEn: 'Diki Sherpa (Health Assistant)',
      designation: 'हाइ-अल्टिच्युड मेडिकल रेस्पोन्डर',
      phone: '९८४१६६५५४४',
    },
    status: 'en_route_patient',
    statusNp: 'घटनास्थल जाँदै (En Route to Patient)',
    statusEn: 'En Route to Landslide Victim',
    statusColor: '#f59e0b',
    currentLocationNp: 'छिम्ती-भोताङ कृषि सडक (किमी ६)',
    currentLocationEn: 'Chhimti-Bhotang Link Road (Km 6)',
    coords: [27.9542, 85.6505],
    speedKmH: 32,
    headingDegrees: 35,
    fuelLevelPercent: 78,
    oxygenLevelPercent: 90,
    batteryVoltage: '१३.४ V (Charging)',
    sirenActive: true,
    destinationHospital: {
      nameNp: 'पाँचपोखरी प्राथमिक अस्पताल (थाङपालधाप)',
      nameEn: 'Panchpokhari Primary Hospital',
      distanceKm: 9.6,
      etaMinutes: 18,
      phone: '०११-४६०१११',
      emergencyDeptContact: '०११-४६०१११',
      lat: 27.8728,
      lng: 85.6044,
    },
    cctvChannels: [
      {
        id: 'cctv-amb3-front',
        nameNp: 'सडक तथा बाटो दृश्य (Road Dashcam)',
        nameEn: 'Road Ahead HD Dashcam',
        viewType: 'front_dashcam',
        streamUrl: 'http://localhost:8889/ambulance3_front',
        resolution: '1080p FHD',
        fps: 28,
        bitrateKbps: 2200,
        isOnline: true,
        nightVisionSupported: true,
      },
      {
        id: 'cctv-amb3-cabin',
        nameNp: 'क्याबिन भित्री दृश्य (Patient Cabin)',
        nameEn: 'Cabin Interior View',
        viewType: 'cabin_telemedicine',
        streamUrl: 'http://localhost:8889/ambulance3_cabin',
        resolution: '720p HD',
        fps: 25,
        bitrateKbps: 1800,
        isOnline: true,
        nightVisionSupported: true,
      },
    ],
    routeWaypoints: [
      [27.9407, 85.6462],
      [27.9464, 85.6484],
      [27.9503, 85.6514],
      [27.9542, 85.6505],
      [27.9622, 85.6522],
      [27.9687, 85.6465],
      [27.9739, 85.6536],
      [27.9794, 85.6564],
    ],
    currentWaypointIdx: 3,
  },
  {
    id: 'amb-04',
    callSign: 'थाङपालकोट ०४ (Thangpalkot-04)',
    callSignEn: 'Thangpalkot-04 Maternity Ambulance',
    vehicleNumber: 'बा १ झ ६५४०',
    ambulanceType: 'Class-C (Transport)',
    ambulanceTypeNp: '"ग" वर्ग (मातृ-शिशु तथा बिरामी ढुवानी)',
    baseStationNp: 'थाङपालकोट वडा कार्यालय भवन, वडा ६',
    baseStationEn: 'Thangpalkot Ward Office, Ward 6',
    wardNo: 6,
    driver: {
      nameNp: 'नरहरि खड्का',
      nameEn: 'Narahari Khadka',
      phone: '९८४९९९८८७७',
      experienceYears: 8,
    },
    paramedic: {
      nameNp: 'पार्वती सापकोटा (ANM)',
      nameEn: 'Parbati Sapkota (ANM/Nurse)',
      designation: 'मातृ-शिशु स्वास्थ्य सुरक्षाकर्मी',
      phone: '९८४१२३३२११',
    },
    status: 'standby',
    statusNp: 'स्ट्यान्डबाइ तयार (Standby Ready)',
    statusEn: 'Standby Ready at Base',
    statusColor: '#10b981',
    currentLocationNp: 'थाङपालकोट वडा ६ भवन ग्यारेज',
    currentLocationEn: 'Thangpalkot Ward 6 Garage',
    coords: [27.8865, 85.6161],
    speedKmH: 0,
    headingDegrees: 180,
    fuelLevelPercent: 88,
    oxygenLevelPercent: 100,
    batteryVoltage: '१२.८ V',
    sirenActive: false,
    destinationHospital: {
      nameNp: 'पाँचपोखरी प्राथमिक अस्पताल',
      nameEn: 'Panchpokhari Primary Hospital',
      distanceKm: 6.2,
      etaMinutes: 12,
      phone: '०११-४६०१११',
      emergencyDeptContact: '०११-४६०१११',
      lat: 27.8728,
      lng: 85.6044,
    },
    cctvChannels: [
      {
        id: 'cctv-amb4-front',
        nameNp: 'सडक तथा बाटो दृश्य (Road Dashcam)',
        nameEn: 'Road Ahead Dashcam',
        viewType: 'front_dashcam',
        streamUrl: 'http://localhost:8889/ambulance4_front',
        resolution: '720p HD',
        fps: 25,
        bitrateKbps: 1600,
        isOnline: true,
        nightVisionSupported: true,
      },
    ],
    routeWaypoints: [
      [27.8865, 85.6161],
      [27.8812, 85.6113],
      [27.8772, 85.6079],
      [27.8728, 85.6044],
    ],
    currentWaypointIdx: 0,
  },
];
