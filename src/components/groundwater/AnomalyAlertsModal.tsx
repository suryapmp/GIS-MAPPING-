import React from 'react';
import { GroundwaterAnomaly } from '../../types/groundwater';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, MapPin, Eye } from 'lucide-react';

interface Props {
  anomalies: GroundwaterAnomaly[];
  onClose: () => void;
}

export const AnomalyAlertsModal: React.FC<Props> = ({ anomalies, onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-rose-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Automated Groundwater Anomaly Detection</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {anomalies.length} Flagged Events
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Piezometric outlier detection, sudden drawdown, and sensor telemetry validation.
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
        <div className="p-5 space-y-3 overflow-y-auto">
          {anomalies.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-white">No Critical Groundwater Anomalies Detected</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                All monitoring piezometers within the active spatial search radius are operating within standard seasonal hydrogeological parameters.
              </p>
            </div>
          ) : (
            anomalies.map((anom) => (
              <div
                key={anom.id}
                className="bg-slate-950 border border-rose-500/30 rounded-xl p-4 space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {anom.severity} SEVERITY
                    </span>
                    <span className="font-bold text-white text-sm">{anom.anomalyType}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{anom.observationDate}</span>
                </div>

                <div className="text-xs text-slate-300">
                  Station: <strong className="text-cyan-300 font-mono">{anom.wellId}</strong> • {anom.wellName}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Observed Value / Deviation:</span>
                    <span className="font-mono font-bold text-rose-400">{anom.observedChangeM} m</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Expected Seasonal Baseline:</span>
                    <span className="font-mono text-slate-300">{anom.expectedRangeM}</span>
                  </div>
                </div>

                <div className="text-[11px] text-amber-300/90 bg-amber-950/20 p-2 rounded border border-amber-500/20">
                  <strong>Hydrogeological Recommendation:</strong> {anom.recommendedAction}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Anomaly Panel
          </button>
        </div>
      </div>
    </div>
  );
};
