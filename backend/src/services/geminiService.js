import { GoogleGenerativeAI } from '@google/generative-ai';
import { evaluateResumeLocally } from './atsEngine.js';

/**
 * Initializes Gemini client if key is available
 */
function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Default to gemini-1.5-flash (fast, reliable, free-tier friendly)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

/**
 * Analyzes Resume vs Job Description using Gemini AI, with automatic heuristic fallback
 */
export async function analyzeResumeWithAI(resumeText, jdText, fileName = 'Resume') {
  const model = getGeminiModel();

  if (!model) {
    console.log('ℹ️ No GEMINI_API_KEY detected. Utilizing native rule-based ATS engine.');
    const result = evaluateResumeLocally(resumeText, jdText, fileName);
    return { ...result, isDemoMode: true };
  }

  const prompt = `
You are a World-Class Executive Recruiter and Senior ATS (Applicant Tracking System) Algorithm Specialist.
Analyze the following Candidate Resume against the Job Description.

Candidate Resume:
"""
${resumeText.slice(0, 7000)}
"""

Target Job Description:
"""
${jdText.slice(0, 4000)}
"""

CRITICAL CANDIDATE INTEGRITY & FIDELITY RULES:
1. ABSOLUTELY NO FAKE WORK EXPERIENCE:
   If the candidate's resume DOES NOT contain professional work experience (e.g. they are a student, fresher, or entry-level developer without prior corporate jobs), DO NOT INVENT A "PROFESSIONAL EXPERIENCE" OR "WORK EXPERIENCE" SECTION. Do not add fake company names, job titles, or dates!
   Instead, format the resume in an ATS-compliant Project-Centric format highlighting their TECHNICAL PROJECTS, TECHNICAL SKILLS, SUMMARY, and EDUCATION.
2. ABSOLUTELY NO INVENTED PROJECTS:
   Do NOT create imaginary projects. Keep ONLY the projects that are actually mentioned in the candidate's resume. Rewrite and optimize the bullet points of their REAL projects using the XYZ formula ("Accomplished [X] as measured by [Y] by doing [Z]") incorporating relevant target JD keywords naturally.
3. PRESERVE CANDIDATE DETAILS:
   Retain the candidate's real name, contact details, actual education, and project titles. Never replace real details with placeholder text.

Provide your expert evaluation in STRICT valid JSON format with NO markdown wrapping, or within a single \`\`\`json block.
The JSON must follow this exact schema:
{
  "atsScore": <number between 0 and 100 representing overall compatibility>,
  "keywordMatchRate": <number between 0 and 100 representing keyword overlap>,
  "matchedSkills": [<array of matched technical, domain, and soft skills found in both>],
  "missingSkills": [<array of critical skills/requirements in the JD missing or weak in the resume>],
  "summaryFeedback": "<concise 2-3 sentence executive assessment of candidate fit>",
  "strengths": [<array of 3-5 key candidate strengths relevant to this job>],
  "weaknesses": [<array of 3-5 areas where the resume falls short or has red flags for ATS>],
  "sectionFeedbacks": {
    "experience": "<actionable advice for Work Experience, or note for freshers on project emphasis>",
    "skills": "<actionable advice for Skills section>",
    "education": "<actionable advice for Education>",
    "formatting": "<actionable advice for ATS readability and structure>"
  },
  "optimizedResume": {
    "markdown": "<Full rewritten, ATS-optimized, professional resume in clean GitHub Markdown format tailored for this exact JD. Must STRICTLY include ONLY candidate's actual projects, omit work experience if candidate has none, and highlight real skills>",
    "plainText": "<Plain text version without markdown characters>",
    "headline": "<Professional title headline suited for the JD>",
    "summary": "<Compelling 3-4 sentence professional summary loaded with JD keywords>",
    "skillsFormatted": [<array of curated skills combining candidate background and JD demands>],
    "bulletImprovements": [<array of 3-4 specific examples of bullet points rewritten to be quantifiable and impactful from their real projects>]
  }
}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2, // Low temperature for consistent ATS scoring
        maxOutputTokens: 4096,
      },
    });

    const responseText = result.response.text();
    const parsedData = cleanAndParseJSON(responseText);

    if (parsedData && parsedData.atsScore !== undefined) {
      return {
        ...parsedData,
        isDemoMode: false,
      };
    }

    throw new Error('Could not parse structured JSON from Gemini response');
  } catch (error) {
    console.warn(`Gemini API call failed (${error.message}). Falling back to local ATS engine.`);
    const fallback = evaluateResumeLocally(resumeText, jdText, fileName);
    return {
      ...fallback,
      isDemoMode: true,
      apiNotice: `Gemini API Notice: ${error.message}. Generated using built-in rule engine.`,
    };
  }
}

/**
 * Regenerates / customizes optimized resume with custom instructions
 */
export async function optimizeResumeCustom(resumeText, jdText, tone = 'impactful', focusArea = 'all') {
  const model = getGeminiModel();

  if (!model) {
    return evaluateResumeLocally(resumeText, jdText).optimizedResume;
  }

  const prompt = `
You are a Professional Resume Writer specializing in ATS optimization.
Rewrite and optimize the following resume specifically for the target job description.

Tone: ${tone}
Focus: ${focusArea}

CRITICAL RULES:
1. ONLY include the candidate's REAL projects mentioned in their resume. DO NOT invent extra projects!
2. If the candidate has NO work experience (fresher/student), DO NOT add any fake work experience or fake companies! Focus heavily on their projects and technical skills.

Resume:
"""
${resumeText.slice(0, 6000)}
"""

Target Job Description:
"""
${jdText.slice(0, 3500)}
"""

Return a valid JSON object:
{
  "markdown": "<Full rewritten resume in Markdown>",
  "plainText": "<Full plain text version>",
  "headline": "<Target headline>",
  "summary": "<Professional summary>",
  "skillsFormatted": ["Skill 1", "Skill 2"],
  "bulletImprovements": ["Improvement 1", "Improvement 2"]
}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3500,
      },
    });

    return cleanAndParseJSON(result.response.text());
  } catch (err) {
    console.error('Custom optimization error:', err);
    return evaluateResumeLocally(resumeText, jdText).optimizedResume;
  }
}

/**
 * Helper to strip markdown JSON fences and parse safely
 */
function cleanAndParseJSON(raw) {
  let cleaned = raw.trim();
  // Strip \`\`\`json or \`\`\` if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  // Find the first { and the last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}
