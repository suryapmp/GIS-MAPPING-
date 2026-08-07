import React, { useState } from 'react';
import { useHydroStore } from '../../stores/useHydroStore';
import {
  LayoutDashboard,
  FolderKanban,
  Map,
  MapPin,
  Layers,
  UploadCloud,
  ClipboardList,
  FlaskConical,
  TestTube,
  Droplets,
  Mountain,
  Compass,
  Zap,
  BookOpen,
  Sliders,
  Cpu,
  Target,
  CheckCircle2,
  Filter,
  GitCompare,
  BookMarked,
  FileText,
  Download,
  Users,
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface NavGroup {
  title: string;
  items: { id: string; label: string; icon: React.ElementType }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview & Setup',
    items: [
      { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
      { id: 'projects', label: '2. Projects', icon: FolderKanban },
      { id: 'studyAreas', label: '3. Study Areas', icon: MapPin }
    ]
  },
  {
    title: 'GIS Workspace',
    items: [
      { id: 'map', label: '4. GIS Map', icon: Map },
      { id: 'layers', label: '5. GIS Layer Manager', icon: Layers },
      { id: 'dataImport', label: '6. Data Import', icon: UploadCloud }
    ]
  },
  {
    title: 'Field & Lab Data',
    items: [
      { id: 'fieldSurvey', label: '7. Field Survey', icon: ClipboardList },
      { id: 'soilSamples', label: '8. Soil Samples', icon: FlaskConical },
      { id: 'soilLabData', label: '9. Soil Laboratory Data', icon: TestTube },
      { id: 'wells', label: '10. Wells & Groundwater', icon: Droplets },
      { id: 'geology', label: '11. Geological Survey', icon: Mountain },
      { id: 'hydrogeology', label: '12. Hydrogeological Survey', icon: Compass },
      { id: 'ert', label: '13. ERT Geophysics', icon: Zap }
    ]
  },
  {
    title: 'Analysis & AI ML',
    items: [
      { id: 'references', label: '14. Scientific References', icon: BookOpen },
      { id: 'ahp', label: '15. AHP / MCDA', icon: Sliders },
      { id: 'ml', label: '16. Machine Learning', icon: Cpu },
      { id: 'gwpz', label: '17. GWPZ Mapping', icon: Target },
      { id: 'validation', label: '18. Field Validation', icon: CheckCircle2 }
    ]
  },
  {
    title: 'Decision Support & MAR',
    items: [
      { id: 'mar', label: '19. MAR Site Selection', icon: Filter },
      { id: 'comparative', label: '20. Comparative Study', icon: GitCompare }
    ]
  },
  {
    title: 'Documentation & System',
    items: [
      { id: 'notebook', label: '21. Research Notebook', icon: BookMarked },
      { id: 'reports', label: '22. Research Reports', icon: FileText },
      { id: 'export', label: '23. Export & Backup', icon: Download },
      { id: 'admin', label: '24. Administration', icon: Users },
      { id: 'settings', label: '25. Settings', icon: Settings }
    ]
  }
];

export const Sidebar: React.FC = () => {
  const { activeModuleTab, setActiveModuleTab } = useHydroStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 flex flex-col z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
        {!collapsed && <span className="uppercase tracking-wider font-mono text-[11px]">Research Modules (25)</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx}>
            {!collapsed && (
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400/80 mb-1">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModuleTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModuleTab(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center space-x-3 px-2.5 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    {!collapsed && <span className="truncate text-left text-xs">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
