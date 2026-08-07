import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Cpu, Play, Activity, CheckCircle2, Sliders, BarChart2 } from 'lucide-react';
import { MlAlgorithm } from '../types/hydro';
import { runMlTrainingSimulation } from '../utils/mlEngine';

export const MachineLearningPage: React.FC = () => {
  const { mlModelRuns, addMlModelRun, activeProjectId } = useHydroStore();

  const [modelName, setModelName] = useState('XGBoost Groundwater Yield Classifier');
  const [algorithm, setAlgorithm] = useState<MlAlgorithm>('XGBoost');
  const [trainRatio, setTrainRatio] = useState<number>(0.75);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Lineament Density',
    'Slope',
    'Distance to Stream',
    'Drainage Density',
    'Rainfall',
    'Soil Permeability',
    'Elevation'
  ]);

  const [activeModel, setActiveModel] = useState(mlModelRuns[0]);

  const handleRunTraining = () => {
    const newRun = runMlTrainingSimulation(
      activeProjectId,
      modelName,
      algorithm,
      selectedFeatures,
      'High vs Low Groundwater Potential',
      trainRatio
    );

    addMlModelRun(newRun);
    setActiveModel(newRun);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Cpu className="w-4 h-4" />
            <span>Module 16: Machine Learning Groundwater Modeling</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Supervised ML Classifiers (XGBoost, Random Forest, SVM)</h1>
          <p className="text-xs text-slate-400">Train geospatial machine learning classifiers, evaluate ROC-AUC, confusion matrices, and feature importance.</p>
        </div>

        <button
          onClick={handleRunTraining}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95 text-xs"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Train ML Model</span>
        </button>
      </div>

      {/* Model Parameters & Feature Selection Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Training Configuration</h3>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">ML Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as MlAlgorithm)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-bold text-cyan-300"
            >
              <option value="XGBoost">XGBoost Gradient Boosting</option>
              <option value="Random Forest">Random Forest Classifier</option>
              <option value="SVM">Support Vector Machine (SVM)</option>
              <option value="Ensemble Classifier">Ensemble Voting Classifier</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Train / Test Split Ratio</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0.50"
                max="0.85"
                step="0.05"
                value={trainRatio}
                onChange={(e) => setTrainRatio(parseFloat(e.target.value))}
                className="flex-1 accent-cyan-500"
              />
              <span className="font-mono text-cyan-300 font-bold">{Math.round(trainRatio * 100)}% Train</span>
            </div>
          </div>
        </div>

        {/* Model Results Dashboard */}
        {activeModel && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <h3 className="font-bold text-slate-100 text-sm">{activeModel.modelName}</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Algorithm: {activeModel.algorithm} | Train: {activeModel.trainingSamplesCount} samples | Test: {activeModel.testSamplesCount} samples
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-1 rounded">
                ROC-AUC: {activeModel.metrics.rocAuc}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Accuracy</div>
                <div className="text-xl font-extrabold text-cyan-400">{(activeModel.metrics.accuracy * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Precision</div>
                <div className="text-xl font-extrabold text-indigo-400">{(activeModel.metrics.precision * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Recall</div>
                <div className="text-xl font-extrabold text-emerald-400">{(activeModel.metrics.recall * 100).toFixed(1)}%</div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-mono">F1 Score</div>
                <div className="text-xl font-extrabold text-purple-400">{activeModel.metrics.f1Score}</div>
              </div>
            </div>

            {/* Feature Importance Bar Chart */}
            <div className="space-y-2 pt-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase font-mono">Feature Importance Ranking</h4>
              <div className="space-y-1.5">
                {Object.entries(activeModel.featureImportance).map(([feat, score]) => {
                  const numScore = score as number;
                  return (
                    <div key={feat} className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 font-semibold">{feat}</span>
                        <span className="text-cyan-400 font-bold">{(numScore * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-600 to-indigo-500 h-full" style={{ width: `${numScore * 100}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
