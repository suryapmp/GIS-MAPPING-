import React, { useState } from 'react';
import { 
  InterpolationOptions, 
  InterpolatedSurfaceLayer, 
  GroundwaterObservation 
} from '../../types/groundwater';
import { interpolationEngine } from '../../services/groundwater/interpolationEngine';
import { X, Layers, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

interface Props {
  observations: GroundwaterObservation[];
  bounds: [number, number, number, number];
  onClose: () => void;
  onSurfaceGenerated: (surface: InterpolatedSurfaceLayer) => void;
}

export const SurfaceGeneratorModal: React.FC<Props> = ({
  observations,
  bounds,
  onClose,
  onSurfaceGenerated
}) => {
  const [method, setMethod] = useState<'IDW' | 'TIN' | 'Kriging'>('IDW');
  const [power, setPower] = useState<number>(2.0);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);
  const [gridResolution, setGridResolution] = useState<number>(25);
  const [targetParam, setTargetParam] = useState<InterpolationOptions['targetParameter']>('water_level_mbgl');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const surface = interpolationEngine.generateSurface(
        observations,
        {
          method,
          power,
          searchRadiusKm,
          minPoints: 3,
          maxPoints: 50,
          gridResolution,
          targetParameter: targetParam
        },
        bounds
      );
      onSurfaceGenerated(surface);
      setIsGenerating(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Groundwater Surface Generation Engine
              </h3>
              <p className="text-xs text-slate-400">
                Spatial interpolation matrix generator (IDW, Kriging, TIN).
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
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Target Parameter */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Target Parameter Layer:
            </label>
            <select
              value={targetParam}
              onChange={(e) => setTargetParam(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="water_level_mbgl">Water Table Depth (mbgl)</option>
              <option value="water_head_msl">Groundwater Piezometric Head (m MSL)</option>
              <option value="drawdown">Seasonal Drawdown Deficit (m)</option>
              <option value="stress">Groundwater Stress Index (0-100)</option>
            </select>
          </div>

          {/* Interpolation Method */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
              Interpolation Algorithm:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['IDW', 'TIN', 'Kriging'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`p-2 rounded-lg font-bold border transition ${
                    method === m
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* IDW Power Slider */}
          {method === 'IDW' && (
            <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span>Distance Weighting Power (p):</span>
                <span className="font-mono text-cyan-300 font-bold">{power}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={power}
                onChange={(e) => setPower(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="text-[10px] text-slate-500">
                Higher power emphasizes local monitoring well clusters; lower power creates regional smoothed surfaces.
              </div>
            </div>
          )}

          {/* Grid Resolution */}
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span>Grid Mesh Density:</span>
              <span className="font-mono text-cyan-300 font-bold">{gridResolution} × {gridResolution} Cells</span>
            </div>
            <input
              type="range"
              min="15"
              max="40"
              step="5"
              value={gridResolution}
              onChange={(e) => setGridResolution(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Using {observations.length} observation points
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Computing Grid...' : 'Generate Surface'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
