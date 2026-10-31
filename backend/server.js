import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDbStatus } from './src/config/db.js';
import resumeRoutes from './src/routes/resumeRoutes.js';
import historyRoutes from './src/routes/historyRoutes.js';
import { errorHandler, notFoundHandler } from './src/middlewares/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (graceful fallback if local MongoDB is inactive)
await connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev-friendly permissive
      }
    },
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health and Status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ResumeX AI Backend',
    moduleType: 'ES Module (type: module)',
    databaseConnected: getDbStatus(),
    geminiConfigured: Boolean(
      process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY.trim() !== '' &&
        !process.env.GEMINI_API_KEY.includes('your_gemini_api_key')
    ),
    timestamp: new Date().toISOString(),
  });
});

// Main API routes
app.use('/api/resume', resumeRoutes);
app.use('/api/history', historyRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ResumeX AI Server running on http://127.0.0.1:${PORT}`);
  console.log(`📦 Architecture: Express.js (ES Module: type="module")`);
  console.log(`🤖 Gemini AI Mode: ${process.env.GEMINI_API_KEY ? 'Active' : 'Standby / Local ATS Engine'}`);
});
