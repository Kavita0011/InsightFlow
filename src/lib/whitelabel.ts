import type { Org } from '@/types';

export interface WhiteLabelConfig {
  orgId: string;
  customDomain?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  emailFromName?: string;
  emailFromAddress?: string;
  supportUrl?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

export interface APIKey {
  id: string;
  orgId: string;
  name: string;
  key: string;
  prefix: string;
  permissions: string[];
  lastUsed?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface APIRateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
}

export const defaultRateLimit: APIRateLimit = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  requestsPerDay: 10000,
};

export function createWhiteLabelConfig(org: Org, overrides?: Partial<WhiteLabelConfig>): WhiteLabelConfig {
  return {
    orgId: org.id,
    customDomain: org.domain || undefined,
    logoUrl: org.logo_url || undefined,
    primaryColor: org.primary_color,
    ...overrides,
  };
}

export function generateAPIKey(orgId: string, name: string, permissions: string[]): APIKey {
  const prefix = 'if_live_';
  const randomPart = crypto.randomUUID().replace(/-/g, '').substring(0, 32);
  const key = prefix + randomPart;

  return {
    id: crypto.randomUUID(),
    orgId,
    name,
    key,
    prefix,
    permissions,
    createdAt: new Date().toISOString(),
  };
}

export function validateAPIKey(key: string): { valid: boolean; prefix: string; key: string } {
  const prefix = 'if_live_';
  
  if (!key.startsWith(prefix)) {
    return { valid: false, prefix: '', key: '' };
  }

  const actualKey = key.substring(prefix.length);
  
  if (actualKey.length < 32) {
    return { valid: false, prefix, key: '' };
  }

  return { valid: true, prefix, key: actualKey };
}

export function maskAPIKey(key: string): string {
  if (key.length < 8) return '****';
  return key.substring(0, 8) + '****' + key.substring(key.length - 4);
}

export function checkRateLimit(
  currentCount: number,
  limit: APIRateLimit,
  window: 'minute' | 'hour' | 'day'
): { allowed: boolean; remaining: number; resetAt: string } {
  const limits = {
    minute: limit.requestsPerMinute,
    hour: limit.requestsPerHour,
    day: limit.requestsPerDay,
  };

  const allowed = currentCount < limits[window];
  const remaining = Math.max(0, limits[window] - currentCount);
  
  const now = new Date();
  const resetTimes = {
    minute: new Date(now.getTime() + 60000),
    hour: new Date(now.getTime() + 3600000),
    day: new Date(now.getTime() + 86400000),
  };

  return {
    allowed,
    remaining,
    resetAt: resetTimes[window].toISOString(),
  };
}

export function createCustomDomainRecord(
  domain: string,
  orgId: string
): { type: string; name: string; value: string; priority?: number } {
  return {
    type: 'CNAME',
    name: domain.replace(/^[^.]+\./, ''),
    value: `${orgId}.insightflow.app`,
  };
}

export function validateCustomDomain(domain: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!domain) {
    errors.push('Domain is required');
    return { valid: false, errors };
  }

  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    const parsed = new URL(url);
    
    if (!['com', 'net', 'org', 'io', 'co'].includes(parsed.hostname.split('.').pop() || '')) {
      errors.push('Invalid domain TLD');
    }
  } catch {
    errors.push('Invalid domain format');
  }

  return { valid: errors.length === 0, errors };
}

export function generateEmailFooter(config: WhiteLabelConfig): string {
  const lines = [
    `© ${new Date().getFullYear()} ${config.customDomain || 'InsightFlow'}`,
  ];

  if (config.supportUrl) {
    lines.push(`Support: ${config.supportUrl}`);
  }

  if (config.privacyPolicyUrl) {
    lines.push(`Privacy Policy: ${config.privacyPolicyUrl}`);
  }

  if (config.termsOfServiceUrl) {
    lines.push(`Terms of Service: ${config.termsOfServiceUrl}`);
  }

  return lines.join(' | ');
}
