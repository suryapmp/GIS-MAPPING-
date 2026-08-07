import {
  Project,
  StudyArea,
  Well,
  WellMeasurement,
  SoilSample,
  SoilLabResult,
  GeologicalObservation,
  HydrogeologicalObservation,
  ErtSurvey,
  ErtDataPoint,
  ScientificReference,
  AhpAnalysis,
  MlModelRun,
  GwpzResult,
  ValidationRecord,
  MarSite,
  ResearchNote,
  GisLayer,
  AuditLog
} from '../types/hydro';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Cauvery River Basin Groundwater Recharge & Storage Vulnerability',
    code: 'CRB-GW-2026',
    description: 'PhD hydrogeological research evaluating fractured basalt and granitic basement aquifer recharge potential using AHP-MCDA, Random Forest ML, and ERT field verification.',
    leadResearcher: 'Dr. Aris Thorne (Lead Hydrogeologist)',
    location: 'Tamil Nadu & Karnataka, India',
    areaSqKm: 1420.5,
    watershedCount: 4,
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-08-01T14:20:00Z'
  },
  {
    id: 'proj-002',
    name: 'Upper Semi-Arid Alluvial Watershed Managed Aquifer Recharge (MAR)',
    code: 'MAR-SAW-2025',
    description: 'Site suitability classification for check dams and percolation tanks to mitigate agricultural groundwater depletion in hard-rock aquifers.',
    leadResearcher: 'Prof. Elena Rostova',
    location: 'Deccan Traps, India',
    areaSqKm: 850.2,
    watershedCount: 2,
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2026-07-28T11:45:00Z'
  }
];

export const INITIAL_STUDY_AREAS: StudyArea[] = [
  {
    id: 'sa-001',
    projectId: 'proj-001',
    name: 'Palar Sub-Watershed Sub-Basin 4',
    code: 'PSW-SB4',
    areaSqKm: 384.6,
    perimeterKm: 88.4,
    averageSlopePercent: 6.8,
    annualRainfallMm: 890,
    geologyOverview: 'Weathered granitic gneiss underlain by fractured crystalline basement complex with lineament crossings.',
    bounds: [12.72, 78.85, 12.98, 79.22],
    centroid: [12.85, 79.035],
    createdAt: '2026-01-18T09:00:00Z'
  },
  {
    id: 'sa-002',
    projectId: 'proj-001',
    name: 'Upper Bhavani Pediment Zone',
    code: 'UBP-Z2',
    areaSqKm: 245.1,
    perimeterKm: 64.2,
    averageSlopePercent: 12.4,
    annualRainfallMm: 1120,
    geologyOverview: 'Charnockite and hornblende-biotite gneiss with intense quartz veins and deep saprolite overburden.',
    bounds: [11.35, 76.88, 11.58, 77.15],
    centroid: [11.465, 77.015],
    createdAt: '2026-02-04T11:30:00Z'
  }
];

export const INITIAL_WELLS: Well[] = [
  {
    id: 'well-01',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    wellId: 'GW-PLR-01',
    lat: 12.862,
    lng: 79.021,
    wellType: 'Borewell',
    depthM: 112.5,
    diameterMm: 150,
    aquiferType: 'Fractured Basement',
    lithology: 'Weathered Gneiss & Quartz Vein Fracture',
    yieldLps: 4.8,
    status: 'Active',
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'well-02',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    wellId: 'GW-PLR-02',
    lat: 12.841,
    lng: 79.055,
    wellType: 'Dug Well',
    depthM: 18.2,
    diameterMm: 3500,
    aquiferType: 'Unconfined',
    lithology: 'Sandy Loam Saprolite',
    yieldLps: 2.1,
    status: 'Active',
    createdAt: '2026-01-22T14:15:00Z'
  },
  {
    id: 'well-03',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    wellId: 'GW-PLR-03',
    lat: 12.885,
    lng: 78.988,
    wellType: 'Piezometer',
    depthM: 65.0,
    diameterMm: 100,
    aquiferType: 'Semi-confined',
    lithology: 'Fissured Hornblende Gneiss',
    yieldLps: 5.6,
    status: 'Active',
    createdAt: '2026-02-01T09:30:00Z'
  },
  {
    id: 'well-04',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    wellId: 'GW-PLR-04',
    lat: 12.810,
    lng: 79.080,
    wellType: 'Tube Well',
    depthM: 88.0,
    diameterMm: 200,
    aquiferType: 'Unconfined',
    lithology: 'Alluvial Coarse Sand & Gravel',
    yieldLps: 8.4,
    status: 'Active',
    createdAt: '2026-02-10T11:00:00Z'
  }
];

export const INITIAL_WELL_MEASUREMENTS: WellMeasurement[] = [
  { id: 'wm-1', wellId: 'well-01', date: '2025-05-15', season: 'Pre-Monsoon', staticWaterLevelM: 18.4, pumpingWaterLevelM: 28.5, yieldLps: 3.2, remarks: 'Depleted water table during dry summer' },
  { id: 'wm-2', wellId: 'well-01', date: '2025-09-20', season: 'Monsoon', staticWaterLevelM: 7.2, pumpingWaterLevelM: 14.1, yieldLps: 5.8, remarks: 'Rapid recharge response post-monsoon' },
  { id: 'wm-3', wellId: 'well-01', date: '2025-12-10', season: 'Post-Monsoon', staticWaterLevelM: 9.8, pumpingWaterLevelM: 17.0, yieldLps: 5.1, remarks: 'Gradual decay curve' },
  { id: 'wm-4', wellId: 'well-01', date: '2026-03-30', season: 'Dry Season', staticWaterLevelM: 14.5, pumpingWaterLevelM: 22.8, yieldLps: 4.2, remarks: 'Steady pumping discharge' },
  { id: 'wm-5', wellId: 'well-02', date: '2025-05-15', season: 'Pre-Monsoon', staticWaterLevelM: 14.2, pumpingWaterLevelM: 16.8, yieldLps: 1.1, remarks: 'Near bottom dry condition' },
  { id: 'wm-6', wellId: 'well-02', date: '2025-09-20', season: 'Monsoon', staticWaterLevelM: 3.1, pumpingWaterLevelM: 6.2, yieldLps: 3.4, remarks: 'High water level response' },
  { id: 'wm-7', wellId: 'well-04', date: '2025-09-20', season: 'Monsoon', staticWaterLevelM: 2.8, pumpingWaterLevelM: 5.4, yieldLps: 9.2, remarks: 'High yielding alluvial aquifer' }
];

export const INITIAL_SOIL_SAMPLES: SoilSample[] = [
  {
    id: 'soil-01',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    sampleId: 'SMP-PLR-A1',
    lat: 12.855,
    lng: 79.012,
    depthCm: 45,
    date: '2026-02-12',
    texture: 'Sandy Loam',
    color: '7.5YR 4/4 Strong Brown',
    structure: 'Granular',
    moisture: 'Moist',
    gravelPercent: 8,
    organicMatterObs: 'Moderate root fragments',
    landUse: 'Agricultural Cropland'
  },
  {
    id: 'soil-02',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    sampleId: 'SMP-PLR-B2',
    lat: 12.875,
    lng: 79.060,
    depthCm: 60,
    date: '2026-02-14',
    texture: 'Clay',
    color: '10YR 3/2 Very Dark Greyish Brown',
    structure: 'Blocky',
    moisture: 'Saturated',
    gravelPercent: 2,
    organicMatterObs: 'High organic clay layer',
    landUse: 'Tank Inundation Zone'
  }
];

export const INITIAL_SOIL_LAB_RESULTS: SoilLabResult[] = [
  {
    id: 'slr-01',
    sampleId: 'soil-01',
    ph: 7.2,
    ecDsM: 0.48,
    organicCarbonPercent: 0.65,
    nitrogenMgKg: 185.0,
    phosphorusMgKg: 22.4,
    potassiumMgKg: 210.0,
    sulphurMgKg: 14.2,
    zincMgKg: 1.15,
    ironMgKg: 6.8,
    manganeseMgKg: 3.4,
    copperMgKg: 0.95,
    boronMgKg: 0.42,
    method: 'AAS & Walkley-Black Titration',
    labName: 'Central Geochemical Research Laboratory',
    verified: true,
    testDate: '2026-02-20'
  },
  {
    id: 'slr-02',
    sampleId: 'soil-02',
    ph: 8.1,
    ecDsM: 1.22,
    organicCarbonPercent: 1.12,
    nitrogenMgKg: 240.0,
    phosphorusMgKg: 35.1,
    potassiumMgKg: 310.0,
    sulphurMgKg: 28.5,
    zincMgKg: 0.85,
    ironMgKg: 4.2,
    manganeseMgKg: 2.8,
    copperMgKg: 1.10,
    boronMgKg: 0.65,
    method: 'Spectrophotometry & Flame Photometer',
    labName: 'Regional Agri-Hydro Soil Testing Facility',
    verified: true,
    testDate: '2026-02-22'
  }
];

export const INITIAL_GEOLOGY_OBSERVATIONS: GeologicalObservation[] = [
  {
    id: 'geo-01',
    projectId: 'proj-001',
    locationName: 'Palar Quarry Cutting Outcrop',
    lat: 12.868,
    lng: 78.995,
    rockType: 'Gneiss',
    lithology: 'Biotite Gneiss with Pegmatite Intrusions',
    weatheringGrade: 'Slightly Weathered',
    fractureDensity: 'High',
    strikeDeg: 45,
    dipDeg: 62,
    rockQualityRqd: 68,
    outcropDescription: 'Exposed road-cut outcrop showing sub-vertical sheet jointing trending NE-SW with high infiltration capacity.',
    timestamp: '2026-02-18T10:30:00Z'
  }
];

export const INITIAL_HYDRO_OBSERVATIONS: HydrogeologicalObservation[] = [
  {
    id: 'hy-01',
    projectId: 'proj-001',
    locationName: 'Anicut Perennial Spring',
    lat: 12.830,
    lng: 79.040,
    type: 'Spring',
    dischargeLps: 1.8,
    waterEvidence: 'Crystal clear discharge at fracture-lineament intersection',
    streamCondition: 'Perennial',
    interpretation: 'Fault-controlled artesian discharge from fractured basement beneath saprolite layer.',
    timestamp: '2026-02-22T14:00:00Z'
  }
];

export const INITIAL_ERT_SURVEYS: ErtSurvey[] = [
  {
    id: 'ert-01',
    projectId: 'proj-001',
    profileName: 'ERT Profile Line 1 (Palar-East)',
    latStart: 12.850,
    lngStart: 79.010,
    latEnd: 12.852,
    lngEnd: 79.030,
    electrodeSpacingM: 5.0,
    electrodeCount: 48,
    arrayMethod: 'Wenner',
    surveyDate: '2026-02-25',
    notes: '235 meter profile designed to identify depth to saprolite-unweathered rock interface and fractured aquifer zone.'
  }
];

export const INITIAL_ERT_DATA: ErtDataPoint[] = [
  { id: 'ep-1', surveyId: 'ert-01', distanceM: 0, electrode: 1, depthM: 2.5, resistivityOhmM: 145, interpretedLithology: 'Dry Topsoil' },
  { id: 'ep-2', surveyId: 'ert-01', distanceM: 25, electrode: 5, depthM: 7.5, resistivityOhmM: 42, interpretedLithology: 'Saturated Saprolite' },
  { id: 'ep-3', surveyId: 'ert-01', distanceM: 50, electrode: 10, depthM: 15.0, resistivityOhmM: 18, interpretedLithology: 'Weathered Aquifer Zone' },
  { id: 'ep-4', surveyId: 'ert-01', distanceM: 75, electrode: 15, depthM: 25.0, resistivityOhmM: 28, interpretedLithology: 'Fractured Basement (Water Bearing)' },
  { id: 'ep-5', surveyId: 'ert-01', distanceM: 100, electrode: 20, depthM: 40.0, resistivityOhmM: 520, interpretedLithology: 'Massive Unweathered Granitic Gneiss' }
];

export const INITIAL_REFERENCES: ScientificReference[] = [
  {
    id: 'ref-01',
    title: 'Delineation of Groundwater Potential Zones in Hard Rock Terrain Using Remote Sensing, GIS and AHP Techniques',
    authors: 'Krishnamurthy, J., Mani, A., Jayaraman, V., & Ramachandran, S.',
    organization: 'Indian Space Research Organisation (ISRO) & Anna University',
    year: 2021,
    source: 'International Journal of Remote Sensing, Vol. 42(8), pp. 2890-2915',
    url: 'https://doi.org/10.1080/01431161.2021.1895000',
    citation: 'Krishnamurthy et al., 2021. Delineation of GWPZ using RS, GIS and AHP.',
    geographicCoverage: 'Southern Granulite Terrain, Peninsular India',
    keywords: ['Groundwater Potential', 'AHP', 'GIS', 'Lineament Density', 'Hard Rock Aquifers']
  },
  {
    id: 'ref-02',
    title: 'Machine Learning Algorithms (Random Forest, XGBoost, and SVM) for Groundwater Potential Mapping in Semi-Arid Watersheds',
    authors: 'Rahmati, O., Pourghasemi, H. R., & Melesse, A. M.',
    organization: 'Hydrogeology Journal / Springer',
    year: 2023,
    source: 'Hydrogeology Journal, Vol. 31(3), pp. 745-768',
    url: 'https://doi.org/10.1007/s10040-023-02610-w',
    citation: 'Rahmati et al., 2023. ML Algorithms for GWPZ Mapping.',
    geographicCoverage: 'Semi-Arid Basins',
    keywords: ['Random Forest', 'XGBoost', 'Machine Learning', 'ROC-AUC', 'Groundwater Assessment']
  }
];

export const INITIAL_AHP_ANALYSES: AhpAnalysis[] = [
  {
    id: 'ahp-01',
    projectId: 'proj-001',
    name: 'Palar Watershed Multi-Criteria Groundwater Potential Evaluation (2026)',
    criteria: ['geology', 'slope', 'drainageDensity', 'lineamentDensity', 'rainfall', 'soil', 'landUse', 'elevation', 'depthToWater'],
    pairwiseMatrix: {},
    weights: {
      geology: 0.22,
      lineamentDensity: 0.18,
      slope: 0.15,
      drainageDensity: 0.12,
      rainfall: 0.10,
      depthToWater: 0.09,
      soil: 0.06,
      landUse: 0.05,
      elevation: 0.03
    },
    consistencyIndex: 0.042,
    consistencyRatio: 0.029, // < 0.10 implies valid AHP calculation
    isConsistent: true,
    classDistributionPercent: {
      VeryHigh: 18.5,
      High: 32.1,
      Moderate: 28.4,
      Low: 14.8,
      VeryLow: 6.2
    },
    createdBy: 'Dr. Aris Thorne',
    createdAt: '2026-03-01T12:00:00Z'
  }
];

export const INITIAL_ML_RUNS: MlModelRun[] = [
  {
    id: 'ml-01',
    projectId: 'proj-001',
    modelName: 'XGBoost Groundwater Potential Classifier v2.1',
    algorithm: 'XGBoost',
    features: ['Slope', 'Elevation', 'Lineament Density', 'Drainage Density', 'Rainfall', 'Soil Permeability', 'NDVI', 'NDWI', 'Distance to Stream'],
    target: 'Groundwater Yield Class (High vs Low)',
    hyperparameters: { n_estimators: 150, max_depth: 6, learning_rate: 0.05, subsample: 0.8 },
    metrics: {
      accuracy: 0.895,
      precision: 0.882,
      recall: 0.910,
      f1Score: 0.896,
      rocAuc: 0.934
    },
    confusionMatrix: [
      [42, 5],
      [4, 44]
    ],
    featureImportance: {
      'Lineament Density': 0.285,
      'Slope': 0.210,
      'Distance to Stream': 0.165,
      'Drainage Density': 0.140,
      'Rainfall': 0.095,
      'Soil Permeability': 0.065,
      'Elevation': 0.040
    },
    trainingSamplesCount: 220,
    testSamplesCount: 95,
    createdAt: '2026-03-05T16:30:00Z'
  }
];

export const INITIAL_GWPZ_RESULTS: GwpzResult[] = [
  {
    id: 'gwpz-01',
    projectId: 'proj-001',
    studyAreaId: 'sa-001',
    title: 'Groundwater Potential Zoning Map — Palar Sub-Watershed (AHP Method)',
    method: 'AHP',
    modelOrAhpId: 'ahp-01',
    totalAreaKm2: 384.6,
    zones: [
      { class: 'Very High', areaKm2: 71.1, percentage: 18.5, color: '#059669' },
      { class: 'High', areaKm2: 123.5, percentage: 32.1, color: '#10b981' },
      { class: 'Moderate', areaKm2: 109.2, percentage: 28.4, color: '#f59e0b' },
      { class: 'Low', areaKm2: 56.9, percentage: 14.8, color: '#f97316' },
      { class: 'Very Low', areaKm2: 23.9, percentage: 6.2, color: '#ef4444' }
    ],
    parametersUsed: ['Geology', 'Slope', 'Drainage Density', 'Lineament Density', 'Rainfall', 'Soil', 'Land Use', 'Elevation', 'Water Table Depth'],
    createdAt: '2026-03-02T10:00:00Z'
  }
];

export const INITIAL_VALIDATION_RECORDS: ValidationRecord[] = [
  {
    id: 'val-01',
    gwpzResultId: 'gwpz-01',
    wellId: 'well-01',
    observedYieldLps: 4.8,
    observedClass: 'High',
    predictedClass: 'High',
    matched: true,
    yieldMatchScore: 0.94,
    validatedAt: '2026-03-03T11:00:00Z'
  },
  {
    id: 'val-02',
    gwpzResultId: 'gwpz-01',
    wellId: 'well-02',
    observedYieldLps: 2.1,
    observedClass: 'Moderate',
    predictedClass: 'Moderate',
    matched: true,
    yieldMatchScore: 0.88,
    validatedAt: '2026-03-03T11:05:00Z'
  },
  {
    id: 'val-03',
    gwpzResultId: 'gwpz-01',
    wellId: 'well-04',
    observedYieldLps: 8.4,
    observedClass: 'Very High',
    predictedClass: 'Very High',
    matched: true,
    yieldMatchScore: 0.98,
    validatedAt: '2026-03-03T11:10:00Z'
  }
];

export const INITIAL_MAR_SITES: MarSite[] = [
  {
    id: 'mar-01',
    projectId: 'proj-001',
    siteName: 'MAR Site Candidate #1 (Palar River Check Dam)',
    lat: 12.845,
    lng: 79.032,
    suitabilityScore: 92,
    suitabilityClass: 'High',
    recommendedStructure: 'Check Dam',
    soilPermeabilityMmHr: 45.0,
    slopePercent: 2.1,
    drainageOrder: 3,
    waterAvailability: 'Abundant',
    accessibility: 'Easy',
    researcherApproved: true,
    comments: 'Ideal 3rd-order stream bed location with coarse sand layer and high lineament density downstream.',
    createdAt: '2026-03-06T09:00:00Z'
  },
  {
    id: 'mar-02',
    projectId: 'proj-001',
    siteName: 'MAR Site Candidate #2 (Vaduganthangal Percolation Tank)',
    lat: 12.872,
    lng: 78.998,
    suitabilityScore: 84,
    suitabilityClass: 'High',
    recommendedStructure: 'Percolation Tank',
    soilPermeabilityMmHr: 32.0,
    slopePercent: 3.5,
    drainageOrder: 2,
    waterAvailability: 'Moderate',
    accessibility: 'Easy',
    researcherApproved: true,
    comments: 'Existing depression suitable for capacity expansion to recharge surrounding 6 agricultural dug wells.',
    createdAt: '2026-03-06T10:30:00Z'
  }
];

export const INITIAL_RESEARCH_NOTES: ResearchNote[] = [
  {
    id: 'note-01',
    projectId: 'proj-001',
    title: 'Observation of Lineament Control on Well Discharge Yields',
    category: 'Observation',
    observation: 'Wells located within 150 meters of NE-SW lineaments consistently yield >4.5 L/s compared to 1.8 L/s in non-lineament areas.',
    hypothesis: 'Fracture-network connectivity provides high hydraulic conductivity pathways through unweathered basement gneiss.',
    method: 'Lineament buffer extraction overlaid on pumping test records.',
    result: 'Correlation coefficient r = 0.78 between lineament proximity and yield.',
    conclusion: 'Lineament density must carry at least 18-20% weight in AHP model for peninsular hard rock terrains.',
    linkedEntityId: 'well-01',
    author: 'Dr. Aris Thorne',
    date: '2026-02-28'
  }
];

export const INITIAL_GIS_LAYERS: GisLayer[] = [
  {
    id: 'layer-wells',
    projectId: 'proj-001',
    name: 'Monitoring & Production Wells',
    category: 'Groundwater',
    format: 'GeoJSON',
    visible: true,
    opacity: 1.0,
    color: '#0284c7',
    featureCount: 4,
    crs: 'EPSG:4326',
    source: 'Field GPS Hydrogeological Survey',
    data: {
      type: 'FeatureCollection',
      features: INITIAL_WELLS.map(w => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [w.lng, w.lat] },
        properties: { wellId: w.wellId, type: w.wellType, depth: w.depthM, yield: w.yieldLps, status: w.status }
      }))
    },
    createdAt: '2026-01-20T10:00:00Z'
  },
  {
    id: 'layer-study-boundary',
    projectId: 'proj-001',
    name: 'Palar Sub-Watershed Boundary',
    category: 'Hydrology',
    format: 'GeoJSON',
    visible: true,
    opacity: 0.35,
    color: '#2563eb',
    featureCount: 1,
    crs: 'EPSG:4326',
    source: 'DEM D8 Watershed Extraction',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [78.85, 12.72],
              [79.22, 12.72],
              [79.22, 12.98],
              [78.85, 12.98],
              [78.85, 12.72]
            ]]
          },
          properties: { name: 'Palar Sub-Watershed Boundary', areaKm2: 384.6 }
        }
      ]
    },
    createdAt: '2026-01-18T09:00:00Z'
  },
  {
    id: 'layer-mar-sites',
    projectId: 'proj-001',
    name: 'MAR Site Candidates',
    category: 'Groundwater',
    format: 'GeoJSON',
    visible: true,
    opacity: 1.0,
    color: '#059669',
    featureCount: 2,
    crs: 'EPSG:4326',
    source: 'MAR Multi-Criteria Optimization Engine',
    data: {
      type: 'FeatureCollection',
      features: INITIAL_MAR_SITES.map(s => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
        properties: { siteName: s.siteName, suitability: s.suitabilityClass, structure: s.recommendedStructure, score: s.suitabilityScore }
      }))
    },
    createdAt: '2026-03-06T09:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    userEmail: 'sp40016@gmail.com',
    action: 'CREATE_PROJECT',
    targetCollection: 'projects',
    targetId: 'proj-001',
    timestamp: '2026-01-15T08:30:00Z',
    details: 'Initiated Cauvery River Basin Groundwater Research Project'
  },
  {
    id: 'log-02',
    userEmail: 'sp40016@gmail.com',
    action: 'RUN_AHP_MODEL',
    targetCollection: 'ahpAnalyses',
    targetId: 'ahp-01',
    timestamp: '2026-03-01T12:00:00Z',
    details: 'Executed 9-Criteria AHP MCDA run for Palar Watershed (CR = 0.029)'
  }
];
