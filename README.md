# 🚀 ResumeX AI - ATS Score Scanner & Resume Optimizer

**ResumeX AI** ek modern **MERN Stack** application hai jo job seekers aur developers ke liye banayi gayi hai. Isme user apna resume (PDF, DOCX ya text) upload karta hai, target Job Description provide karta hai, aur AI ke zariye:
1. **ATS Compatibility Score (0 - 100%)** calculate karta hai.
2. **Missing Skills aur Keywords** identify karke highlight karta hai.
3. **Matched Skills** dikhata hai.
4. **Strengths aur ATS Red Flags / Weaknesses** ka detailed feedback deta hai.
5. **Section-by-Section suggestions** deta hai (Work Experience, Skills, Education, Formatting).
6. **AI-Optimized ATS-Friendly Resume** generate karke deta hai jise aap **Print/PDF save**, **Markdown download**, ya **1-Click Copy** kar sakte hain.

---

## ⚡ Tech Stack & Architecture

- **Code Standard**: Pure **ES Modules (`"type": "module"`)** in both Backend and Frontend (No CommonJS / `require`), making code modern, clean, and easily maintainable.
- **Backend**:
  - **Node.js** + **Express.js** (ESM)
  - **Google Gemini AI** (`@google/generative-ai` with `gemini-1.5-flash`)
  - **Hybrid Rule Engine**: Fallback engine for ATS evaluation jab tak API key add na ho.
  - **Multer**: Memory storage for PDF, DOCX, TXT files.
  - **pdf-parse** & **mammoth**: Text extraction from PDFs and Word documents.
  - **MongoDB / Mongoose**: Stores analysis history (with in-memory fallback if MongoDB service is not started locally).
- **Frontend**:
  - **React 18** + **Vite**
  - **Tailwind CSS** (modern dark UI)
  - **Lucide React** (icons)
  - **Canvas Confetti** (for high ATS scores celebration)

---

## 📂 Project Structure

```
ResumeX AI/
├── backend/
│   ├── package.json           # "type": "module"
│   ├── .env.example           # Environment template
│   ├── .env                   # PORT, MONGODB_URI, GEMINI_API_KEY
│   ├── server.js              # Express app entrypoint
│   └── src/
│       ├── config/db.js       # MongoDB connection & status
│       ├── controllers/       # resumeController & historyController
│       ├── models/            # Analysis schema & Repository
│       ├── routes/            # /api/resume & /api/history routes
│       ├── services/
│       │   ├── geminiService.js   # Gemini 1.5 prompt & structured JSON parser
│       │   ├── parserService.js   # PDF & DOCX text extraction
│       │   └── atsEngine.js       # Rule-based skill extraction & scoring
│       ├── middlewares/       # Multer file upload & error handling
│       └── utils/sampleData.js# Sample resumes & JDs for 1-click test
├── frontend/
│   ├── package.json           # "type": "module"
│   ├── vite.config.js         # Proxy to backend (:5000)
│   ├── tailwind.config.js     # Tailwind setup
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # Main dashboard & state management
│       ├── components/
│       │   ├── Navbar.jsx               # Brand, Status indicators, Demo loader
│       │   ├── FileUpload.jsx           # Drag-and-drop PDF/DOCX or Paste Text
│       │   ├── JobDescriptionInput.jsx  # JD Textarea with sample picker
│       │   ├── ScoreGauge.jsx           # Radial ATS Score meter + metrics
│       │   ├── MissingSkillsCard.jsx    # Missing vs Matched skills tags
│       │   ├── InsightsCard.jsx         # Strengths, Weaknesses, Section tips
│       │   ├── OptimizedResumeView.jsx  # Printable resume, Markdown & XYZ bullets
│       │   └── HistoryModal.jsx         # Previous scan history
│       ├── services/api.js              # Backend API requests
│       └── utils/exportUtils.js         # Copy, Download .md, Print PDF
├── package.json               # Root scripts for running both concurrently
└── README.md
```

---

## 🚀 Quick Start Guide (Kaise Run Karein)

### 1. Backend Setup:
```bash
cd backend
npm install
```

Configure `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumex_ai
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```
> **Note:** Agar aapke paas Gemini API key nahi hai to bhi application automatically **Built-in ATS Rule Engine** se smoothly chalegi! Free Gemini key lene ke liye [Google AI Studio](https://aistudio.google.com/app/apikey) par ja sakte hain.
> Agar MongoDB local machine par install/started nahi hai, to backend automatically **In-Memory Store Mode** me switch ho jayega bina crash huye!

Backend start karne ke liye:
```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 2. Frontend Setup:
Alag terminal me:
```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:5173
```

---

### 3. Ek Command Se Dono Chalana (Root Folder Se):
```bash
# Root folder me
npm install
npm run dev
```
Ye command `backend` (Port 5000) aur `frontend` (Port 5173) dono ko ek saath launch kar dega!

---

## 🎯 Key Features

1. **Dual Resume Input**:
   - PDF, DOCX ya TXT file drag-and-drop karein.
   - Ya direct resume text paste karein.
2. **Job Description Matching (Upload File or Paste)**:
   - Target Job Description file (**PDF, DOCX, TXT**) drag-and-drop karein ya direct text paste karein.
   - Built-in sample buttons (e.g. Senior MERN Developer) se 1-click test karein.
   - File upload karne par Role Title automatically derive ho jata hai.
3. **ATS Compatibility Gauge**:
   - 0-100% Score meter with dynamic color coding (Emerald, Blue, Amber, Rose).
   - Keyword Match Percentage & Skill Coverage.
4. **Missing Skills Gap Analyzer**:
   - Job requirements me jo skills chahiye aur aapke resume me nahi hain, unhe alag se highlight karta hai.
   - "Copy list" button to easily copy all missing keywords.
5. **AI-Optimized Resume Generator**:
   - Target role ke hisab se structured, single-column ATS resume generate karta hai.
   - XYZ Formula bullet points ("Accomplished [X] measured by [Y] by doing [Z]").
   - **Print / Save as PDF** directly from browser.
   - **Download as Markdown (.md)**.
   - **1-Click Copy**.
   - Custom Tone re-optimizer (Impactful, Executive, Technical, Concise).
6. **Scan History**:
   - Saari previous analyses history me save hoti hain jise aap kabhi bhi 1-click me reload ya delete kar sakte hain.
