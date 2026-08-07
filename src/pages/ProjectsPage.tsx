import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { FolderKanban, Plus, Building2, MapPin, User, Calendar, CheckCircle } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, activeProjectId, setActiveProject, addProject } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [leadResearcher, setLeadResearcher] = useState('');
  const [location, setLocation] = useState('');
  const [areaSqKm, setAreaSqKm] = useState<number>(500);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    addProject({
      name,
      code,
      description,
      leadResearcher: leadResearcher || 'Dr. Researcher',
      location,
      areaSqKm: Number(areaSqKm),
      watershedCount: 1
    });

    setName('');
    setCode('');
    setDescription('');
    setLeadResearcher('');
    setLocation('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <FolderKanban className="w-4 h-4" />
            <span>Module 2: Research Projects</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Hydrogeological Research Projects</h1>
          <p className="text-xs text-slate-400">Manage basin-scale research programs, study locations, and principal investigator leads.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => {
          const isActive = proj.id === activeProjectId;
          return (
            <div
              key={proj.id}
              className={`bg-slate-900 border p-5 rounded-xl transition-all relative overflow-hidden ${
                isActive
                  ? 'border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 right-0 bg-cyan-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Active Workspace Project</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="bg-slate-800 text-cyan-300 font-mono text-xs font-bold px-2.5 py-0.5 rounded border border-slate-700">
                    {proj.code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{proj.location}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">{proj.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">{proj.leadResearcher}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Area: <strong className="text-slate-200">{proj.areaSqKm} km²</strong></span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Created: {new Date(proj.createdAt).toLocaleDateString()}
                  </span>

                  {!isActive ? (
                    <button
                      onClick={() => setActiveProject(proj.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Set as Active
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-cyan-400 italic">Currently Selected</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Create Hydrogeological Research Project</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Peninsular Hard-Rock Aquifer Study"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Project Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g., HR-GW-2026"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Location / Basin</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Deccan Traps, India"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Lead Hydrogeologist</label>
                <input
                  type="text"
                  value={leadResearcher}
                  onChange={(e) => setLeadResearcher(e.target.value)}
                  placeholder="e.g., Dr. Aris Thorne"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Estimated Area (km²)</label>
                <input
                  type="number"
                  value={areaSqKm}
                  onChange={(e) => setAreaSqKm(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description & Hydrogeological Objectives</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe regional geology, target aquifer layers, and research hypotheses..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
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
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
