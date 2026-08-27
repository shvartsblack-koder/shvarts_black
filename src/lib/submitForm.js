const WEBHOOK_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL ||
  'https://script.google.com/macros/s/AKfycby1lINKHR80ryX5OcCuRE2tr1b85owLFLLA13tacTDtiQbbLkubhqHp3GKw9GPws5wV/exec';

/**
 * Posts a form lead to a Google Apps Script web app that appends a row to Sheets.
 * Deploy script: scripts/google-sheets-webhook.gs
 */
export async function submitForm(payload) {
  if (!WEBHOOK_URL) {
    throw new Error(
      'Google Sheets webhook is not configured (VITE_GOOGLE_SHEETS_WEBHOOK_URL).'
    );
  }

  const body = {
    ...payload,
    project: 'shvarts-black',
    timestamp: new Date().toISOString(),
    page:
      typeof window !== 'undefined'
        ? `${window.location.hostname}${window.location.pathname}${window.location.hash}`
        : 'shvarts.black',
  };

  // text/plain avoids a CORS preflight against Apps Script
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Webhook HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  try {
    const data = JSON.parse(text);
    if (data.result !== 'ok') {
      throw new Error(data.error || 'Webhook rejected the submission');
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      if (!text.toLowerCase().includes('ok')) {
        throw new Error('Unexpected webhook response');
      }
    } else {
      throw err;
    }
  }
}
