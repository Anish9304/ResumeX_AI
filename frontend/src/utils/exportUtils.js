/**
 * Downloads a string as a text or markdown file
 */
export function downloadFile(content, fileName, mimeType = 'text/markdown') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copies text to user's clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Prints the resume in a dedicated isolated iframe to strictly fit onto EXACTLY 1 PAGE
 */
export function printResume() {
  const printableElement = document.getElementById('printable-resume');
  if (!printableElement) {
    window.print();
    return;
  }

  // Create or reuse hidden iframe
  let iframe = document.getElementById('print-resume-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'print-resume-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Resume</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 7mm 10mm 7mm 10mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #111827;
            background: #ffffff;
            font-size: 8.5pt;
            line-height: 1.24;
          }
          h1 {
            font-size: 15pt;
            font-weight: 800;
            margin: 0 0 1.5pt 0;
            padding-bottom: 1.5pt;
            border-bottom: 1.2pt solid #111827;
            color: #000000;
            letter-spacing: -0.2px;
          }
          h2 {
            font-size: 9.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin: 5pt 0 1.5pt 0;
            padding-bottom: 1pt;
            border-bottom: 1pt solid #4b5563;
            color: #111827;
          }
          p, div {
            font-size: 8.5pt;
            line-height: 1.24;
            color: #1f2937;
            margin: 0 0 1.5pt 0;
          }
          .bullet-row {
            display: flex;
            align-items: flex-start;
            gap: 4px;
            margin-bottom: 1.5pt;
          }
          .bullet-point {
            font-weight: 800;
            color: #111827;
            font-size: 9pt;
            line-height: 1.1;
          }
          strong {
            font-weight: 700;
            color: #000000;
          }
          em {
            font-style: italic;
            color: #4b5563;
          }
          a {
            color: #111827;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        ${printableElement.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Give the iframe 200ms to prepare DOM then trigger browser print
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 200);
}
