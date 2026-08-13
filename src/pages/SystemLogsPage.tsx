import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { Shield, Search, Filter, Clock, Activity, FileCheck, CheckCircle, Database } from 'lucide-react';

export const SystemLogsPage: React.FC = () => {
  const { auditLogs } = useHydroStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.targetCollection.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || log.targetCollection.toLowerCase() === moduleFilter.toLowerCase();
    return matchesSearch && matchesModule;
  });

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <Shield className="w-4 h-4" />
            <span>System Administration & Audit Trail</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">HYDRO-GIS System Action & API Audit Logs</h1>
          <p className="text-xs text-slate-400">Real-time action logging for CGWB sync, Survey of India API calls, batch media uploads, and GIS transformations.</p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Total Log Entries: <strong className="text-white">{auditLogs.length}</strong></span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action logs..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            <option value="gis">GIS Workspaces</option>
            <option value="wells">Wells & Telemetry</option>
            <option value="survey">Field Survey</option>
            <option value="soil">Soil & Lab</option>
            <option value="mar">MAR Decisions</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Target Module</th>
                <th className="p-3.5">Log Details & API Response</th>
                <th className="p-3.5">User Role</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500 text-xs font-sans">
                    No matching audit log entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 text-slate-400 text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-cyan-300">{log.action}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded text-[10px] uppercase">
                        {log.targetCollection}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200 max-w-md truncate font-sans text-xs">
                      {log.details}
                    </td>
                    <td className="p-3.5 text-slate-400 text-[11px]">Lead Hydrogeologist</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] flex items-center space-x-1 w-max">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
