export interface WatershedMetrics {
  watershedName: string;
  subCatchmentId: string;
  catchmentAreaKm2: number;
  drainageDensityKmKm2: number;
  bifurcationRatio: number;
  hypsometricIntegral: number;
  timeOfConcentrationHours: number;
  estimatedAnnualRunoffMillionM3: number;
  streamOrder: number;
  rechargePotentialIndex: 'High' | 'Moderate' | 'Low';
  dominantSlopeGrade: string;
  vulnerabilityStatus: string;
  flowDirection: string;
}

export class WatershedEngine {
  analyzeWatershedAtGps(lat: number, lng: number): WatershedMetrics {
    const area = Number((42.5 + Math.abs(Math.sin(lat * 8)) * 30).toFixed(1));
    const runoff = Number((area * 0.94 * 0.22).toFixed(2)); // ~22% runoff coeff

    return {
      watershedName: `Micro-Catchment MC-${Math.round(lat * 10)}-${Math.round(lng * 10)}`,
      subCatchmentId: `SW-BASIN-${Math.floor(lat)}-${Math.floor(lng)}`,
      catchmentAreaKm2: area,
      drainageDensityKmKm2: 1.78,
      bifurcationRatio: 3.84,
      hypsometricIntegral: 0.42,
      timeOfConcentrationHours: 3.4,
      estimatedAnnualRunoffMillionM3: runoff,
      streamOrder: 3,
      rechargePotentialIndex: 'High',
      dominantSlopeGrade: 'Gentle Peneplain (2 - 5% Slope)',
      vulnerabilityStatus: 'Moderate Seasonal Groundwater Depletion Pressure',
      flowDirection: 'South-East towards Regional Trunk Stream'
    };
  }
}

export const watershedEngine = new WatershedEngine();
