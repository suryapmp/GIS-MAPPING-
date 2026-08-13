import React from 'react';
import { MlForecastResult } from '../../types/groundwater';
import { mlForecastEngine } from '../../services/groundwater/mlForecastEngine';
import { 
  X, 
  Zap, 
  Brain, 
  TrendingDown, 
  ShieldCheck, 
  BarChart3, 
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface Props {
  currentDepthMbgl: number;
  onClose: () => void;
}

export const MlForecastModal: React.FC<Props> = ({ currentDepthMbgl, onClose }) => {
  const forecast: MlForecastResult = mlForecastEngine.generateForecast(currentDepthMbgl);

  // Combine historical and projected data for the continuous chart
  const chartData = [
    ...forecast.historicalSeries.map((h) => ({
      date: h.date.slice(5),
      observed: h.observedMbgl,
      rainfall: h.rainfallMm,
      projected: undefined,
      upperBound: undefined,
      lowerBound: undefined
    })),
    {
      date: 'Now',
      observed: currentDepthMbgl,
      rainfall: 70,
      projected: currentDepthMbgl,
      upperBound: currentDepthMbgl,
      lowerBound: currentDepthMbgl
    },
    ...forecast.projectedSeries.map((p) => ({
      date: `+${p.date.slice(5)}`,
      observed: undefined,
      rainfall: undefined,
      projected: p.projectedMbgl,
      upperBound: p.upperConfidenceMbgl,
      lowerBound: p.lowerConfidenceMbgl
    }))
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>AI/ML Groundwater Forecasting Module</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {forecast.modelUsed.split(' ')[0]}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Coupled hydro-physical time-series regressor with 95% Bayesian confidence intervals.
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Projections Matrix */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Current (Observed)</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{forecast.currentDepthMbgl} mbgl</div>
              <div className="text-[10px] text-emerald-400 font-medium">Measured Datum</div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">+30 Days Forecast</div>
              <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">{forecast.forecast30DaysMbgl} mbgl</div>
              <div className="text-[10px] text-slate-400">±0.45m bounds</div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">+90 Days Forecast</div>
              <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">{forecast.forecast90DaysMbgl} mbgl</div>
              <div className="text-[10px] text-slate-400">±0.85m bounds</div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">+180 Days Forecast</div>
              <div className="text-lg font-bold text-indigo-300 font-mono mt-0.5">{forecast.forecast180DaysMbgl} mbgl</div>
              <div className="text-[10px] text-emerald-400">Monsoon recovery</div>
            </div>
          </div>

          {/* Model Chart */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Historical Telemetry vs AI Model Projections</span>
              </span>
              <span className="text-emerald-400 text-[11px] font-mono font-bold">
                Confidence: {forecast.predictionConfidencePct}%
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 18]} reversed />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="observed" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Observed (mbgl)" />
                  <Area type="monotone" dataKey="projected" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="AI Projection (mbgl)" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 text-[10px] text-slate-400">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Measured Telemetry</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span><span>AI Model Forecast</span></span>
            </div>
          </div>

          {/* Input Features Used */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
              Trained Model Features & Input Signals
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
              {forecast.inputFeaturesUsed.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 py-0.5">
                  <span className="text-cyan-400">•</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Forecast
          </button>
        </div>
      </div>
    </div>
  );
};
