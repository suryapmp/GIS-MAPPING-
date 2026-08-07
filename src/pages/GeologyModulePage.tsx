import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Mountain, Plus, MapPin, Compass } from 'lucide-react';

export const GeologyModulePage: React.FC = () => {
  const { geologicalObservations, addGeologicalObservation, activeProjectId } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [locationName, setLocationName] = useState('');
  const [rockType, setRockType] = useState<'Granite' | 'Basalt' | 'Gneiss' | 'Sandstone' | 'Limestone' | 'Schist' | 'Alluvium'>('Gneiss');
  const [lithology, setLithology] = useState('');
  const [weatheringGrade, setWeatheringGrade] = useState<'Fresh' | 'Slightly Weathered' | 'Highly Weathered' | 'Completely Weathered'>('Slightly Weathered');
  const [strikeDeg, setStrikeDeg] = useState<number>(45);
  const [dipDeg, setDipDeg] = useState<number>(60);
  const [rqd, setRqd] = useState<number>(75);
  const [outcropDescription, setOutcropDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName) return;

    addGeologicalObservation({
      projectId: activeProjectId,
      locationName,
      lat: 12.865,
      lng: 79.010,
      rockType,
      lithology: lithology || `${rockType} outcrop`,
      weatheringGrade,
      fractureDensity: 'High',
      strikeDeg: Number(strikeDeg),
      dipDeg: Number(dipDeg),
      rockQualityRqd: Number(rqd),
      outcropDescription
    });

    setLocationName('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase font-bold">
            <Mountain className="w-4 h-4" />
            <span>Module 11: Geological Outcrop Survey</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Structural Geology, Lithology & Structural Jointing</h1>
          <p className="text-xs text-slate-400">Record rock quality (RQD %), strike/dip structural measurements, weathering grade, and lineament fractures.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Geological Observation</span>
        </button>
      </div>

      {/* Outcrop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {geologicalObservations.map((geo) => (
          <div key={geo.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">{geo.locationName}</h3>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                RQD: {geo.rockQualityRqd}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <p><strong>Rock Type:</strong> {geo.rockType}</p>
              <p><strong>Weathering:</strong> {geo.weatheringGrade}</p>
              <p><strong>Strike / Dip:</strong> N{geo.strikeDeg}°E / {geo.dipDeg}° SE</p>
              <p><strong>Fractures:</strong> {geo.fractureDensity}</p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Lithology & Outcrop Description</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                {geo.outcropDescription}
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between border-t border-slate-800">
              <span>GPS: [{geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}]</span>
              <span>Recorded: {new Date(geo.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Add Geological Outcrop Observation</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Outcrop Location Name *</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g., Palar Quarry Cutting Outcrop"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rock Type</label>
                  <select
                    value={rockType}
                    onChange={(e) => setRockType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Gneiss">Gneiss</option>
                    <option value="Granite">Granite</option>
                    <option value="Basalt">Basalt</option>
                    <option value="Schist">Schist</option>
                    <option value="Sandstone">Sandstone</option>
                    <option value="Limestone">Limestone</option>
                    <option value="Alluvium">Alluvium</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Weathering Grade</label>
                  <select
                    value={weatheringGrade}
                    onChange={(e) => setWeatheringGrade(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Fresh">Fresh</option>
                    <option value="Slightly Weathered">Slightly Weathered</option>
                    <option value="Highly Weathered">Highly Weathered</option>
                    <option value="Completely Weathered">Completely Weathered (Saprolite)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Strike (°)</label>
                  <input
                    type="number"
                    value={strikeDeg}
                    onChange={(e) => setStrikeDeg(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Dip (°)</label>
                  <input
                    type="number"
                    value={dipDeg}
                    onChange={(e) => setDipDeg(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Rock Quality RQD (%)</label>
                  <input
                    type="number"
                    value={rqd}
                    onChange={(e) => setRqd(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Outcrop Description & Jointing Notes</label>
                <textarea
                  rows={3}
                  value={outcropDescription}
                  onChange={(e) => setOutcropDescription(e.target.value)}
                  placeholder="Describe joint spacing, fault plane dip, pegmatite veins..."
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
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
