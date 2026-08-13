import React, { useState } from 'react';
import { 
  GroundwaterIntelligenceResult,
  GpsLocationTelemetry
} from '../../types/groundwater';
import { 
  Droplets, 
  MapPin, 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Clock, 
  CloudRain, 
  AlertTriangle,
  Compass,
  Zap,
  ChevronRight,
  BarChart3,
  Sliders,
  Maximize2
} from 'lucide-react';

interface Props {
  intelligence: GroundwaterIntelligenceResult | null;
  gpsTelemetry: GpsLocationTelemetry | null;
  loading: boolean;
  selectedRadiusKm: number;
  onRadiusChange: (r: number) => void;
  onRefresh: () => void;
  onOpenTimeMachine: () => void;
  onOpenStressIndex: () => void;
  onOpenMlForecast: () => void;
  onOpenRainfallRecharge: () => void;
  onOpenMarRecommendation: () => void;
  onOpenAnomalies: () => void;
  onOpenWatershed: () => void;
  onOpenContamination: () => void;
  onOpen3dSubsurface: () => void;
  onOpenSurfaceGenerator: () => void;
}

export const GroundwaterIntelligenceCard: React.FC<Props> = ({
  intelligence,
  gpsTelemetry,
  loading,
  selectedRadiusKm,
  onRadiusChange,
  onRefresh,
  onOpenTimeMachine,
  onOpenStressIndex,
  onOpenMlForecast,
  onOpenRainfallRecharge,
  onOpenMarRecommendation,
  onOpenAnomalies,
  onOpenWatershed,
  onOpenContamination,
  onOpen3dSubsurface,
  onOpenSurfaceGenerator
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'actions'>('overview');

  if (loading) {
    return (
      <div className="bg-slate-900/95 backdrop-blur border border-cyan-500/30 rounded-xl p-4 shadow-2xl text-slate-100 flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <div className="text-sm font-semibold text-cyan-300">Executing Multi-Provider Groundwater Analysis...</div>
        <div className="text-xs text-slate-400 text-center max-w-xs">
          Querying CGWB telemetry, State Groundwater Department, and spatial IDW interpolation engine at your GPS coordinates.
        </div>
      </div>
    );
  }

  if (!intelligence || !gpsTelemetry) {
    return (
      <div className="bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-xl text-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">Groundwater Intelligence</h3>
          </div>
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Analyze My GPS</span>
          </button>
        </div>
        <p className="text-xs text-slate-400">
          Acquire live device GPS to calculate estimated groundwater depth, confidence scores, and surrounding monitoring well telemetry.
        </p>
      </div>
    );
  }

  const {
    gpsLocation,
    nearbyWellsCount,
    validWellsCount,
    nearestWellDistanceKm,
    nearestWellId,
    latestNearbyObservation,
    seasonalCondition,
    longTermTrend,
    localGroundwaterStress,
    estimatedWaterLevelMbgl,
    confidenceScore,
    confidenceBreakdown,
    hydraulicParameters
  } = intelligence;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-2xl text-slate-100 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-500/30 p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold tracking-wider text-cyan-300 uppercase">
                  Groundwater Intelligence at My Location
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 animate-pulse">
                  LIVE GPS
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
                <span>Lat: {gpsLocation.lat.toFixed(5)}°</span>
                <span>Lng: {gpsLocation.lng.toFixed(5)}°</span>
                {gpsTelemetry.elevationMsl !== undefined && (
                  <span>Elev: {gpsTelemetry.elevationMsl}m MSL</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onRefresh}
            title="Refresh GPS Intelligence"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-900/60 text-slate-300 hover:text-cyan-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Radius Quick Selector */}
        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
          <span className="text-slate-400 font-medium">Search Radius:</span>
          <div className="flex space-x-1">
            {[5, 10, 25, 50].map((r) => (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                  selectedRadiusKm === r
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-3 pt-1 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-2.5 font-semibold transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview & Estimate
        </button>
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`pb-2 px-2.5 font-semibold transition border-b-2 ${
            activeTab === 'breakdown'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Confidence & Physics
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`pb-2 px-2.5 font-semibold transition border-b-2 ${
            activeTab === 'actions'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Digital Twin Engines
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-3.5 space-y-3">
        {activeTab === 'overview' && (
          <>
            {/* Primary Estimation Box */}
            <div className="bg-gradient-to-br from-cyan-950/50 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl p-3 shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-cyan-300 mb-1">
                <span className="font-semibold uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Estimated Groundwater Condition at GPS</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-400/30">
                  IDW Model
                </span>
              </div>

              <div className="flex items-baseline space-x-2 my-1">
                <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {estimatedWaterLevelMbgl}
                </span>
                <span className="text-sm font-bold text-cyan-400">mbgl</span>
                <span className="text-xs text-slate-400 font-normal ml-auto">
                  ({(150 - estimatedWaterLevelMbgl).toFixed(1)} m MSL Head)
                </span>
              </div>

              <div className="text-[11px] text-amber-300/90 font-medium italic mt-1 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">
                ⚠ Note: Interpolated spatial condition at current GPS coordinate based on {validWellsCount} surrounding observation stations.
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Nearby Monitoring Wells</div>
                <div className="text-sm font-bold text-white mt-0.5 font-mono">
                  {nearbyWellsCount} Wells
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Nearest: <span className="text-cyan-300 font-medium">{nearestWellDistanceKm} km</span> ({nearestWellId})
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Latest Nearby Observation</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5 font-mono">
                  {latestNearbyObservation.waterLevelMbgl} mbgl
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Date: <span className="text-slate-300">{latestNearbyObservation.observationDate}</span>
                </div>
              </div>
            </div>

            {/* Status Pills */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold">
              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 uppercase text-[9px]">Seasonal Status</div>
                <div className={`mt-0.5 font-bold ${
                  seasonalCondition === 'EXCELLENT' ? 'text-emerald-400' :
                  seasonalCondition === 'NORMAL' ? 'text-cyan-400' :
                  seasonalCondition === 'BELOW NORMAL' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {seasonalCondition}
                </div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 uppercase text-[9px]">Long-Term Trend</div>
                <div className="mt-0.5 font-bold text-amber-400 truncate" title={longTermTrend}>
                  {longTermTrend.split(' ')[0]}
                </div>
              </div>

              <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 uppercase text-[9px]">Groundwater Stress</div>
                <div className={`mt-0.5 font-bold ${
                  localGroundwaterStress === 'LOW' ? 'text-emerald-400' :
                  localGroundwaterStress === 'MODERATE' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {localGroundwaterStress}
                </div>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Estimation Confidence Score</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">{confidenceScore}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    confidenceScore >= 80 ? 'bg-emerald-500' :
                    confidenceScore >= 60 ? 'bg-cyan-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'breakdown' && (
          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Confidence Assessment Matrix</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Nearby Data Density</div>
                  <div className="font-semibold text-white mt-0.5">{confidenceBreakdown.nearbyDataDensity} ({validWellsCount} stations)</div>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Observation Freshness</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">{confidenceBreakdown.observationFreshness}</div>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Elevation Compatibility</div>
                  <div className="font-semibold text-cyan-300 mt-0.5">{confidenceBreakdown.elevationCompatibility}</div>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Spatial Distribution</div>
                  <div className="font-semibold text-white mt-0.5">{confidenceBreakdown.spatialDistribution}</div>
                </div>
              </div>
            </div>

            {/* Hydrogeological Physics Parameters */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
                Subsurface Hydraulic Properties
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex justify-between py-0.5 border-b border-slate-850">
                  <span className="text-slate-400">Hydraulic Conductivity (K):</span>
                  <span className="font-mono text-cyan-300 font-medium">{hydraulicParameters.estimatedKValueMDay} m/day</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-850">
                  <span className="text-slate-400">Transmissivity (T):</span>
                  <span className="font-mono text-cyan-300 font-medium">{hydraulicParameters.transmissivityM2Day} m²/day</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-850">
                  <span className="text-slate-400">Specific Yield (Sy):</span>
                  <span className="font-mono text-cyan-300 font-medium">{hydraulicParameters.specificYieldPct}%</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Recommended MAR:</span>
                  <span className="font-medium text-emerald-300 truncate max-w-[170px]">{hydraulicParameters.recommendedMar}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider px-1">
              Aquifer Digital Twin Analytical Engines
            </div>
            
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={onOpenStressIndex}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-amber-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-amber-400 font-semibold text-[11px]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Stress & Risk Index</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Multi-criteria weighted aquifer risk</div>
              </button>

              <button
                onClick={onOpenMlForecast}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold text-[11px]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>AI/ML Forecast (180d)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">XGBoost-LSTM recharge projections</div>
              </button>

              <button
                onClick={onOpenTimeMachine}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-indigo-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-indigo-400 font-semibold text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time Machine (2010-26)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Historical time-lapse animation</div>
              </button>

              <button
                onClick={onOpenRainfallRecharge}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-blue-400 font-semibold text-[11px]">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Rainfall → Recharge</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Lag time (28d) & SPI drought</div>
              </button>

              <button
                onClick={onOpenMarRecommendation}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-emerald-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find Best MAR Sites</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">AHP site ranking & structures</div>
              </button>

              <button
                onClick={onOpen3dSubsurface}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-purple-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-purple-400 font-semibold text-[11px]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>3D Subsurface Twin</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Stratigraphy, ERT & water table</div>
              </button>

              <button
                onClick={onOpenAnomalies}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-rose-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-rose-400 font-semibold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Anomaly Detection</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Sudden drops & sensor flags</div>
              </button>

              <button
                onClick={onOpenWatershed}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-teal-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-teal-400 font-semibold text-[11px]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Watershed Intel</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Drainage order & runoff volume</div>
              </button>

              <button
                onClick={onOpenContamination}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-orange-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-orange-400 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DRASTIC Vulnerability</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Pollution index & hazard buffers</div>
              </button>

              <button
                onClick={onOpenSurfaceGenerator}
                className="p-2.5 bg-slate-950 hover:bg-slate-850 text-left rounded-lg border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold text-[11px]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Surface Generator</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">IDW/TIN water table grids</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
