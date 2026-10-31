import { AnalysisRepository } from '../models/Analysis.js';
import { sampleResumes, sampleJobDescriptions } from '../utils/sampleData.js';

export const getHistory = async (req, res) => {
  try {
    const list = await AnalysisRepository.find(30);
    // Return lightweight summary for the history list
    const summaries = list.map((item) => ({
      id: item._id ? item._id.toString() : item.id,
      fileName: item.fileName,
      targetJobTitle: item.targetJobTitle,
      atsScore: item.atsScore,
      keywordMatchRate: item.keywordMatchRate,
      matchedSkillsCount: item.matchedSkills?.length || 0,
      missingSkillsCount: item.missingSkills?.length || 0,
      createdAt: item.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: summaries,
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history.',
    });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await AnalysisRepository.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching history item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis report.',
    });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AnalysisRepository.deleteById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or already deleted.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete report.',
    });
  }
};

export const getSamples = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      resumes: sampleResumes,
      jobDescriptions: sampleJobDescriptions,
    },
  });
};
