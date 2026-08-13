import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { TestTube, Plus, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BatchPhotoUploader } from '../components/common/BatchPhotoUploader';

export const SoilLabDataPage: React.FC = () => {
  const { soilLabResults, soilSamples, addSoilLabResult, logSystemAction } = useHydroStore();
  const [showModal, setShowModal] = useState(false);

  const [sampleId, setSampleId] = useState(soilSamples[0]?.sampleId || 'SMP-PLR-A1');
  const [ph, setPh] = useState<number>(7.4);
  const [ec, setEc] = useState<number>(0.55);
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.72);
  const [nitrogen, setNitrogen] = useState<number>(195.0);
  const [phosphorus, setPhosphorus] = useState<number>(24.0);
  const [potassium, setPotassium] = useState<number>(225.0);
  const [labName, setLabName] = useState('Central Hydrogeochemical Laboratory');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addSoilLabResult({
      sampleId,
      ph: Number(ph),
      ecDsM: Number(ec),
      organicCarbonPercent: Number(organicCarbon),
      nitrogenMgKg: Number(nitrogen),
      phosphorusMgKg: Number(phosphorus),
      potassiumMgKg: Number(potassium),
      sulphurMgKg: 15.0,
      zincMgKg: 1.2,
      ironMgKg: 5.5,
      manganeseMgKg: 3.1,
      copperMgKg: 0.9,
      boronMgKg: 0.45,
      method: 'Flame Photometer & AAS Titration',
      labName,
      verified: true,
      testDate: new Date().toISOString().split('T')[0]
    });

    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs uppercase font-bold">
            <TestTube className="w-4 h-4" />
            <span>Module 9: Soil Laboratory Analytics</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Physico-Chemical Laboratory Results</h1>
          <p className="text-xs text-slate-400">Store verified laboratory parameters including pH, EC, Organic Carbon, Macro and Micro Nutrients.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lab Analysis</span>
        </button>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {soilLabResults.map((lab) => (
          <div key={lab.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono font-bold text-indigo-400 text-sm">{lab.sampleId}</span>
                <p className="text-[11px] text-slate-400">{lab.labName}</p>
              </div>
              <div className="flex items-center space-x-1 bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>

            {/* Parameter Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-800/60 p-2 rounded border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase">pH Level</div>
                <div className="font-bold text-cyan-400 text-sm">{lab.ph}</div>
              </div>
              <div className="bg-slate-800/60 p-2 rounded border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase">EC (dS/m)</div>
                <div className="font-bold text-indigo-400 text-sm">{lab.ecDsM}</div>
              </div>
              <div className="bg-slate-800/60 p-2 rounded border border-slate-700/50">
                <div className="text-[10px] text-slate-400 uppercase">Org Carbon %</div>
                <div className="font-bold text-emerald-400 text-sm">{lab.organicCarbonPercent}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">N (mg/kg)</div>
                <div className="font-bold text-slate-200">{lab.nitrogenMgKg}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">P (mg/kg)</div>
                <div className="font-bold text-slate-200">{lab.phosphorusMgKg}</div>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">K (mg/kg)</div>
                <div className="font-bold text-slate-200">{lab.potassiumMgKg}</div>
              </div>
            </div>

            <div className="pt-2 text-[11px] font-mono text-slate-500 flex justify-between border-t border-slate-800">
              <span>Method: {lab.method}</span>
              <span>Test Date: {lab.testDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Photo Uploads */}
      <BatchPhotoUploader
        moduleTitle="Module 9: Soil Laboratory Analytical Setups & Specimen Photos"
        onPhotosUploaded={(photos) => {
          logSystemAction('UPLOAD_BATCH_PHOTOS', 'soilLabData', `Uploaded ${photos.length} photos for lab equipment & specimen documentation.`);
        }}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Add Soil Lab Analysis Result</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Sample ID *</label>
                <input
                  type="text"
                  required
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">EC (dS/m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={ec}
                    onChange={(e) => setEc(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Organic C %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={organicCarbon}
                    onChange={(e) => setOrganicCarbon(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nitrogen (mg/kg)</label>
                  <input
                    type="number"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phosphorus (mg/kg)</label>
                  <input
                    type="number"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Potassium (mg/kg)</label>
                  <input
                    type="number"
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Testing Laboratory Name</label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold"
                >
                  Save Lab Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
