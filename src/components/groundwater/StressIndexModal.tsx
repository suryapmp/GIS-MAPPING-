import React, { useState } from 'react';
import { StressIndexResult, StressIndexWeights } from '../../types/groundwater';
import { groundwaterIntelligenceService } from '../../services/groundwater/groundwaterIntelligenceService';
import { X, Activity, Sliders, ShieldCheck, AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  currentDepthMbgl: number;
  onClose: () => void;
}

export const StressIndexModal: React.FC<Props> = ({ currentDepthMbgl, onClose }) => {
  const [weights, setWeights] = useState<StressIndexWeights>({
    groundwaterLevel: 0.25,
    longTermTrend: 0.20,
    seasonalAnomaly: 0.15,
    rainfallDeficit: 0.15,
    aquiferVulnerability: 0.10,
    rechargePotential: 0.05,
    extractionPressure: 0.10
  });

  const [rainfallDeficit, setRainfallDeficit] = useState<number>(14);

  const stressResult: StressIndexResult = groundwaterIntelligenceService.calculateStressIndex(
    currentDepthMbgl,
    rainfallDeficit,
    weights
  );

  const handleWeightChange = (key: keyof StressIndexWeights, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetWeights = () => {
    setWeights({
      groundwaterLevel: 0.25,
      longTermTrend: 0.20,
      seasonalAnomaly: 0.15,
      rainfallDeficit: 0.15,
      aquiferVulnerability: 0.10,
      rechargePotential: 0.05,
      extractionPressure: 0.10
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Groundwater Stress & Aquifer Risk Index</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AHP / MCDA
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Multi-parametric composite vulnerability and depletion pressure scoring.
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
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Main Score Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Composite Aquifer Risk Score</div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-4xl font-extrabold font-mono" style={{ color: stressResult.color }}>
                  {stressResult.score}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold ml-2 uppercase"
                  style={{ backgroundColor: `${stressResult.color}25`, color: stressResult.color, border: `1px solid ${stressResult.color}50` }}
                >
                  {stressResult.status}
                </span>
              </div>
            </div>

            <button
              onClick={handleResetWeights}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Weights</span>
            </button>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Normalized Parameter Contributions & Weights
            </div>

            <div className="space-y-2 text-xs">
              {stressResult.factors.map((f, i) => (
                <div key={i} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-850 space-y-1.5">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-slate-200">{f.name}</span>
                    <span className="text-amber-400 font-mono font-bold">
                      Score: {f.rawScore} (Weighted: +{f.weightedScore})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{f.description}</div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${f.rawScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl space-y-1.5 text-xs">
            <div className="font-bold text-amber-300 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Decision Support & Mitigation Directives</span>
            </div>
            <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
              {stressResult.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Stress Panel
          </button>
        </div>
      </div>
    </div>
  );
};
