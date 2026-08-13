import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  Layers, 
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  onClose: () => void;
  onYearChange?: (year: number) => void;
}

export const TimeMachineModal: React.FC<Props> = ({ onClose, onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const [selectedSeason, setSelectedSeason] = useState<'All' | 'Pre-Monsoon' | 'Post-Monsoon'>('All');

  // Multi-decadal historical trend data for the basin
  const timeSeriesData = [
    { year: 2010, preMonsoon: 9.8, postMonsoon: 3.2, annualAvg: 6.5, rainfallMm: 1050 },
    { year: 2012, preMonsoon: 10.4, postMonsoon: 3.8, annualAvg: 7.1, rainfallMm: 980 },
    { year: 2014, preMonsoon: 11.2, postMonsoon: 4.5, annualAvg: 7.8, rainfallMm: 890 },
    { year: 2016, preMonsoon: 13.8, postMonsoon: 7.2, annualAvg: 10.5, rainfallMm: 620 }, // Severe drought
    { year: 2018, preMonsoon: 12.1, postMonsoon: 4.8, annualAvg: 8.4, rainfallMm: 940 },
    { year: 2020, preMonsoon: 11.5, postMonsoon: 3.9, annualAvg: 7.7, rainfallMm: 1120 },
    { year: 2022, preMonsoon: 12.8, postMonsoon: 4.2, annualAvg: 8.5, rainfallMm: 910 },
    { year: 2024, preMonsoon: 14.2, postMonsoon: 5.6, annualAvg: 9.9, rainfallMm: 840 },
    { year: 2026, preMonsoon: 15.1, postMonsoon: 6.2, annualAvg: 10.6, rainfallMm: 825 }
  ];

  // Auto-play time-lapse effect
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedYear((prev) => {
          if (prev >= 2026) {
            return 2010;
          }
          const next = prev + 1;
          if (onYearChange) onYearChange(next);
          return next;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, onYearChange]);

  const currentYearData = timeSeriesData.find((d) => d.year === selectedYear) || {
    year: selectedYear,
    preMonsoon: 14.5,
    postMonsoon: 5.8,
    annualAvg: 10.1,
    rainfallMm: 850
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSelectedYear(val);
    if (onYearChange) onYearChange(val);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Historical Groundwater Time Machine</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  2010 – 2026
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Multi-decadal hydrogeological time-lapse and seasonal aquifer reconstruction.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Main Time-Lapse Controller Box */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 shadow-inner space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-indigo-300 uppercase font-semibold">Active Snapshot Year</div>
                <div className="text-3xl font-extrabold text-white font-mono">{selectedYear}</div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-lg ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Time-Lapse' : 'Play Time-Lapse Mode'}</span>
                </button>

                <button
                  onClick={() => setSelectedYear(2010)}
                  title="Reset to 2010"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1.5">
              <input
                type="range"
                min="2010"
                max="2026"
                step="1"
                value={selectedYear}
                onChange={handleSliderChange}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>2010 (Baseline)</span>
                <span>2016 (Severe Drought)</span>
                <span>2020</span>
                <span>2026 (Present Day)</span>
              </div>
            </div>
          </div>

          {/* Stats for Selected Year */}
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Pre-Monsoon SWL</div>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                {currentYearData.preMonsoon} mbgl
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Peak dry season depth</div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Post-Monsoon SWL</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                {currentYearData.postMonsoon} mbgl
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Recharged water table</div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Annual Rainfall</div>
              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                {currentYearData.rainfallMm} mm
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Meteoric precipitation</div>
            </div>
          </div>

          {/* Decadal Historical Hydrograph */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                Multi-Decadal Groundwater Level Hydrograph (2010 – 2026)
              </span>
              <span className="text-amber-400 text-[11px] font-semibold">
                ↓ Decadal Decline: -0.38 m/year
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 18]} reversed label={{ value: 'Depth (mbgl)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <Line type="monotone" dataKey="preMonsoon" stroke="#f59e0b" name="Pre-Monsoon (mbgl)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="postMonsoon" stroke="#10b981" name="Post-Monsoon (mbgl)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-slate-500 text-center italic">
              Note: Y-axis is reversed to represent water table depth below ground level (mbgl).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Time Machine
          </button>
        </div>
      </div>
    </div>
  );
};
