import multer from 'multer';

// Use memory storage for fast in-memory text parsing
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/markdown',
    'application/octet-stream', // Some browsers send this for PDFs
  ];

  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
  const extMatch = (file.originalname || '').toLowerCase().match(/\.[0-9a-z]+$/i);
  const ext = extMatch ? extMatch[0] : '';

  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file format (${file.originalname}). Please upload a PDF, DOCX, or TXT file.`), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter,
});
