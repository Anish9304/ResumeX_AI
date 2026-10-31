import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

export default function ScoreGauge({
  score = 0,
  keywordMatchRate = 0,
  matchedCount = 0,
  missingCount = 0,
}) {
  // Fire confetti on high score!
  useEffect(() => {
    if (score >= 80) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [score]);

  // Color logic
  const getColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'High ATS Match' };
    if (s >= 60) return { stroke: '#0ea5e9', text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', label: 'Good Match' };
    if (s >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Moderate Match' };
    return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', label: 'Low ATS Match' };
  };

  const current = getColor(score);

  // SVG circular calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-400" />
          Overall ATS Compatibility
        </h3>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${current.bg} ${current.text} ${current.border}`}>
          {current.label}
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-800"
          />
          {/* Animated progress circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={current.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${current.text}`}>
            {score}%
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
            ATS Score
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-800 text-center">
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium">Keyword Match</div>
          <div className="text-base font-bold text-slate-100 mt-0.5">{keywordMatchRate}%</div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium">Matched</div>
          <div className="text-base font-bold text-emerald-400 mt-0.5">{matchedCount} Skills</div>
        </div>
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="text-xs text-slate-400 font-medium">Missing</div>
          <div className="text-base font-bold text-rose-400 mt-0.5">{missingCount} Skills</div>
        </div>
      </div>
    </div>
  );
}
