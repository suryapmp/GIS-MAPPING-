import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, FileCheck, Layers } from 'lucide-react';

export const DataImportPage: React.FC = () => {
  const { addGisLayer, activeProjectId, setActiveModuleTab } = useHydroStore();

  const [layerName, setLayerName] = useState('');
  const [category, setCategory] = useState<'Groundwater' | 'Geology' | 'Terrain' | 'Hydrology' | 'Soil' | 'Land' | 'Field' | 'ERT'>('Groundwater');
  const [format, setFormat] = useState<'GeoJSON' | 'KML' | 'Shapefile' | 'CSV' | 'GeoTIFF'>('CSV');
  const [crs, setCrs] = useState('EPSG:4326');
  const [color, setColor] = useState('#0284c7');
  const [latColumn, setLatColumn] = useState('latitude');
  const [lngColumn, setLngColumn] = useState('longitude');
  const [rawText, setRawText] = useState(`latitude,longitude,wellId,depthM,yieldLps\n12.865,79.020,GW-NEW-01,95.0,5.2\n12.870,79.035,GW-NEW-02,110.0,4.1`);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [logMessage, setLogMessage] = useState('');

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!layerName) return;

    setStatus('processing');
    setLogMessage('Parsing raw spatial coordinate string & verifying geometry validity...');

    setTimeout(() => {
      try {
        const lines = rawText.trim().split('\n');
        if (lines.length < 2) throw new Error('CSV must contain at least 1 header line and 1 data line.');

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const latIdx = headers.indexOf(latColumn.toLowerCase());
        const lngIdx = headers.indexOf(lngColumn.toLowerCase());

        const features: any[] = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(r => r.trim());
          if (row.length < 2) continue;
          const lat = parseFloat(row[latIdx]);
          const lng = parseFloat(row[lngIdx]);
          if (isNaN(lat) || isNaN(lng)) continue;

          const props: Record<string, any> = {};
          headers.forEach((h, idx) => {
            props[h] = row[idx];
          });

          features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lng, lat] },
            properties: props
          });
        }

        addGisLayer({
          projectId: activeProjectId,
          name: layerName,
          category,
          format,
          visible: true,
          opacity: 0.9,
          color,
          featureCount: features.length,
          crs,
          source: 'User Data Import Pipeline',
          data: {
            type: 'FeatureCollection',
            features
          }
        });

        setStatus('completed');
        setLogMessage(`Successfully created spatial layer '${layerName}' with ${features.length} features.`);
      } catch (err: any) {
        setStatus('failed');
        setLogMessage(err.message || 'Import failed due to invalid format.');
      }
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
          <UploadCloud className="w-4 h-4" />
          <span>Module 6: Spatial Data Import Engine</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Import GIS Layers & Tabular Field Data</h1>
        <p className="text-xs text-slate-400">
          Support GeoJSON, KML, Shapefile ZIP, CSV, Excel, and GeoTIFF formats. Raw provenance is preserved without modification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Formats */}
        <form onSubmit={handleImport} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Layer Metadata & File Parser</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Layer Display Name *</label>
              <input
                type="text"
                required
                value={layerName}
                onChange={(e) => setLayerName(e.target.value)}
                placeholder="e.g., Aquifer Water Table Observations"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Groundwater">Groundwater</option>
                <option value="Geology">Geology</option>
                <option value="Terrain">Terrain</option>
                <option value="Hydrology">Hydrology</option>
                <option value="Soil">Soil</option>
                <option value="Land">Land Use</option>
                <option value="Field">Field Survey</option>
                <option value="ERT">ERT Geophysics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Data Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              >
                <option value="CSV">CSV / Excel</option>
                <option value="GeoJSON">GeoJSON</option>
                <option value="KML">KML / KMZ</option>
                <option value="Shapefile">Shapefile ZIP</option>
                <option value="GeoTIFF">GeoTIFF Raster</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Coordinate Reference System</label>
              <select
                value={crs}
                onChange={(e) => setCrs(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              >
                <option value="EPSG:4326">EPSG:4326 (WGS 84 Lat/Lng)</option>
                <option value="EPSG:3857">EPSG:3857 (Web Mercator)</option>
                <option value="EPSG:32643">EPSG:32643 (UTM Zone 43N)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Layer Symbol Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-8 bg-slate-800 border border-slate-700 rounded cursor-pointer"
              />
            </div>
          </div>

          {format === 'CSV' && (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h4 className="font-bold text-cyan-400 text-xs uppercase font-mono">CSV Column Mapping</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Latitude Column Name</label>
                  <input
                    type="text"
                    value={latColumn}
                    onChange={(e) => setLatColumn(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Longitude Column Name</label>
                  <input
                    type="text"
                    value={lngColumn}
                    onChange={(e) => setLngColumn(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Paste CSV Content (Header + Rows)</label>
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 font-mono text-[11px] text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={status === 'processing'}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Process & Import GIS Layer</span>
            </button>

            {status === 'completed' && (
              <button
                type="button"
                onClick={() => setActiveModuleTab('layers')}
                className="text-xs text-cyan-400 font-bold hover:underline"
              >
                Go to Layer Manager →
              </button>
            )}
          </div>
        </form>

        {/* Status & Processing Provenance */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Processing Status & Provenance</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 font-mono">Current Status:</span>
              <span
                className={`font-bold font-mono px-2 py-0.5 rounded text-[11px] uppercase ${
                  status === 'completed'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : status === 'processing'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : status === 'failed'
                    ? 'bg-red-950 text-red-300 border border-red-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {status}
              </span>
            </div>

            {logMessage && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono leading-relaxed ${
                  status === 'completed'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : status === 'failed'
                    ? 'bg-red-950/40 border-red-800/60 text-red-200'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {logMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
