import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { ClipboardList, Crosshair, Camera, MapPin, Check, Wifi, Activity, Gauge } from 'lucide-react';
import { ObservationType } from '../types/hydro';
import { BatchPhotoUploader } from '../components/common/BatchPhotoUploader';

export const FieldSurveyPage: React.FC = () => {
  const { addFieldObservation, fieldObservations, activeProjectId, logSystemAction } = useHydroStore();

  const [activeSubTab, setActiveSubTab] = useState<'observation' | 'pumping'>('observation');

  // General Observation state
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

  // Dedicated Pumping Data Entry state
  const [pumpWellId, setPumpWellId] = useState('WEL-PLR-001');
  const [pumpingRateLps, setPumpingRateLps] = useState<number>(12.5);
  const [durationHours, setDurationHours] = useState<number>(24.0);
  const [swlM, setSwlM] = useState<number>(8.5);
  const [pwlM, setPwlM] = useState<number>(14.2);
  const [transmissivityM2D, setTransmissivityM2D] = useState<number>(185.0);
  const [storativity, setStorativity] = useState<number>(0.00045);
  const [pumpingNotes, setPumpingNotes] = useState('');
  const [pumpingSubmitted, setPumpingSubmitted] = useState(false);

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

  const handlePumpingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const drawdown = Number((pwlM - swlM).toFixed(2));
    const specificCapacity = Number((pumpingRateLps / (drawdown || 1)).toFixed(2));

    addFieldObservation({
      projectId: activeProjectId,
      observerName,
      type: 'Well',
      lat: Number(lat),
      lng: Number(lng),
      elevationM: Number(elevationM),
      accuracyM: Number(accuracyM),
      photoUrl,
      notes: `PUMPING TEST RECORD [${pumpWellId}]: Q=${pumpingRateLps} L/s, Duration=${durationHours}h, SWL=${swlM}m, PWL=${pwlM}m, Drawdown=${drawdown}m, Specific Capacity=${specificCapacity} Lps/m. T=${transmissivityM2D} m²/day. Notes: ${pumpingNotes}`,
      syncStatus: 'synced'
    });

    logSystemAction('ADD_PUMPING_TEST_RECORD', 'fieldObservations', `Recorded pumping test for well ${pumpWellId} with Q=${pumpingRateLps} L/s.`);
    setPumpingSubmitted(true);
    setTimeout(() => setPumpingSubmitted(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1300px] mx-auto">
      {/* Header */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <ClipboardList className="w-4 h-4" />
            <span>Module 7: Field Data Collection & Hydro-Pumping Surveys</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Field Survey Collector & Pumping Test Data Entry</h1>
          <p className="text-xs text-slate-400">Capture GPS coordinates, outcrop features, step-drawdown pumping test datasets, and batch field imagery.</p>
        </div>

        {/* Sub-Tab Navigation Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('observation')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'observation'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>General Field Survey</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pumping')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'pumping'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Pumping Test Data</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'pumping' ? (
        /* PUMPING TEST DATA ENTRY SECTION */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handlePumpingSubmit} className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Dedicated Pumping Test Hydrogeological Form</span>
              </h3>
              <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono px-2 py-0.5 rounded">
                Aquifer Hydraulics Integration
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Well ID *</label>
                <input
                  type="text"
                  required
                  value={pumpWellId}
                  onChange={(e) => setPumpWellId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Pumping Rate Q (L/s)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={pumpingRateLps}
                  onChange={(e) => setPumpingRateLps(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Test Duration (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Static Water Level (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={swlM}
                  onChange={(e) => setSwlM(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Pumping Level (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pwlM}
                  onChange={(e) => setPwlM(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Calculated Drawdown s</label>
                <div className="w-full bg-slate-900 border border-cyan-800/80 rounded p-2 text-cyan-300 font-bold font-mono">
                  {(pwlM - swlM).toFixed(2)} m
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Specific Capacity</label>
                <div className="w-full bg-slate-900 border border-cyan-800/80 rounded p-2 text-emerald-400 font-bold font-mono">
                  {(pumpingRateLps / ((pwlM - swlM) || 1)).toFixed(2)} Lps/m
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Aquifer Transmissivity T (m²/day)</label>
                <input
                  type="number"
                  step="1"
                  value={transmissivityM2D}
                  onChange={(e) => setTransmissivityM2D(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Storativity S (Dimensionless)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={storativity}
                  onChange={(e) => setStorativity(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hydraulic Recovery & Boundary Notes</label>
              <textarea
                rows={3}
                value={pumpingNotes}
                onChange={(e) => setPumpingNotes(e.target.value)}
                placeholder="Log residual drawdown recovery rate, barrier boundary effects, or well discharge stability..."
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-md flex items-center justify-center space-x-2"
            >
              <Gauge className="w-4 h-4" />
              <span>Save Pumping Test Dataset</span>
            </button>

            {pumpingSubmitted && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-lg text-center font-bold">
                Pumping test dataset successfully saved and logged in system audit trail!
              </div>
            )}
          </form>

          {/* Quick Hydraulic Summary */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs">
            <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Pumping Test Parameters</h3>
            <div className="space-y-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase">Yield Classification</span>
                <div className="text-sm font-bold text-cyan-400">
                  {pumpingRateLps > 15 ? 'High Yield Aquifer (>15 L/s)' : pumpingRateLps > 5 ? 'Moderate Yield (5-15 L/s)' : 'Low Yield Fractured Aquifer (<5 L/s)'}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase">Drawdown Ratio</span>
                <div className="text-sm font-bold text-emerald-400">
                  {(((pwlM - swlM) / (swlM || 1)) * 100).toFixed(1)}% SWL Displacement
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded border border-slate-700/60 text-[11px] text-slate-400 leading-relaxed">
                Pumping test datasets evaluate Cooper-Jacob and Theis drawdown curves to estimate local transmissivity and sustainable yield limits under CGWB norms.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GENERAL FIELD OBSERVATION SECTION */
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
      )}

      {/* Batch Photo Uploads */}
      <BatchPhotoUploader
        moduleTitle="Module 7: Field Hydrogeology Outcrop & Survey Photo Documentation"
        onPhotosUploaded={(photos) => {
          logSystemAction('UPLOAD_BATCH_PHOTOS', 'fieldSurvey', `Uploaded ${photos.length} photos for field survey geological outcrops.`);
        }}
      />
    </div>
  );
};
