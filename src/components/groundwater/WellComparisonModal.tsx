import React, { useState } from 'react';
import { GroundwaterObservation } from '../../types/groundwater';
import { X, ArrowUpDown, Check, Layers, BarChart2 } from 'lucide-react';

interface Props {
  observations: GroundwaterObservation[];
  onClose: () => void;
}

export const WellComparisonModal: React.FC<Props> = ({ observations, onClose }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    observations.slice(0, 3).map((o) => o.sourceWellId)
  );

  const toggleWell = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((i) => i !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedWells = observations.filter((o) => selectedIds.includes(o.sourceWellId));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Multi-Well Comparative Hydrogeology Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Side-by-side telemetry comparison, drawdown trends, and lithological characteristics.
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
          {/* Well Selection Badges */}
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Select Wells (Max 4):</span>
            {observations.map((o) => {
              const isSelected = selectedIds.includes(o.sourceWellId);
              return (
                <button
                  key={o.sourceWellId}
                  onClick={() => toggleWell(o.sourceWellId)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                  <span>{o.sourceWellId}</span>
                </button>
              );
            })}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="p-3 border-b border-slate-800">Hydrogeological Attribute</th>
                  {selectedWells.map((w) => (
                    <th key={w.sourceWellId} className="p-3 border-b border-slate-800 text-cyan-300 font-mono">
                      {w.sourceWellId}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300 text-[11px]">
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Monitoring Agency</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className="p-3 font-medium text-white">{w.agencyName}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Latest Water Level</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className="p-3 font-mono font-bold text-cyan-300 text-sm">
                      {w.normalizedDepthMbgl} mbgl
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Piezometric Head</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className="p-3 font-mono text-emerald-400">
                      {w.normalizedHeadMsl} m MSL
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Annual Rate of Change</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className={`p-3 font-mono ${
                      (w.rateOfChangeMYear ?? 0) < 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'
                    }`}>
                      {w.rateOfChangeMYear} m/yr
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Total Well Depth</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className="p-3 font-mono">{w.wellDepthM || 100} m</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Aquifer & Lithology</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className="p-3 text-slate-200">
                      <div className="font-medium">{w.aquiferType}</div>
                      <div className="text-[10px] text-slate-400">{w.lithology}</div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-400">Quality Score</td>
                  {selectedWells.map((w) => (
                    <td key={w.sourceWellId} className="p-3 font-mono text-emerald-400 font-bold">
                      {w.qualityScore}%
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
