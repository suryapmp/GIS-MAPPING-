import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Waves, Plus, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { MarStructureType } from '../types/hydro';

export const MarPage: React.FC = () => {
  const { marSites, addMarSite, activeProjectId } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [siteName, setSiteName] = useState('');
  const [recommendedStructure, setRecommendedStructure] = useState<MarStructureType>('Check Dam');
  const [suitabilityScore, setSuitabilityScore] = useState<number>(88.5);
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName) return;

    addMarSite({
      projectId: activeProjectId,
      siteName,
      lat: 12.868,
      lng: 79.025,
      suitabilityScore: Number(suitabilityScore),
      suitabilityClass: suitabilityScore > 80 ? 'High' : suitabilityScore > 50 ? 'Moderate' : 'Low',
      recommendedStructure,
      soilPermeabilityMmHr: 45.0,
      slopePercent: 2.1,
      drainageOrder: 3,
      waterAvailability: 'Abundant',
      accessibility: 'Easy',
      researcherApproved: true,
      comments: comments || 'Gentle stream gradient with permeable saprolite overburden'
    });

    setSiteName('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Waves className="w-4 h-4" />
            <span>Module 19: Managed Aquifer Recharge (MAR)</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Managed Aquifer Recharge (MAR) Site Suitability</h1>
          <p className="text-xs text-slate-400">Identify optimal locations for Check Dams, Percolation Tanks, Recharge Shafts, and Injection Wells.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add MAR Candidate Site</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marSites.map((site) => (
          <div key={site.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono font-bold text-cyan-400 text-sm">{site.siteName}</span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                Suitability: {site.suitabilityScore}% ({site.suitabilityClass})
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Recommended Structure</span>
              <div className="text-sm font-bold text-slate-100 mt-0.5">{site.recommendedStructure}</div>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <p><strong>Stream Order:</strong> {site.drainageOrder}rd Order Stream</p>
              <p><strong>Slope:</strong> {site.slopePercent}%</p>
              <p><strong>Soil Permeability:</strong> {site.soilPermeabilityMmHr} mm/hr</p>
              <p><strong>Water Availability:</strong> {site.waterAvailability}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Hydrogeological Justification</span>
              <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 mt-1">
                {site.comments}
              </p>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between border-t border-slate-800">
              <span>GPS: [{site.lat.toFixed(4)}, {site.lng.toFixed(4)}]</span>
              <span className="text-emerald-400 font-bold">✓ Approved</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Propose MAR Candidate Site</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Site Name *</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="e.g., MAR-PLR-03"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Recommended Structure</label>
                  <select
                    value={recommendedStructure}
                    onChange={(e) => setRecommendedStructure(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Check Dam">Check Dam</option>
                    <option value="Percolation Tank">Percolation Tank</option>
                    <option value="Recharge Shaft">Recharge Shaft</option>
                    <option value="Subsurface Dyke">Subsurface Dyke</option>
                    <option value="Injection Well">Injection Well</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Suitability Score (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={suitabilityScore}
                    onChange={(e) => setSuitabilityScore(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hydrogeological Justification</label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Explain why this location is optimal for recharge structure..."
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
                  Save Candidate Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
