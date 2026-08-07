import * as turf from '@turf/turf';

export function calculateAreaSqKm(geojsonPolygon: any): number {
  try {
    const areaSqMeters = turf.area(geojsonPolygon);
    return Math.round((areaSqMeters / 1000000) * 100) / 100;
  } catch (err) {
    return 0;
  }
}

export function calculatePerimeterKm(geojsonPolygon: any): number {
  try {
    const line = turf.polygonToLine(geojsonPolygon);
    const lengthKm = turf.length(line, { units: 'kilometers' });
    return Math.round(lengthKm * 100) / 100;
  } catch (err) {
    return 0;
  }
}

export function calculateCentroid(geojsonGeometry: any): [number, number] {
  try {
    const centroid = turf.centroid(geojsonGeometry);
    const coords = centroid.geometry.coordinates;
    return [coords[1], coords[0]]; // [lat, lng]
  } catch (err) {
    return [12.85, 79.035];
  }
}

export function calculateBounds(geojsonGeometry: any): [number, number, number, number] {
  try {
    const bbox = turf.bbox(geojsonGeometry); // [minX, minY, maxX, maxY]
    return [bbox[1], bbox[0], bbox[3], bbox[2]]; // [minLat, minLng, maxLat, maxLng]
  } catch (err) {
    return [12.72, 78.85, 12.98, 79.22];
  }
}

export function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const from = turf.point([lng1, lat1]);
  const to = turf.point([lng2, lat2]);
  return Math.round(turf.distance(from, to, { units: 'kilometers' }) * 100) / 100;
}
