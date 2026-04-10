import { describe, it, expect } from 'vitest';
import type { Org, User, Dashboard, Chart, DataSource, Payment, Invoice, Role } from '@/types';

describe('Types', () => {
  describe('Org', () => {
    it('should have required fields', () => {
      const org: Org = {
        id: '123',
        name: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        primary_color: '#3B82F6',
        currency: 'USD',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };
      expect(org.name).toBe('Test Org');
      expect(org.slug).toBe('test-org');
    });
  });

  describe('User', () => {
    it('should have valid role', () => {
      const user: User = {
        id: '123',
        clerk_user_id: ' clerk_123',
        email: 'test@example.com',
        org_id: 'org_123',
        role: 'admin',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };
      expect(['admin', 'editor', 'viewer']).toContain(user.role);
    });
  });

  describe('Dashboard', () => {
    it('should have layout object', () => {
      const dashboard: Dashboard = {
        id: '123',
        org_id: 'org_123',
        name: 'Test Dashboard',
        layout: { widgets: [] },
        is_public: false,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };
      expect(dashboard.layout).toBeDefined();
    });
  });

  describe('Chart', () => {
    it('should have valid chart type', () => {
      const chart: Chart = {
        id: '123',
        dashboard_id: 'dash_123',
        type: 'bar',
        data_config: {},
        position: { x: 0, y: 0, w: 4, h: 3 },
        style: {},
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };
      expect(['bar', 'line', 'pie', 'area', 'table', 'kpi']).toContain(chart.type);
    });
  });

  describe('Payment', () => {
    it('should have valid gateway', () => {
      const payment: Payment = {
        id: '123',
        org_id: 'org_123',
        amount: 100,
        currency: 'USD',
        status: 'pending',
        gateway: 'razorpay',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };
      expect(['razorpay', 'stripe']).toContain(payment.gateway);
    });
  });
});
