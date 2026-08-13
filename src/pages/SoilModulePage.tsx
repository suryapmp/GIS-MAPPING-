import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { FlaskConical, Plus, MapPin, Calendar, FileText } from 'lucide-react';
import { BatchPhotoUploader } from '../components/common/BatchPhotoUploader';

export const SoilModulePage: React.FC = () => {
  const { soilSamples, addSoilSample, activeProjectId, logSystemAction } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [sampleId, setSampleId] = useState('');
  const [lat, setLat] = useState<number>(12.860);
  const [lng, setLng] = useState<number>(79.030);
  const [depthCm, setDepthCm] = useState<number>(45);
  const [texture, setTexture] = useState<'Sandy Loam' | 'Clay' | 'Silt Loam' | 'Loam' | 'Silty Clay' | 'Sandy Clay Loam' | 'Gravelly Sand'>('Sandy Loam');
  const [color, setColor] = useState('7.5YR 4/4 Strong Brown');
  const [structure, setStructure] = useState<'Granular' | 'Blocky' | 'Prismatic' | 'Platy' | 'Massive'>('Granular');
  const [moisture, setMoisture] = useState<'Dry' | 'Moist' | 'Saturated'>('Moist');
  const [gravelPercent, setGravelPercent] = useState<number>(5);
  const [landUse, setLandUse] = useState('Agriculture');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleId) return;

    addSoilSample({
      projectId: activeProjectId,
      sampleId,
      lat: Number(lat),
      lng: Number(lng),
      depthCm: Number(depthCm),
      date: new Date().toISOString().split('T')[0],
      texture,
      color,
      structure,
      moisture,
      gravelPercent: Number(gravelPercent),
      organicMatterObs: 'Observed topsoil organic layer',
      landUse
    });

    setSampleId('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase font-bold">
            <FlaskConical className="w-4 h-4" />
            <span>Module 8: Soil Sampling & Physical Properties</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Pedological Soil Field Observations</h1>
          <p className="text-xs text-slate-400">Record soil texture, Munsell color, structural aggregates, and permeability indicators.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Soil Sample</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {soilSamples.map((soil) => (
          <div key={soil.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono font-bold text-amber-400 text-sm">{soil.sampleId}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                Depth: {soil.depthCm} cm
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong>Texture:</strong> <span className="text-amber-300 font-semibold">{soil.texture}</span></p>
              <p><strong>Munsell Color:</strong> {soil.color}</p>
              <p><strong>Structure:</strong> {soil.structure}</p>
              <p><strong>Moisture Status:</strong> {soil.moisture}</p>
              <p><strong>Gravel Content:</strong> {soil.gravelPercent}%</p>
              <p><strong>Land Use Cover:</strong> {soil.landUse}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>GPS: [{soil.lat.toFixed(4)}, {soil.lng.toFixed(4)}]</span>
              <span>{soil.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Photo Uploads */}
      <BatchPhotoUploader
        moduleTitle="Module 8: Soil Profile & Pit Photo Documentation"
        onPhotosUploaded={(photos) => {
          logSystemAction('UPLOAD_BATCH_PHOTOS', 'soilSamples', `Uploaded ${photos.length} photos for soil pit profiles & core horizons.`);
        }}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Record Soil Sample Field Properties</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Sample ID *</label>
                  <input
                    type="text"
                    required
                    value={sampleId}
                    onChange={(e) => setSampleId(e.target.value)}
                    placeholder="e.g., SMP-PLR-C3"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Sampling Depth (cm)</label>
                  <input
                    type="number"
                    value={depthCm}
                    onChange={(e) => setDepthCm(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Soil Texture Class</label>
                  <select
                    value={texture}
                    onChange={(e) => setTexture(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Silt Loam">Silt Loam</option>
                    <option value="Loam">Loam</option>
                    <option value="Silty Clay">Silty Clay</option>
                    <option value="Sandy Clay Loam">Sandy Clay Loam</option>
                    <option value="Gravelly Sand">Gravelly Sand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Munsell Soil Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded font-bold"
                >
                  Save Soil Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
