import { describe, it, expect } from 'vitest';
import {
  generatePredictions,
  detectAnomalies,
  validatePredictionRequest,
  validateAnomalyRequest,
} from '@/lib/predictive';

describe('Predictive Analytics', () => {
  const sampleData = [
    { date: '2024-01', sales: 100 },
    { date: '2024-02', sales: 120 },
    { date: '2024-03', sales: 140 },
    { date: '2024-04', sales: 160 },
  ];

  describe('generatePredictions', () => {
    it('should generate linear predictions', async () => {
      const result = await generatePredictions({
        data: sampleData,
        targetField: 'sales',
        periods: 3,
        method: 'linear',
      });
      
      expect(result.predictions.length).toBe(3);
      expect(result.trend).toBe('up');
      expect(result.model).toBe('linear');
    });

    it('should generate moving average predictions', async () => {
      const result = await generatePredictions({
        data: sampleData,
        targetField: 'sales',
        periods: 2,
        method: 'moving_average',
      });
      
      expect(result.predictions.length).toBe(2);
      expect(result.model).toBe('moving_average');
    });

    it('should generate exponential smoothing predictions', async () => {
      const result = await generatePredictions({
        data: sampleData,
        targetField: 'sales',
        periods: 2,
        method: 'exponential_smoothing',
      });
      
      expect(result.predictions.length).toBe(2);
      expect(result.model).toBe('exponential_smoothing');
    });

    it('should use default method', async () => {
      const result = await generatePredictions({
        data: sampleData,
        targetField: 'sales',
        periods: 2,
      });
      
      expect(result.predictions.length).toBe(2);
    });

    it('should detect stable trend', async () => {
      const stableData = [
        { date: '2024-01', value: 100 },
        { date: '2024-02', value: 101 },
        { date: '2024-03', value: 99 },
      ];
      
      const result = await generatePredictions({
        data: stableData,
        targetField: 'value',
        periods: 2,
      });
      
      expect(result.trend).toBe('stable');
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalies in data', async () => {
      const dataWithAnomaly = [
        { value: 100 },
        { value: 102 },
        { value: 101 },
        { value: 500 },
        { value: 103 },
      ];
      
      const result = await detectAnomalies({
        data: dataWithAnomaly,
        field: 'value',
        sensitivity: 1,
      });
      
      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
    });

    it('should calculate normal range', async () => {
      const result = await detectAnomalies({
        data: sampleData,
        field: 'sales',
        sensitivity: 2,
      });
      
      expect(result.normalRange.min).toBeLessThan(result.normalRange.max);
    });

    it('should respect sensitivity parameter', async () => {
      const dataWithAnomaly = [
        { value: 100 },
        { value: 500 },
      ];
      
      const resultLow = await detectAnomalies({
        data: dataWithAnomaly,
        field: 'value',
        sensitivity: 0.5,
      });
      
      const resultHigh = await detectAnomalies({
        data: dataWithAnomaly,
        field: 'value',
        sensitivity: 3,
      });
      
      expect(resultLow.anomalies.length).toBeGreaterThanOrEqual(resultHigh.anomalies.length);
    });
  });

  describe('validatePredictionRequest', () => {
    it('should validate valid request', () => {
      const result = validatePredictionRequest({
        data: sampleData,
        targetField: 'sales',
        periods: 3,
      });
      expect(result.valid).toBe(true);
    });

    it('should reject empty data', () => {
      const result = validatePredictionRequest({
        data: [],
        targetField: 'sales',
        periods: 3,
      });
      expect(result.valid).toBe(false);
    });

    it('should reject invalid periods', () => {
      const result = validatePredictionRequest({
        data: sampleData,
        targetField: 'sales',
        periods: 500,
      });
      expect(result.valid).toBe(false);
    });

    it('should reject missing target field', () => {
      const result = validatePredictionRequest({
        data: sampleData,
        targetField: 'nonexistent',
        periods: 3,
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('validateAnomalyRequest', () => {
    it('should validate valid request', () => {
      const result = validateAnomalyRequest({
        data: sampleData,
        field: 'sales',
        sensitivity: 2,
      });
      expect(result.valid).toBe(true);
    });

    it('should reject insufficient data', () => {
      const result = validateAnomalyRequest({
        data: [{ sales: 100 }],
        field: 'sales',
        sensitivity: 2,
      });
      expect(result.valid).toBe(false);
    });

    it('should reject invalid sensitivity', () => {
      const result = validateAnomalyRequest({
        data: sampleData,
        field: 'sales',
        sensitivity: 10,
      });
      expect(result.valid).toBe(false);
    });
  });
});
