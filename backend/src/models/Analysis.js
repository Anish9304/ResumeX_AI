import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';

const AnalysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      default: 'Pasted_Resume.txt',
    },
    targetJobTitle: {
      type: String,
      default: 'Target Role',
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    keywordMatchRate: {
      type: Number,
      default: 0,
    },
    matchedSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    summaryFeedback: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    sectionFeedbacks: {
      experience: { type: String, default: '' },
      skills: { type: String, default: '' },
      education: { type: String, default: '' },
      formatting: { type: String, default: '' },
    },
    optimizedResume: {
      markdown: { type: String, default: '' },
      plainText: { type: String, default: '' },
      headline: { type: String, default: '' },
      summary: { type: String, default: '' },
      skillsFormatted: { type: [String], default: [] },
      bulletImprovements: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

const MongooseAnalysis = mongoose.models.Analysis || mongoose.model('Analysis', AnalysisSchema);

// In-memory fallback repository when MongoDB is not running
const inMemoryStore = [];

export const AnalysisRepository = {
  async create(data) {
    if (getDbStatus()) {
      try {
        return await MongooseAnalysis.create(data);
      } catch (err) {
        console.warn('MongoDB create failed, saving to in-memory store:', err.message);
      }
    }
    const record = {
      _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryStore.unshift(record);
    return record;
  },

  async find(limit = 20) {
    if (getDbStatus()) {
      try {
        return await MongooseAnalysis.find().sort({ createdAt: -1 }).limit(limit);
      } catch (err) {
        console.warn('MongoDB find failed, reading from in-memory store:', err.message);
      }
    }
    return inMemoryStore.slice(0, limit);
  },

  async findById(id) {
    if (getDbStatus()) {
      try {
        const item = await MongooseAnalysis.findById(id);
        if (item) return item;
      } catch (err) {
        // Fall through to memory check if id isn't valid ObjectId
      }
    }
    return inMemoryStore.find((item) => item._id.toString() === id.toString()) || null;
  },

  async deleteById(id) {
    if (getDbStatus()) {
      try {
        await MongooseAnalysis.findByIdAndDelete(id);
      } catch (err) {
        // continue
      }
    }
    const idx = inMemoryStore.findIndex((item) => item._id.toString() === id.toString());
    if (idx !== -1) {
      inMemoryStore.splice(idx, 1);
      return true;
    }
    return false;
  },
};

export default MongooseAnalysis;
