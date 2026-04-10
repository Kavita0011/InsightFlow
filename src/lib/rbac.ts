import { type Role } from '@/types';

export const RBACPermissions = {
  admin: [
    'org:manage',
    'org:delete',
    'users:invite',
    'users:manage',
    'users:remove',
    'dashboards:create',
    'dashboards:edit',
    'dashboards:delete',
    'dashboards:publish',
    'charts:create',
    'charts:edit',
    'charts:delete',
    'data_sources:manage',
    'data:entry',
    'data:import',
    'payments:view',
    'payments:manage',
    'invoices:view',
    'invoices:manage',
    'templates:manage',
  ],
  editor: [
    'dashboards:create',
    'dashboards:edit',
    'charts:create',
    'charts:edit',
    'data_sources:manage',
    'data:entry',
    'data:import',
    'payments:view',
    'invoices:view',
  ],
  viewer: [
    'dashboards:view',
    'charts:view',
    'data_sources:view',
    'payments:view',
    'invoices:view',
  ],
} as const;

export function hasPermission(role: Role, permission: string): boolean {
  return RBACPermissions[role]?.includes(permission as never) ?? false;
}

export function getPermissions(role: Role): readonly string[] {
  return RBACPermissions[role] ?? [];
}
