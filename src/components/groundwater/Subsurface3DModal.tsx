import React, { useState } from 'react';
import { X, Layers, Eye, EyeOff, Activity, Droplets, Info } from 'lucide-react';

interface Props {
  waterLevelMbgl: number;
  onClose: () => void;
}

export const Subsurface3DModal: React.FC<Props> = ({ waterLevelMbgl, onClose }) => {
  const [showErtOverlay, setShowErtOverlay] = useState<boolean>(true);
  const [showWaterTable, setShowWaterTable] = useState<boolean>(true);
  const [showBoreholeLogs, setShowBoreholeLogs] = useState<boolean>(true);

  // Subsurface Stratigraphic Horizons (Depth in meters)
  const strata = [
    { name: 'Topsoil & Humus Layer', topM: 0, bottomM: 1.5, color: '#78350f', lithology: 'Sandy Loam with organic roots', k: '18.5 m/day', resistivity: '120-250 Ω·m' },
    { name: 'Unconsolidated Alluvium & Colluvium', topM: 1.5, bottomM: 6.0, color: '#b45309', lithology: 'Porous sand and fluvial gravel lenses', k: '12.0 m/day', resistivity: '65-110 Ω·m' },
    { name: 'Weathered Saprolite Transition Zone', topM: 6.0, bottomM: 22.0, color: '#d97706', lithology: 'Completely to highly weathered granitic gneiss', k: '4.8 m/day', resistivity: '35-70 Ω·m (Saturated)' },
    { name: 'Fissured & Fractured Crystalline Aquifer', topM: 22.0, bottomM: 65.0, color: '#0369a1', lithology: 'Sub-vertical fracture networks & quartz veins', k: '2.4 m/day', resistivity: '40-90 Ω·m (High Yield)' },
    { name: 'Massive Impermeable Granitic Basement', topM: 65.0, bottomM: 120.0, color: '#334155', lithology: 'Competent Charnockite / Granite Bedrock', k: '0.001 m/day', resistivity: '> 850 Ω·m (Dry Bedrock)' }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>3D Subsurface & Aquifer Digital Twin Cross-Section</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Hydro-Stratigraphy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Coupled Electrical Resistivity Tomography (ERT), lithological borehole logs, and dynamic piezometric water table.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Layer Visibility Controls */}
          <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Toggles:</span>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-200">
              <input 
                type="checkbox" 
                checked={showWaterTable} 
                onChange={(e) => setShowWaterTable(e.target.checked)} 
                className="rounded accent-cyan-400"
              />
              <span>Water Table ({waterLevelMbgl} mbgl)</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-200">
              <input 
                type="checkbox" 
                checked={showErtOverlay} 
                onChange={(e) => setShowErtOverlay(e.target.checked)} 
                className="rounded accent-purple-400"
              />
              <span>ERT Resistivity Section</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-200">
              <input 
                type="checkbox" 
                checked={showBoreholeLogs} 
                onChange={(e) => setShowBoreholeLogs(e.target.checked)} 
                className="rounded accent-emerald-400"
              />
              <span>Borehole Logs</span>
            </label>
          </div>

          {/* Subsurface Stratigraphic Visualizer Canvas */}
          <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-hidden shadow-inner min-h-[360px] flex flex-col justify-between">
            {/* Ground Surface Label */}
            <div className="flex items-center justify-between border-b-2 border-amber-600/80 pb-1 z-10">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                <span>▲ Ground Surface (0.0 m MSL Datum: 150m)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Palar River Basin Survey Profile ERT-01</span>
            </div>

            {/* Stratigraphic Blocks */}
            <div className="relative flex-1 my-2 space-y-1">
              {strata.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-2.5 transition relative overflow-hidden flex items-center justify-between border border-white/5"
                  style={{
                    backgroundColor: `${s.color}35`,
                    borderLeft: `5px solid ${s.color}`,
                    minHeight: `${Math.max(45, (s.bottomM - s.topM) * 3.5)}px`
                  }}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({s.topM}m – {s.bottomM}m depth)</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">{s.lithology}</div>
                  </div>

                  <div className="text-right text-[10px] font-mono">
                    <div className="text-cyan-300">K = {s.k}</div>
                    {showErtOverlay && (
                      <div className="text-purple-300 font-semibold">Resistivity: {s.resistivity}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Dynamic Water Table Plane Line */}
              {showWaterTable && (
                <div 
                  className="absolute left-0 right-0 z-20 border-t-2 border-cyan-400 border-dashed bg-cyan-500/20 backdrop-blur-[1px] py-1 px-3 flex items-center justify-between shadow-lg"
                  style={{ top: `${Math.min(90, Math.max(10, waterLevelMbgl * 4.5))}%` }}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-extrabold text-cyan-200">
                    <Droplets className="w-4 h-4 text-cyan-300 animate-bounce" />
                    <span>Dynamic Piezometric Water Table: {waterLevelMbgl} mbgl</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-200 font-bold">
                    Head: {(150 - waterLevelMbgl).toFixed(1)}m MSL
                  </span>
                </div>
              )}
            </div>

            {/* Bedrock Floor */}
            <div className="flex items-center justify-between border-t-2 border-slate-700 pt-1 text-[10px] text-slate-500 font-mono">
              <span>▼ Deep Crystalline Basement (&gt; 120m MSL)</span>
              <span>Regional Hard-Rock Hydrogeology Model</span>
            </div>
          </div>

          {/* ERT & Geophysical Summary */}
          <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl text-xs space-y-1">
            <div className="font-bold text-purple-300">ERT Survey Integration Notes:</div>
            <p className="text-slate-300 text-[11px]">
              Schlumberger array profile reveals low resistivity anomaly (35–70 Ω·m) between 6.0m and 22.0m depth, corresponding to saturated saprolite with high potential for horizontal infiltration and recharge shaft placement.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Subsurface 3D
          </button>
        </div>
      </div>
    </div>
  );
};
