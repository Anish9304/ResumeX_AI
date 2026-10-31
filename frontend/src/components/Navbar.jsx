import React from 'react';
import { Sparkles, History, Database, Cpu, RefreshCw } from 'lucide-react';

export default function Navbar({
  systemHealth,
  historyCount,
  onOpenHistory,
  onLoadSample,
  isAnalyzing,
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="ResumeX AI Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(14,140,233,0.35)] hover:scale-105 transition-transform select-none"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ResumeX <span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              ATS Analyzer • Skill Gap Detection • Resume Optimizer
            </p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Status Badges */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            {systemHealth?.geminiConfigured ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-3.5 h-3.5" />
                Gemini AI Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Add GEMINI_API_KEY to backend/.env for generative model">
                <Cpu className="w-3.5 h-3.5" />
                Local ATS Engine
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                systemHealth?.databaseConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              {systemHealth?.databaseConnected ? 'MongoDB' : 'Memory Store'}
            </span>
          </div>

          {/* Quick Demo Sample Button */}
          <button
            onClick={onLoadSample}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
            title="Load sample full-stack resume and JD"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden sm:inline">Load Sample</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border border-brand-500/30 transition shadow-sm"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
