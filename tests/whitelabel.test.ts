import { describe, it, expect } from 'vitest';
import {
  createWhiteLabelConfig,
  generateAPIKey,
  validateAPIKey,
  maskAPIKey,
  checkRateLimit,
  createCustomDomainRecord,
  validateCustomDomain,
  generateEmailFooter,
  defaultRateLimit,
} from '@/lib/whitelabel';
import type { Org } from '@/types';

describe('White-label & API v1', () => {
  const mockOrg: Org = {
    id: 'org-123',
    name: 'Test Org',
    slug: 'test-org',
    plan: 'pro',
    primary_color: '#FF0000',
    currency: 'USD',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  describe('createWhiteLabelConfig', () => {
    it('should create config from org', () => {
      const config = createWhiteLabelConfig(mockOrg);
      expect(config.orgId).toBe('org-123');
      expect(config.primaryColor).toBe('#FF0000');
    });

    it('should allow overrides', () => {
      const config = createWhiteLabelConfig(mockOrg, { primaryColor: '#0000FF' });
      expect(config.primaryColor).toBe('#0000FF');
    });
  });

  describe('generateAPIKey', () => {
    it('should generate API key with correct prefix', () => {
      const key = generateAPIKey('org-123', 'Test Key', ['dashboards:read']);
      expect(key.prefix).toBe('if_live_');
      expect(key.key).toContain(key.prefix);
      expect(key.permissions).toContain('dashboards:read');
    });

    it('should generate unique keys', () => {
      const key1 = generateAPIKey('org-123', 'Key 1', []);
      const key2 = generateAPIKey('org-123', 'Key 2', []);
      expect(key1.key).not.toBe(key2.key);
    });
  });

  describe('validateAPIKey', () => {
    it('should validate correct key', () => {
      const result = validateAPIKey('if_live_abcdef1234567890abcd');
      expect(result.prefix).toBe('if_live_');
    });

    it('should reject key without prefix', () => {
      const result = validateAPIKey('abcdef1234567890abcdef12345678');
      expect(result.valid).toBe(false);
    });

    it('should reject short key', () => {
      const result = validateAPIKey('if_live_short');
      expect(result.valid).toBe(false);
    });
  });

  describe('maskAPIKey', () => {
    it('should mask middle of key', () => {
      const masked = maskAPIKey('if_live_abcdefghijklmnopqrstuvwxyz012345');
      expect(masked).toContain('****');
      expect(masked).toContain('2345');
    });

    it('should handle short keys', () => {
      expect(maskAPIKey('short')).toBe('****');
    });
  });

  describe('checkRateLimit', () => {
    it('should allow under limit', () => {
      const result = checkRateLimit(50, defaultRateLimit, 'minute');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(10);
    });

    it('should deny at limit', () => {
      const result = checkRateLimit(60, defaultRateLimit, 'minute');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe('createCustomDomainRecord', () => {
    it('should create CNAME record', () => {
      const record = createCustomDomainRecord('app.example.com', 'org-123');
      expect(record.type).toBe('CNAME');
      expect(record.value).toContain('org-123');
    });
  });

  describe('validateCustomDomain', () => {
    it('should validate valid domain', () => {
      const result = validateCustomDomain('app.example.com');
      expect(result.valid).toBe(true);
    });

    it('should validate domain with https', () => {
      const result = validateCustomDomain('https://app.example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject empty domain', () => {
      const result = validateCustomDomain('');
      expect(result.valid).toBe(false);
    });

    it('should reject invalid domain', () => {
      const result = validateCustomDomain('not-a-domain');
      expect(result.valid).toBe(false);
    });
  });

  describe('generateEmailFooter', () => {
    it('should generate footer with copyright', () => {
      const config = { orgId: 'org-123', primaryColor: '#FF0000', customDomain: 'example.com' };
      const footer = generateEmailFooter(config);
      expect(footer).toContain(`${new Date().getFullYear()}`);
      expect(footer).toContain('example.com');
    });

    it('should include support URL when provided', () => {
      const config = { orgId: 'org-123', primaryColor: '#FF0000', supportUrl: 'https://support.example.com' };
      const footer = generateEmailFooter(config);
      expect(footer).toContain('Support:');
    });
  });
});
