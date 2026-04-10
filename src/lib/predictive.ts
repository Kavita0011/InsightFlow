import type { DataSource } from '@/types';

export interface PredictionRequest {
  data: Record<string, unknown>[];
  targetField: string;
  periods: number;
  method?: 'linear' | 'moving_average' | 'exponential_smoothing';
}

export interface PredictionResponse {
  predictions: { date?: string; value: number; lower?: number; upper?: number }[];
  model: string;
  accuracy: number;
  trend: 'up' | 'down' | 'stable';
  seasonality?: { pattern: string; strength: number };
}

export interface AnomalyDetectionRequest {
  data: Record<string, unknown>[];
  field: string;
  sensitivity: number;
}

export interface AnomalyResponse {
  anomalies: { index: number; value: number; expected: number; deviation: number }[];
  threshold: number;
  normalRange: { min: number; max: number };
}

export async function generatePredictions(request: PredictionRequest): Promise<PredictionResponse> {
  const values = request.data.map(row => Number(row[request.targetField]) || 0);
  const method = request.method || 'linear';

  let predictions: { value: number; lower?: number; upper?: number }[];

  switch (method) {
    case 'moving_average':
      predictions = generateMovingAverage(values, request.periods);
      break;
    case 'exponential_smoothing':
      predictions = generateExponentialSmoothing(values, request.periods);
      break;
    case 'linear':
    default:
      predictions = generateLinearTrend(values, request.periods);
      break;
  }

  const trend = calculateTrend(predictions.map(p => p.value));
  const accuracy = calculateAccuracy(predictions, values);

  return {
    predictions,
    model: method,
    accuracy,
    trend,
  };
}

function generateLinearTrend(values: number[], periods: number): { value: number; lower?: number; upper?: number }[] {
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predictions: { value: number; lower?: number; upper?: number }[] = [];
  const stdError = calculateStdError(values, slope, intercept);

  for (let i = 0; i < periods; i++) {
    const x = n + i;
    const value = slope * x + intercept;
    const margin = stdError * 1.96;
    predictions.push({
      value: Math.round(value * 100) / 100,
      lower: Math.round((value - margin) * 100) / 100,
      upper: Math.round((value + margin) * 100) / 100,
    });
  }

  return predictions;
}

function generateMovingAverage(values: number[], periods: number): { value: number; lower?: number; upper?: number }[] {
  const windowSize = Math.min(3, values.length);
  const lastValues = values.slice(-windowSize);
  const avg = lastValues.reduce((a, b) => a + b, 0) / lastValues.length;
  const std = Math.sqrt(lastValues.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / lastValues.length);

  return Array(periods).fill(null).map(() => ({
    value: Math.round(avg * 100) / 100,
    lower: Math.round((avg - 1.96 * std) * 100) / 100,
    upper: Math.round((avg + 1.96 * std) * 100) / 100,
  }));
}

function generateExponentialSmoothing(values: number[], periods: number): { value: number; lower?: number; upper?: number }[] {
  const alpha = 0.3;
  let smoothed = values[0];

  for (const value of values.slice(1)) {
    smoothed = alpha * value + (1 - alpha) * smoothed;
  }

  const std = Math.sqrt(values.reduce((sq, v) => sq + Math.pow(v - smoothed, 2), 0) / values.length);

  return Array(periods).fill(null).map(() => ({
    value: Math.round(smoothed * 100) / 100,
    lower: Math.round((smoothed - 1.96 * std) * 100) / 100,
    upper: Math.round((smoothed + 1.96 * std) * 100) / 100,
  }));
}

function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const first = values[0];
  const last = values[values.length - 1];
  const percentChange = ((last - first) / first) * 100;

  if (percentChange > 5) return 'up';
  if (percentChange < -5) return 'down';
  return 'stable';
}

function calculateStdError(values: number[], slope: number, intercept: number): number {
  const predictions = values.map((_, x) => slope * x + intercept);
  const sse = values.reduce((sum, y, i) => sum + Math.pow(y - predictions[i], 2), 0);
  return Math.sqrt(sse / (values.length - 2));
}

function calculateAccuracy(predictions: { value: number }[], actual: number[]): number {
  if (actual.length === 0) return 0;
  
  const errors = actual.slice(-predictions.length).map((actual, i) => 
    Math.abs(actual - predictions[i]?.value || 0)
  );
  const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
  const avgActual = actual.reduce((a, b) => a + b, 0) / actual.length;
  
  return Math.max(0, Math.round((1 - avgError / avgActual) * 100));
}

export async function detectAnomalies(request: AnomalyDetectionRequest): Promise<AnomalyResponse> {
  const values = request.data.map(row => Number(row[request.field]) || 0);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.reduce((sq, v) => sq + Math.pow(v - mean, 2), 0) / values.length);
  
  const threshold = request.sensitivity * std;
  const anomalies: AnomalyResponse['anomalies'] = [];

  values.forEach((value, index) => {
    const deviation = Math.abs(value - mean);
    if (deviation > threshold) {
      anomalies.push({
        index,
        value,
        expected: mean,
        deviation: Math.round(deviation * 100) / 100,
      });
    }
  });

  return {
    anomalies,
    threshold: Math.round(threshold * 100) / 100,
    normalRange: {
      min: Math.round((mean - threshold) * 100) / 100,
      max: Math.round((mean + threshold) * 100) / 100,
    },
  };
}

export function validatePredictionRequest(request: PredictionRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.data || request.data.length < 2) {
    errors.push('At least 2 data points required');
  }

  if (!request.targetField) {
    errors.push('Target field is required');
  }

  if (!request.data?.[0]?.[request.targetField]) {
    errors.push('Target field not found in data');
  }

  if (request.periods < 1 || request.periods > 365) {
    errors.push('Periods must be between 1 and 365');
  }

  return { valid: errors.length === 0, errors };
}

export function validateAnomalyRequest(request: AnomalyDetectionRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.data || request.data.length < 3) {
    errors.push('At least 3 data points required');
  }

  if (!request.field) {
    errors.push('Field is required');
  }

  if (request.sensitivity < 0.5 || request.sensitivity > 3) {
    errors.push('Sensitivity must be between 0.5 and 3');
  }

  return { valid: errors.length === 0, errors };
}
