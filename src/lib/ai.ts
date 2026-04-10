export type InsightType = 'chart_suggestion' | 'data_insight' | 'trend' | 'anomaly';

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  chartType?: string;
  dataPoints?: Record<string, unknown>[];
}

export interface AIRequest {
  context: 'dashboard' | 'data' | 'insight';
  data?: Record<string, unknown>[];
  goal?: string;
}

const featureFlags = {
  aiEnabled: process.env.NEXT_PUBLIC_AI_ENABLED === 'true',
  openAIKey: process.env.OPENAI_API_KEY,
};

export function isAIEnabled(): boolean {
  return featureFlags.aiEnabled;
}

export function hasOpenAIKey(): boolean {
  return !!featureFlags.openAIKey;
}

export function generateRuleBasedInsight(data: Record<string, unknown>[]): AIInsight[] {
  if (!data || data.length === 0) return [];

  const insights: AIInsight[] = [];
  const columns = Object.keys(data[0]);

  if (columns.length >= 2) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'chart_suggestion',
      title: 'Consider a Bar Chart',
      description: `You have ${columns.length} columns that could benefit from visualization.`,
      confidence: 0.85,
      chartType: 'bar',
    });
  }

  const numericColumns = columns.filter((col) =>
    data.some((row) => typeof row[col] === 'number')
  );
  if (numericColumns.length >= 2) {
    insights.push({
      id: crypto.randomUUID(),
      type: 'trend',
      title: 'Correlation Possible',
      description: `Found ${numericColumns.length} numeric columns that might show trends.`,
      confidence: 0.7,
    });
  }

  return insights;
}

export async function getAIInsights(request: AIRequest): Promise<AIInsight[]> {
  if (!isAIEnabled()) {
    return generateRuleBasedInsight(request.data || []);
  }

  if (hasOpenAIKey()) {
    return [
      {
        id: crypto.randomUUID(),
        type: 'data_insight',
        title: 'AI Insight',
        description: 'Real AI insights will be generated when API key is available.',
        confidence: 0.5,
      },
    ];
  }

  return generateRuleBasedInsight(request.data || []);
}

export function selectChartType(goal: string, dataShape: Record<string, unknown>): string {
  const goalToChart: Record<string, string> = {
    analytics: 'bar',
    reporting: 'table',
    monitoring: 'line',
    forecasting: 'area',
  };
  return goalToChart[goal] || 'bar';
}
