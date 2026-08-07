import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Zap, Plus, Layers, Activity } from 'lucide-react';

export const ErtModulePage: React.FC = () => {
  const { ertSurveys, ertDataPoints, addErtSurvey, activeProjectId } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [profileName, setProfileName] = useState('');
  const [electrodeSpacingM, setElectrodeSpacingM] = useState<number>(5.0);
  const [electrodeCount, setElectrodeCount] = useState<number>(48);
  const [arrayMethod, setArrayMethod] = useState<'Wenner' | 'Schlumberger' | 'Dipole-Dipole'>('Wenner');
  const [notes, setNotes] = useState('');

  const activeSurvey = ertSurveys[0];
  const activePoints = ertDataPoints.filter(p => p.surveyId === activeSurvey?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName) return;

    addErtSurvey({
      projectId: activeProjectId,
      profileName,
      latStart: 12.850,
      lngStart: 79.010,
      latEnd: 12.852,
      lngEnd: 79.030,
      electrodeSpacingM: Number(electrodeSpacingM),
      electrodeCount: Number(electrodeCount),
      arrayMethod,
      surveyDate: new Date().toISOString().split('T')[0],
      notes
    });

    setProfileName('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase font-bold">
            <Zap className="w-4 h-4" />
            <span>Module 13: Electrical Resistivity Tomography (ERT)</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Geophysical ERT Pseudo-Section Inversion</h1>
          <p className="text-xs text-slate-400">Map overburden saprolite resistivity, fractured water-bearing zones, and bedrock depth.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add ERT Profile</span>
        </button>
      </div>

      {/* 2D Pseudo-Section Inversion Visualization */}
      {activeSurvey && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">{activeSurvey.profileName}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Method: {activeSurvey.arrayMethod} Array | Spacing: {activeSurvey.electrodeSpacingM}m | Electrodes: {activeSurvey.electrodeCount}
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950 border border-purple-800 px-2.5 py-1 rounded">
              Profile Length: {activeSurvey.electrodeSpacingM * (activeSurvey.electrodeCount - 1)} meters
            </span>
          </div>

          {/* 2D Depth Section Simulation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-[11px] font-bold uppercase font-mono text-slate-400">2D Apparent Resistivity Pseudo-Section (Ω·m)</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {activePoints.map((pt) => {
                let colorClass = 'bg-cyan-900 border-cyan-500 text-cyan-200';
                if (pt.resistivityOhmM < 30) colorClass = 'bg-blue-900 border-blue-400 text-blue-200'; // Water bearing
                else if (pt.resistivityOhmM < 100) colorClass = 'bg-emerald-900 border-emerald-400 text-emerald-200'; // Saturated Saprolite
                else if (pt.resistivityOhmM > 300) colorClass = 'bg-rose-950 border-rose-600 text-rose-200'; // Massive Bedrock

                return (
                  <div key={pt.id} className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${colorClass}`}>
                    <div className="flex justify-between text-[10px] opacity-80">
                      <span>Dist: {pt.distanceM}m</span>
                      <span>Depth: {pt.depthM}m</span>
                    </div>
                    <div className="text-base font-extrabold">{pt.resistivityOhmM} Ω·m</div>
                    <div className="text-[10px] font-sans font-bold border-t border-slate-700/50 pt-1 mt-1 truncate">
                      {pt.interpretedLithology}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Color Legend */}
            <div className="flex items-center justify-center space-x-6 pt-3 text-[11px] font-mono border-t border-slate-900">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-blue-600 rounded"></span>
                <span>&lt;30 Ω·m (Saturated Fractured Zone)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-emerald-600 rounded"></span>
                <span>30-100 Ω·m (Weathered Saprolite)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-3 bg-rose-600 rounded"></span>
                <span>&gt;300 Ω·m (Unweathered Bedrock)</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ERT Profiles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ertSurveys.map((survey) => (
          <div key={survey.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <h3 className="font-bold text-slate-100 text-sm">{survey.profileName}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <p><strong>Array Method:</strong> {survey.arrayMethod}</p>
              <p><strong>Spacing:</strong> {survey.electrodeSpacingM} m</p>
              <p><strong>Electrodes:</strong> {survey.electrodeCount}</p>
              <p><strong>Date:</strong> {survey.surveyDate}</p>
            </div>
            <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
              {survey.notes}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Add ERT Profile Survey</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Profile Name *</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g., ERT Profile Line 2 (Palar-West)"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Array Method</label>
                  <select
                    value={arrayMethod}
                    onChange={(e) => setArrayMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Wenner">Wenner</option>
                    <option value="Schlumberger">Schlumberger</option>
                    <option value="Dipole-Dipole">Dipole-Dipole</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Spacing (m)</label>
                  <input
                    type="number"
                    value={electrodeSpacingM}
                    onChange={(e) => setElectrodeSpacingM(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Electrodes</label>
                  <input
                    type="number"
                    value={electrodeCount}
                    onChange={(e) => setElectrodeCount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Survey Notes & Geophysics Objectives</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe electrode array setup and targeted depth section..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold">
                  Save ERT Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
