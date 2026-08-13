import React, { useState } from 'react';
import { MarSiteRecommendation } from '../../types/groundwater';
import { marSuitabilityEngine } from '../../services/groundwater/marSuitabilityEngine';
import { 
  X, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  MapPin, 
  Sliders, 
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  onClose: () => void;
  onSelectSite?: (site: MarSiteRecommendation) => void;
}

export const MarRecommendationModal: React.FC<Props> = ({ lat, lng, onClose, onSelectSite }) => {
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const candidates: MarSiteRecommendation[] = marSuitabilityEngine.findBestMarLocations(lat, lng, radiusKm);

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      name: `MAR_Candidate_Recommendations_${Date.now()}`,
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: candidates.map((c) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [c.lng, c.lat]
        },
        properties: {
          candidateId: c.candidateId,
          rank: c.rank,
          siteName: c.siteName,
          suitabilityScorePct: c.suitabilityScorePct,
          recommendedStructure: c.recommendedStructure,
          estimatedStorageM3: c.estimatedStorageM3,
          estimatedAnnualRechargeM3: c.estimatedAnnualRechargeM3,
          slopePct: c.slopePct,
          soilPermeabilityMmHr: c.soilPermeabilityMmHr,
          drainageOrder: c.drainageOrder,
          distanceFromStreamM: c.distanceFromStreamM,
          geologySuitability: c.geologySuitability
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MAR_Candidate_Sites_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center space-x-2">
                <span>Automated MAR Suitability & Site Finder</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AHP / MCDA Ranker
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Managed Aquifer Recharge site ranking based on slope, soil, geology, drainage order, and stream proximity.
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
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">
              Found <strong className="text-emerald-400 font-mono">{candidates.length} Candidate Sites</strong> within {radiusKm} km radius
            </span>
            <button
              onClick={handleExportGeoJSON}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GeoJSON</span>
            </button>
          </div>

          {/* Candidate Site Cards */}
          <div className="space-y-3">
            {candidates.map((site) => (
              <div 
                key={site.candidateId}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 transition space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                      #{site.rank}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{site.siteName}</h4>
                      <div className="text-[11px] font-mono text-slate-400">
                        {site.lat.toFixed(5)}°, {site.lng.toFixed(5)}° • {site.distanceFromStreamM}m from drainage line
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-400 font-mono">
                      {site.suitabilityScorePct}%
                    </div>
                    <div className="text-[10px] text-slate-400">Suitability Score</div>
                  </div>
                </div>

                {/* Structure Pill */}
                <div className="flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-lg border border-slate-850">
                  <div className="space-x-1.5">
                    <span className="text-slate-400">Recommended Structure:</span>
                    <span className="font-bold text-cyan-300">{site.recommendedStructure}</span>
                  </div>
                  <div className="text-slate-300 font-mono">
                    Storage: <span className="font-semibold text-emerald-400">{(site.estimatedStorageM3 / 1000).toFixed(0)}k m³</span>
                  </div>
                </div>

                {/* Hydrogeological Criteria */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-850">
                    <span className="text-slate-500 block text-[10px]">Slope / Grade:</span>
                    <span className="font-mono text-slate-200">{site.slopePct}% Slope</span>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-850">
                    <span className="text-slate-500 block text-[10px]">Soil Permeability:</span>
                    <span className="font-mono text-slate-200">{site.soilPermeabilityMmHr} mm/h</span>
                  </div>
                  <div className="p-1.5 bg-slate-900/60 rounded border border-slate-850">
                    <span className="text-slate-500 block text-[10px]">Drainage Order:</span>
                    <span className="font-mono text-slate-200">Stream Order {site.drainageOrder}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 italic">
                  Geology: {site.geologySuitability}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close MAR Finder
          </button>
        </div>
      </div>
    </div>
  );
};
