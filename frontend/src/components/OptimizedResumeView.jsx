import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Printer,
  Sparkles,
  Check,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { copyToClipboard, downloadFile, printResume } from '../utils/exportUtils';

export default function OptimizedResumeView({
  optimizedResume = {},
  onRegenerate,
  isRegenerating = false,
}) {
  const [activeTab, setActiveTab] = useState('preview');
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState('impactful');

  const {
    markdown = '',
    plainText = '',
    headline = '',
    summary = '',
    skillsFormatted = [],
    bulletImprovements = [],
  } = optimizedResume;

  const handleCopy = async () => {
    const success = await copyToClipboard(markdown || plainText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(
      markdown || plainText,
      'ResumeX_Optimized_Resume.md',
      'text/markdown'
    );
  };

  const handlePrint = () => {
    printResume();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg">AI-Optimized ATS Resume</h3>
              <p className="text-xs text-slate-400">
                Rewritten with target keywords, XYZ accomplishment formula, and ATS single-column structure
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tone Selector & Regenerate */}
          {onRegenerate && (
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-transparent text-slate-300 text-xs focus:outline-none px-2 py-1"
                disabled={isRegenerating}
              >
                <option value="impactful" className="bg-slate-900">Tone: Impactful</option>
                <option value="executive" className="bg-slate-900">Tone: Executive</option>
                <option value="technical" className="bg-slate-900">Tone: Technical</option>
                <option value="concise" className="bg-slate-900">Tone: Concise</option>
              </select>

              <button
                type="button"
                onClick={() => onRegenerate(tone)}
                disabled={isRegenerating}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-medium transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>Re-Optimize</span>
              </button>
            </div>
          )}

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>

          {/* Print / Save PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium shadow-md shadow-brand-500/20 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'preview'
              ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Formatted Resume Preview
        </button>
        <button
          onClick={() => setActiveTab('improvements')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'improvements'
              ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Rewritten Bullet Improvements ({bulletImprovements.length})
        </button>
        <button
          onClick={() => setActiveTab('markdown')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'markdown'
              ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Raw Markdown
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'preview' && (
        <div className="bg-slate-950 rounded-xl p-3 sm:p-6 border border-slate-800/80 shadow-inner max-h-[650px] overflow-y-auto">
          {/* Printable Resume Container (Clean Black & White / Strict 1-Page ATS Typography) */}
          <div
            id="printable-resume"
            className="bg-white text-gray-900 p-6 sm:p-8 rounded-lg shadow-2xl max-w-3xl mx-auto font-sans leading-tight text-xs selection:bg-gray-200"
          >
            <FormattedMarkdownToHtml markdown={markdown || plainText} />
          </div>
        </div>
      )}

      {activeTab === 'improvements' && (
        <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Quantifiable Bullet Point Enhancements (XYZ Formula)
          </div>
          <p className="text-xs text-slate-400">
            How statements were rewritten: "Accomplished [X] as measured by [Y] by doing [Z]" to dramatically increase ATS ranking and recruiter engagement.
          </p>

          <div className="space-y-3 pt-2">
            {bulletImprovements.map((point, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="leading-relaxed">{point}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'markdown' && (
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
          <textarea
            readOnly
            value={markdown || plainText}
            className="w-full h-[500px] bg-transparent text-slate-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Lightweight, safe parser for Strict 1-Page ATS Markdown format
 */
function FormattedMarkdownToHtml({ markdown }) {
  if (!markdown) {
    return <div className="text-gray-400">No optimized resume generated yet.</div>;
  }

  const lines = markdown.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Main Name / Header 1
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-xl font-extrabold text-gray-900 tracking-tight pb-0.5 border-b border-gray-400 mb-1">
              {trimmed.replace('# ', '')}
            </h1>
          );
        }

        // Section Titles / Header 2 or 3
        if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
          const title = trimmed.replace(/^#{2,3}\s*/, '');
          return (
            <h2 key={idx} className="text-[11px] font-bold tracking-wider uppercase text-gray-900 mt-2.5 pb-0.5 border-b border-gray-400 mb-1">
              {title}
            </h2>
          );
        }

        // Divider
        if (trimmed === '---') {
          return null;
        }

        // Bullet points
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[-*]\s*/, '');
          return (
            <div key={idx} className="bullet-row flex items-start gap-1.5 pl-1 text-[11px] text-gray-800 leading-normal mb-0.5">
              <span className="bullet-point font-bold text-gray-900 leading-none mt-0.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: renderInlineBold(content) }} />
            </div>
          );
        }

        // Subheaders like **Role** | Company
        if (trimmed.startsWith('**') && trimmed.includes('|')) {
          return (
            <div key={idx} className="text-[11px] font-semibold text-gray-900 mt-1" dangerouslySetInnerHTML={{ __html: renderInlineBold(trimmed) }} />
          );
        }

        // Italic dates like *Jan 2022 - Present*
        if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
          return (
            <div key={idx} className="text-[10px] italic text-gray-600 mb-0.5">
              {trimmed.replace(/\*/g, '')}
            </div>
          );
        }

        // Standard text
        if (trimmed) {
          return (
            <p key={idx} className="text-[11px] text-gray-800 leading-normal mb-1" dangerouslySetInnerHTML={{ __html: renderInlineBold(trimmed) }} />
          );
        }

        return null;
      })}
    </div>
  );
}

function renderInlineBold(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
}
