import type { DataSource } from '@/types';

export interface Integration {
  id: string;
  name: string;
  type: 'google_sheets' | 'stripe' | 'hubspot' | 'webhook';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  config: Record<string, unknown>;
}

export interface WebhookEvent {
  id: string;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export async function registerDataSource(
  orgId: string,
  integration: Partial<Integration>
): Promise<DataSource> {
  return {
    id: crypto.randomUUID(),
    org_id: orgId,
    name: integration.name || 'New Source',
    type: integration.type as DataSource['type'] || 'manual',
    config: integration.config || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function syncDataSource(dataSourceId: string): Promise<{ success: boolean; rowsAffected: number }> {
  return { success: true, rowsAffected: 0 };
}

export function createWebhookHandler(eventType: string) {
  return async (payload: Record<string, unknown>): Promise<WebhookEvent> => {
    return {
      id: crypto.randomUUID(),
      type: eventType,
      source: 'webhook',
      payload,
      timestamp: new Date().toISOString(),
    };
  };
}

export function processWebhookEvent(event: WebhookEvent): Record<string, unknown> {
  return {
    processed: true,
    eventId: event.id,
    eventType: event.type,
    data: event.payload,
  };
}

export const supportedIntegrations: Integration[] = [
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    type: 'google_sheets',
    status: 'disconnected',
    config: {},
  },
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'stripe',
    status: 'disconnected',
    config: {},
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'hubspot',
    status: 'disconnected',
    config: {},
  },
];

export function validateIntegrationConfig(
  type: string,
  config: Record<string, unknown>
): boolean {
  const requiredFields: Record<string, string[]> = {
    google_sheets: ['spreadsheet_id'],
    stripe: ['api_key'],
    hubspot: ['api_key'],
    webhook: ['url'],
  };
  
  const fields = requiredFields[type];
  if (!fields) return false;
  
  return fields.every((field) => config[field]);
}
