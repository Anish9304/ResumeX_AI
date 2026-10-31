import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import ScoreGauge from './components/ScoreGauge';
import MissingSkillsCard from './components/MissingSkillsCard';
import InsightsCard from './components/InsightsCard';
import OptimizedResumeView from './components/OptimizedResumeView';
import HistoryModal from './components/HistoryModal';
import {
  analyzeResumeApi,
  optimizeResumeApi,
  fetchHistoryApi,
  fetchHistoryItemApi,
  deleteHistoryItemApi,
  fetchSamplesApi,
  fetchBackendHealth,
} from './services/api';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  // Input states
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'paste'
  const [jdFile, setJdFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jdInputMode, setJdInputMode] = useState('paste'); // 'file' | 'paste'
  const [targetJobTitle, setTargetJobTitle] = useState('');

  // Execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // System & History states
  const [systemHealth, setSystemHealth] = useState(null);
  const [samples, setSamples] = useState({ resumes: [], jobDescriptions: [] });
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const resultsRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const health = await fetchBackendHealth();
        setSystemHealth(health);

        const sampleData = await fetchSamplesApi();
        setSamples(sampleData);

        const hist = await fetchHistoryApi();
        setHistory(hist || []);
      } catch (err) {
        console.warn('Initial load warning:', err);
      }
    }
    init();
  }, []);

  // Quick 1-click load sample
  const handleLoadSample = () => {
    if (samples.resumes.length > 0) {
      const sampleResume = samples.resumes[0];
      setPastedText(sampleResume.text);
      setInputMode('paste');
      setFile(null);
    }
    if (samples.jobDescriptions.length > 0) {
      const sampleJd = samples.jobDescriptions[0];
      setJobDescription(sampleJd.text);
      setTargetJobTitle(sampleJd.title);
      setJdInputMode('paste');
      setJdFile(null);
    }
    showToast('Loaded sample Full-Stack MERN resume and job description!', 'success');
  };

  const handleSelectSampleJd = (sampleJd) => {
    setJobDescription(sampleJd.text);
    setTargetJobTitle(sampleJd.title);
    setJdInputMode('paste');
    setJdFile(null);
    showToast(`Loaded "${sampleJd.title}" Job Description`, 'info');
  };

  // Run ATS Analysis
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (inputMode === 'file' && !file) {
      showToast('Please upload a resume file (PDF, DOCX, TXT) or switch to Paste Text mode.', 'error');
      return;
    }

    if (inputMode === 'paste' && (!pastedText || pastedText.trim().length < 50)) {
      showToast('Please paste your resume text (at least 50 characters).', 'error');
      return;
    }

    if (jdInputMode === 'file' && !jdFile) {
      showToast('Please upload a Job Description file (PDF, DOCX, TXT) or switch to Paste Text mode.', 'error');
      return;
    }

    if (jdInputMode === 'paste' && (!jobDescription || jobDescription.trim().length < 30)) {
      showToast('Please paste a target Job Description (at least 30 characters).', 'error');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Uploading and extracting document structure...');

    try {
      const formData = new FormData();
      if (inputMode === 'file' && file) {
        formData.append('resumeFile', file);
      } else {
        formData.append('resumeText', pastedText);
      }

      if (jdInputMode === 'file' && jdFile) {
        formData.append('jdFile', jdFile);
      } else {
        formData.append('jobDescription', jobDescription);
      }

      formData.append('targetJobTitle', targetJobTitle || 'Target Role');

      const stepTimer1 = setTimeout(() => {
        setAnalysisStep('Extracting skills & cross-matching ATS keywords...');
      }, 900);

      const stepTimer2 = setTimeout(() => {
        setAnalysisStep('Computing ATS score & generating optimized resume...');
      }, 1800);

      const response = await analyzeResumeApi(formData);

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setAnalysisResult(response.data);
      showToast('Resume ATS Analysis & Optimization completed!', 'success');

      // Refresh history list
      fetchHistoryApi().then((data) => setHistory(data || []));

      // Scroll smoothly to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (error) {
      console.error('Analysis error:', error);
      showToast(error.message || 'Failed to analyze resume. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Regenerate optimized resume with specific tone
  const handleRegenerate = async (tone) => {
    if (!analysisResult) return;
    setIsRegenerating(true);
    try {
      const resumeText =
        analysisResult.resumeText || (inputMode === 'paste' ? pastedText : '');
      const response = await optimizeResumeApi({
        resumeText,
        jobDescription,
        tone,
      });

      setAnalysisResult((prev) => ({
        ...prev,
        optimizedResume: response.data,
      }));
      showToast(`Resume re-optimized with "${tone}" tone!`, 'success');
    } catch (error) {
      console.error('Regenerate error:', error);
      showToast(error.message || 'Failed to re-optimize resume', 'error');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Restore history item
  const handleSelectReport = async (id) => {
    try {
      const report = await fetchHistoryItemApi(id);
      setAnalysisResult(report);
      setJobDescription(report.jobDescription || '');
      setTargetJobTitle(report.targetJobTitle || '');
      if (report.resumeText) {
        setPastedText(report.resumeText);
        setInputMode('paste');
      }
      showToast('Loaded saved analysis report!', 'info');
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      showToast('Failed to load report: ' + err.message, 'error');
    }
  };

  // Delete history item
  const handleDeleteReport = async (id) => {
    try {
      await deleteHistoryItemApi(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      showToast('Report deleted', 'info');
    } catch (err) {
      showToast('Failed to delete report: ' + err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/30'
                : 'bg-slate-900/90 text-slate-200 border-slate-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-brand-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        systemHealth={systemHealth}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onLoadSample={handleLoadSample}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Next-Gen AI ATS Scanner & Resume Tailoring
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Beat the ATS. <br />
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Land 3x More Interviews.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume, paste the target job description, and let AI reveal your ATS compatibility score, extract missing keywords, and generate a tailored resume ready to impress recruiters.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ATS Algorithm Compatible
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-brand-400" />
              Instant Skill Gap Detection
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              1-Click AI Resume Generator
            </span>
          </div>
        </div>

        {/* Input Form Section */}
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Box 1: Resume Upload / Paste */}
            <FileUpload
              file={file}
              setFile={setFile}
              pastedText={pastedText}
              setPastedText={setPastedText}
              inputMode={inputMode}
              setInputMode={setInputMode}
            />

            {/* Box 2: Job Description Input */}
            <JobDescriptionInput
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              jdFile={jdFile}
              setJdFile={setJdFile}
              jdInputMode={jdInputMode}
              setJdInputMode={setJdInputMode}
              targetJobTitle={targetJobTitle}
              setTargetJobTitle={setTargetJobTitle}
              sampleJds={samples.jobDescriptions}
              onSelectSampleJd={handleSelectSampleJd}
            />
          </div>

          {/* Submit Action */}
          <div className="flex flex-col items-center justify-center pt-2">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze ATS Match & Generate Resume</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Progress status message while analyzing */}
            {isAnalyzing && (
              <div className="mt-3 text-xs text-brand-400 flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></div>
                <span>{analysisStep || 'Processing resume and job description...'}</span>
              </div>
            )}
          </div>
        </form>

        {/* Analysis Results View */}
        {analysisResult && (
          <div ref={resultsRef} className="mt-16 pt-12 border-t border-slate-800 space-y-8 animate-fade-in">
            {/* Header for Results */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  Analysis Report
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  ATS Match & Optimization Report
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Target Role: <strong className="text-slate-200">{analysisResult.targetJobTitle}</strong> • Resume: <span className="text-slate-300">{analysisResult.fileName}</span>
                </p>
              </div>

              {analysisResult.isDemoMode && (
                <div className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                  ⚡ Generated using Built-in ATS Engine
                </div>
              )}
            </div>

            {/* Top row: Score Gauge + Missing Skills Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-1">
                <ScoreGauge
                  score={analysisResult.atsScore}
                  keywordMatchRate={analysisResult.keywordMatchRate}
                  matchedCount={analysisResult.matchedSkills?.length || 0}
                  missingCount={analysisResult.missingSkills?.length || 0}
                />
              </div>

              <div className="lg:col-span-2">
                <MissingSkillsCard
                  missingSkills={analysisResult.missingSkills || []}
                  matchedSkills={analysisResult.matchedSkills || []}
                />
              </div>
            </div>

            {/* Middle row: Insights & Section feedback */}
            <InsightsCard
              summaryFeedback={analysisResult.summaryFeedback}
              strengths={analysisResult.strengths}
              weaknesses={analysisResult.weaknesses}
              sectionFeedbacks={analysisResult.sectionFeedbacks}
            />

            {/* Bottom: Generated Optimized Resume View */}
            <OptimizedResumeView
              optimizedResume={analysisResult.optimizedResume}
              onRegenerate={handleRegenerate}
              isRegenerating={isRegenerating}
            />
          </div>
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 w-full">
        <div className="w-full px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ResumeX AI </p>
          <div className="flex items-center gap-4 text-slate-400">
            
          </div>
        </div>
      </footer>
    </div>
  );
}
