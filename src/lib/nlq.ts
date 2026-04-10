export type ChartType = 'bar' | 'line' | 'pie' | 'table' | 'kpi' | 'area';

export interface NLQRequest {
  question: string;
  dataSourceId?: string;
  data?: Record<string, unknown>[];
}

export interface NLQResponse {
  answer: string;
  sql?: string;
  visualization?: {
    type: ChartType;
    data: Record<string, unknown>[];
  };
  confidence: number;
}

const keywordToOperation: Record<string, string> = {
  sum: 'sum',
  total: 'sum',
  average: 'avg',
  mean: 'avg',
  count: 'count',
  maximum: 'max',
  max: 'max',
  minimum: 'min',
  min: 'min',
  latest: 'last',
  newest: 'last',
  oldest: 'first',
};

const keywordToChartType: Record<string, ChartType> = {
  show: 'table',
  list: 'table',
  display: 'table',
  trend: 'line',
  growth: 'area',
  compare: 'bar',
  breakdown: 'pie',
  distribution: 'pie',
  summary: 'kpi',
  total: 'kpi',
};

export async function processNaturalLanguageQuery(request: NLQRequest): Promise<NLQResponse> {
  const question = request.question.toLowerCase();
  const data = request.data || [];

  if (data.length === 0) {
    return {
      answer: 'No data available to answer your question.',
      confidence: 0,
    };
  }

  const operation = detectAggregation(question);
  const field = detectField(question, data);
  const groupBy = detectGroupBy(question, data);
  const chartType = detectChartType(question);

  if (operation && field) {
    const result = executeAggregation(data, field, operation, groupBy);
    const answer = formatAnswer(question, result, field, operation);
    
    return {
      answer,
      sql: generateMockSQL(operation, field, groupBy),
      visualization: {
        type: chartType || (groupBy ? 'bar' : 'kpi'),
        data: result,
      },
      confidence: 0.85,
    };
  }

  if (question.includes('how many') || question.includes('count')) {
    return {
      answer: `There are ${data.length} records.`,
      visualization: {
        type: 'kpi',
        data: [{ value: data.length }],
      },
      confidence: 0.9,
    };
  }

  if (question.includes('what') || question.includes('list')) {
    const fields = Object.keys(data[0]);
    return {
      answer: `The data contains ${fields.length} fields: ${fields.join(', ')}`,
      visualization: {
        type: 'table',
        data: data.slice(0, 10),
      },
      confidence: 0.8,
    };
  }

  return {
    answer: 'I could not understand your question. Try asking about totals, averages, or trends.',
    confidence: 0.3,
  };
}

function detectAggregation(question: string): string | null {
  for (const [keyword, op] of Object.entries(keywordToOperation)) {
    if (question.includes(keyword)) {
      return op;
    }
  }
  return null;
}

function detectField(question: string, data: Record<string, unknown>[]): string | null {
  const fields = Object.keys(data[0]);
  const lowerQuestion = question.toLowerCase();

  for (const field of fields) {
    if (lowerQuestion.includes(field.toLowerCase())) {
      return field;
    }
  }
  return fields[0];
}

function detectGroupBy(question: string, data: Record<string, unknown>[]): string | null {
  const fields = Object.keys(data[0]);
  const lowerQuestion = question.toLowerCase();

  const groupKeywords = ['by', 'per', 'each', 'grouped by'];
  if (!groupKeywords.some(kw => lowerQuestion.includes(kw))) {
    return null;
  }

  for (const field of fields) {
    if (lowerQuestion.includes(field.toLowerCase())) {
      return field;
    }
  }
  return null;
}

function detectChartType(question: string): ChartType | null {
  const lowerQuestion = question.toLowerCase();
  
  for (const [keyword, type] of Object.entries(keywordToChartType)) {
    if (lowerQuestion.includes(keyword)) {
      return type;
    }
  }
  return null;
}

function executeAggregation(
  data: Record<string, unknown>[],
  field: string,
  operation: string,
  groupBy: string | null
): Record<string, unknown>[] {
  if (groupBy) {
    const groups = new Map<string, number[]>();
    
    for (const row of data) {
      const key = String(row[groupBy] || 'Unknown');
      const value = Number(row[field]) || 0;
      
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(value);
    }

    return Array.from(groups.entries()).map(([key, values]) => {
      let result: number;
      switch (operation) {
        case 'sum': result = values.reduce((a, b) => a + b, 0); break;
        case 'avg': result = values.reduce((a, b) => a + b, 0) / values.length; break;
        case 'count': result = values.length; break;
        case 'max': result = Math.max(...values); break;
        case 'min': result = Math.min(...values); break;
        default: result = values.reduce((a, b) => a + b, 0);
      }
      return { [groupBy]: key, value: Math.round(result * 100) / 100 };
    });
  }

  const values = data.map(row => Number(row[field]) || 0);
  let result: number;

  switch (operation) {
    case 'sum':
      result = values.reduce((a, b) => a + b, 0);
      break;
    case 'avg':
      result = values.reduce((a, b) => a + b, 0) / values.length;
      break;
    case 'count':
      result = values.length;
      break;
    case 'max':
      result = Math.max(...values);
      break;
    case 'min':
      result = Math.min(...values);
      break;
    default:
      result = values.reduce((a, b) => a + b, 0);
  }

  return [{ value: Math.round(result * 100) / 100 }];
}

function formatAnswer(question: string, result: Record<string, unknown>[], field: string, operation: string): string {
  const value = result[0]?.value;
  
  if (result.length > 1) {
    return `Here are the ${operation} of ${field} by ${Object.keys(result[0])[0]}: ` + 
      result.map(r => `${r[Object.keys(r)[0]]}: ${r.value}`).join(', ');
  }
  
  return `The ${operation} of ${field} is ${value}`;
}

function generateMockSQL(operation: string, field: string, groupBy: string | null): string {
  if (groupBy) {
    return `SELECT ${groupBy}, ${operation}(${field}) as value FROM data GROUP BY ${groupBy}`;
  }
  return `SELECT ${operation}(${field}) as value FROM data`;
}

export function validateNLQRequest(request: NLQRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.question || request.question.trim().length === 0) {
    errors.push('Question is required');
  }

  if (request.question && request.question.length < 3) {
    errors.push('Question must be at least 3 characters');
  }

  if (request.data && !Array.isArray(request.data)) {
    errors.push('Data must be an array');
  }

  return { valid: errors.length === 0, errors };
}
