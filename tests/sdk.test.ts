import { describe, it, expect } from 'vitest';
import { createInsightFlowSDK, SDK_VERSION, SDK_NAME } from '@/lib/sdk';

describe('SDK', () => {
  describe('createInsightFlowSDK', () => {
    it('should create SDK instance', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(sdk.dashboards).toBeDefined();
      expect(sdk.charts).toBeDefined();
      expect(sdk.data).toBeDefined();
    });

    it('should use custom base URL', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key', baseUrl: 'https://custom.api.com' });
      expect(sdk).toBeDefined();
    });

    it('should include orgId when provided', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key', orgId: 'org-123' });
      expect(sdk.orgId).toBe('org-123');
    });
  });

  describe('SDK constants', () => {
    it('should have correct version', () => {
      expect(SDK_VERSION).toBe('1.0.0');
    });

    it('should have correct name', () => {
      expect(SDK_NAME).toBe('insightflow-sdk-js');
    });
  });

  describe('dashboards API', () => {
    it('should have list method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.dashboards.list).toBe('function');
    });

    it('should have get method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.dashboards.get).toBe('function');
    });

    it('should have create method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.dashboards.create).toBe('function');
    });

    it('should have update method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.dashboards.update).toBe('function');
    });

    it('should have delete method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.dashboards.delete).toBe('function');
    });
  });

  describe('charts API', () => {
    it('should have list method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.charts.list).toBe('function');
    });

    it('should have create method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.charts.create).toBe('function');
    });
  });

  describe('data API', () => {
    it('should have getDataSources method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.data.getDataSources).toBe('function');
    });

    it('should have importData method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.data.importData).toBe('function');
    });

    it('should have query method', () => {
      const sdk = createInsightFlowSDK({ apiKey: 'test-key' });
      expect(typeof sdk.data.query).toBe('function');
    });
  });
});
