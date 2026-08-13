import React from 'react';
import { WatershedMetrics, watershedEngine } from '../../services/groundwater/watershedEngine';
import { X, Compass, Activity, Droplets, MapPin, ArrowDownRight, ShieldCheck } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  onClose: () => void;
}

export const WatershedModal: React.FC<Props> = ({ lat, lng, onClose }) => {
  const watershed: WatershedMetrics = watershedEngine.analyzeWatershedAtGps(lat, lng);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-teal-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Watershed Catchment Intelligence</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Order {watershed.streamOrder}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Topographical drainage basin boundaries, runoff routing, and recharge dynamics.
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
          {/* Main Watershed Overview Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-300 font-bold uppercase tracking-wider">{watershed.watershedName}</span>
              <span className="text-slate-400 font-mono">{watershed.subCatchmentId}</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white font-mono">{watershed.catchmentAreaKm2}</span>
              <span className="text-sm font-semibold text-teal-400">km² Catchment Area</span>
            </div>
            <p className="text-xs text-slate-400">{watershed.flowDirection}</p>
          </div>

          {/* Morphometric Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Drainage Density</div>
              <div className="font-mono text-cyan-300 text-sm font-bold">{watershed.drainageDensityKmKm2} km/km²</div>
              <div className="text-[11px] text-slate-400">Moderate stream channel frequency promoting natural infiltration.</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Annual Surface Runoff</div>
              <div className="font-mono text-emerald-400 text-sm font-bold">{watershed.estimatedAnnualRunoffMillionM3} M m³</div>
              <div className="text-[11px] text-slate-400">Available surplus surface runoff harvestable through MAR structures.</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Hypsometric Integral (HI)</div>
              <div className="font-mono text-slate-200 text-sm font-bold">{watershed.hypsometricIntegral}</div>
              <div className="text-[11px] text-slate-400">Mature geomorphic stage with gentle peneplain topography.</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Time of Concentration (Tc)</div>
              <div className="font-mono text-amber-300 text-sm font-bold">{watershed.timeOfConcentrationHours} Hours</div>
              <div className="text-[11px] text-slate-400">Peak flood runoff transit time to main catchment outlet.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Watershed
          </button>
        </div>
      </div>
    </div>
  );
};
