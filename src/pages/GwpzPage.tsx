import React from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Target, Download, Layers } from 'lucide-react';
import { downloadJsonFile } from '../utils/reportExporter';

export const GwpzPage: React.FC = () => {
  const { gwpzResults, setActiveModuleTab } = useHydroStore();

  const activeResult = gwpzResults[0];

  const handleExportGeoJson = () => {
    if (!activeResult) return;
    downloadJsonFile(`gwpz_zones_${activeResult.method.toLowerCase()}.geojson`, activeResult);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase font-bold">
            <Target className="w-4 h-4" />
            <span>Module 17: Groundwater Potential Zoning (GWPZ)</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Groundwater Potential Zoning Analysis</h1>
          <p className="text-xs text-slate-400">Classified potential zones (Very High, High, Moderate, Low, Very Low) calculated via AHP or Machine Learning.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveModuleTab('map')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold rounded-lg flex items-center space-x-2"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>View on GIS Map</span>
          </button>
          <button
            onClick={handleExportGeoJson}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export GeoJSON Layer</span>
          </button>
        </div>
      </div>

      {activeResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Zone Breakdown */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">{activeResult.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Methodology: <strong className="text-emerald-400">{activeResult.method}</strong> | Total Area: {activeResult.totalAreaKm2} km²
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeResult.zones.map((zone) => (
                <div key={zone.class} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: zone.color }}></span>
                      <span className="text-slate-100">{zone.class} Potential Zone</span>
                    </div>
                    <span className="font-mono text-cyan-300">{zone.areaKm2} km² ({zone.percentage}%)</span>
                  </div>

                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: zone.color, width: `${zone.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Parameters List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Integrated Spatial Criteria</h3>
            <div className="space-y-1.5 font-mono text-xs text-slate-300">
              {activeResult.parametersUsed.map((param, idx) => (
                <div key={idx} className="p-2 bg-slate-800/80 rounded border border-slate-700/60 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{param}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
