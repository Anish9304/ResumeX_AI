import { extractTextFromFile } from '../services/parserService.js';
import { analyzeResumeWithAI, optimizeResumeCustom } from '../services/geminiService.js';
import { AnalysisRepository } from '../models/Analysis.js';

export const analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    let fileName = 'Direct_Input_Resume.txt';

    let jobDescription = req.body.jobDescription || '';
    let jdFileName = 'Direct_Input_JD.txt';

    // Check if resume file was uploaded
    const resumeUpload = Array.isArray(req.files)
      ? req.files.find((f) => f.fieldname === 'resumeFile')
      : (req.files?.resumeFile?.[0] || req.file);

    if (resumeUpload) {
      fileName = resumeUpload.originalname;
      resumeText = await extractTextFromFile(
        resumeUpload.buffer,
        resumeUpload.originalname,
        resumeUpload.mimetype
      );
    }

    // Check if Job Description file was uploaded
    const jdUpload = Array.isArray(req.files)
      ? req.files.find((f) => f.fieldname === 'jdFile')
      : req.files?.jdFile?.[0];

    if (jdUpload) {
      jdFileName = jdUpload.originalname;
      jobDescription = await extractTextFromFile(
        jdUpload.buffer,
        jdUpload.originalname,
        jdUpload.mimetype
      );
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Resume content is empty or too short. Please upload a valid resume (PDF/DOCX/TXT) or paste the text.',
      });
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message: 'Job Description is required (minimum 30 characters). Please upload a JD file or paste the description text.',
      });
    }

    let targetJobTitle = req.body.targetJobTitle || '';
    if (!targetJobTitle || targetJobTitle.trim() === 'Target Role') {
      if (jdUpload) {
        // Derive clean title from filename if title wasn't manually specified
        targetJobTitle = jdUpload.originalname.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      } else {
        targetJobTitle = 'Target Role';
      }
    }

    console.log(`🔍 Analyzing resume "${fileName}" (${resumeText.length} chars) vs JD "${jdFileName}" (${jobDescription.length} chars)...`);

    // Run AI analysis
    const analysisResult = await analyzeResumeWithAI(resumeText, jobDescription, fileName);

    // Save report to database (or in-memory repository)
    const savedRecord = await AnalysisRepository.create({
      fileName,
      targetJobTitle,
      jobDescription,
      resumeText,
      atsScore: analysisResult.atsScore,
      keywordMatchRate: analysisResult.keywordMatchRate,
      matchedSkills: analysisResult.matchedSkills,
      missingSkills: analysisResult.missingSkills,
      summaryFeedback: analysisResult.summaryFeedback,
      strengths: analysisResult.strengths,
      weaknesses: analysisResult.weaknesses,
      sectionFeedbacks: analysisResult.sectionFeedbacks,
      optimizedResume: analysisResult.optimizedResume,
    });

    return res.status(200).json({
      success: true,
      data: {
        id: savedRecord._id,
        fileName,
        targetJobTitle,
        ...analysisResult,
      },
    });
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while analyzing resume.',
    });
  }
};

export const optimizeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription, tone, focusArea } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Both resumeText and jobDescription are required for optimization.',
      });
    }

    const optimized = await optimizeResumeCustom(resumeText, jobDescription, tone, focusArea);

    return res.status(200).json({
      success: true,
      data: optimized,
    });
  } catch (error) {
    console.error('Error in optimizeResume:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error generating optimized resume.',
    });
  }
};
