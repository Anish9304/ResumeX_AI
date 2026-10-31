import { extractText as extractPdfText } from 'unpdf';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts plain text from an uploaded file buffer based on MIME type or extension.
 * Supports PDF (modern unpdf + fallback), DOCX (mammoth), and TXT/Markdown.
 * @param {Buffer} buffer - File buffer
 * @param {string} originalName - Original file name with extension
 * @param {string} mimetype - MIME type from multer
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromFile(buffer, originalName = '', mimetype = '') {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty file buffer provided');
  }

  const extension = originalName.split('.').pop()?.toLowerCase();

  try {
    if (mimetype.includes('pdf') || extension === 'pdf') {
      let extracted = '';

      // 1. Try modern unpdf (Mozilla PDF.js engine)
      try {
        const uint8 = new Uint8Array(buffer);
        const { text } = await extractPdfText(uint8);
        extracted = Array.isArray(text) ? text.join('\n') : (text || '');
      } catch (unpdfErr) {
        console.warn(`unpdf parser failed for ${originalName}: ${unpdfErr.message}. Trying pdf-parse fallback...`);
      }

      // 2. If unpdf produced no text or threw error, try legacy pdfParse fallback
      if (!extracted || extracted.trim().length === 0) {
        try {
          const legacyData = await pdfParse(buffer);
          extracted = legacyData?.text || '';
        } catch (legacyErr) {
          console.warn(`pdf-parse fallback also failed for ${originalName}: ${legacyErr.message}`);
        }
      }

      const cleaned = cleanExtractedText(extracted);
      if (!cleaned || cleaned.trim().length === 0) {
        throw new Error(
          `The PDF "${originalName}" does not contain readable/selectable text (it might be a scanned image, screenshot, or protected). Please upload a text-based PDF or paste text directly.`
        );
      }
      return cleaned;
    }

    if (
      mimetype.includes('word') ||
      mimetype.includes('officedocument') ||
      extension === 'docx' ||
      extension === 'doc'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      const cleaned = cleanExtractedText(result.value);
      if (!cleaned || cleaned.trim().length === 0) {
        throw new Error(
          `The Word document "${originalName}" contains no readable text. Please paste text directly or upload another file.`
        );
      }
      return cleaned;
    }

    if (mimetype.includes('text') || extension === 'txt' || extension === 'md') {
      return cleanExtractedText(buffer.toString('utf-8'));
    }

    // Default utf-8 decode
    return cleanExtractedText(buffer.toString('utf-8'));
  } catch (error) {
    console.error(`Error parsing file ${originalName}:`, error);
    throw new Error(`Failed to parse file (${originalName}): ${error.message}`);
  }
}

/**
 * Normalizes and cleans up whitespace and formatting artifacts.
 * @param {string} text
 * @returns {string}
 */
export function cleanExtractedText(text) {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
