/**
 * Google Apps Script — paste into Extensions → Apps Script on your Sheet.
 *
 * 1. Create a Google Sheet with a tab named "Leads" (or let this create it).
 * 2. Paste this file into the script editor and save.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into:
 *    - local: .env.local → VITE_GOOGLE_SHEETS_WEBHOOK_URL=...
 *    - GitHub Actions: VITE_GOOGLE_SHEETS_WEBHOOK_URL in deploy.yml build env
 */

var SHEET_NAME = 'Leads';
var HEADERS = [
  'timestamp',
  'type',
  'name',
  'email',
  'subject',
  'message',
  'album',
  'composition',
  'page',
  'project',
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS);
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.type || '',
      data.name || '',
      data.email || '',
      data.subject || '',
      data.message || '',
      data.album || '',
      data.composition || '',
      data.page || '',
      data.project || 'shvarts-black',
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ result: 'ok', service: 'shvarts-black-leads' })
  ).setMimeType(ContentService.MimeType.JSON);
}
