import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Droplets, Plus, Activity, Calendar, MapPin, TrendingDown, RefreshCw, FileCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export const WellsModulePage: React.FC = () => {
  const { wells, wellMeasurements, addWell, addWellMeasurement, activeProjectId, logSystemAction } = useHydroStore();
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [isSyncingCgwb, setIsSyncingCgwb] = useState(false);
  const [cgwbSyncSuccess, setCgwbSyncSuccess] = useState(false);

  // Unified Form Tab State
  const [modalTab, setModalTab] = useState<'inventory' | 'permit' | 'performance'>('inventory');

  // Unified Well Form State
  const [wellId, setWellId] = useState('');
  const [wellType, setWellType] = useState<'Borewell' | 'Dug Well' | 'Piezometer' | 'Tube Well'>('Borewell');
  const [lat, setLat] = useState<number>(12.860);
  const [lng, setLng] = useState<number>(79.030);
  const [depthM, setDepthM] = useState<number>(100);
  const [aquiferType, setAquiferType] = useState<'Unconfined' | 'Confined' | 'Semi-confined' | 'Fractured Basement'>('Fractured Basement');
  const [yieldLps, setYieldLps] = useState<number>(4.5);
  const [lithology, setLithology] = useState('Fractured Gneiss & Quartz Vein');

  // Statutory Permit & CGWB NOC state
  const [nocNumber, setNocNumber] = useState('CGWB/NOC/TN/2026/8841');
  const [zoneCategory, setZoneCategory] = useState<'Safe' | 'Semi-Critical' | 'Critical' | 'Over-Exploited'>('Critical');
  const [permissibleM3Day, setPermissibleM3Day] = useState<number>(150);

  // Performance & Periodic Monitoring state
  const [staticWaterLevel, setStaticWaterLevel] = useState<number>(12.5);
  const [pumpingWaterLevel, setPumpingWaterLevel] = useState<number>(21.0);
  const [season, setSeason] = useState<'Pre-Monsoon' | 'Monsoon' | 'Post-Monsoon' | 'Dry Season'>('Monsoon');

  const [selectedWellId, setSelectedWellId] = useState(wells[0]?.id || '');

  // CGWB Portal Automated Pipeline Sync
  const handleSyncCgwb = async () => {
    setIsSyncingCgwb(true);
    setCgwbSyncSuccess(false);

    try {
      const res = await fetch('/api/cgwb/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ district: 'Vellore' })
      });
      const data = await res.json();

      if (data.stations && data.stations.length > 0) {
        data.stations.forEach((st: any) => {
          addWell({
            projectId: activeProjectId,
            wellId: st.cgwbCode,
            lat: st.lat,
            lng: st.lng,
            wellType: st.wellType.includes('Dug') ? 'Dug Well' : 'Piezometer',
            depthM: st.depthM,
            diameterMm: 200,
            aquiferType: 'Fractured Basement',
            lithology: st.aquiferType,
            yieldLps: st.dischargeYieldLps,
            status: 'Active'
          });

          addWellMeasurement({
            wellId: st.cgwbCode,
            date: new Date().toISOString().split('T')[0],
            season: 'Pre-Monsoon',
            staticWaterLevelM: st.preMonsoonSwlM,
            pumpingWaterLevelM: st.preMonsoonSwlM + 6.0,
            yieldLps: st.dischargeYieldLps,
            remarks: `CGWB Telemetry Auto-Sync: ${st.zoneCategory} Zone. NOC: ${st.nocStatus}`
          });
        });

        logSystemAction('SYNC_CGWB_TELEMETRY', 'wells', `Imported ${data.stations.length} official CGWB observation wells & telemetry datasets.`);
      }

      setIsSyncingCgwb(false);
      setCgwbSyncSuccess(true);
      setTimeout(() => setCgwbSyncSuccess(false), 4000);
    } catch (err) {
      console.warn('CGWB Sync Fallback:', err);
      setIsSyncingCgwb(false);
    }
  };

  // Consolidated Form Submission
  const handleUnifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wellId) return;

    // 1. Add well inventory
    addWell({
      projectId: activeProjectId,
      wellId,
      lat: Number(lat),
      lng: Number(lng),
      wellType,
      depthM: Number(depthM),
      diameterMm: 150,
      aquiferType,
      lithology: `${lithology} | CGWB Zone: ${zoneCategory} | NOC: ${nocNumber}`,
      yieldLps: Number(yieldLps),
      status: 'Active'
    });

    // 2. Add immediate baseline periodic measurement
    addWellMeasurement({
      wellId,
      date: new Date().toISOString().split('T')[0],
      season,
      staticWaterLevelM: Number(staticWaterLevel),
      pumpingWaterLevelM: Number(pumpingWaterLevel),
      yieldLps: Number(yieldLps),
      remarks: `Permissible limit: ${permissibleM3Day} m³/day. NOC: ${nocNumber}`
    });

    logSystemAction('ADD_UNIFIED_WELL_PERMIT', 'wells', `Registered well ${wellId} with consolidated CGWB NOC permit ${nocNumber}.`);

    setWellId('');
    setShowUnifiedModal(false);
  };

  const selectedWell = wells.find(w => w.id === selectedWellId) || wells[0];
  const chartMeasurements = wellMeasurements.filter(m => m.wellId === selectedWell?.id || m.wellId === selectedWell?.wellId);

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase font-bold">
            <Droplets className="w-4 h-4" />
            <span>Module 10: Groundwater Wells, CGWB Sync & Permit Management</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Borewells Inventory, Statutory Permits & CGWB Telemetry</h1>
          <p className="text-xs text-slate-400">Manage consolidated well permissions, performance monitoring, and automated CGWB portal data sync.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSyncCgwb}
            disabled={isSyncingCgwb}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold rounded-lg flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCgwb ? 'animate-spin' : ''}`} />
            <span>{isSyncingCgwb ? 'Syncing CGWB...' : 'Sync CGWB Portal Telemetry'}</span>
          </button>

          <button
            onClick={() => setShowUnifiedModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Unified Well & Permit</span>
          </button>
        </div>
      </div>

      {cgwbSyncSuccess && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-800 text-emerald-200 rounded-xl text-xs font-mono font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CGWB Telemetry Pipeline: Successfully fetched & updated ground water telemetry wells from CGWB portal!</span>
          </div>
        </div>
      )}

      {/* Selected Well Time-Series Chart */}
      {selectedWell && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
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
        <div className="p-4 bg-slate-950 border-b border-slate-800 font-bold text-xs uppercase font-mono text-slate-400 flex justify-between items-center">
          <span>Unified Project Wells & CGWB NOC Inventory ({wells.length})</span>
          <span className="text-[10px] text-cyan-400">Click well row to view hydrograph</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Well ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Depth</th>
                <th className="p-3">Aquifer Type</th>
                <th className="p-3">Discharge Yield</th>
                <th className="p-3">Lithology & Statutory Permit</th>
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
                  <td className="p-3 text-slate-300 max-w-xs truncate">{w.lithology}</td>
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

      {/* UNIFIED WELL & PERMIT / PERFORMANCE FORM MODAL */}
      {showUnifiedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-blue-400" />
                  <span>Unified Well Registration & Statutory Permit Form</span>
                </h3>
                <p className="text-xs text-slate-400">Consolidated inventory, CGWB NOC permissions, and baseline performance.</p>
              </div>

              {/* Modal Section Tabs */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setModalTab('inventory')}
                  className={`px-3 py-1 rounded font-bold ${modalTab === 'inventory' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  1. Inventory
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('permit')}
                  className={`px-3 py-1 rounded font-bold ${modalTab === 'permit' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  2. CGWB Permit
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('performance')}
                  className={`px-3 py-1 rounded font-bold ${modalTab === 'performance' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  3. Performance
                </button>
              </div>
            </div>

            <form onSubmit={handleUnifiedSubmit} className="space-y-4 text-xs">
              {modalTab === 'inventory' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Well ID *</label>
                      <input
                        type="text"
                        required
                        value={wellId}
                        onChange={(e) => setWellId(e.target.value)}
                        placeholder="e.g., WEL-PLR-009"
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
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

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lng}
                        onChange={(e) => setLng(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Depth (m)</label>
                      <input
                        type="number"
                        value={depthM}
                        onChange={(e) => setDepthM(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Target Aquifer Lithology</label>
                    <input
                      type="text"
                      value={lithology}
                      onChange={(e) => setLithology(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                    />
                  </div>
                </div>
              )}

              {modalTab === 'permit' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">CGWB NOC Clearance Number</label>
                    <input
                      type="text"
                      value={nocNumber}
                      onChange={(e) => setNocNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">CGWB Zone Category</label>
                      <select
                        value={zoneCategory}
                        onChange={(e) => setZoneCategory(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                      >
                        <option value="Safe">Safe Zone (&lt;70% extraction)</option>
                        <option value="Semi-Critical">Semi-Critical (70-90% extraction)</option>
                        <option value="Critical">Critical (90-100% extraction)</option>
                        <option value="Over-Exploited">Over-Exploited (&gt;100% extraction)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Permissible Abstraction (m³/day)</label>
                      <input
                        type="number"
                        value={permissibleM3Day}
                        onChange={(e) => setPermissibleM3Day(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'performance' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Static SWL (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={staticWaterLevel}
                        onChange={(e) => setStaticWaterLevel(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Pumping PWL (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={pumpingWaterLevel}
                        onChange={(e) => setPumpingWaterLevel(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Discharge Yield (L/s)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={yieldLps}
                        onChange={(e) => setYieldLps(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Monitoring Season</label>
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
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowUnifiedModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-semibold"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2">
                  {modalTab !== 'performance' ? (
                    <button
                      type="button"
                      onClick={() => setModalTab(modalTab === 'inventory' ? 'permit' : 'performance')}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-bold"
                    >
                      Next Step →
                    </button>
                  ) : null}

                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold shadow-md">
                    Save Unified Well Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
