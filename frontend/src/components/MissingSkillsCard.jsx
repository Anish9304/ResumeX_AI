import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Copy, Check, Filter, Layers } from 'lucide-react';
import { copyToClipboard } from '../utils/exportUtils';

export default function MissingSkillsCard({
  missingSkills = [],
  matchedSkills = [],
}) {
  const [filter, setFilter] = useState('missing');
  const [copied, setCopied] = useState(false);

  const handleCopyMissing = async () => {
    const text = missingSkills.join(', ');
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-semibold text-slate-100 text-base flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-400" />
            Skills Analysis & Gap Detection
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Keywords extracted from the Job Description vs your Resume
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'missing'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Missing ({missingSkills.length})
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'matched'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Matched ({matchedSkills.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({missingSkills.length + matchedSkills.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto max-h-[340px] pr-1">
        {/* Missing Skills Section */}
        {(filter === 'missing' || filter === 'all') && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Missing Critical Skills ({missingSkills.length})
              </span>

              {missingSkills.length > 0 && (
                <button
                  onClick={handleCopyMissing}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-200 transition"
                  title="Copy missing skills as comma-separated list"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy list</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {missingSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Great job! No major required skills are missing from your resume.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-2 italic">
              💡 Tip: Integrate these missing keywords naturally into your Work Experience bullet points and Technical Skills section.
            </p>
          </div>
        )}

        {/* Matched Skills Section */}
        {(filter === 'matched' || filter === 'all') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Matched Skills ({matchedSkills.length})
              </span>
            </div>

            {matchedSkills.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400">
                No overlapping skills detected yet. Check if keywords match the role requirements.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
