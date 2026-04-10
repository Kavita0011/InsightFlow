import { describe, it, expect } from 'vitest';
import {
  getRolePermissions,
  hasAdvancedPermission,
  canAccessResource,
  upgradeRole,
  downgradeRole,
  validateRoleChange,
  getRoleDisplayName,
  getRoleColor,
  migrateLegacyRole,
} from '@/lib/advanced-rbac';

describe('Advanced RBAC', () => {
  describe('getRolePermissions', () => {
    it('should return all owner permissions', () => {
      const permissions = getRolePermissions('owner');
      expect(permissions).toContain('org:manage');
      expect(permissions).toContain('org:delete');
      expect(permissions.length).toBeGreaterThan(20);
    });

    it('should return admin permissions', () => {
      const permissions = getRolePermissions('admin');
      expect(permissions).toContain('org:manage');
      expect(permissions).not.toContain('org:delete');
    });

    it('should return viewer permissions', () => {
      const permissions = getRolePermissions('viewer');
      expect(permissions).toContain('dashboards:view');
      expect(permissions).not.toContain('dashboards:create');
    });

    it('should return guest permissions', () => {
      const permissions = getRolePermissions('guest');
      expect(permissions).toHaveLength(2);
    });
  });

  describe('hasAdvancedPermission', () => {
    it('should check owner has all permissions', () => {
      expect(hasAdvancedPermission('owner', 'org:delete')).toBe(true);
      expect(hasAdvancedPermission('owner', 'users:manage')).toBe(true);
    });

    it('should check editor limited permissions', () => {
      expect(hasAdvancedPermission('editor', 'dashboards:create')).toBe(true);
      expect(hasAdvancedPermission('editor', 'org:manage')).toBe(false);
    });

    it('should check guest minimal permissions', () => {
      expect(hasAdvancedPermission('guest', 'dashboards:view')).toBe(true);
      expect(hasAdvancedPermission('guest', 'charts:create')).toBe(false);
    });
  });

  describe('canAccessResource', () => {
    it('should allow owner to access any resource', () => {
      expect(canAccessResource('owner', 'dashboard', 'dash-1', 'user-1')).toBe(true);
    });

    it('should allow admin to access any resource', () => {
      expect(canAccessResource('admin', 'dashboard', 'dash-1', 'user-1')).toBe(true);
    });

    it('should allow owner to access own resource', () => {
      expect(canAccessResource('viewer', 'dashboard', 'dash-1', 'user-1', 'user-1')).toBe(true);
    });
  });

  describe('upgradeRole', () => {
    it('should upgrade viewer to editor', () => {
      expect(upgradeRole('viewer', 'editor')).toBe('editor');
    });

    it('should not downgrade when upgrading', () => {
      expect(upgradeRole('admin', 'viewer')).toBe('admin');
    });
  });

  describe('downgradeRole', () => {
    it('should downgrade admin to viewer', () => {
      expect(downgradeRole('admin', 'viewer')).toBe('viewer');
    });

    it('should not upgrade when downgrading', () => {
      expect(downgradeRole('viewer', 'admin')).toBe('viewer');
    });
  });

  describe('validateRoleChange', () => {
    it('should allow owner to change any role', () => {
      const result = validateRoleChange('admin', 'viewer', 'owner');
      expect(result.allowed).toBe(true);
    });

    it('should allow admin to change non-owner roles', () => {
      const result = validateRoleChange('viewer', 'editor', 'admin');
      expect(result.allowed).toBe(true);
    });

    it('should deny viewer to change roles', () => {
      const result = validateRoleChange('viewer', 'editor', 'viewer');
      expect(result.allowed).toBe(false);
    });
  });

  describe('getRoleDisplayName', () => {
    it('should return correct display names', () => {
      expect(getRoleDisplayName('owner')).toBe('Owner');
      expect(getRoleDisplayName('admin')).toBe('Administrator');
      expect(getRoleDisplayName('manager')).toBe('Manager');
    });
  });

  describe('getRoleColor', () => {
    it('should return correct colors', () => {
      expect(getRoleColor('owner')).toBe('#DC2626');
      expect(getRoleColor('admin')).toBe('#7C3AED');
    });
  });

  describe('migrateLegacyRole', () => {
    it('should migrate admin to admin', () => {
      expect(migrateLegacyRole('admin')).toBe('admin');
    });

    it('should migrate editor to editor', () => {
      expect(migrateLegacyRole('editor')).toBe('editor');
    });

    it('should migrate viewer to viewer', () => {
      expect(migrateLegacyRole('viewer')).toBe('viewer');
    });
  });
});
