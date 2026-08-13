import React from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Layers, Eye, EyeOff, Sliders, Trash2, Download, Plus, FileSpreadsheet } from 'lucide-react';
import { downloadJsonFile } from '../utils/reportExporter';

export const LayerManagerPage: React.FC = () => {
  const { gisLayers, toggleLayerVisibility, toggleLayerOverlay, setLayerOpacity, deleteGisLayer, setActiveModuleTab } = useHydroStore();

  const handleExportLayer = (layer: any) => {
    downloadJsonFile(`${layer.name.toLowerCase().replace(/\s+/g, '_')}.geojson`, layer.data);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Layers className="w-4 h-4" />
            <span>Module 5: GIS Layer Manager</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Geospatial Layer Stack & Overlay Symbology</h1>
          <p className="text-xs text-slate-400">Control transparency, layer order, overlay compositing, color styles, and export GeoJSON datasets.</p>
        </div>

        <button
          onClick={() => setActiveModuleTab('dataImport')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Import New GIS Layer</span>
        </button>
      </div>

      {/* Layers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Layer Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Format</th>
                <th className="p-3">Overlay Mode</th>
                <th className="p-3">CRS</th>
                <th className="p-3">Features</th>
                <th className="p-3">Color</th>
                <th className="p-3">Opacity</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {gisLayers.map((layer) => (
                <tr key={layer.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleLayerVisibility(layer.id)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                      >
                        {layer.visible ? (
                          <Eye className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                      <span className={layer.visible ? 'text-slate-100' : 'text-slate-500 line-through'}>
                        {layer.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-cyan-300">{layer.category}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {layer.format}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleLayerOverlay(layer.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border ${
                        layer.isOverlay
                          ? 'bg-purple-950 text-purple-300 border-purple-700 shadow-sm'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {layer.isOverlay ? '⚡ Overlay Active' : 'Normal Layer'}
                    </button>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">{layer.crs}</td>
                  <td className="p-3 font-bold text-slate-200">{layer.featureCount}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-4 h-4 rounded-full border border-slate-600 shadow"
                        style={{ backgroundColor: layer.color }}
                      ></span>
                      <span className="font-mono text-[10px] text-slate-400">{layer.color}</span>
                    </div>
                  </td>
                  <td className="p-3 w-40">
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={layer.opacity}
                        onChange={(e) => setLayerOpacity(layer.id, parseFloat(e.target.value))}
                        className="w-24 accent-cyan-500 h-1.5 bg-slate-800 rounded cursor-pointer"
                      />
                      <span className="font-mono text-[10px] text-slate-400">
                        {Math.round(layer.opacity * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleExportLayer(layer)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                        title="Export GeoJSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGisLayer(layer.id)}
                        className="p-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 rounded border border-slate-700 transition-colors"
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
