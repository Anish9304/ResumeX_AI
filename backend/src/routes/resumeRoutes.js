import { Router } from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { analyzeResume, optimizeResume } from '../controllers/resumeController.js';

const router = Router();

// Upload resume file and/or job description file (PDF/DOCX/TXT) or submit text
// Using upload.any() guarantees any field configuration will be parsed smoothly without Multer field errors
router.post('/analyze', upload.any(), analyzeResume);

// Customize or regenerate optimized resume
router.post('/optimize', optimizeResume);

export default router;
