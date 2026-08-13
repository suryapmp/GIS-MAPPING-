/**
 * HYDRO-GIS Research Platform Core Data Models
 */

export type UserRole = 'ADMIN' | 'RESEARCHER' | 'FIELD_SURVEYOR' | 'VIEWER';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  leadResearcher: string;
  location: string;
  areaSqKm: number;
  watershedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyArea {
  id: string;
  projectId: string;
  name: string;
  code: string;
  areaSqKm: number;
  perimeterKm: number;
  averageSlopePercent: number;
  annualRainfallMm: number;
  geologyOverview: string;
  bounds: [number, number, number, number]; // [minLat, minLng, maxLat, maxLng]
  centroid: [number, number]; // [lat, lng]
  createdAt: string;
}

export interface GisLayer {
  id: string;
  projectId: string;
  studyAreaId?: string;
  name: string;
  category: 'Groundwater' | 'Geology' | 'Terrain' | 'Hydrology' | 'Soil' | 'Land' | 'Field' | 'ERT';
  format: 'GeoJSON' | 'KML' | 'Shapefile' | 'CSV' | 'GeoTIFF';
  visible: boolean;
  isOverlay?: boolean; // Overlay mode toggle for GIS map compositing
  opacity: number; // 0.0 to 1.0
  color: string;
  featureCount: number;
  crs: string;
  source: string;
  data: any; // GeoJSON or FeatureCollection
  createdAt: string;
}

export type ObservationType = 'Soil' | 'Well' | 'Geology' | 'Hydrogeology' | 'Recharge' | 'Drainage' | 'LandUse' | 'General';

export interface FieldObservation {
  id: string;
  projectId: string;
  studyAreaId?: string;
  observerName: string;
  observerEmail?: string;
  type: ObservationType;
  lat: number;
  lng: number;
  elevationM?: number;
  accuracyM?: number;
  photoUrl?: string;
  notes: string;
  syncStatus: 'synced' | 'pending';
  timestamp: string;
}

export interface SoilSample {
  id: string;
  projectId: string;
  studyAreaId?: string;
  sampleId: string;
  lat: number;
  lng: number;
  depthCm: number;
  date: string;
  texture: 'Sandy Loam' | 'Clay' | 'Silt Loam' | 'Loam' | 'Silty Clay' | 'Sandy Clay Loam' | 'Gravelly Sand';
  color: string;
  structure: 'Granular' | 'Blocky' | 'Prismatic' | 'Platy' | 'Massive';
  moisture: 'Dry' | 'Moist' | 'Saturated';
  gravelPercent: number;
  organicMatterObs: string;
  landUse: string;
}

export interface SoilLabResult {
  id: string;
  sampleId: string;
  ph: number;
  ecDsM: number;
  organicCarbonPercent: number;
  nitrogenMgKg: number;
  phosphorusMgKg: number;
  potassiumMgKg: number;
  sulphurMgKg: number;
  zincMgKg: number;
  ironMgKg: number;
  manganeseMgKg: number;
  copperMgKg: number;
  boronMgKg: number;
  method: string;
  labName: string;
  verified: boolean;
  testDate: string;
}

export interface Well {
  id: string;
  projectId: string;
  studyAreaId?: string;
  wellId: string;
  lat: number;
  lng: number;
  wellType: 'Borewell' | 'Dug Well' | 'Piezometer' | 'Tube Well';
  depthM: number;
  diameterMm: number;
  aquiferType: 'Unconfined' | 'Confined' | 'Semi-confined' | 'Fractured Basement';
  lithology: string;
  yieldLps: number;
  status: 'Active' | 'Inactive' | 'Abandoned' | 'Dry';
  createdAt: string;
}

export interface WellMeasurement {
  id: string;
  wellId: string;
  date: string;
  season: 'Pre-Monsoon' | 'Monsoon' | 'Post-Monsoon' | 'Dry Season';
  staticWaterLevelM: number;
  pumpingWaterLevelM: number;
  yieldLps: number;
  remarks?: string;
}

export interface GeologicalObservation {
  id: string;
  projectId: string;
  locationName: string;
  lat: number;
  lng: number;
  rockType: 'Granite' | 'Basalt' | 'Gneiss' | 'Sandstone' | 'Limestone' | 'Schist' | 'Alluvium';
  lithology: string;
  weatheringGrade: 'Fresh' | 'Slightly Weathered' | 'Highly Weathered' | 'Completely Weathered';
  fractureDensity: 'High' | 'Moderate' | 'Low' | 'Nil';
  strikeDeg: number;
  dipDeg: number;
  rockQualityRqd: number; // 0 - 100%
  outcropDescription: string;
  timestamp: string;
}

export interface HydrogeologicalObservation {
  id: string;
  projectId: string;
  locationName: string;
  lat: number;
  lng: number;
  type: 'Spring' | 'Seepage' | 'Recharge Area' | 'Discharge Zone' | 'Stream Leakage';
  dischargeLps?: number;
  waterEvidence: string;
  streamCondition: 'Perennial' | 'Intermittent' | 'Ephemeral';
  interpretation: string;
  timestamp: string;
}

export interface ErtSurvey {
  id: string;
  projectId: string;
  profileName: string;
  latStart: number;
  lngStart: number;
  latEnd: number;
  lngEnd: number;
  electrodeSpacingM: number;
  electrodeCount: number;
  arrayMethod: 'Wenner' | 'Schlumberger' | 'Dipole-Dipole';
  surveyDate: string;
  notes: string;
}

export interface ErtDataPoint {
  id: string;
  surveyId: string;
  distanceM: number;
  electrode: number;
  depthM: number;
  resistivityOhmM: number;
  interpretedLithology?: string;
}

export interface ScientificReference {
  id: string;
  title: string;
  authors: string;
  organization: string;
  year: number;
  source: string;
  url?: string;
  citation: string;
  geographicCoverage: string;
  keywords: string[];
  notes?: string;
}

export type AhpCriteriaKey =
  | 'geology'
  | 'slope'
  | 'drainageDensity'
  | 'lineamentDensity'
  | 'rainfall'
  | 'soil'
  | 'landUse'
  | 'elevation'
  | 'depthToWater';

export interface AhpAnalysis {
  id: string;
  projectId: string;
  name: string;
  criteria: AhpCriteriaKey[];
  pairwiseMatrix: Record<string, Record<string, number>>;
  weights: Record<AhpCriteriaKey, number>;
  consistencyIndex: number;
  consistencyRatio: number; // Must be <= 0.10 for scientific validity
  isConsistent: boolean;
  classDistributionPercent: {
    VeryHigh: number;
    High: number;
    Moderate: number;
    Low: number;
    VeryLow: number;
  };
  createdBy: string;
  createdAt: string;
}

export type MlAlgorithm = 'Random Forest' | 'XGBoost' | 'SVM' | 'Ensemble Classifier';

export interface MlModelRun {
  id: string;
  projectId: string;
  modelName: string;
  algorithm: MlAlgorithm;
  features: string[];
  target: string;
  hyperparameters: Record<string, any>;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
  };
  confusionMatrix: number[][]; // 2x2 or 5x5
  featureImportance: Record<string, number>;
  trainingSamplesCount: number;
  testSamplesCount: number;
  createdAt: string;
}

export interface GwpzResult {
  id: string;
  projectId: string;
  studyAreaId: string;
  title: string;
  method: 'AHP' | 'Random Forest' | 'XGBoost' | 'SVM' | 'Ensemble';
  modelOrAhpId: string;
  totalAreaKm2: number;
  zones: {
    class: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
    areaKm2: number;
    percentage: number;
    color: string;
  }[];
  parametersUsed: string[];
  createdAt: string;
}

export interface ValidationRecord {
  id: string;
  gwpzResultId: string;
  wellId: string;
  observedYieldLps: number;
  observedClass: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
  predictedClass: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
  matched: boolean;
  yieldMatchScore: number;
  validatedAt: string;
}

export type MarStructureType = 'Check Dam' | 'Percolation Tank' | 'Recharge Shaft' | 'Injection Well' | 'Subsurface Dyke';

export interface MarSite {
  id: string;
  projectId: string;
  siteName: string;
  lat: number;
  lng: number;
  suitabilityScore: number; // 0 - 100
  suitabilityClass: 'High' | 'Moderate' | 'Low';
  recommendedStructure: MarStructureType;
  soilPermeabilityMmHr: number;
  slopePercent: number;
  drainageOrder: number;
  waterAvailability: 'Abundant' | 'Moderate' | 'Limited';
  accessibility: 'Easy' | 'Moderate' | 'Difficult';
  researcherApproved: boolean;
  comments: string;
  createdAt: string;
}

export interface ResearchNote {
  id: string;
  projectId: string;
  title: string;
  category: 'Observation' | 'Hypothesis' | 'Methodology' | 'Result Analysis' | 'Field Work';
  observation: string;
  hypothesis?: string;
  method?: string;
  result?: string;
  conclusion?: string;
  linkedEntityId?: string; // sampleId, wellId, ertProfileId
  author: string;
  date: string;
}

export interface ResearchReport {
  id: string;
  projectId: string;
  title: string;
  executiveSummary: string;
  author: string;
  status: 'Draft' | 'Peer Review' | 'Published';
  methodologyOverview: string;
  gwpzSummary: string;
  marRecommendations: string;
  limitations: string;
  generatedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  targetCollection: string;
  targetId: string;
  timestamp: string;
  details: string;
}
