import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Droplets, Plus, Activity, Calendar, MapPin, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export const WellsModulePage: React.FC = () => {
  const { wells, wellMeasurements, addWell, addWellMeasurement, activeProjectId } = useHydroStore();
  const [showWellModal, setShowWellModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  const [wellId, setWellId] = useState('');
  const [wellType, setWellType] = useState<'Borewell' | 'Dug Well' | 'Piezometer' | 'Tube Well'>('Borewell');
  const [lat, setLat] = useState<number>(12.860);
  const [lng, setLng] = useState<number>(79.030);
  const [depthM, setDepthM] = useState<number>(100);
  const [aquiferType, setAquiferType] = useState<'Unconfined' | 'Confined' | 'Semi-confined' | 'Fractured Basement'>('Fractured Basement');
  const [yieldLps, setYieldLps] = useState<number>(4.5);
  const [lithology, setLithology] = useState('Fractured Gneiss & Quartz Vein');

  const [selectedWellId, setSelectedWellId] = useState(wells[0]?.id || '');
  const [staticWaterLevel, setStaticWaterLevel] = useState<number>(12.5);
  const [season, setSeason] = useState<'Pre-Monsoon' | 'Monsoon' | 'Post-Monsoon' | 'Dry Season'>('Monsoon');

  const handleAddWell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wellId) return;

    addWell({
      projectId: activeProjectId,
      wellId,
      lat: Number(lat),
      lng: Number(lng),
      wellType,
      depthM: Number(depthM),
      diameterMm: 150,
      aquiferType,
      lithology,
      yieldLps: Number(yieldLps),
      status: 'Active'
    });

    setWellId('');
    setShowWellModal(false);
  };

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();

    addWellMeasurement({
      wellId: selectedWellId,
      date: new Date().toISOString().split('T')[0],
      season,
      staticWaterLevelM: Number(staticWaterLevel),
      pumpingWaterLevelM: Number(staticWaterLevel) + 8.5,
      yieldLps: 4.2,
      remarks: 'Periodic field monitoring'
    });

    setShowMeasureModal(false);
  };

  const selectedWell = wells.find(w => w.id === selectedWellId) || wells[0];
  const chartMeasurements = wellMeasurements.filter(m => m.wellId === selectedWell?.id);

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase font-bold">
            <Droplets className="w-4 h-4" />
            <span>Module 10: Groundwater Wells & Level Monitoring</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Borewells, Dug Wells & Piezometers Inventory</h1>
          <p className="text-xs text-slate-400">Track seasonal static water level fluctuations, drawdown curves, and discharge rates.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMeasureModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-bold rounded-lg"
          >
            + Add Level Record
          </button>
          <button
            onClick={() => setShowWellModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Well Inventory</span>
          </button>
        </div>
      </div>

      {/* Selected Well Time-Series Chart */}
      {selectedWell && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Water Level Hydrograph: {selectedWell.wellId}</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {selectedWell.wellType} | Aquifer: {selectedWell.aquiferType} | Depth: {selectedWell.depthM} m
              </p>
            </div>

            <select
              value={selectedWellId}
              onChange={(e) => setSelectedWellId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-cyan-300 rounded px-3 py-1 text-xs font-mono font-bold"
            >
              {wells.map(w => (
                <option key={w.id} value={w.id}>{w.wellId} ({w.wellType})</option>
              ))}
            </select>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartMeasurements}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis reversed stroke="#38bdf8" fontSize={10} label={{ value: 'Static Water Level Depth (m below GL)', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="staticWaterLevelM" name="Static Water Level (m)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Wells Grid Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs uppercase font-mono text-slate-400">
          All Project Wells ({wells.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Well ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Depth (m)</th>
                <th className="p-3">Aquifer Type</th>
                <th className="p-3">Discharge Yield</th>
                <th className="p-3">Lithology</th>
                <th className="p-3">Coordinates</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {wells.map((w) => (
                <tr
                  key={w.id}
                  onClick={() => setSelectedWellId(w.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedWellId === w.id ? 'bg-blue-950/40 text-blue-200' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="p-3 font-bold font-mono text-blue-400">{w.wellId}</td>
                  <td className="p-3">{w.wellType}</td>
                  <td className="p-3 font-mono">{w.depthM} m</td>
                  <td className="p-3">{w.aquiferType}</td>
                  <td className="p-3 font-bold text-emerald-400">{w.yieldLps} L/s</td>
                  <td className="p-3 text-slate-300">{w.lithology}</td>
                  <td className="p-3 font-mono text-[10px] text-slate-400">
                    [{w.lat.toFixed(4)}, {w.lng.toFixed(4)}]
                  </td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono">
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showWellModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Add Well Inventory Record</h3>
            <form onSubmit={handleAddWell} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Well ID *</label>
                  <input
                    type="text"
                    required
                    value={wellId}
                    onChange={(e) => setWellId(e.target.value)}
                    placeholder="e.g., GW-PLR-05"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Well Type</label>
                  <select
                    value={wellType}
                    onChange={(e) => setWellType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Borewell">Borewell</option>
                    <option value="Dug Well">Dug Well</option>
                    <option value="Piezometer">Piezometer</option>
                    <option value="Tube Well">Tube Well</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Total Depth (m)</label>
                  <input
                    type="number"
                    value={depthM}
                    onChange={(e) => setDepthM(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Estimated Yield (L/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={yieldLps}
                    onChange={(e) => setYieldLps(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Aquifer Type</label>
                <select
                  value={aquiferType}
                  onChange={(e) => setAquiferType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                >
                  <option value="Unconfined">Unconfined Saprolite Layer</option>
                  <option value="Confined">Confined Alluvial Bed</option>
                  <option value="Semi-confined">Semi-confined Layer</option>
                  <option value="Fractured Basement">Fractured Hard-Rock Basement</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowWellModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold">
                  Save Well
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMeasureModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Record Water Table Level Measurement</h3>
            <form onSubmit={handleAddMeasurement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Well</label>
                <select
                  value={selectedWellId}
                  onChange={(e) => setSelectedWellId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                >
                  {wells.map(w => (
                    <option key={w.id} value={w.id}>{w.wellId} ({w.wellType})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Static Water Level Depth (m below GL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={staticWaterLevel}
                  onChange={(e) => setStaticWaterLevel(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                >
                  <option value="Pre-Monsoon">Pre-Monsoon</option>
                  <option value="Monsoon">Monsoon</option>
                  <option value="Post-Monsoon">Post-Monsoon</option>
                  <option value="Dry Season">Dry Season</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMeasureModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded">
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
