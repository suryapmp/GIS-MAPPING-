import React from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { CheckCircle2, AlertCircle, Award } from 'lucide-react';

export const ValidationPage: React.FC = () => {
  const { validationRecords, wells } = useHydroStore();

  const matchedCount = validationRecords.filter(v => v.matched).length;
  const matchRate = validationRecords.length > 0 ? (matchedCount / validationRecords.length) * 100 : 100;

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Module 18: Ground-Truth Field Validation</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Groundwater Potential Map Ground-Truth Cross-Validation</h1>
          <p className="text-xs text-slate-400">Validate predicted GWPZ categories against actual well discharge rates (L/s) and pumping drawdown.</p>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Validation Match Accuracy: {matchRate.toFixed(1)}%</span>
        </div>
      </div>

      {/* Validation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs uppercase font-mono text-slate-400">
          Field Well vs Predicted GWPZ Class Validation Matrix
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Well ID</th>
                <th className="p-3">Observed Yield</th>
                <th className="p-3">Observed Yield Class</th>
                <th className="p-3">Predicted GWPZ Zone</th>
                <th className="p-3">Match Status</th>
                <th className="p-3">Confidence Score</th>
                <th className="p-3">Validated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {validationRecords.map((rec) => {
                const wellObj = wells.find(w => w.id === rec.wellId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold font-mono text-blue-400">{wellObj?.wellId || rec.wellId}</td>
                    <td className="p-3 font-bold text-slate-100">{rec.observedYieldLps} L/s</td>
                    <td className="p-3">{rec.observedClass}</td>
                    <td className="p-3 font-semibold text-emerald-400">{rec.predictedClass}</td>
                    <td className="p-3">
                      {rec.matched ? (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          Matched ✓
                        </span>
                      ) : (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          Mismatch ✕
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-cyan-300">{Math.round(rec.yieldMatchScore * 100)}%</td>
                    <td className="p-3 font-mono text-[10px] text-slate-500">{new Date(rec.validatedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
