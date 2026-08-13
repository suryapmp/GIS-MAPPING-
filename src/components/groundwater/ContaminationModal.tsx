import React from 'react';
import { VulnerabilityAssessment, contaminationVulnerabilityEngine } from '../../services/groundwater/contaminationVulnerabilityEngine';
import { X, ShieldAlert, AlertTriangle, ShieldCheck, Factory, Fuel, Trash2 } from 'lucide-react';

interface Props {
  depthMbgl: number;
  onClose: () => void;
}

export const ContaminationModal: React.FC<Props> = ({ depthMbgl, onClose }) => {
  const assessment: VulnerabilityAssessment = contaminationVulnerabilityEngine.evaluateVulnerability(depthMbgl);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-orange-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>DRASTIC Aquifer Vulnerability & Pollution Index</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  DRASTIC: {assessment.drasticIndex}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Standard EPA/USGS hydrogeological pollution vulnerability indexing and hazard proximity mapping.
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
          {/* Main DRASTIC Score */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">DRASTIC Pollution Risk Classification</div>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-extrabold font-mono" style={{ color: assessment.color }}>
                  {assessment.drasticIndex}
                </span>
                <span className="text-xs text-slate-400 font-medium">Index Score (Scale 65 - 220)</span>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold ml-2 uppercase"
                  style={{ backgroundColor: `${assessment.color}25`, color: assessment.color, border: `1px solid ${assessment.color}50` }}
                >
                  {assessment.vulnerabilityClass} Vulnerability
                </span>
              </div>
            </div>
          </div>

          {/* DRASTIC Breakdown Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              DRASTIC Seven-Factor Parameter Weights
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {assessment.parameters.map((p) => (
                <div key={p.code} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-850 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">{p.parameter}</span>
                    <span className="font-mono text-cyan-300 font-bold">W={p.weight} × R={p.rating} = {p.weightedScore}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{p.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Potential Hazards */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-orange-300 uppercase tracking-wider">
              Surrounding Potential Contamination Sources
            </div>

            <div className="space-y-1.5 text-xs">
              {assessment.proximityHazards.map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
                  <div className="flex items-center space-x-2">
                    {h.type === 'Industrial' ? <Factory className="w-4 h-4 text-orange-400" /> :
                     h.type === 'Fuel Station' ? <Fuel className="w-4 h-4 text-amber-400" /> :
                     h.type === 'Landfill' ? <Trash2 className="w-4 h-4 text-rose-400" /> :
                     <ShieldAlert className="w-4 h-4 text-yellow-400" />}
                    <div>
                      <span className="font-medium text-slate-200">{h.name}</span>
                      <span className="text-slate-500 text-[10px] block">Source: {h.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-cyan-300 font-bold">{h.distanceM} m</span>
                    <span className={`text-[10px] block font-semibold ${
                      h.riskLevel === 'High' ? 'text-rose-400' :
                      h.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {h.riskLevel} Hazard Buffer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mitigation Protocol */}
          <div className="bg-orange-950/20 border border-orange-500/30 p-3 rounded-xl text-xs space-y-1">
            <div className="font-bold text-orange-300">Sanitary Aquifer Protection Protocol:</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{assessment.mitigationProtocol}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Vulnerability Panel
          </button>
        </div>
      </div>
    </div>
  );
};
