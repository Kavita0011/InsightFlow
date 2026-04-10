import { describe, it, expect } from 'vitest';
import {
  createAuditLog,
  getAuditLogsByOrg,
  getActionLabel,
  getActionCategory,
  filterAuditLogsByDateRange,
  groupAuditLogsByAction,
  groupAuditLogsByUser,
  groupAuditLogsByDay,
  validateAuditLog,
} from '@/lib/audit';

describe('Audit Logs', () => {
  describe('createAuditLog', () => {
    it('should create audit log with timestamp', async () => {
      const log = await createAuditLog({
        orgId: 'org-123',
        userId: 'user-456',
        action: 'dashboard_created',
        resourceId: 'dash-789',
        details: { name: 'Test Dashboard' },
      });
      
      expect(log.id).toBeDefined();
      expect(log.timestamp).toBeDefined();
      expect(log.action).toBe('dashboard_created');
    });
  });

  describe('getActionLabel', () => {
    it('should return correct labels', () => {
      expect(getActionLabel('org_created')).toBe('Organization Created');
      expect(getActionLabel('dashboard_created')).toBe('Dashboard Created');
      expect(getActionLabel('login')).toBe('User Login');
    });
  });

  describe('getActionCategory', () => {
    it('should return correct category', () => {
      expect(getActionCategory('org_created')).toBe('Organization');
      expect(getActionCategory('user_invited')).toBe('Users');
      expect(getActionCategory('dashboard_created')).toBe('Dashboards');
      expect(getActionCategory('chart_created')).toBe('Charts');
      expect(getActionCategory('data_imported')).toBe('Data');
      expect(getActionCategory('payment_received')).toBe('Billing');
      expect(getActionCategory('sso_configured')).toBe('Security');
    });
  });

  describe('filterAuditLogsByDateRange', () => {
    it('should filter by start date', () => {
      const logs = [
        { id: '1', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-01T00:00:00Z' },
        { id: '2', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-15T00:00:00Z' },
        { id: '3', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-02-01T00:00:00Z' },
      ];
      
      const result = filterAuditLogsByDateRange(logs, '2024-01-10T00:00:00Z');
      expect(result.length).toBe(2);
    });

    it('should filter by end date', () => {
      const logs = [
        { id: '1', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-01T00:00:00Z' },
        { id: '2', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-15T00:00:00Z' },
        { id: '3', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-02-01T00:00:00Z' },
      ];
      
      const result = filterAuditLogsByDateRange(logs, undefined, '2024-01-20T00:00:00Z');
      expect(result.length).toBe(2);
    });
  });

  describe('groupAuditLogsByAction', () => {
    it('should group logs by action', () => {
      const logs = [
        { id: '1', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-01' },
        { id: '2', orgId: 'org-1', userId: 'u2', action: 'login' as const, details: {}, timestamp: '2024-01-01' },
        { id: '3', orgId: 'org-1', userId: 'u1', action: 'dashboard_created' as const, details: {}, timestamp: '2024-01-01' },
      ];
      
      const result = groupAuditLogsByAction(logs);
      expect(result.login).toBe(2);
      expect(result.dashboard_created).toBe(1);
    });
  });

  describe('groupAuditLogsByUser', () => {
    it('should group logs by user', () => {
      const logs = [
        { id: '1', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-01' },
        { id: '2', orgId: 'org-1', userId: 'u2', action: 'login' as const, details: {}, timestamp: '2024-01-01' },
        { id: '3', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-01' },
      ];
      
      const result = groupAuditLogsByUser(logs);
      expect(result.u1).toBe(2);
      expect(result.u2).toBe(1);
    });
  });

  describe('groupAuditLogsByDay', () => {
    it('should group logs by day', () => {
      const logs = [
        { id: '1', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-01T10:00:00Z' },
        { id: '2', orgId: 'org-1', userId: 'u2', action: 'login' as const, details: {}, timestamp: '2024-01-02T10:00:00Z' },
        { id: '3', orgId: 'org-1', userId: 'u1', action: 'login' as const, details: {}, timestamp: '2024-01-02T10:00:00Z' },
      ];
      
      const result = groupAuditLogsByDay(logs);
      expect(result['2024-01-01']).toBe(1);
      expect(result['2024-01-02']).toBe(2);
    });
  });

  describe('validateAuditLog', () => {
    it('should validate valid log', () => {
      const log = { orgId: 'org-1', userId: 'user-1', action: 'login' as const };
      const result = validateAuditLog(log);
      expect(result.valid).toBe(true);
    });

    it('should reject missing org ID', () => {
      const log = { userId: 'user-1', action: 'login' as const };
      const result = validateAuditLog(log);
      expect(result.valid).toBe(false);
    });

    it('should reject missing user ID', () => {
      const log = { orgId: 'org-1', action: 'login' as const };
      const result = validateAuditLog(log);
      expect(result.valid).toBe(false);
    });

    it('should reject missing action', () => {
      const log = { orgId: 'org-1', userId: 'user-1' };
      const result = validateAuditLog(log);
      expect(result.valid).toBe(false);
    });
  });
});
