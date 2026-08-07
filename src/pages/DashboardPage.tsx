import React from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import {
  FolderKanban,
  MapPin,
  Layers,
  Droplets,
  FlaskConical,
  Zap,
  Target,
  Filter,
  CheckCircle2,
  BookMarked,
  Activity,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    projects,
    studyAreas,
    gisLayers,
    wells,
    wellMeasurements,
    soilSamples,
    ertSurveys,
    ahpAnalyses,
    mlModelRuns,
    gwpzResults,
    marSites,
    setActiveModuleTab
  } = useHydroStore();

  const totalWells = wells.length;
  const activeWells = wells.filter(w => w.status === 'Active').length;
  const totalSoil = soilSamples.length;
  const totalErt = ertSurveys.length;
  const totalMar = marSites.length;
  const approvedMar = marSites.filter(s => s.researcherApproved).length;

  // Pie chart data for GWPZ distribution
  const activeGwpz = gwpzResults[0];
  const gwpzChartData = activeGwpz ? activeGwpz.zones.map(z => ({
    name: z.class,
    value: z.areaKm2,
    color: z.color
  })) : [];

  // Line chart data for water level time series
  const waterTrendData = [
    { date: 'May 2025 (Pre-Monsoon)', level: 18.4, yield: 3.2 },
    { date: 'Sep 2025 (Monsoon)', level: 7.2, yield: 5.8 },
    { date: 'Dec 2025 (Post-Monsoon)', level: 9.8, yield: 5.1 },
    { date: 'Mar 2026 (Dry Season)', level: 14.5, yield: 4.2 }
  ];

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1600px] mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold mb-1">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>PhD Hydrogeology & Groundwater Decision System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Cauvery Basin & Hard-Rock Aquifer Research Command
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Integrating multi-criteria AHP overlay, XGBoost Machine Learning, ERT geophysics, and Managed Aquifer Recharge (MAR) site suitability.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveModuleTab('map')}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition-transform active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Launch Interactive Map</span>
            </button>
            <button
              onClick={() => setActiveModuleTab('ahp')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg text-xs flex items-center space-x-2"
            >
              <Target className="w-4 h-4 text-cyan-400" />
              <span>AHP MCDA Model</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => setActiveModuleTab('projects')}
          className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase font-mono">Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{projects.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">{studyAreas.length} Watersheds</p>
        </div>

        <div
          onClick={() => setActiveModuleTab('wells')}
          className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase font-mono">Wells</span>
            <Droplets className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalWells}</div>
          <p className="text-[10px] text-emerald-400 mt-1">{activeWells} Active Monitoring</p>
        </div>

        <div
          onClick={() => setActiveModuleTab('soilSamples')}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase font-mono">Soil Samples</span>
            <FlaskConical className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalSoil}</div>
          <p className="text-[10px] text-amber-300 mt-1">Physico-Chemical Lab</p>
        </div>

        <div
          onClick={() => setActiveModuleTab('ert')}
          className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase font-mono">ERT Lines</span>
            <Zap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalErt}</div>
          <p className="text-[10px] text-purple-300 mt-1">235m Resistivity Profile</p>
        </div>

        <div
          onClick={() => setActiveModuleTab('ahp')}
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase font-mono">AHP Runs</span>
            <Target className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{ahpAnalyses.length}</div>
          <p className="text-[10px] text-emerald-400 mt-1">CR = 0.029 (Valid)</p>
        </div>

        <div
          onClick={() => setActiveModuleTab('mar')}
          className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-4 rounded-xl cursor-pointer transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase font-mono">MAR Sites</span>
            <Filter className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalMar}</div>
          <p className="text-[10px] text-teal-300 mt-1">{approvedMar} Approved Sites</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groundwater Potential Zones (GWPZ) Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">GWPZ Area Distribution (AHP Model)</h3>
              <p className="text-[11px] text-slate-400">Palar Sub-Watershed Sub-Basin 4 (Total: 384.6 km²)</p>
            </div>
            <button
              onClick={() => setActiveModuleTab('gwpz')}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>View Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gwpzChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gwpzChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} km²`, 'Area']}
                />
                <Legend formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Table SWL & Yield Trend Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Static Water Level & Well Yield Fluctuations</h3>
              <p className="text-[11px] text-slate-400">Well GW-PLR-01 Pre vs Post-Monsoon Seasonality</p>
            </div>
            <button
              onClick={() => setActiveModuleTab('wells')}
              className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>All Wells</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                <YAxis yAxisId="left" stroke="#38bdf8" fontSize={10} label={{ value: 'SWL Depth (m)', angle: -90, position: 'insideLeft', fill: '#38bdf8', fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} label={{ value: 'Yield (L/s)', angle: 90, position: 'insideRight', fill: '#10b981', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="level" name="Static Water Level (m)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="yield" name="Discharge Yield (L/s)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Machine Learning & MAR Candidate Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* XGBoost Performance Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">XGBoost ML Model Classifier</h3>
              <p className="text-[11px] text-slate-400">Trained on 220 Groundwater Yield Observations</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center mb-4">
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase">Accuracy</div>
              <div className="text-base font-extrabold text-cyan-400">89.5%</div>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase">Precision</div>
              <div className="text-base font-extrabold text-indigo-400">88.2%</div>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase">Recall</div>
              <div className="text-base font-extrabold text-emerald-400">91.0%</div>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase">ROC-AUC</div>
              <div className="text-base font-extrabold text-purple-400">0.934</div>
            </div>
          </div>

          <button
            onClick={() => setActiveModuleTab('ml')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            Inspect Feature Importance & Confusion Matrix →
          </button>
        </div>

        {/* MAR Site Highlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-3 border-b border-slate-800 pb-3 mb-4">
            <div className="w-8 h-8 rounded bg-teal-950 border border-teal-800 flex items-center justify-center">
              <Filter className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Managed Aquifer Recharge (MAR) Priority Sites</h3>
              <p className="text-[11px] text-slate-400">Check Dams & Percolation Tanks Candidate List</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {marSites.slice(0, 2).map((site) => (
              <div key={site.id} className="bg-slate-800/50 border border-slate-700/60 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200 text-xs">{site.siteName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Structure: <span className="text-teal-300 font-bold">{site.recommendedStructure}</span> | Permeability: {site.soilPermeabilityMmHr} mm/hr
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px] font-bold">
                  Score: {site.suitabilityScore}/100
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveModuleTab('mar')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            Manage MAR Artificial Recharge Candidates →
          </button>
        </div>
      </div>
    </div>
  );
};
