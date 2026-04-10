import { describe, it, expect } from 'vitest';
import {
  generateDashboardWithAI,
  validateAIRequest,
  estimateAICost,
} from '@/lib/ai-dashboard';

describe('AI Dashboard Generation', () => {
  describe('generateDashboardWithAI', () => {
    it('should generate rule-based dashboard without API key', async () => {
      const request = {
        goal: 'analytics',
        data: [
          { month: 'Jan', sales: 100, profit: 20 },
          { month: 'Feb', sales: 150, profit: 30 },
        ],
      };
      const result = await generateDashboardWithAI(request);
      
      expect(result.dashboard.name).toBe('analytics Dashboard');
      expect(result.charts.length).toBeGreaterThan(0);
      expect(result.insights.length).toBeGreaterThan(0);
      expect(result.confidence).toBe(0.75);
    });

    it('should include bar chart for analytics goal', async () => {
      const request = { goal: 'analytics' };
      const result = await generateDashboardWithAI(request);
      expect(result.charts.some(c => c.type === 'bar')).toBe(true);
    });

    it('should include table for reporting goal', async () => {
      const request = { goal: 'reporting' };
      const result = await generateDashboardWithAI(request);
      expect(result.charts.some(c => c.type === 'table')).toBe(true);
    });

    it('should include line chart for monitoring goal', async () => {
      const request = { goal: 'monitoring' };
      const result = await generateDashboardWithAI(request);
      expect(result.charts.some(c => c.type === 'line')).toBe(true);
    });

    it('should include area chart for forecasting goal', async () => {
      const request = { goal: 'forecasting' };
      const result = await generateDashboardWithAI(request);
      expect(result.charts.some(c => c.type === 'area')).toBe(true);
    });

    it('should use custom chart types from preferences', async () => {
      const request = {
        goal: 'analytics',
        preferences: { chartTypes: ['pie', 'kpi'] },
      };
      const result = await generateDashboardWithAI(request);
      expect(result.charts.length).toBe(2);
    });
  });

  describe('validateAIRequest', () => {
    it('should validate valid request', () => {
      const request = { goal: 'analytics' };
      const result = validateAIRequest(request);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject request without goal', () => {
      const request = { goal: '' };
      const result = validateAIRequest(request);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Goal is required');
    });

    it('should reject invalid data type', () => {
      const request = { goal: 'analytics', data: 'not an array' };
      const result = validateAIRequest(request);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Data must be an array');
    });

    it('should reject invalid style preference', () => {
      const request = { goal: 'analytics', preferences: { style: 'invalid' } };
      const result = validateAIRequest(request);
      expect(result.valid).toBe(false);
    });
  });

  describe('estimateAICost', () => {
    it('should estimate cost for request', () => {
      const request = { goal: 'analytics' };
      const result = estimateAICost(request);
      expect(result.tokens).toBeGreaterThan(0);
      expect(result.estimatedCost).toBeGreaterThan(0);
    });

    it('should include data in token estimate', () => {
      const request = {
        goal: 'analytics',
        data: [{ a: 1 }, { a: 2 }, { a: 3 }],
      };
      const result = estimateAICost(request);
      expect(result.tokens).toBeGreaterThan(100);
    });
  });
});
