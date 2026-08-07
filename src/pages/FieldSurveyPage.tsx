import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { ClipboardList, Crosshair, Camera, MapPin, Check, Wifi, WifiOff } from 'lucide-react';
import { ObservationType } from '../types/hydro';

export const FieldSurveyPage: React.FC = () => {
  const { addFieldObservation, fieldObservations, activeProjectId } = useHydroStore();

  const [observerName, setObserverName] = useState('Dr. Field Surveyor');
  const [type, setType] = useState<ObservationType>('Soil');
  const [lat, setLat] = useState<number>(12.855);
  const [lng, setLng] = useState<number>(79.020);
  const [elevationM, setElevationM] = useState<number>(142.5);
  const [accuracyM, setAccuracyM] = useState<number>(3.2);
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setAccuracyM(pos.coords.accuracy);
          setIsCapturingGps(false);
        },
        () => {
          setIsCapturingGps(false);
        }
      );
    } else {
      setIsCapturingGps(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes) return;

    addFieldObservation({
      projectId: activeProjectId,
      observerName,
      type,
      lat: Number(lat),
      lng: Number(lng),
      elevationM: Number(elevationM),
      accuracyM: Number(accuracyM),
      photoUrl,
      notes,
      syncStatus: 'synced'
    });

    setNotes('');
    setPhotoUrl('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <ClipboardList className="w-4 h-4" />
            <span>Module 7: Field Data Collection</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Mobile-Friendly Field Survey Collector</h1>
          <p className="text-xs text-slate-400">Capture GPS coordinates, elevation, site photos, and field observations offline or online.</p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>Online Sync Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Record Field Observation</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Surveyor Name *</label>
              <input
                type="text"
                required
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Observation Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ObservationType)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              >
                <option value="Soil">Soil Observation</option>
                <option value="Well">Well Monitoring</option>
                <option value="Geology">Geology / Outcrop</option>
                <option value="Hydrogeology">Hydrogeological Spring/Seep</option>
                <option value="Recharge">Recharge Potential</option>
                <option value="Drainage">Drainage Channel</option>
                <option value="LandUse">Land Use Cover</option>
                <option value="General">General Field Note</option>
              </select>
            </div>
          </div>

          {/* GPS Capture HUD */}
          <div className="bg-slate-950 p-4 rounded-lg border border-cyan-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 text-xs uppercase font-mono">GPS Telemetry Capture</span>
              <button
                type="button"
                onClick={handleCaptureGps}
                disabled={isCapturingGps}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center space-x-1"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isCapturingGps ? 'animate-spin' : ''}`} />
                <span>{isCapturingGps ? 'Fixing Satellites...' : 'Get Current GPS'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Latitude</div>
                <div className="font-bold text-slate-200">{lat.toFixed(5)}°N</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Longitude</div>
                <div className="font-bold text-slate-200">{lng.toFixed(5)}°E</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Elevation</div>
                <div className="font-bold text-emerald-400">{elevationM} m</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">GPS Accuracy</div>
                <div className="font-bold text-amber-400">±{accuracyM} m</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Field Photo URL / Storage Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://firebasestorage.googleapis.com/.../outcrop_photo.jpg"
                className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
              />
              <button type="button" className="p-2 bg-slate-800 border border-slate-700 rounded text-slate-300">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Observation Notes & Scientific Findings *</label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record rock weathering grade, soil texture, water seepage discharge, or structural jointing..."
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-md flex items-center justify-center space-x-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Submit Observation Record</span>
          </button>

          {submitted && (
            <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-lg text-center font-bold">
              Observation record saved successfully!
            </div>
          )}
        </form>

        {/* Recent Observations List */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Recent Field Surveys ({fieldObservations.length})</h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {fieldObservations.length === 0 ? (
              <div className="text-center p-8 text-slate-500 italic">No field observations recorded yet. Submit the form on the left to add records.</div>
            ) : (
              fieldObservations.map((obs) => (
                <div key={obs.id} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 uppercase font-mono text-[11px]">{obs.type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(obs.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200">{obs.notes}</p>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-700/50">
                    <span>GPS: [{obs.lat.toFixed(4)}, {obs.lng.toFixed(4)}] (±{obs.accuracyM}m)</span>
                    <span className="text-emerald-400 font-semibold">{obs.observerName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
