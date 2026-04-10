import type { DataSource } from '@/types';

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  range?: string;
}

export interface GoogleSheetsSyncResult {
  success: boolean;
  rowsAffected: number;
  lastSync: string;
  data?: Record<string, unknown>[];
}

const GOOGLE_SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

export async function fetchGoogleSheet(
  config: GoogleSheetsConfig,
  accessToken: string
): Promise<GoogleSheetsSyncResult> {
  try {
    const range = config.sheetName + (config.range ? `!${config.range}` : '!A1:1000');
    
    const response = await fetch(
      `${GOOGLE_SHEETS_API}/${config.spreadsheetId}/values/${range}?majorDimension=ROWS`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    const json = await response.json();
    const values = json.values || [];

    if (values.length === 0) {
      return { success: true, rowsAffected: 0, lastSync: new Date().toISOString() };
    }

    const [headers, ...rows] = values;
    const data = rows.map((row: string[]) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header: string, index: number) => {
        const value = row[index];
        obj[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return obj;
    });

    return {
      success: true,
      rowsAffected: data.length,
      lastSync: new Date().toISOString(),
      data,
    };
  } catch (error) {
    return {
      success: false,
      rowsAffected: 0,
      lastSync: new Date().toISOString(),
    };
  }
}

export async function writeToGoogleSheet(
  config: GoogleSheetsConfig,
  accessToken: string,
  data: Record<string, unknown>[]
): Promise<{ success: boolean; rowsWritten: number }> {
  try {
    const headers = Object.keys(data[0] || {});
    const values = [headers, ...data.map(row => headers.map(h => row[h]))];

    const range = config.sheetName + '!A1';
    
    const response = await fetch(
      `${GOOGLE_SHEETS_API}/${config.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.status}`);
    }

    return {
      success: true,
      rowsWritten: data.length,
    };
  } catch {
    return {
      success: false,
      rowsWritten: 0,
    };
  }
}

export function createGoogleSheetsDataSource(
  orgId: string,
  config: GoogleSheetsConfig
): DataSource {
  return {
    id: crypto.randomUUID(),
    org_id: orgId,
    name: `Google Sheet: ${config.sheetName}`,
    type: 'google_sheets',
    config: {
      spreadsheetId: config.spreadsheetId,
      sheetName: config.sheetName,
    },
    last_sync: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function validateGoogleSheetsConfig(config: GoogleSheetsConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.spreadsheetId) {
    errors.push('Spreadsheet ID is required');
  }

  if (!config.sheetName) {
    errors.push('Sheet name is required');
  }

  return { valid: errors.length === 0, errors };
}

export function parseGoogleSheetsUrl(url: string): GoogleSheetsConfig | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    
    if (!pathMatch) return null;

    const spreadsheetId = pathMatch[1];
    const sheetName = urlObj.hash.replace('#gid=', '') || 'Sheet1';

    return {
      spreadsheetId,
      sheetName: isNaN(Number(sheetName)) ? sheetName : 'Sheet1',
    };
  } catch {
    return null;
  }
}
