import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';

export default function InsightsCard({
  summaryFeedback = '',
  strengths = [],
  weaknesses = [],
  sectionFeedbacks = {},
}) {
  const [expandedSection, setExpandedSection] = useState('experience');

  const sections = [
    { key: 'experience', label: 'Work Experience', feedback: sectionFeedbacks?.experience },
    { key: 'skills', label: 'Skills Section', feedback: sectionFeedbacks?.skills },
    { key: 'education', label: 'Education & Certifications', feedback: sectionFeedbacks?.education },
    { key: 'formatting', label: 'ATS Formatting & Structure', feedback: sectionFeedbacks?.formatting },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Executive Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm">Recruiter & ATS Assessment</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {summaryFeedback || 'Resume analysis completed. Review the strengths and weaknesses below to tailor your application.'}
        </p>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Key Strengths ({strengths.length})
          </div>
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Red Flags */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            ATS Vulnerabilities ({weaknesses.length})
          </div>
          <ul className="space-y-2">
            {weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section-by-Section Feedback */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-brand-400" />
          Section-by-Section Improvements
        </h4>

        <div className="space-y-2">
          {sections.map(({ key, label, feedback }) => {
            const isExpanded = expandedSection === key;
            return (
              <div
                key={key}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/30 transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedSection(isExpanded ? null : key)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/30 transition"
                >
                  <span className="text-xs sm:text-sm font-medium text-slate-200">{label}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-1 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed">
                    {feedback || 'Follow standard ATS guidelines for this section.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
