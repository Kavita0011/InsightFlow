import type { Dashboard, Chart, DataSource } from '@/types';

export interface AIDashboardRequest {
  goal: string;
  dataSourceId?: string;
  data?: Record<string, unknown>[];
  preferences?: {
    chartTypes?: string[];
    style?: 'minimal' | 'detailed' | 'colorful';
  };
}

export interface AIDashboardResponse {
  dashboard: Partial<Dashboard>;
  charts: Partial<Chart>[];
  insights: string[];
  confidence: number;
}

export async function generateDashboardWithAI(request: AIDashboardRequest): Promise<AIDashboardResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return generateRuleBasedDashboard(request);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a data visualization expert. Generate dashboard layouts and chart configurations based on user goals.',
          },
          {
            role: 'user',
            content: JSON.stringify(request),
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0]?.message?.content || '{}');
    return content as AIDashboardResponse;
  } catch {
    return generateRuleBasedDashboard(request);
  }
}

function generateRuleBasedDashboard(request: AIDashboardRequest): AIDashboardResponse {
  const charts: Partial<Chart>[] = [];
  const insights: string[] = [];

  const goalToCharts: Record<string, string[]> = {
    analytics: ['bar', 'line', 'kpi'],
    reporting: ['table', 'bar', 'pie'],
    monitoring: ['line', 'area', 'kpi'],
    forecasting: ['area', 'line', 'bar'],
  };

  const chartTypes = request.preferences?.chartTypes || goalToCharts[request.goal] || ['bar', 'line'];

  chartTypes.forEach((type, index) => {
    charts.push({
      type: type as Chart['type'],
      title: getDefaultTitle(type, index),
      position: calculatePosition(index, type as Chart['type']),
      data_config: getDefaultDataConfig(type),
      style: request.preferences?.style === 'minimal' ? { padding: 8 } : { padding: 16 },
    });
  });

  if (request.data && request.data.length > 0) {
    const columns = Object.keys(request.data[0]);
    insights.push(`Found ${columns.length} data columns: ${columns.join(', ')}`);
    insights.push(`Dataset contains ${request.data.length} records`);
    
    const numericColumns = columns.filter(col => 
      request.data!.some(row => typeof row[col] === 'number')
    );
    if (numericColumns.length >= 2) {
      insights.push(`Detected ${numericColumns.length} numeric columns suitable for trend analysis`);
    }
  }

  return {
    dashboard: {
      name: `${request.goal} Dashboard`,
      description: `AI-generated dashboard for ${request.goal}`,
      layout: { widgets: [] },
    },
    charts,
    insights,
    confidence: 0.75,
  };
}

function getDefaultTitle(type: string, index: number): string {
  const titles: Record<string, string[]> = {
    bar: ['Monthly Revenue', 'Sales by Category'],
    line: ['Trend Over Time', 'Growth Analysis'],
    pie: ['Distribution', 'Composition'],
    area: ['Cumulative Growth', 'Volume Trend'],
    table: ['Data Overview', 'Detailed Records'],
    kpi: ['Key Metric', 'Performance'],
  };
  return titles[type]?.[index] || `${type} Chart ${index + 1}`;
}

function calculatePosition(index: number, type: Chart['type']): Chart['position'] {
  const positions: Record<Chart['type'], Chart['position']> = {
    bar: { x: 0, y: 0, w: 6, h: 3 },
    line: { x: 6, y: 0, w: 6, h: 3 },
    pie: { x: 0, y: 3, w: 4, h: 3 },
    area: { x: 4, y: 3, w: 4, h: 3 },
    table: { x: 0, y: 6, w: 12, h: 4 },
    kpi: { x: 8, y: 3, w: 4, h: 3 },
  };
  return positions[type] || { x: index * 4, y: 0, w: 4, h: 3 };
}

function getDefaultDataConfig(type: string): Record<string, unknown> {
  const configs: Record<string, Record<string, unknown>> = {
    bar: { xAxis: 'category', yAxis: 'value', aggregation: 'sum' },
    line: { xAxis: 'date', yAxis: 'value', showDots: true },
    pie: { valueField: 'value', labelField: 'name', innerRadius: 0 },
    area: { xAxis: 'date', yAxis: 'value', opacity: 0.5 },
    table: { columns: [], pagination: true, pageSize: 10 },
    kpi: { format: 'number', comparison: 'previous' },
  };
  return configs[type] || {};
}

export function validateAIRequest(request: AIDashboardRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.goal) {
    errors.push('Goal is required');
  }

  if (request.data && !Array.isArray(request.data)) {
    errors.push('Data must be an array');
  }

  if (request.preferences?.style && !['minimal', 'detailed', 'colorful'].includes(request.preferences.style)) {
    errors.push('Invalid style preference');
  }

  return { valid: errors.length === 0, errors };
}

export function estimateAICost(request: AIDashboardRequest): { tokens: number; estimatedCost: number } {
  const inputTokens = JSON.stringify(request).length / 4;
  const estimatedOutputTokens = 500;
  const tokens = Math.ceil(inputTokens) + estimatedOutputTokens;
  const costPer1KTokens = 0.03;
  const estimatedCost = (tokens / 1000) * costPer1KTokens;

  return { tokens, estimatedCost };
}
