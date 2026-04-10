import { describe, it, expect } from 'vitest';
import {
  fetchGoogleSheet,
  writeToGoogleSheet,
  createGoogleSheetsDataSource,
  validateGoogleSheetsConfig,
  parseGoogleSheetsUrl,
} from '@/lib/google-sheets';

describe('Google Sheets Integration', () => {
  describe('validateGoogleSheetsConfig', () => {
    it('should validate valid config', () => {
      const config = { spreadsheetId: 'abc123', sheetName: 'Sheet1' };
      const result = validateGoogleSheetsConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should reject missing spreadsheet ID', () => {
      const config = { sheetName: 'Sheet1' };
      const result = validateGoogleSheetsConfig(config);
      expect(result.valid).toBe(false);
    });

    it('should reject missing sheet name', () => {
      const config = { spreadsheetId: 'abc123' };
      const result = validateGoogleSheetsConfig(config);
      expect(result.valid).toBe(false);
    });
  });

  describe('parseGoogleSheetsUrl', () => {
    it('should parse valid URL', () => {
      const url = 'https://docs.google.com/spreadsheets/d/abc123/edit#gid=0';
      const result = parseGoogleSheetsUrl(url);
      expect(result?.spreadsheetId).toBe('abc123');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com';
      const result = parseGoogleSheetsUrl(url);
      expect(result).toBeNull();
    });
  });

  describe('createGoogleSheetsDataSource', () => {
    it('should create data source', () => {
      const config = { spreadsheetId: 'abc123', sheetName: 'Sales' };
      const result = createGoogleSheetsDataSource('org-123', config);
      expect(result.org_id).toBe('org-123');
      expect(result.type).toBe('google_sheets');
      expect(result.name).toContain('Sales');
    });
  });

  describe('fetchGoogleSheet', () => {
    it('should handle API error gracefully', async () => {
      const result = await fetchGoogleSheet(
        { spreadsheetId: 'invalid', sheetName: 'Sheet1' },
        'invalid-token'
      );
      expect(result.success).toBe(false);
    });
  });

  describe('writeToGoogleSheet', () => {
    it('should handle API error gracefully', async () => {
      const result = await writeToGoogleSheet(
        { spreadsheetId: 'invalid', sheetName: 'Sheet1' },
        'invalid-token',
        [{ col: 'value' }]
      );
      expect(result.success).toBe(false);
    });
  });
});
