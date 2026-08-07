import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { MapPin, Plus, Compass, Mountain, CloudRain, CheckCircle2 } from 'lucide-react';

export const StudyAreasPage: React.FC = () => {
  const { studyAreas, activeProjectId, activeStudyAreaId, setActiveStudyArea, addStudyArea, projects } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [areaSqKm, setAreaSqKm] = useState<number>(250);
  const [perimeterKm, setPerimeterKm] = useState<number>(60);
  const [averageSlope, setAverageSlope] = useState<number>(8.5);
  const [annualRainfall, setAnnualRainfall] = useState<number>(920);
  const [geologyOverview, setGeologyOverview] = useState('');

  const currentProjectStudyAreas = studyAreas.filter(s => s.projectId === activeProjectId);
  const activeProj = projects.find(p => p.id === activeProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    addStudyArea({
      projectId: activeProjectId,
      name,
      code,
      areaSqKm: Number(areaSqKm),
      perimeterKm: Number(perimeterKm),
      averageSlopePercent: Number(averageSlope),
      annualRainfallMm: Number(annualRainfall),
      geologyOverview,
      bounds: [12.75, 78.90, 12.95, 79.15],
      centroid: [12.85, 79.025]
    });

    setName('');
    setCode('');
    setGeologyOverview('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase font-bold">
            <MapPin className="w-4 h-4" />
            <span>Module 3: Study Areas & Watersheds</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Watershed Sub-Basins & Study Zones</h1>
          <p className="text-xs text-slate-400">
            Current Project: <span className="text-cyan-400 font-bold">{activeProj?.name || 'Active Project'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Watershed Sub-Basin</span>
        </button>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentProjectStudyAreas.map((sa) => {
          const isSelected = sa.id === activeStudyAreaId;
          return (
            <div
              key={sa.id}
              className={`bg-slate-900 border p-5 rounded-xl transition-all relative ${
                isSelected
                  ? 'border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Selected Focus Sub-Basin</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-slate-800 text-emerald-300 font-mono text-xs font-bold px-2.5 py-0.5 rounded border border-slate-700">
                    {sa.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">{sa.name}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-xs text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Area</div>
                    <div className="font-bold text-emerald-400">{sa.areaSqKm} km²</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Perimeter</div>
                    <div className="font-bold text-cyan-400">{sa.perimeterKm} km</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Avg Slope</div>
                    <div className="font-bold text-amber-400">{sa.averageSlopePercent}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Rainfall</div>
                    <div className="font-bold text-blue-400">{sa.annualRainfallMm} mm/yr</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">Geology & Aquifer Overburden</h4>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                    {sa.geologyOverview}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Centroid: [{sa.centroid[0].toFixed(3)}, {sa.centroid[1].toFixed(3)}]
                  </span>

                  {!isSelected ? (
                    <button
                      onClick={() => setActiveStudyArea(sa.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Select Watershed
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 italic">Active Focus</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Add Watershed Sub-Basin</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Watershed Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Bhavani Pediment Sub-Basin"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Sub-Basin Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g., BSB-02"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Area (km²)</label>
                  <input
                    type="number"
                    value={areaSqKm}
                    onChange={(e) => setAreaSqKm(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Perimeter (km)</label>
                  <input
                    type="number"
                    value={perimeterKm}
                    onChange={(e) => setPerimeterKm(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Avg Slope (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={averageSlope}
                    onChange={(e) => setAverageSlope(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rainfall (mm/yr)</label>
                  <input
                    type="number"
                    value={annualRainfall}
                    onChange={(e) => setAnnualRainfall(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Geology & Lithology Overview</label>
                <textarea
                  rows={3}
                  value={geologyOverview}
                  onChange={(e) => setGeologyOverview(e.target.value)}
                  placeholder="Describe saprolite thickness, fractured basement rock, joints, and lineaments..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold"
                >
                  Save Watershed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
