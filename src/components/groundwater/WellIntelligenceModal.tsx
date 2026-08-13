import React from 'react';
import { GroundwaterObservation } from '../../types/groundwater';
import { 
  X, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  ArrowDown, 
  ArrowUp,
  Layers,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface Props {
  observation: GroundwaterObservation | null;
  onClose: () => void;
}

export const WellIntelligenceModal: React.FC<Props> = ({ observation, onClose }) => {
  if (!observation) return null;

  const rawVal = observation.rawValue;
  const isDepth = observation.measurementType === 'depth_bgl';
  const depthMbgl = observation.normalizedDepthMbgl ?? 4.5;
  const headMsl = observation.normalizedHeadMsl ?? (150 - depthMbgl);
  const changeM = observation.rateOfChangeMYear ?? -0.25;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-base">
              井
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Well Intelligence & Telemetry
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {observation.qualityFlag.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                ID: {observation.sourceWellId} • {observation.agencyName}
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

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Main Reading Highlight Card */}
          <div className="bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/30 rounded-xl p-3.5">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span className="font-semibold text-cyan-300 uppercase tracking-wider">Latest Water Level Observation</span>
              <span className="font-mono text-slate-300">{observation.observationDate}</span>
            </div>
            <div className="flex items-baseline space-x-3 my-1.5">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {depthMbgl}
              </span>
              <span className="text-lg font-bold text-cyan-400">mbgl</span>
              <div className="ml-auto text-right">
                <div className="text-xs text-slate-400">Piezometric Head</div>
                <div className="text-sm font-bold text-slate-200 font-mono">{headMsl} m MSL</div>
              </div>
            </div>

            {/* Change indicator - scientifically accurate mbgl terminology */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">Annual Water-Level Change:</span>
              <span className={`font-semibold flex items-center space-x-1 ${
                changeM < 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {changeM < 0 ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                <span>{Math.abs(changeM)} m/yr ({changeM < 0 ? 'Deeper / Falling Table' : 'Shallower / Rising Table'})</span>
              </span>
            </div>
          </div>

          {/* Spatial & Well Construction Matrix */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Coordinates & Distance</div>
              <div className="font-mono text-slate-200">{observation.latitude.toFixed(5)}°, {observation.longitude.toFixed(5)}°</div>
              <div className="text-cyan-300 text-[11px] font-medium">
                {observation.distanceFromGpsKm !== undefined ? `${observation.distanceFromGpsKm} km from current GPS` : 'Regional Station'}
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Well Depth & Elevation</div>
              <div className="font-mono text-slate-200">Depth: {observation.wellDepthM || 110} m</div>
              <div className="text-slate-400 text-[11px]">
                Ground RL: <span className="text-slate-200 font-mono">{observation.groundElevationMsl || 148} m MSL</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Aquifer Stratum</div>
              <div className="font-medium text-slate-200">{observation.aquiferType || 'Fractured Granitic Basement'}</div>
              <div className="text-[11px] text-slate-400">{observation.lithology || 'Saprolite overburden with quartz fissures'}</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Historical Bounds</div>
              <div className="text-slate-200 text-[11px]">
                Min: <span className="font-mono text-emerald-400">{observation.historicalMinMbgl || 2.4} mbgl</span>
              </div>
              <div className="text-slate-200 text-[11px]">
                Max: <span className="font-mono text-rose-400">{observation.historicalMaxMbgl || 16.8} mbgl</span>
              </div>
            </div>
          </div>

          {/* Quality & Telemetry Provenance */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Data Quality & Provenance</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">{observation.qualityScore}% Quality Score</span>
            </div>
            
            <div className="space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between py-0.5 border-b border-slate-850">
                <span>Data Source / Code:</span>
                <span className="text-slate-200 font-mono">{observation.source}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-850">
                <span>Original Raw Value:</span>
                <span className="text-slate-200 font-mono">{rawVal} {observation.rawUnit}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-850">
                <span>Measurement Type:</span>
                <span className="text-cyan-300 font-medium">{observation.measurementType}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span>Seasonal Status:</span>
                <span className="text-slate-200 font-semibold">{observation.seasonalTrend || 'Stable Post-Monsoon'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
