import { describe, it, expect } from 'vitest';
import {
  sendAlert,
  createAlertConfig,
  validateAlertConfig,
  getEventLabel,
} from '@/lib/alerts';

describe('Alerts (Slack/Teams)', () => {
  describe('createAlertConfig', () => {
    it('should create Slack alert config', () => {
      const config = createAlertConfig('org-123', 'slack', 'https://hooks.slack.com/xxx', 'Test Alert', ['dashboard_created']);
      expect(config.channel).toBe('slack');
      expect(config.enabled).toBe(true);
    });

    it('should create Teams alert config', () => {
      const config = createAlertConfig('org-123', 'teams', 'https://outlook.office.com/xxx', 'Test Alert', ['dashboard_created']);
      expect(config.channel).toBe('teams');
    });
  });

  describe('validateAlertConfig', () => {
    it('should validate valid config', () => {
      const config = { channel: 'slack' as const, destination: 'https://hooks.slack.com/xxx', events: ['dashboard_created'] };
      const result = validateAlertConfig(config);
      expect(result.valid).toBe(true);
    });

    it('should reject missing channel', () => {
      const result = validateAlertConfig({ destination: 'https://url', events: ['dashboard_created'] });
      expect(result.valid).toBe(false);
    });

    it('should reject missing destination', () => {
      const result = validateAlertConfig({ channel: 'slack' as const, events: ['dashboard_created'] });
      expect(result.valid).toBe(false);
    });

    it('should reject empty events', () => {
      const result = validateAlertConfig({ channel: 'slack' as const, destination: 'https://url', events: [] });
      expect(result.valid).toBe(false);
    });
  });

  describe('getEventLabel', () => {
    it('should return correct labels', () => {
      expect(getEventLabel('dashboard_created')).toBe('Dashboard Created');
      expect(getEventLabel('anomaly_detected')).toBe('Anomaly Detected');
      expect(getEventLabel('payment_received')).toBe('Payment Received');
    });
  });

  describe('sendAlert', () => {
    it('should fail for disabled alert', async () => {
      const config = { id: '1', orgId: 'org-123', channel: 'slack' as const, destination: 'https://url', name: 'Test', enabled: false, events: ['dashboard_created'] };
      const payload = { event: 'dashboard_created' as const, title: 'Test', message: 'Test message', timestamp: '2024-01-01' };
      const result = await sendAlert(config, payload);
      expect(result.success).toBe(false);
    });

    it('should fail for unsubscribed event', async () => {
      const config = { id: '1', orgId: 'org-123', channel: 'slack' as const, destination: 'https://url', name: 'Test', enabled: true, events: ['dashboard_created'] };
      const payload = { event: 'anomaly_detected' as const, title: 'Test', message: 'Test message', timestamp: '2024-01-01' };
      const result = await sendAlert(config, payload);
      expect(result.success).toBe(false);
    });
  });
});
