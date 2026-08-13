import React from 'react';
import { RainfallRechargeAnalysis } from '../../types/groundwater';
import { rainfallRechargeEngine } from '../../services/groundwater/rainfallRechargeEngine';
import { X, CloudRain, Droplets, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  onClose: () => void;
}

export const RainfallRechargeModal: React.FC<Props> = ({ lat, lng, onClose }) => {
  const analysis: RainfallRechargeAnalysis = rainfallRechargeEngine.analyzeRecharge(lat, lng);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-blue-500/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Rainfall → Recharge Response Engine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SPI: {analysis.spiScore}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Hydrological precipitation routing, infiltration dynamics, and aquifer recharge lag.
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
          {/* Hydrological Pathway Pipeline */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">
              Hydrological Infiltration Continuum
            </div>

            <div className="grid grid-cols-4 gap-1 items-center text-center text-xs">
              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Precipitation</div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{analysis.annualCumulativeRainfallMm} mm</div>
                <div className="text-[9px] text-amber-400">{analysis.rainfallAnomalyPct}% Anomaly</div>
              </div>

              <div className="flex justify-center text-slate-600">➔</div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Infiltration</div>
                <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">{analysis.estimatedInfiltrationRateMmHr} mm/h</div>
                <div className="text-[9px] text-slate-400">Sandy Loam</div>
              </div>

              <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Net Recharge</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{(analysis.estimatedRechargeVolumeM3 / 1000000).toFixed(2)} M m³</div>
                <div className="text-[9px] text-emerald-400 font-semibold">{analysis.rechargeCategory}</div>
              </div>
            </div>
          </div>

          {/* Key Lag & Correlation Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Aquifer Response Lag</div>
              <div className="text-lg font-bold text-amber-400 font-mono">~{analysis.responseLagDays} Days</div>
              <div className="text-[11px] text-slate-400">Time required for surface meteoric pulses to penetrate the saprolite zone.</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Rain-Piezometer Correlation</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">r = {analysis.correlationCoefficient}</div>
              <div className="text-[11px] text-slate-400">Strong linear coupling between rainfall volume and seasonal table recovery.</div>
            </div>
          </div>

          {/* Drought Classification */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Drought & Groundwater Status</div>
              <div className="text-base font-bold text-white mt-0.5">{analysis.droughtCategory}</div>
              <div className="text-xs text-slate-400 mt-0.5">Standardized Precipitation Index (SPI) = {analysis.spiScore}</div>
            </div>
            <div className={`px-3 py-1 rounded-lg font-bold text-xs ${
              analysis.droughtCategory === 'Normal' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              analysis.droughtCategory === 'Watch' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {analysis.droughtCategory.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Rainfall Analysis
          </button>
        </div>
      </div>
    </div>
  );
};
