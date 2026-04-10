export type AuditAction = 
  | 'org_created'
  | 'org_updated'
  | 'org_deleted'
  | 'user_invited'
  | 'user_removed'
  | 'user_role_changed'
  | 'dashboard_created'
  | 'dashboard_updated'
  | 'dashboard_deleted'
  | 'chart_created'
  | 'chart_updated'
  | 'chart_deleted'
  | 'data_imported'
  | 'data_exported'
  | 'payment_received'
  | 'invoice_generated'
  | 'sso_configured'
  | 'settings_updated'
  | 'login'
  | 'logout';

export interface AuditLog {
  id: string;
  orgId: string;
  userId: string;
  action: AuditAction;
  resource?: string;
  resourceId?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogFilter {
  orgId: string;
  userId?: string;
  action?: AuditAction;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export async function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
  return {
    ...log,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}

export async function getAuditLogs(filter: AuditLogFilter): Promise<AuditLog[]> {
  const logs: AuditLog[] = [];
  return logs;
}

export async function getAuditLogsByOrg(orgId: string, limit = 100): Promise<AuditLog[]> {
  return getAuditLogs({ orgId, limit });
}

export async function getAuditLogsByUser(orgId: string, userId: string, limit = 100): Promise<AuditLog[]> {
  return getAuditLogs({ orgId, userId, limit });
}

export async function getAuditLogsByAction(orgId: string, action: AuditAction, limit = 100): Promise<AuditLog[]> {
  return getAuditLogs({ orgId, action, limit });
}

export function getActionLabel(action: AuditAction): string {
  const labels: Record<AuditAction, string> = {
    org_created: 'Organization Created',
    org_updated: 'Organization Updated',
    org_deleted: 'Organization Deleted',
    user_invited: 'User Invited',
    user_removed: 'User Removed',
    user_role_changed: 'User Role Changed',
    dashboard_created: 'Dashboard Created',
    dashboard_updated: 'Dashboard Updated',
    dashboard_deleted: 'Dashboard Deleted',
    chart_created: 'Chart Created',
    chart_updated: 'Chart Updated',
    chart_deleted: 'Chart Deleted',
    data_imported: 'Data Imported',
    data_exported: 'Data Exported',
    payment_received: 'Payment Received',
    invoice_generated: 'Invoice Generated',
    sso_configured: 'SSO Configured',
    settings_updated: 'Settings Updated',
    login: 'User Login',
    logout: 'User Logout',
  };
  return labels[action];
}

export function getActionCategory(action: AuditAction): string {
  const categories: Record<string, AuditAction[]> = {
    Organization: ['org_created', 'org_updated', 'org_deleted'],
    Users: ['user_invited', 'user_removed', 'user_role_changed', 'login', 'logout'],
    Dashboards: ['dashboard_created', 'dashboard_updated', 'dashboard_deleted'],
    Charts: ['chart_created', 'chart_updated', 'chart_deleted'],
    Data: ['data_imported', 'data_exported'],
    Billing: ['payment_received', 'invoice_generated'],
    Security: ['sso_configured', 'settings_updated'],
  };

  for (const [category, actions] of Object.entries(categories)) {
    if (actions.includes(action)) return category;
  }
  return 'Other';
}

export function filterAuditLogsByDateRange(
  logs: AuditLog[],
  startDate?: string,
  endDate?: string
): AuditLog[] {
  return logs.filter(log => {
    const logDate = new Date(log.timestamp);
    if (startDate && logDate < new Date(startDate)) return false;
    if (endDate && logDate > new Date(endDate)) return false;
    return true;
  });
}

export function groupAuditLogsByAction(logs: AuditLog[]): Record<AuditAction, number> {
  const grouped: Record<string, number> = {};
  
  for (const log of logs) {
    grouped[log.action] = (grouped[log.action] || 0) + 1;
  }
  
  return grouped as Record<AuditAction, number>;
}

export function groupAuditLogsByUser(logs: AuditLog[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  
  for (const log of logs) {
    grouped[log.userId] = (grouped[log.userId] || 0) + 1;
  }
  
  return grouped;
}

export function groupAuditLogsByDay(logs: AuditLog[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  
  for (const log of logs) {
    const date = log.timestamp.split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  }
  
  return grouped;
}

export function validateAuditLog(log: Partial<AuditLog>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!log.orgId) errors.push('Organization ID is required');
  if (!log.userId) errors.push('User ID is required');
  if (!log.action) errors.push('Action is required');

  return { valid: errors.length === 0, errors };
}
