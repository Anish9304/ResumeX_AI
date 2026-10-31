import React, { useRef, useState } from 'react';
import { Briefcase, Upload, Edit3, FileText, CheckCircle2, X } from 'lucide-react';

export default function JobDescriptionInput({
  jobDescription,
  setJobDescription,
  jdFile,
  setJdFile,
  jdInputMode,
  setJdInputMode,
  targetJobTitle,
  setTargetJobTitle,
  sampleJds = [],
  onSelectSampleJd,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const jdFileInputRef = useRef(null);

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
      validateAndSetJdFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetJdFile(e.target.files[0]);
    }
  };

  const validateAndSetJdFile = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const ext = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(ext)) {
      alert('Please upload a PDF, DOCX, or TXT file for Job Description.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setJdFile(selectedFile);
    setJdInputMode('file');

    // Auto-fill target job title if currently empty
    if (!targetJobTitle || targetJobTitle.trim() === '') {
      const derivedTitle = selectedFile.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b(jd|job|description|spec|role)\b/gi, '')
        .trim();
      if (derivedTitle) {
        setTargetJobTitle(derivedTitle);
      }
    }
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
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
              2. Target Job Description
            </h3>
            <p className="text-xs text-slate-400">Upload JD file or paste text</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/60 text-xs">
          <button
            type="button"
            onClick={() => setJdInputMode('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              jdInputMode === 'file'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload JD</span>
          </button>
          <button
            type="button"
            onClick={() => setJdInputMode('paste')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
              jdInputMode === 'paste'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {/* Target Title Input */}
      <div className="mb-3">
        <input
          type="text"
          value={targetJobTitle}
          onChange={(e) => setTargetJobTitle(e.target.value)}
          placeholder="Target Job Title (e.g. Senior MERN Developer, Frontend Engineer)"
          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Mode 1: Upload JD File */}
      {jdInputMode === 'file' ? (
        <div className="flex-1 flex flex-col">
          {jdFile ? (
            <div className="flex-1 min-h-[175px] border-2 border-indigo-500/30 bg-indigo-950/15 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100 text-sm break-all">{jdFile.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(jdFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setJdFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Remove JD file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" /> JD File Ready for ATS Match
                </span>
                <button
                  type="button"
                  onClick={() => jdFileInputRef.current?.click()}
                  className="text-indigo-400 hover:underline"
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
              onClick={() => jdFileInputRef.current?.click()}
              className={`flex-1 min-h-[175px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800/50'
              }`}
            >
              <input
                ref={jdFileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                Drop JD file here, or <span className="text-indigo-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, TXT (up to 10MB)</p>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Paste JD Text */
        <div className="flex-1 flex flex-col">
          {/* Quick sample chips */}
          {sampleJds.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-500 font-medium shrink-0">Try Sample:</span>
              {sampleJds.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onSelectSampleJd(sample)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/60 transition shrink-0"
                >
                  {sample.title.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste full job description here (requirements, qualifications, tech stack, responsibilities)..."
            className="w-full flex-1 min-h-[145px] p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-sans"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>{jobDescription.length} characters</span>
            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
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
