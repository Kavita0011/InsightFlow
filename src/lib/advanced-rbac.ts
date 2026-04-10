import type { Role } from '@/types';

export type AdvancedRole = 'owner' | 'admin' | 'manager' | 'editor' | 'viewer' | 'guest';
export type Permission = 
  | 'org:manage' | 'org:delete' | 'org:billing'
  | 'users:invite' | 'users:manage' | 'users:remove'
  | 'dashboards:create' | 'dashboards:edit' | 'dashboards:delete' | 'dashboards:publish' | 'dashboards:view'
  | 'charts:create' | 'charts:edit' | 'charts:delete' | 'charts:view'
  | 'data:import' | 'data:export' | 'data:delete'
  | 'payments:view' | 'payments:manage'
  | 'invoices:view' | 'invoices:manage'
  | 'reports:create' | 'reports:view' | 'reports:export'
  | 'alerts:create' | 'alerts:manage' | 'alerts:view'
  | 'sso:manage' | 'sso:view'
  | 'audit:view' | 'audit:export';

export interface RolePermission {
  role: AdvancedRole;
  permissions: Permission[];
  inheritsFrom?: AdvancedRole;
}

export const advancedRoles: RolePermission[] = [
  {
    role: 'owner',
    permissions: [
      'org:manage', 'org:delete', 'org:billing',
      'users:invite', 'users:manage', 'users:remove',
      'dashboards:create', 'dashboards:edit', 'dashboards:delete', 'dashboards:publish', 'dashboards:view',
      'charts:create', 'charts:edit', 'charts:delete', 'charts:view',
      'data:import', 'data:export', 'data:delete',
      'payments:view', 'payments:manage',
      'invoices:view', 'invoices:manage',
      'reports:create', 'reports:view', 'reports:export',
      'alerts:create', 'alerts:manage', 'alerts:view',
      'sso:manage', 'sso:view',
      'audit:view', 'audit:export',
    ],
  },
  {
    role: 'admin',
    permissions: [
      'org:manage',
      'users:invite', 'users:manage', 'users:remove',
      'dashboards:create', 'dashboards:edit', 'dashboards:delete', 'dashboards:publish', 'dashboards:view',
      'charts:create', 'charts:edit', 'charts:delete', 'charts:view',
      'data:import', 'data:export', 'data:delete',
      'payments:view', 'payments:manage',
      'invoices:view', 'invoices:manage',
      'reports:create', 'reports:view', 'reports:export',
      'alerts:create', 'alerts:manage', 'alerts:view',
      'sso:view',
      'audit:view',
    ],
  },
  {
    role: 'manager',
    permissions: [
      'dashboards:create', 'dashboards:edit', 'dashboards:delete', 'dashboards:publish', 'dashboards:view',
      'charts:create', 'charts:edit', 'charts:delete', 'charts:view',
      'data:import', 'data:export',
      'reports:create', 'reports:view', 'reports:export',
      'alerts:create', 'alerts:view',
    ],
  },
  {
    role: 'editor',
    permissions: [
      'dashboards:create', 'dashboards:edit', 'dashboards:view',
      'charts:create', 'charts:edit', 'charts:view',
      'data:import',
      'reports:create', 'reports:view', 'reports:export',
      'alerts:view',
    ],
  },
  {
    role: 'viewer',
    permissions: [
      'dashboards:view',
      'charts:view',
      'reports:view',
      'alerts:view',
    ],
  },
  {
    role: 'guest',
    permissions: [
      'dashboards:view',
      'charts:view',
    ],
  },
];

export function getRolePermissions(role: AdvancedRole): Permission[] {
  const roleConfig = advancedRoles.find(r => r.role === role);
  return roleConfig?.permissions || [];
}

export function hasAdvancedPermission(role: AdvancedRole, permission: Permission): boolean {
  return getRolePermissions(role).includes(permission);
}

export function canAccessResource(
  role: AdvancedRole,
  resourceType: string,
  resourceId: string,
  userId: string,
  ownerId?: string
): boolean {
  const permissions = getRolePermissions(role);

  if (['owner', 'admin'].includes(role)) {
    return true;
  }

  if (resourceType === 'dashboard' || resourceType === 'chart') {
    return permissions.some(p => p.includes(resourceType) && p.includes('view'));
  }

  if (ownerId && ownerId === userId) {
    return true;
  }

  return permissions.some(p => p.includes('view'));
}

export function upgradeRole(currentRole: AdvancedRole, newRole: AdvancedRole): AdvancedRole {
  const roleHierarchy: AdvancedRole[] = ['guest', 'viewer', 'editor', 'manager', 'admin', 'owner'];
  const currentIndex = roleHierarchy.indexOf(currentRole);
  const newIndex = roleHierarchy.indexOf(newRole);

  if (newIndex > currentIndex) {
    return newRole;
  }

  return currentRole;
}

export function downgradeRole(currentRole: AdvancedRole, newRole: AdvancedRole): AdvancedRole {
  const roleHierarchy: AdvancedRole[] = ['guest', 'viewer', 'editor', 'manager', 'admin', 'owner'];
  const currentIndex = roleHierarchy.indexOf(currentRole);
  const newIndex = roleHierarchy.indexOf(newRole);

  if (newIndex < currentIndex) {
    return newRole;
  }

  return currentRole;
}

export function validateRoleChange(
  fromRole: AdvancedRole,
  toRole: AdvancedRole,
  actorRole: AdvancedRole
): { allowed: boolean; reason?: string } {
  if (actorRole === 'owner') {
    return { allowed: true };
  }

  if (actorRole === 'admin' && !['owner'].includes(toRole)) {
    return { allowed: true };
  }

  if (actorRole === 'manager' && ['viewer', 'editor'].includes(toRole)) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'Insufficient permissions to perform this role change' };
}

export function getRoleDisplayName(role: AdvancedRole): string {
  const names: Record<AdvancedRole, string> = {
    owner: 'Owner',
    admin: 'Administrator',
    manager: 'Manager',
    editor: 'Editor',
    viewer: 'Viewer',
    guest: 'Guest',
  };
  return names[role];
}

export function getRoleColor(role: AdvancedRole): string {
  const colors: Record<AdvancedRole, string> = {
    owner: '#DC2626',
    admin: '#7C3AED',
    manager: '#2563EB',
    editor: '#059669',
    viewer: '#6B7280',
    guest: '#9CA3AF',
  };
  return colors[role];
}

export function migrateLegacyRole(legacyRole: Role): AdvancedRole {
  const migration: Record<Role, AdvancedRole> = {
    admin: 'admin',
    editor: 'editor',
    viewer: 'viewer',
  };
  return migration[legacyRole] || 'viewer';
}
