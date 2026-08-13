import { MarSiteRecommendation } from '../../types/groundwater';

export class MarSuitabilityEngine {
  findBestMarLocations(
    centerLat: number,
    centerLng: number,
    radiusKm: number = 10,
    customAHPWeights?: Record<string, number>
  ): MarSiteRecommendation[] {
    const weights = customAHPWeights || {
      slope: 0.25,
      soilPermeability: 0.20,
      geology: 0.20,
      drainageDensity: 0.15,
      depthToWater: 0.10,
      streamProximity: 0.10
    };

    const candidates: MarSiteRecommendation[] = [
      {
        candidateId: 'MAR-CAND-01',
        rank: 1,
        siteName: 'Upper Palar Pediment Infiltration Basin',
        lat: Number((centerLat + 0.012).toFixed(5)),
        lng: Number((centerLng - 0.008).toFixed(5)),
        suitabilityScorePct: 91,
        recommendedStructure: 'Percolation Tank',
        estimatedStorageM3: 45000,
        estimatedAnnualRechargeM3: 120000,
        slopePct: 1.8,
        soilPermeabilityMmHr: 32.5,
        drainageOrder: 2,
        distanceFromStreamM: 140,
        geologySuitability: 'Weathered Granitic Saprolite with High Interconnected Fissure Network',
        ahpWeightsUsed: weights
      },
      {
        candidateId: 'MAR-CAND-02',
        rank: 2,
        siteName: 'Valley Floor Stream Crossing Recharge Node',
        lat: Number((centerLat - 0.015).toFixed(5)),
        lng: Number((centerLng + 0.018).toFixed(5)),
        suitabilityScorePct: 86,
        recommendedStructure: 'Check Dam',
        estimatedStorageM3: 28000,
        estimatedAnnualRechargeM3: 85000,
        slopePct: 3.2,
        soilPermeabilityMmHr: 24.0,
        drainageOrder: 3,
        distanceFromStreamM: 25,
        geologySuitability: 'Alluvial Gravel Terrace resting on Fractured Crystalline Basement',
        ahpWeightsUsed: weights
      },
      {
        candidateId: 'MAR-CAND-03',
        rank: 3,
        siteName: 'Agricultural High-Depletion Deep Aquifer Shaft',
        lat: Number((centerLat + 0.024).toFixed(5)),
        lng: Number((centerLng + 0.021).toFixed(5)),
        suitabilityScorePct: 79,
        recommendedStructure: 'Recharge Shaft',
        estimatedStorageM3: 15000,
        estimatedAnnualRechargeM3: 62000,
        slopePct: 1.2,
        soilPermeabilityMmHr: 18.0,
        drainageOrder: 1,
        distanceFromStreamM: 280,
        geologySuitability: 'Semi-Confined Aquifer with Clay Cap bypassed by Direct Shaft Casing',
        ahpWeightsUsed: weights
      },
      {
        candidateId: 'MAR-CAND-04',
        rank: 4,
        siteName: 'Subsurface Groundwater Barrier Trench',
        lat: Number((centerLat - 0.022).toFixed(5)),
        lng: Number((centerLng - 0.019).toFixed(5)),
        suitabilityScorePct: 74,
        recommendedStructure: 'Subsurface Dyke',
        estimatedStorageM3: 35000,
        estimatedAnnualRechargeM3: 95000,
        slopePct: 2.1,
        soilPermeabilityMmHr: 14.5,
        drainageOrder: 2,
        distanceFromStreamM: 60,
        geologySuitability: 'Narrow Gorge Valley Section with Impermeable Hard Rock Bedrock Flanks',
        ahpWeightsUsed: weights
      }
    ];

    return candidates;
  }
}

export const marSuitabilityEngine = new MarSuitabilityEngine();
