import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Sliders, Target, CheckCircle2, AlertTriangle, Play, Save } from 'lucide-react';
import { AhpCriteriaKey } from '../types/hydro';
import { computeAHPWeights } from '../utils/ahpCalculator';

const ALL_CRITERIA: { key: AhpCriteriaKey; label: string }[] = [
  { key: 'geology', label: 'Geology & Lithology' },
  { key: 'lineamentDensity', label: 'Lineament Density' },
  { key: 'slope', label: 'Slope Gradient (%)' },
  { key: 'drainageDensity', label: 'Drainage Density' },
  { key: 'rainfall', label: 'Annual Rainfall' },
  { key: 'depthToWater', label: 'Depth to Water Table' },
  { key: 'soil', label: 'Soil Permeability' },
  { key: 'landUse', label: 'Land Use / Land Cover' },
  { key: 'elevation', label: 'Elevation DEM' }
];

export const AhpMcdaPage: React.FC = () => {
  const { ahpAnalyses, addAhpAnalysis, addGwpzResult, activeProjectId, activeStudyAreaId } = useHydroStore();

  const [analysisName, setAnalysisName] = useState('Palar Watershed MCDA AHP Model (2026)');
  const [selectedCriteria, setSelectedCriteria] = useState<AhpCriteriaKey[]>([
    'geology',
    'lineamentDensity',
    'slope',
    'drainageDensity',
    'rainfall',
    'depthToWater',
    'soil',
    'landUse',
    'elevation'
  ]);

  // Pairwise Matrix State
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({
    geology: { lineamentDensity: 1.5, slope: 2.0, drainageDensity: 2.5, rainfall: 3.0, depthToWater: 3.0, soil: 4.0, landUse: 5.0, elevation: 6.0 },
    lineamentDensity: { slope: 1.5, drainageDensity: 2.0, rainfall: 2.5, depthToWater: 2.5, soil: 3.5, landUse: 4.0, elevation: 5.0 },
    slope: { drainageDensity: 1.5, rainfall: 2.0, depthToWater: 2.0, soil: 3.0, landUse: 3.5, elevation: 4.5 }
  });

  const ahpResult = computeAHPWeights(selectedCriteria, matrix);

  const handleUpdatePairwise = (row: string, col: string, value: number) => {
    setMatrix(prev => ({
      ...prev,
      [row]: {
        ...(prev[row] || {}),
        [col]: value
      }
    }));
  };

  const handleSaveAhpRun = () => {
    addAhpAnalysis({
      projectId: activeProjectId,
      name: analysisName,
      criteria: selectedCriteria,
      pairwiseMatrix: matrix,
      weights: ahpResult.weights,
      consistencyIndex: ahpResult.consistencyIndex,
      consistencyRatio: ahpResult.consistencyRatio,
      isConsistent: ahpResult.isConsistent,
      classDistributionPercent: {
        VeryHigh: 18.5,
        High: 32.1,
        Moderate: 28.4,
        Low: 14.8,
        VeryLow: 6.2
      },
      createdBy: 'Dr. Aris Thorne'
    });

    addGwpzResult({
      projectId: activeProjectId,
      studyAreaId: activeStudyAreaId,
      title: `${analysisName} Zone Layer`,
      method: 'AHP',
      modelOrAhpId: `ahp-${Date.now()}`,
      totalAreaKm2: 384.6,
      zones: [
        { class: 'Very High', areaKm2: 71.1, percentage: 18.5, color: '#059669' },
        { class: 'High', areaKm2: 123.5, percentage: 32.1, color: '#10b981' },
        { class: 'Moderate', areaKm2: 109.2, percentage: 28.4, color: '#f59e0b' },
        { class: 'Low', areaKm2: 56.9, percentage: 14.8, color: '#f97316' },
        { class: 'Very Low', areaKm2: 23.9, percentage: 6.2, color: '#ef4444' }
      ],
      parametersUsed: selectedCriteria
    });
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase font-bold">
            <Sliders className="w-4 h-4" />
            <span>Module 15: Analytic Hierarchy Process (AHP - MCDA)</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Multi-Criteria Decision Analysis Weight Solver</h1>
          <p className="text-xs text-slate-400">Configure pairwise importance intensity scales (Saaty 1-9), compute priority weights, and verify Consistency Ratio (CR ≤ 0.10).</p>
        </div>

        <button
          onClick={handleSaveAhpRun}
          disabled={!ahpResult.isConsistent}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95 text-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Analysis Run & GWPZ Overlay</span>
        </button>
      </div>

      {/* Consistency Validation Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between font-mono text-xs ${
          ahpResult.isConsistent
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            : 'bg-amber-950/60 border-amber-800 text-amber-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          {ahpResult.isConsistent ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          )}
          <div>
            <div className="font-bold text-sm">
              {ahpResult.isConsistent ? 'AHP Matrix is Mathematically Consistent' : 'Consistency Ratio Exceeds Threshold (CR > 0.10)'}
            </div>
            <p className="text-[11px] opacity-90">
              Consistency Index (CI) = {ahpResult.consistencyIndex} | Consistency Ratio (CR) = <strong className="text-white">{ahpResult.consistencyRatio}</strong> {ahpResult.isConsistent ? '(≤ 0.10 Valid)' : '(Please adjust pairwise scale values)'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase opacity-70">Lambda Max (λmax)</div>
          <div className="font-extrabold text-base">{ahpResult.lambdaMax}</div>
        </div>
      </div>

      {/* Weights Bar Chart Output */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Computed Normalized Criteria Weights</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {selectedCriteria.map((cKey) => {
            const weight = ahpResult.weights[cKey] || 0;
            const item = ALL_CRITERIA.find(c => c.key === cKey);
            return (
              <div key={cKey} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/60 text-center space-y-1">
                <div className="text-[10px] text-slate-400 font-bold truncate">{item?.label}</div>
                <div className="text-lg font-black text-emerald-400 font-mono">{(weight * 100).toFixed(1)}%</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${weight * 100}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Pairwise Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
        <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Saaty 1-9 Pairwise Comparison Matrix</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 text-slate-400">
                <th className="p-2 text-left">Criteria</th>
                {selectedCriteria.map(c => (
                  <th key={c} className="p-2 truncate max-w-[90px]">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {selectedCriteria.map((rowKey) => (
                <tr key={rowKey} className="hover:bg-slate-800/50">
                  <td className="p-2 font-bold text-left text-slate-200">{rowKey}</td>
                  {selectedCriteria.map((colKey) => {
                    if (rowKey === colKey) {
                      return <td key={colKey} className="p-2 bg-slate-800 font-bold text-slate-500">1.00</td>;
                    }
                    const val = matrix[rowKey]?.[colKey] || 1;
                    return (
                      <td key={colKey} className="p-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          max="9"
                          value={val}
                          onChange={(e) => handleUpdatePairwise(rowKey, colKey, parseFloat(e.target.value) || 1)}
                          className="w-16 bg-slate-800 border border-slate-700 rounded p-1 text-center text-cyan-300 font-bold"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
