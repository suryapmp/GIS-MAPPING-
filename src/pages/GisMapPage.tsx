import React, { useState, useEffect } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  Polyline,
  Polygon,
  useMap,
  useMapEvents
} from 'react-leaflet';
import {
  Map as MapIcon,
  Layers,
  Compass,
  Eye,
  EyeOff,
  Maximize2,
  Globe,
  Mountain,
  Crosshair,
  Ruler,
  Info
} from 'lucide-react';
import L from 'leaflet';
import * as turf from '@turf/turf';

// Fix Leaflet Default Marker Icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const BASEMAPS = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: 'Esri World Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  },
  terrain: {
    name: 'OpenTopoMap Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data &copy; OpenStreetMap, SRTM'
  }
};

// Mouse Location Display Component
const MousePositionHUD: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    mousemove(e) {
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  if (!coords) return null;

  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-mono shadow-xl flex items-center space-x-2 backdrop-blur-md">
      <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
      <span>Lat: <strong className="text-cyan-300">{coords.lat.toFixed(5)}°N</strong></span>
      <span className="text-slate-600">|</span>
      <span>Lng: <strong className="text-cyan-300">{coords.lng.toFixed(5)}°E</strong></span>
    </div>
  );
};

export const GisMapPage: React.FC = () => {
  const {
    gisLayers,
    toggleLayerVisibility,
    basemapTile,
    setBasemapTile,
    mapCenter,
    mapZoom,
    wells,
    marSites,
    soilSamples
  } = useHydroStore();

  const [activeFeatureInfo, setActiveFeatureInfo] = useState<any>(null);
  const [measurementHud, setMeasurementHud] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-950">
      {/* Map Control Sidebar Overlay */}
      <div className="absolute top-4 left-4 z-[1000] w-80 bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-2xl backdrop-blur-md text-slate-200 text-xs space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {/* Module Title */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 font-bold text-slate-100">
            <MapIcon className="w-4 h-4 text-cyan-400" />
            <span>Module 4: GIS Research Map</span>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
            EPSG:4326
          </span>
        </div>

        {/* Basemap Switcher */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase font-mono mb-1.5">
            Basemap Tile Source
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['osm', 'satellite', 'terrain'] as const).map((tile) => (
              <button
                key={tile}
                onClick={() => setBasemapTile(tile)}
                className={`p-2 rounded text-[11px] font-semibold border transition-all text-center capitalize ${
                  basemapTile === tile
                    ? 'bg-cyan-600 border-cyan-400 text-white shadow'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tile}
              </button>
            ))}
          </div>
        </div>

        {/* Active Layers List */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase font-mono mb-2">
            <span>GIS Layer Stack ({gisLayers.length})</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {gisLayers.map((layer) => (
              <div
                key={layer.id}
                className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 p-2 rounded-lg border border-slate-700/60"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: layer.color }}
                  ></span>
                  <span className="truncate text-[11px] font-medium text-slate-200">
                    {layer.name}
                  </span>
                </div>

                <button
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.visible ? (
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Feature Info HUD Panel */}
        {activeFeatureInfo && (
          <div className="bg-slate-950 p-3 rounded-lg border border-cyan-800/60 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-slate-800 pb-1">
              <span className="flex items-center space-x-1">
                <Info className="w-3.5 h-3.5" />
                <span>Feature Attributes</span>
              </span>
              <button
                onClick={() => setActiveFeatureInfo(null)}
                className="text-slate-400 hover:text-white text-[10px]"
              >
                Close
              </button>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              {Object.entries(activeFeatureInfo).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-500 capitalize">{k}:</span>
                  <span className="font-semibold text-slate-200">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Canvas */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0 bg-slate-950"
        zoomControl={false}
      >
        <TileLayer
          attribution={BASEMAPS[basemapTile].attribution}
          url={BASEMAPS[basemapTile].url}
        />

        <MousePositionHUD />

        {/* Render Vector Layers */}
        {gisLayers.filter(l => l.visible).map((layer) => {
          if (!layer.data) return null;
          return (
            <GeoJSON
              key={layer.id}
              data={layer.data}
              style={{
                color: layer.color,
                weight: 2.5,
                opacity: layer.opacity,
                fillColor: layer.color,
                fillOpacity: layer.opacity * 0.25
              }}
              onEachFeature={(feature, l) => {
                l.on('click', () => {
                  setActiveFeatureInfo(feature.properties || {});
                });
              }}
            />
          );
        })}

        {/* Wells Interactive Markers */}
        {wells.map((w) => (
          <CircleMarker
            key={w.id}
            center={[w.lat, w.lng]}
            radius={7}
            pathOptions={{
              color: '#0284c7',
              fillColor: w.status === 'Active' ? '#38bdf8' : '#ef4444',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Popup className="hydro-popup">
              <div className="p-1 font-sans text-xs">
                <h4 className="font-bold text-slate-900 border-b pb-1">{w.wellId} ({w.wellType})</h4>
                <div className="mt-1 space-y-0.5 text-slate-700">
                  <p><strong>Aquifer:</strong> {w.aquiferType}</p>
                  <p><strong>Depth:</strong> {w.depthM} m</p>
                  <p><strong>Yield:</strong> {w.yieldLps} L/s</p>
                  <p><strong>Lithology:</strong> {w.lithology}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* MAR Sites Markers */}
        {marSites.map((site) => (
          <CircleMarker
            key={site.id}
            center={[site.lat, site.lng]}
            radius={9}
            pathOptions={{
              color: '#059669',
              fillColor: '#10b981',
              fillOpacity: 0.9,
              weight: 2
            }}
          >
            <Popup className="hydro-popup">
              <div className="p-1 font-sans text-xs">
                <h4 className="font-bold text-emerald-900 border-b pb-1">{site.siteName}</h4>
                <div className="mt-1 space-y-0.5 text-slate-700">
                  <p><strong>Recommended Structure:</strong> {site.recommendedStructure}</p>
                  <p><strong>Suitability Score:</strong> {site.suitabilityScore}/100</p>
                  <p><strong>Soil Permeability:</strong> {site.soilPermeabilityMmHr} mm/hr</p>
                  <p><strong>Status:</strong> {site.researcherApproved ? 'Approved' : 'Pending'}</p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};
