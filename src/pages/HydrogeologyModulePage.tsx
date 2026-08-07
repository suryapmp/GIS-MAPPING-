import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Compass, Plus, Waves, Droplet } from 'lucide-react';

export const HydrogeologyModulePage: React.FC = () => {
  const { hydrogeologicalObservations, addHydroObservation, activeProjectId } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [locationName, setLocationName] = useState('');
  const [type, setType] = useState<'Spring' | 'Seepage' | 'Recharge Area' | 'Discharge Zone' | 'Stream Leakage'>('Spring');
  const [dischargeLps, setDischargeLps] = useState<number>(2.0);
  const [waterEvidence, setWaterEvidence] = useState('');
  const [streamCondition, setStreamCondition] = useState<'Perennial' | 'Intermittent' | 'Ephemeral'>('Perennial');
  const [interpretation, setInterpretation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName) return;

    addHydroObservation({
      projectId: activeProjectId,
      locationName,
      lat: 12.835,
      lng: 79.042,
      type,
      dischargeLps: Number(dischargeLps),
      waterEvidence: waterEvidence || 'Clear perennial discharge',
      streamCondition,
      interpretation
    });

    setLocationName('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Compass className="w-4 h-4" />
            <span>Module 12: Hydrogeological Field Observations</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Springs, Seepages & Aquifer Discharge Dynamics</h1>
          <p className="text-xs text-slate-400">Log natural discharge springs, stream leakage, artesian features, and recharge evidence.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hydro Observation</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hydrogeologicalObservations.map((hy) => (
          <div key={hy.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">{hy.locationName}</h3>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">
                {hy.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <p><strong>Discharge Rate:</strong> <span className="text-cyan-300 font-bold">{hy.dischargeLps || 0} L/s</span></p>
              <p><strong>Stream Condition:</strong> {hy.streamCondition}</p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Hydrogeological Interpretation</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                {hy.interpretation}
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between border-t border-slate-800">
              <span>GPS: [{hy.lat.toFixed(4)}, {hy.lng.toFixed(4)}]</span>
              <span>Logged: {new Date(hy.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Record Hydrogeological Feature</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Feature Location Name *</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g., Anicut Perennial Spring"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Observation Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Spring">Spring Discharge</option>
                    <option value="Seepage">Rock Seepage</option>
                    <option value="Recharge Area">Recharge Area</option>
                    <option value="Discharge Zone">Discharge Zone</option>
                    <option value="Stream Leakage">Stream Leakage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Estimated Discharge (L/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dischargeLps}
                    onChange={(e) => setDischargeLps(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Scientific Interpretation</label>
                <textarea
                  rows={3}
                  value={interpretation}
                  onChange={(e) => setInterpretation(e.target.value)}
                  placeholder="Describe fault lineament control, artesian head, or saprolite drainage..."
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
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold">
                  Save Hydro Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
