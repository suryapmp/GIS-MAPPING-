import { GroundwaterAnomaly, GroundwaterObservation } from '../../types/groundwater';

export class AnomalyDetectionEngine {
  detectAnomalies(observations: GroundwaterObservation[]): GroundwaterAnomaly[] {
    const anomalies: GroundwaterAnomaly[] = [];

    observations.forEach((obs, idx) => {
      const depth = obs.normalizedDepthMbgl;
      if (depth === undefined || isNaN(depth)) return;

      // 1. Sudden deep decline (greater than 14 mbgl in unconfined / saprolite)
      if (depth > 13.5) {
        anomalies.push({
          id: `anom-${obs.sourceWellId}-1`,
          wellId: obs.sourceWellId,
          wellName: `${obs.agencyName} Station ${obs.sourceWellId}`,
          lat: obs.latitude,
          lng: obs.longitude,
          anomalyType: 'Extreme Drawdown',
          severity: 'HIGH',
          observedChangeM: Number((depth - 6.5).toFixed(2)),
          expectedRangeM: '3.0 – 7.5 mbgl',
          observationDate: obs.observationDate,
          recommendedAction: 'Verify pump discharge rate and inspect for intensive localized multi-borewell extraction cone.'
        });
      }

      // 2. Sudden rapid change
      if (obs.rateOfChangeMYear && Math.abs(obs.rateOfChangeMYear) > 0.8) {
        anomalies.push({
          id: `anom-${obs.sourceWellId}-2`,
          wellId: obs.sourceWellId,
          wellName: `${obs.agencyName} Station ${obs.sourceWellId}`,
          lat: obs.latitude,
          lng: obs.longitude,
          anomalyType: 'Sudden Decline',
          severity: 'HIGH',
          observedChangeM: Math.abs(obs.rateOfChangeMYear),
          expectedRangeM: '±0.20 m/year',
          observationDate: obs.observationDate,
          recommendedAction: 'Cross-examine with nearby precipitation data and conduct geophysical electrical logging.'
        });
      }

      // 3. Suspect sensor readings (e.g. negative depth or depth > 300m)
      if (depth < 0.2 || depth > 250) {
        anomalies.push({
          id: `anom-${obs.sourceWellId}-3`,
          wellId: obs.sourceWellId,
          wellName: `${obs.agencyName} Station ${obs.sourceWellId}`,
          lat: obs.latitude,
          lng: obs.longitude,
          anomalyType: 'Sensor Suspect',
          severity: 'MEDIUM',
          observedChangeM: depth,
          expectedRangeM: '1.0 – 40.0 mbgl',
          observationDate: obs.observationDate,
          recommendedAction: 'Recalibrate pressure transducer zero-offset and purge well casing sediment.'
        });
      }
    });

    return anomalies;
  }
}

export const anomalyDetectionEngine = new AnomalyDetectionEngine();
