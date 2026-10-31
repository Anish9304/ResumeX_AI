const API_BASE = '/api';

/**
 * Analyzes resume (file or text) against Job Description (file or text)
 * @param {FormData} formData
 */
export async function analyzeResumeApi(formData) {
  let response;
  try {
    response = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      body: formData,
    });
  } catch (netErr) {
    console.error('Fetch network error:', netErr);
    throw new Error(
      'Backend server is not running or unreachable on port 5000! Please make sure the backend is started by running "npm run dev" from the root folder.'
    );
  }

  let data;
  const rawText = await response.text();
  try {
    data = JSON.parse(rawText);
  } catch (parseErr) {
    console.error('Non-JSON response from server:', rawText);
    throw new Error(
      `Server error (${response.status} ${response.statusText}): ${rawText.slice(0, 150) || 'Check backend terminal console.'}`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || 'Failed to analyze resume');
  }
  return data;
}

/**
 * Regenerate or customize optimized resume
 */
export async function optimizeResumeApi(payload) {
  let response;
  try {
    response = await fetch(`${API_BASE}/resume/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (netErr) {
    throw new Error('Backend server unreachable. Make sure backend is running.');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to optimize resume');
  }
  return data;
}

/**
 * Fetch analysis history
 */
export async function fetchHistoryApi() {
  try {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    return [];
  }
}

/**
 * Fetch single report by ID
 */
export async function fetchHistoryItemApi(id) {
  const response = await fetch(`${API_BASE}/history/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch report');
  }
  return data.data;
}

/**
 * Delete a report
 */
export async function deleteHistoryItemApi(id) {
  const response = await fetch(`${API_BASE}/history/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete report');
  }
  return data;
}

/**
 * Fetch sample resumes and job descriptions for 1-click test
 */
export async function fetchSamplesApi() {
  try {
    const response = await fetch(`${API_BASE}/history/samples`);
    if (!response.ok) return { resumes: [], jobDescriptions: [] };
    const data = await response.json();
    return data.data || { resumes: [], jobDescriptions: [] };
  } catch (err) {
    return { resumes: [], jobDescriptions: [] };
  }
}

/**
 * Backend health check
 */
export async function fetchBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}
