import { describe, it, expect } from 'vitest';
import { processNaturalLanguageQuery, validateNLQRequest } from '@/lib/nlq';

describe('Natural Language Query', () => {
  const sampleData = [
    { month: 'Jan', sales: 100, profit: 20, region: 'North' },
    { month: 'Feb', sales: 150, profit: 30, region: 'South' },
    { month: 'Mar', sales: 120, profit: 25, region: 'North' },
  ];

  describe('processNaturalLanguageQuery', () => {
    it('should calculate sum', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'What is the total sales?',
        data: sampleData,
      });
      expect(result.answer).toContain('370');
      expect(result.visualization?.type).toBe('kpi');
    });

    it('should calculate average', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'What is the average profit?',
        data: sampleData,
      });
      expect(result.answer).toContain('25');
    });

    it('should handle group by', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'Sum of sales by region',
        data: sampleData,
      });
      expect(result.visualization?.type).toBe('bar');
      expect(result.visualization?.data.length).toBeGreaterThan(0);
    });

    it('should handle count', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'How many records?',
        data: sampleData,
      });
      expect(result.answer).toContain('3');
    });

    it('should handle max', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'Maximum sales',
        data: sampleData,
      });
      expect(result.answer).toContain('150');
    });

    it('should handle min', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'Minimum profit',
        data: sampleData,
      });
      expect(result.answer).toContain('20');
    });

    it('should return table for list questions', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'List all data',
        data: sampleData,
      });
      expect(result.visualization?.type).toBe('table');
    });

    it('should handle what/list questions', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'List all data',
        data: sampleData,
      });
      expect(result.visualization?.type).toBe('table');
    });

    it('should handle empty data', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'What is the total?',
        data: [],
      });
      expect(result.confidence).toBe(0);
    });

    it('should generate mock SQL', async () => {
      const result = await processNaturalLanguageQuery({
        question: 'Total sales by month',
        data: sampleData,
      });
      expect(result.sql).toContain('SELECT');
    });
  });

  describe('validateNLQRequest', () => {
    it('should validate valid request', () => {
      const result = validateNLQRequest({ question: 'What is total?' });
      expect(result.valid).toBe(true);
    });

    it('should reject empty question', () => {
      const result = validateNLQRequest({ question: '' });
      expect(result.valid).toBe(false);
    });

    it('should reject short question', () => {
      const result = validateNLQRequest({ question: 'ab' });
      expect(result.valid).toBe(false);
    });

    it('should reject invalid data type', () => {
      const result = validateNLQRequest({ question: 'test', data: 'invalid' });
      expect(result.valid).toBe(false);
    });
  });
});
