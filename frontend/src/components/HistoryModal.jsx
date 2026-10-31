import React from 'react';
import { X, Trash2, Calendar, Award, ArrowUpRight, History } from 'lucide-react';

export default function HistoryModal({
  isOpen,
  onClose,
  history = [],
  onSelectReport,
  onDeleteReport,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-base">Analysis History</h3>
              <p className="text-xs text-slate-400">Previous resume ATS scans and reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No previous scans found. Run your first analysis to see reports here!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-brand-500/40 hover:bg-slate-800/40 transition flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => {
                  onSelectReport(item.id);
                  onClose();
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-100 text-sm truncate">
                      {item.targetJobTitle || 'Target Role'}
                    </h4>
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md truncate max-w-[120px]">
                      {item.fileName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-brand-400" />
                      ATS Score: <strong className="text-slate-200">{item.atsScore}%</strong>
                    </span>
                    <span>Matched: {item.matchedSkillsCount}</span>
                    <span>Missing: {item.missingSkillsCount}</span>
                    <span className="text-slate-500 hidden sm:inline">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(item.id);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
