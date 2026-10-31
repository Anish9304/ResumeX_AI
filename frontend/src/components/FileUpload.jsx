import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, X, FileCode, Edit3 } from 'lucide-react';

export default function FileUpload({
  file,
  setFile,
  pastedText,
  setPastedText,
  inputMode,
  setInputMode,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const ext = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(ext)) {
      alert('Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
    setInputMode('file');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header & Mode Switcher */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm sm:text-base">1. Your Resume</h3>
            <p className="text-xs text-slate-400">PDF, DOCX, or direct text</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/60 text-xs">
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              inputMode === 'file'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('paste')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              inputMode === 'paste'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      {inputMode === 'file' ? (
        <div className="flex-1 flex flex-col">
          {file ? (
            <div className="flex-1 min-h-[220px] border-2 border-emerald-500/30 bg-emerald-950/10 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100 text-sm break-all">{file.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Ready for ATS Analysis
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-brand-400 hover:underline"
                >
                  Change file
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-h-[220px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragging
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-slate-700/80 hover:border-brand-500/50 hover:bg-slate-800/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-800 text-brand-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                Drop your resume here, or <span className="text-brand-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT (up to 10MB)</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your raw resume text here (experience, skills, education, projects)..."
            className="w-full flex-1 min-h-[220px] p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none font-mono"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>{pastedText.length} characters</span>
            {pastedText && (
              <button
                type="button"
                onClick={() => setPastedText('')}
                className="text-slate-400 hover:text-rose-400"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FileCheck2(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m3 15 2 2 4-4" />
    </svg>
  );
}
