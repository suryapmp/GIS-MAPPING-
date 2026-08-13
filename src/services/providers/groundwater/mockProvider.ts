import { GroundwaterObservation } from '../../../types/groundwater';
import { ProviderQueryOptions } from './cgwbProvider';
import { Well, WellMeasurement } from '../../../types/hydro';

export class LocalDatasetProvider {
  name = 'Internal Hydro-GIS Research Project Dataset';
  sourceCode = 'INTERNAL_RESEARCH_DB';

  fetchFromLocalStore(
    wells: Well[],
    measurements: WellMeasurement[],
    options: ProviderQueryOptions
  ): GroundwaterObservation[] {
    const { lat, lng, radiusKm } = options;

    return wells
      .map((w) => {
        const dLatKm = (w.lat - lat) * 111;
        const dLngKm = (w.lng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
        const dist = Number(Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm).toFixed(2));

        if (dist > radiusKm) return null;

        // Find latest measurement for this well
        const wellMeasures = measurements.filter((m) => m.wellId === w.id);
        const latest = wellMeasures.length > 0 ? wellMeasures[wellMeasures.length - 1] : null;
        const rawDepth = latest ? latest.staticWaterLevelM : 6.8;
        const elev = Math.round(150 + Math.sin(w.lat * 10) * 35);

        const obs: GroundwaterObservation = {
          source: this.sourceCode,
          sourceWellId: w.wellId,
          agencyName: 'Project Field Observatory',
          latitude: w.lat,
          longitude: w.lng,
          distanceFromGpsKm: dist,
          observationDate: latest ? latest.date : '2026-03-30',
          rawValue: rawDepth,
          rawUnit: 'mbgl',
          measurementType: 'depth_bgl',
          normalizedDepthMbgl: rawDepth,
          normalizedHeadMsl: elev - rawDepth,
          groundElevationMsl: elev,
          wellDepthM: w.depthM,
          aquiferType: w.aquiferType,
          lithology: w.lithology,
          status: w.status === 'Active' ? 'Safe' : 'Critical',
          qualityFlag: 'verified',
          qualityScore: 92,
          seasonalTrend: latest && latest.season === 'Pre-Monsoon' ? 'Falling' : 'Rising',
          rateOfChangeMYear: -0.22,
          metadata: {
            wellType: w.wellType,
            yieldLps: w.yieldLps
          }
        };
        return obs;
      })
      .filter((item): item is GroundwaterObservation => item !== null)
      .sort((a, b) => (a.distanceFromGpsKm || 0) - (b.distanceFromGpsKm || 0));
  }
}

export const mockProvider = new LocalDatasetProvider();
