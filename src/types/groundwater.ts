/**
 * Normalized Groundwater & Hydrogeological Data Models
 * Conforming to Research-Grade Groundwater Intelligence & Aquifer Digital Twin Specifications
 */

export type MeasurementType = 
  | 'depth_bgl' 
  | 'water_level_elevation' 
  | 'hydraulic_head' 
  | 'unknown';

export type QualityFlag = 
  | 'verified' 
  | 'estimated' 
  | 'stale' 
  | 'missing' 
  | 'suspect';

export interface GroundwaterObservation {
  source: string;
  sourceWellId: string;
  agencyName: string;

  latitude: number;
  longitude: number;
  distanceFromGpsKm?: number;

  observationDate: string; // YYYY-MM-DD
  observationTimestamp?: string;

  rawValue: number;
  rawUnit: 'mbgl' | 'm_msl' | 'ft_bgl' | 'psi' | 'm';

  measurementType: MeasurementType;

  normalizedDepthMbgl?: number;
  normalizedHeadMsl?: number;

  groundElevationMsl?: number;
  wellDepthM?: number;

  aquiferType?: string;
  lithology?: string;
  status?: 'Active' | 'Critical' | 'Semi-Critical' | 'Safe' | 'Over-Exploited';

  qualityFlag: QualityFlag;
  qualityScore: number; // 0 - 100%

  seasonalTrend?: 'Rising' | 'Falling' | 'Stable';
  historicalMinMbgl?: number;
  historicalMaxMbgl?: number;
  rateOfChangeMYear?: number;

  metadata?: Record<string, unknown>;
}

export interface GpsLocationTelemetry {
  lat: number;
  lng: number;
  accuracyM: number;
  elevationMsl?: number;
  speedKmh?: number;
  headingDeg?: number;
  timestamp: string;
  quality: 'Excellent (RTK/Differential)' | 'High (Dual-Band GPS)' | 'Standard (Single GPS)' | 'Cell/Network Triangulated';
}

export interface GroundwaterIntelligenceResult {
  gpsLocation: { lat: number; lng: number };
  searchRadiusKm: number;
  nearbyWellsCount: number;
  validWellsCount: number;
  nearestWellDistanceKm: number;
  nearestWellId: string;
  nearestWellDepthMbgl?: number;
  
  latestNearbyObservation: {
    waterLevelMbgl: number;
    observationDate: string;
    agency: string;
    wellId: string;
    isRealTimeTelemetry: boolean;
  };

  seasonalCondition: 'EXCELLENT' | 'NORMAL' | 'BELOW NORMAL' | 'CRITICAL DEPLETION';
  longTermTrend: 'RISING (+0.3m/yr)' | 'STABLE (±0.05m/yr)' | 'DECLINING (-0.45m/yr)' | 'RAPID DEPLETION (-1.2m/yr)';
  localGroundwaterStress: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  
  estimatedWaterLevelMbgl: number;
  estimatedWaterHeadMsl?: number;
  confidenceScore: number; // 0 - 100%
  
  confidenceBreakdown: {
    nearbyDataDensity: 'High' | 'Moderate' | 'Low' | 'Sparse';
    observationFreshness: 'Real-Time Telemetry' | 'Recent (< 30 days)' | 'Moderate (< 90 days)' | 'Stale (> 1 yr)';
    elevationCompatibility: 'High' | 'Moderate' | 'Low';
    spatialDistribution: 'Uniform Multi-Quadrant' | 'Bilateral' | 'Unilateral' | 'Single Point';
  };

  hydraulicParameters: {
    estimatedKValueMDay: number;
    transmissivityM2Day: number;
    specificYieldPct: number;
    aquiferVulnerability: string;
    recommendedMar: string;
  };

  surroundingObservations?: GroundwaterObservation[];
  explanatoryNotes: string[];
}

export interface InterpolationOptions {
  method: 'IDW' | 'TIN' | 'Kriging' | 'NaturalNeighbor';
  power: number;
  searchRadiusKm: number;
  minPoints: number;
  maxPoints: number;
  gridResolution: number; // e.g. 20x20
  targetParameter: 'water_level_mbgl' | 'water_head_msl' | 'drawdown' | 'anomaly' | 'stress';
}

export interface SurfaceGridPoint {
  lat: number;
  lng: number;
  value: number;
  confidence: number;
}

export interface InterpolatedSurfaceLayer {
  id: string;
  name: string;
  parameter: string;
  method: string;
  unit: string;
  pointsCount: number;
  minVal: number;
  maxVal: number;
  grid: SurfaceGridPoint[];
  bounds: [number, number, number, number];
  generatedAt: string;
}

export interface StressIndexWeights {
  groundwaterLevel: number; // Default 0.25
  longTermTrend: number;    // Default 0.20
  seasonalAnomaly: number;  // Default 0.15
  rainfallDeficit: number;  // Default 0.15
  aquiferVulnerability: number; // Default 0.10
  rechargePotential: number; // Default 0.05
  extractionPressure: number; // Default 0.10
}

export interface StressIndexResult {
  score: number; // 0 to 100
  status: 'Critical' | 'High Stress' | 'Moderate Stress' | 'Stable' | 'Excellent';
  color: string;
  factors: {
    name: string;
    rawScore: number;
    weightedScore: number;
    description: string;
  }[];
  recommendations: string[];
}

export interface MlForecastResult {
  currentDepthMbgl: number;
  forecast30DaysMbgl: number;
  forecast90DaysMbgl: number;
  forecast180DaysMbgl: number;
  trend: 'Rising' | 'Stable' | 'Declining' | 'Rapid Decline';
  predictionConfidencePct: number;
  modelUsed: 'Ensemble XGBoost + LSTM Hydro-Physics Hybrid' | 'Random Forest Hydro-Regressor' | 'ARIMA Time-Series';
  inputFeaturesUsed: string[];
  historicalSeries: { date: string; observedMbgl: number; rainfallMm: number }[];
  projectedSeries: { date: string; projectedMbgl: number; upperConfidenceMbgl: number; lowerConfidenceMbgl: number }[];
}

export interface RainfallRechargeAnalysis {
  rainfallLast30DaysMm: number;
  annualCumulativeRainfallMm: number;
  rainfallAnomalyPct: number; // e.g. -14%
  estimatedInfiltrationRateMmHr: number;
  estimatedRechargeVolumeM3: number;
  rechargeCategory: 'Abundant' | 'Moderate' | 'Low' | 'Deficit';
  responseLagDays: number; // e.g. 28 days
  correlationCoefficient: number; // e.g. 0.82
  droughtCategory: 'Normal' | 'Watch' | 'Moderate Drought' | 'Severe Drought' | 'Extreme Groundwater Stress';
  spiScore: number;
}

export interface GroundwaterAnomaly {
  id: string;
  wellId: string;
  wellName: string;
  lat: number;
  lng: number;
  anomalyType: 'Sudden Decline' | 'Sudden Rise' | 'Failed Seasonal Recovery' | 'Sensor Suspect' | 'Extreme Drawdown';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  observedChangeM: number;
  expectedRangeM: string;
  observationDate: string;
  recommendedAction: string;
}

export interface MarSiteRecommendation {
  candidateId: string;
  rank: number;
  siteName: string;
  lat: number;
  lng: number;
  suitabilityScorePct: number;
  recommendedStructure: 'Percolation Tank' | 'Recharge Shaft' | 'Check Dam' | 'Injection Well' | 'Subsurface Dyke';
  estimatedStorageM3: number;
  estimatedAnnualRechargeM3: number;
  slopePct: number;
  soilPermeabilityMmHr: number;
  drainageOrder: number;
  distanceFromStreamM: number;
  geologySuitability: string;
  ahpWeightsUsed: Record<string, number>;
}

export interface OfflineSyncItem {
  id: string;
  entityType: 'well' | 'measurement' | 'fieldNote' | 'soilSample' | 'waypoint' | 'gpsTrack';
  data: any;
  queuedAt: string;
  status: 'pending' | 'synced' | 'failed';
  retryCount: number;
  error?: string;
}
