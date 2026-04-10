import { describe, it, expect } from 'vitest';
import {
  defaultTheme,
  generateEmbedCode,
  generateIframeCode,
  applyTheme,
  generateThemeCSS,
  validateThemeColor,
  parseThemeFromString,
} from '@/lib/theme';
import type { Org } from '@/types';

describe('Theme & Embedding', () => {
  describe('generateEmbedCode', () => {
    it('should generate embed URL', () => {
      const code = generateEmbedCode('dash-123', 'my-org');
      expect(code).toBe('https://insightflow.app/embed/my-org/dash-123');
    });
  });

  describe('generateIframeCode', () => {
    it('should generate iframe code', () => {
      const code = generateIframeCode('dash-123', 'my-org');
      expect(code).toContain('<iframe');
      expect(code).toContain('https://insightflow.app/embed/my-org/dash-123');
    });

    it('should include theme params', () => {
      const code = generateIframeCode('dash-123', 'my-org', { primaryColor: '#FF0000' });
      expect(code).toContain('theme=');
    });
  });

  describe('applyTheme', () => {
    it('should apply org primary color', () => {
      const org: Org = {
        id: '123',
        name: 'Test',
        slug: 'test',
        plan: 'free',
        primary_color: '#FF0000',
        currency: 'USD',
        created_at: '',
        updated_at: '',
      };
      const theme = applyTheme(org);
      expect(theme.primaryColor).toBe('#FF0000');
    });

    it('should use default when no primary color', () => {
      const org: Org = {
        id: '123',
        name: 'Test',
        slug: 'test',
        plan: 'free',
        primary_color: '',
        currency: 'USD',
        created_at: '',
        updated_at: '',
      };
      const theme = applyTheme(org);
      expect(theme.primaryColor).toBe('#3B82F6');
    });

    it('should allow overrides', () => {
      const org: Org = {
        id: '123',
        name: 'Test',
        slug: 'test',
        plan: 'free',
        primary_color: '#FF0000',
        currency: 'USD',
        created_at: '',
        updated_at: '',
      };
      const theme = applyTheme(org, { backgroundColor: '#000000' });
      expect(theme.backgroundColor).toBe('#000000');
    });
  });

  describe('generateThemeCSS', () => {
    it('should generate CSS variables', () => {
      const css = generateThemeCSS(defaultTheme);
      expect(css).toContain('--primary-color');
      expect(css).toContain('#3B82F6');
    });
  });

  describe('validateThemeColor', () => {
    it('should validate valid hex colors', () => {
      expect(validateThemeColor('#FF0000')).toBe(true);
      expect(validateThemeColor('#3B82F6')).toBe(true);
    });

    it('should reject invalid colors', () => {
      expect(validateThemeColor('red')).toBe(false);
      expect(validateThemeColor('#FFF')).toBe(false);
      expect(validateThemeColor('')).toBe(false);
    });
  });

  describe('parseThemeFromString', () => {
    it('should parse valid JSON', () => {
      const theme = parseThemeFromString('{"primaryColor":"#FF0000"}');
      expect(theme?.primaryColor).toBe('#FF0000');
    });

    it('should return null for invalid JSON', () => {
      expect(parseThemeFromString('invalid')).toBeNull();
    });
  });
});
