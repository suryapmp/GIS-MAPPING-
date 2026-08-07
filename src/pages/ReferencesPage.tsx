import React, { useState } from 'react';
import { useHydroStore } from '../stores/useHydroStore';
import { BookOpen, Search, ExternalLink, Plus } from 'lucide-react';

export const ReferencesPage: React.FC = () => {
  const { scientificReferences, addScientificReference } = useHydroStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [year, setYear] = useState<number>(2024);
  const [journal, setJournal] = useState('');
  const [doiUrl, setDoiUrl] = useState('');

  const filteredRefs = scientificReferences.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authors) return;

    addScientificReference({
      title,
      authors,
      organization: journal || 'Hydrogeology Research Journal',
      year: Number(year),
      source: journal,
      url: doiUrl,
      citation: `${authors} (${year}). ${title}. ${journal}.`,
      geographicCoverage: 'Global / Hard Rock Aquifers',
      keywords: ['AHP', 'Groundwater', 'Hydrogeology']
    });

    setTitle('');
    setAuthors('');
    setShowModal(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Module 14: Scientific Reference Literature</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Peer-Reviewed Hydrogeological Literature Database</h1>
          <p className="text-xs text-slate-400">Search citations, DOI paper links, geographic coverage, and methodology keywords.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center space-x-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Literature Reference</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search literature by title, authors, or keywords (e.g., AHP, Random Forest, Hard Rock)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Reference Cards */}
      <div className="space-y-4">
        {filteredRefs.map((ref) => (
          <div key={ref.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">[{ref.year}]</span>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">{ref.title}</h3>
                <p className="text-xs text-slate-300 font-medium italic mt-1">{ref.authors}</p>
              </div>

              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs font-semibold flex items-center space-x-1 flex-shrink-0"
                >
                  <span>DOI Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 font-mono">
              {ref.citation}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {ref.keywords.map((kw, idx) => (
                <span key={idx} className="bg-slate-800 text-cyan-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-white">Add Scientific Literature Reference</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Authors *</label>
                  <input
                    type="text"
                    required
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    placeholder="e.g., Smith, J., & Davis, R."
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Publication Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Journal / Conference Source</label>
                <input
                  type="text"
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="e.g., Hydrogeology Journal"
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">DOI / URL</label>
                <input
                  type="text"
                  value={doiUrl}
                  onChange={(e) => setDoiUrl(e.target.value)}
                  placeholder="https://doi.org/10.1007/..."
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold">
                  Save Reference
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
