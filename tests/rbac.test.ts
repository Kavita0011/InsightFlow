import { describe, it, expect } from 'vitest';
import { hasPermission, getPermissions, RBACPermissions } from '@/lib/rbac';

describe('RBAC', () => {
  describe('hasPermission', () => {
    it('should return true for admin permissions', () => {
      expect(hasPermission('admin', 'org:manage')).toBe(true);
      expect(hasPermission('admin', 'users:invite')).toBe(true);
      expect(hasPermission('admin', 'dashboards:create')).toBe(true);
    });

    it('should return true for editor permissions', () => {
      expect(hasPermission('editor', 'dashboards:create')).toBe(true);
      expect(hasPermission('editor', 'charts:create')).toBe(true);
      expect(hasPermission('editor', 'data:entry')).toBe(true);
    });

    it('should return true for viewer permissions', () => {
      expect(hasPermission('viewer', 'dashboards:view')).toBe(true);
      expect(hasPermission('viewer', 'charts:view')).toBe(true);
    });

    it('should return false for permissions not in role', () => {
      expect(hasPermission('viewer', 'org:manage')).toBe(false);
      expect(hasPermission('viewer', 'users:invite')).toBe(false);
      expect(hasPermission('editor', 'org:delete')).toBe(false);
    });

    it('should return false for invalid permission', () => {
      expect(hasPermission('admin', 'invalid:permission')).toBe(false);
      expect(hasPermission('viewer', 'invalid:permission')).toBe(false);
    });
  });

  describe('getPermissions', () => {
    it('should return all admin permissions', () => {
      const permissions = getPermissions('admin');
      expect(permissions).toContain('org:manage');
      expect(permissions).toContain('dashboards:create');
      expect(permissions.length).toBeGreaterThan(10);
    });

    it('should return all editor permissions', () => {
      const permissions = getPermissions('editor');
      expect(permissions).toContain('dashboards:create');
      expect(permissions).not.toContain('org:manage');
    });

    it('should return all viewer permissions', () => {
      const permissions = getPermissions('viewer');
      expect(permissions).toContain('dashboards:view');
      expect(permissions).not.toContain('dashboards:create');
    });
  });

  describe('RBACPermissions', () => {
    it('should have all required roles', () => {
      expect(RBACPermissions).toHaveProperty('admin');
      expect(RBACPermissions).toHaveProperty('editor');
      expect(RBACPermissions).toHaveProperty('viewer');
    });

    it('admin should have most permissions', () => {
      expect(RBACPermissions.admin.length).toBeGreaterThan(RBACPermissions.editor.length);
      expect(RBACPermissions.admin.length).toBeGreaterThan(RBACPermissions.viewer.length);
    });
  });
});
