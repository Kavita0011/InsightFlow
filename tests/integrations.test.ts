import { describe, it, expect } from 'vitest';
import {
  registerDataSource,
  syncDataSource,
  createWebhookHandler,
  processWebhookEvent,
  supportedIntegrations,
  validateIntegrationConfig,
} from '@/lib/integrations';

describe('Integrations', () => {
  describe('registerDataSource', () => {
    it('should register a new data source', async () => {
      const source = await registerDataSource('org-123', {
        name: 'Test Source',
        type: 'google_sheets',
      });
      expect(source.org_id).toBe('org-123');
      expect(source.name).toBe('Test Source');
    });
  });

  describe('syncDataSource', () => {
    it('should sync data source', async () => {
      const result = await syncDataSource('source-123');
      expect(result.success).toBe(true);
      expect(result.rowsAffected).toBe(0);
    });
  });

  describe('createWebhookHandler', () => {
    it('should create webhook handler', async () => {
      const handler = createWebhookHandler('test_event');
      const event = await handler({ data: 'test' });
      expect(event.type).toBe('test_event');
      expect(event.source).toBe('webhook');
    });
  });

  describe('processWebhookEvent', () => {
    it('should process webhook event', () => {
      const event = {
        id: 'evt-123',
        type: 'test',
        source: 'webhook',
        payload: { data: 'test' },
        timestamp: '2024-01-01',
      };
      const result = processWebhookEvent(event);
      expect(result.processed).toBe(true);
      expect(result.eventId).toBe('evt-123');
    });
  });

  describe('supportedIntegrations', () => {
    it('should have Google Sheets integration', () => {
      const gs = supportedIntegrations.find((i) => i.type === 'google_sheets');
      expect(gs).toBeDefined();
    });

    it('should have Stripe integration', () => {
      const stripe = supportedIntegrations.find((i) => i.type === 'stripe');
      expect(stripe).toBeDefined();
    });

    it('should have HubSpot integration', () => {
      const hs = supportedIntegrations.find((i) => i.type === 'hubspot');
      expect(hs).toBeDefined();
    });
  });

  describe('validateIntegrationConfig', () => {
    it('should validate Google Sheets config', () => {
      const valid = validateIntegrationConfig('google_sheets', { spreadsheet_id: 'abc' });
      expect(valid).toBe(true);
    });

    it('should reject invalid Google Sheets config', () => {
      const valid = validateIntegrationConfig('google_sheets', {});
      expect(valid).toBe(false);
    });

    it('should validate Stripe config', () => {
      const valid = validateIntegrationConfig('stripe', { api_key: 'sk_test' });
      expect(valid).toBe(true);
    });

    it('should reject unknown integration', () => {
      const valid = validateIntegrationConfig('unknown', {});
      expect(valid).toBe(false);
    });
  });
});
