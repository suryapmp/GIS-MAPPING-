import { 
  InterpolationOptions, 
  InterpolatedSurfaceLayer, 
  SurfaceGridPoint,
  GroundwaterObservation 
} from '../../types/groundwater';

export class InterpolationEngine {
  generateSurface(
    observations: GroundwaterObservation[],
    options: InterpolationOptions,
    bounds: [number, number, number, number] // [minLat, minLng, maxLat, maxLng]
  ): InterpolatedSurfaceLayer {
    const { method, power, gridResolution, targetParameter } = options;
    const [minLat, minLng, maxLat, maxLng] = bounds;

    // Filter valid points with numeric target
    const validPoints = observations
      .map((obs) => {
        let val = obs.normalizedDepthMbgl;
        if (targetParameter === 'water_head_msl') val = obs.normalizedHeadMsl;
        else if (targetParameter === 'drawdown') val = (obs.historicalMaxMbgl || 15) - (obs.normalizedDepthMbgl || 5);
        else if (targetParameter === 'stress') val = Math.min(100, Math.max(0, (obs.normalizedDepthMbgl || 5) * 6));
        return {
          lat: obs.latitude,
          lng: obs.longitude,
          value: val ?? 5.0,
          quality: obs.qualityScore
        };
      })
      .filter((p) => typeof p.value === 'number' && !isNaN(p.value));

    const grid: SurfaceGridPoint[] = [];
    const latStep = (maxLat - minLat) / gridResolution;
    const lngStep = (maxLng - minLng) / gridResolution;

    let minVal = Infinity;
    let maxVal = -Infinity;

    for (let i = 0; i <= gridResolution; i++) {
      const curLat = minLat + i * latStep;
      for (let j = 0; j <= gridResolution; j++) {
        const curLng = minLng + j * lngStep;

        if (validPoints.length === 0) {
          const defaultVal = 5.0;
          grid.push({ lat: curLat, lng: curLng, value: defaultVal, confidence: 50 });
          minVal = Math.min(minVal, defaultVal);
          maxVal = Math.max(maxVal, defaultVal);
          continue;
        }

        // IDW Interpolation with configurable power
        let weightSum = 0;
        let valSum = 0;
        let minDist = Infinity;

        for (const pt of validPoints) {
          const dLat = (pt.lat - curLat) * 111;
          const dLng = (pt.lng - curLng) * 111 * Math.cos((curLat * Math.PI) / 180);
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          minDist = Math.min(minDist, dist);

          if (dist < 0.05) {
            valSum = pt.value;
            weightSum = 1;
            break;
          }

          const w = 1 / Math.pow(dist, power);
          valSum += pt.value * w;
          weightSum += w;
        }

        const interpolatedVal = weightSum > 0 ? Number((valSum / weightSum).toFixed(2)) : 5.0;
        const confidence = Math.max(30, Math.min(95, Math.round(90 - minDist * 6)));

        minVal = Math.min(minVal, interpolatedVal);
        maxVal = Math.max(maxVal, interpolatedVal);

        grid.push({
          lat: Number(curLat.toFixed(5)),
          lng: Number(curLng.toFixed(5)),
          value: interpolatedVal,
          confidence
        });
      }
    }

    let unit = 'mbgl';
    if (targetParameter === 'water_head_msl') unit = 'm MSL';
    else if (targetParameter === 'drawdown') unit = 'meters';
    else if (targetParameter === 'stress') unit = 'Index (0-100)';

    return {
      id: `surf-${targetParameter}-${Date.now()}`,
      name: `Interpolated ${targetParameter.replace(/_/g, ' ').toUpperCase()} (${method})`,
      parameter: targetParameter,
      method,
      unit,
      pointsCount: validPoints.length,
      minVal: Number(minVal.toFixed(2)),
      maxVal: Number(maxVal.toFixed(2)),
      grid,
      bounds,
      generatedAt: new Date().toISOString()
    };
  }
}

export const interpolationEngine = new InterpolationEngine();
