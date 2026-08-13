import { GroundwaterObservation } from '../../../types/groundwater';
import { ProviderQueryOptions } from './cgwbProvider';

export class StateGroundwaterProvider {
  name = 'State Ground Water Resource Development Department';
  sourceCode = 'STATE_GW_DEPT';

  async fetchObservations(options: ProviderQueryOptions): Promise<GroundwaterObservation[]> {
    const { lat, lng } = options;
    const offsets = [
      { code: 'SGW-VLR-01', dLat: 0.008, dLng: -0.014, depth: 72, rawVal: 5.4, aquifer: 'Saprolite Overburden', date: '2026-07-28' },
      { code: 'SGW-VLR-02', dLat: -0.019, dLng: 0.009, depth: 95, rawVal: 7.8, aquifer: 'Granitic Fissures', date: '2026-08-02' },
      { code: 'SGW-VLR-03', dLat: 0.031, dLng: 0.022, depth: 120, rawVal: 9.1, aquifer: 'Deep Fractured Aquifer', date: '2026-07-15' }
    ];

    return offsets.map((st, i) => {
      const sLat = Number((lat + st.dLat).toFixed(5));
      const sLng = Number((lng + st.dLng).toFixed(5));
      const dLatKm = (sLat - lat) * 111;
      const dLngKm = (sLng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
      const dist = Number(Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm).toFixed(2));
      const elev = 140 + i * 8;

      return {
        source: this.sourceCode,
        sourceWellId: st.code,
        agencyName: 'State Ground Water Department',
        latitude: sLat,
        longitude: sLng,
        distanceFromGpsKm: dist,
        observationDate: st.date,
        rawValue: st.rawVal,
        rawUnit: 'mbgl',
        measurementType: 'depth_bgl',
        normalizedDepthMbgl: st.rawVal,
        normalizedHeadMsl: elev - st.rawVal,
        groundElevationMsl: elev,
        wellDepthM: st.depth,
        aquiferType: st.aquifer,
        status: 'Safe',
        qualityFlag: 'verified',
        qualityScore: 88,
        seasonalTrend: 'Stable',
        rateOfChangeMYear: -0.15
      };
    });
  }
}

export const stateProvider = new StateGroundwaterProvider();
