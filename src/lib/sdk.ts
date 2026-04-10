import type { Dashboard, Chart, DataSource } from '@/types';

export interface InsightFlowSDKConfig {
  apiKey: string;
  baseUrl?: string;
  orgId?: string;
}

export interface SDKDashboards {
  list(): Promise<Dashboard[]>;
  get(id: string): Promise<Dashboard>;
  create(data: Partial<Dashboard>): Promise<Dashboard>;
  update(id: string, data: Partial<Dashboard>): Promise<Dashboard>;
  delete(id: string): Promise<void>;
}

export interface SDKCharts {
  list(dashboardId: string): Promise<Chart[]>;
  get(id: string): Promise<Chart>;
  create(dashboardId: string, data: Partial<Chart>): Promise<Chart>;
  update(id: string, data: Partial<Chart>): Promise<Chart>;
  delete(id: string): Promise<void>;
}

export interface SDKData {
  getDataSources(): Promise<DataSource[]>;
  importData(sourceId: string, data: Record<string, unknown>[]): Promise<void>;
  query(query: string): Promise<Record<string, unknown>[]>;
}

export interface InsightFlowSDK {
  dashboards: SDKDashboards;
  charts: SDKCharts;
  data: SDKData;
  orgId: string;
}

export function createInsightFlowSDK(config: InsightFlowSDKConfig): InsightFlowSDK {
  const baseUrl = config.baseUrl || 'https://api.insightflow.app/v1';
  
  const headers = {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json',
  };

  return {
    dashboards: {
      list: async () => {
        const response = await fetch(`${baseUrl}/dashboards`, { headers });
        return response.json();
      },
      get: async (id: string) => {
        const response = await fetch(`${baseUrl}/dashboards/${id}`, { headers });
        return response.json();
      },
      create: async (data) => {
        const response = await fetch(`${baseUrl}/dashboards`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        return response.json();
      },
      update: async (id, data) => {
        const response = await fetch(`${baseUrl}/dashboards/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });
        return response.json();
      },
      delete: async (id) => {
        await fetch(`${baseUrl}/dashboards/${id}`, { method: 'DELETE', headers });
      },
    },
    charts: {
      list: async (dashboardId) => {
        const response = await fetch(`${baseUrl}/dashboards/${dashboardId}/charts`, { headers });
        return response.json();
      },
      get: async (id) => {
        const response = await fetch(`${baseUrl}/charts/${id}`, { headers });
        return response.json();
      },
      create: async (dashboardId, data) => {
        const response = await fetch(`${baseUrl}/dashboards/${dashboardId}/charts`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        });
        return response.json();
      },
      update: async (id, data) => {
        const response = await fetch(`${baseUrl}/charts/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(data),
        });
        return response.json();
      },
      delete: async (id) => {
        await fetch(`${baseUrl}/charts/${id}`, { method: 'DELETE', headers });
      },
    },
    data: {
      getDataSources: async () => {
        const response = await fetch(`${baseUrl}/data-sources`, { headers });
        return response.json();
      },
      importData: async (sourceId, data) => {
        await fetch(`${baseUrl}/data-sources/${sourceId}/data`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ data }),
        });
      },
      query: async (query) => {
        const response = await fetch(`${baseUrl}/query`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ query }),
        });
        return response.json();
      },
    },
    orgId: config.orgId || '',
  };
}

export const SDK_VERSION = '1.0.0';
export const SDK_NAME = 'insightflow-sdk-js';
