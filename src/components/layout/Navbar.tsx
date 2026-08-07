import React, { useState } from 'react';
import { useHydroStore } from '../../stores/useHydroStore';
import {
  Layers,
  Sparkles,
  UserCheck,
  Building2,
  MapPin,
  ShieldAlert,
  Search,
  BookOpen,
  Database,
  Activity
} from 'lucide-react';
import { UserRole } from '../../types/hydro';

interface NavbarProps {
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiAssistant }) => {
  const {
    currentUser,
    setUserRole,
    projects,
    activeProjectId,
    setActiveProject,
    studyAreas,
    activeStudyAreaId,
    setActiveStudyArea,
    activeModuleTab,
    setActiveModuleTab
  } = useHydroStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const activeProj = projects.find(p => p.id === activeProjectId);
  const filteredStudyAreas = studyAreas.filter(s => s.projectId === activeProjectId);
  const activeSA = studyAreas.find(s => s.id === activeStudyAreaId);

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setRoleMenuOpen(false);
  };

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Brand & Active Scope */}
      <div className="flex items-center space-x-6">
        <div
          onClick={() => setActiveModuleTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-200 to-indigo-300">
                HYDRO-GIS
              </span>
              <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-700/50 uppercase font-mono tracking-widest">
                v1.0 PhD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Groundwater Decision Support Platform
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="hidden lg:flex items-center space-x-3 pl-6 border-l border-slate-800">
          <div className="flex items-center space-x-2 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 font-medium">Project:</span>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProject(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500 font-medium max-w-[220px] truncate"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Study Area Selector */}
          <div className="flex items-center space-x-2 text-xs text-slate-300 pl-3">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">Watershed:</span>
            <select
              value={activeStudyAreaId}
              onChange={(e) => setActiveStudyArea(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 font-medium max-w-[180px] truncate"
            >
              <option value="">-- All Sub-Basins --</option>
              {filteredStudyAreas.map(sa => (
                <option key={sa.id} value={sa.id}>{sa.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Map Workspace Button */}
        <button
          onClick={() => setActiveModuleTab('map')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeModuleTab === 'map'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">GIS Workspace</span>
        </button>

        {/* AI Hydrogeologist Assistant */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-purple-900/30 transition-all border border-purple-400/30"
        >
          <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          <span className="hidden sm:inline">AI Hydrogeologist</span>
        </button>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-200 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <div className="text-left hidden md:block">
              <div className="font-medium text-slate-200 text-[11px] leading-tight">{currentUser.displayName}</div>
              <div className="text-[10px] text-cyan-400 font-mono font-semibold">{currentUser.role}</div>
            </div>
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50 text-xs text-slate-300">
              <div className="px-3 py-1.5 border-b border-slate-700 text-[11px] text-slate-400 font-medium">
                Switch User Authorization Role:
              </div>
              {(['ADMIN', 'RESEARCHER', 'FIELD_SURVEYOR', 'VIEWER'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-700 transition-colors ${
                    currentUser.role === r ? 'text-cyan-400 font-bold bg-slate-700/50' : 'text-slate-300'
                  }`}
                >
                  <span>{r}</span>
                  {currentUser.role === r && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
