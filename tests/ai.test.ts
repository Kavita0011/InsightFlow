import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isAIEnabled,
  hasOpenAIKey,
  generateRuleBasedInsight,
  getAIInsights,
  selectChartType,
} from '@/lib/ai';

describe('AI Playground', () => {
  describe('isAIEnabled', () => {
    it('should return false when AI is not enabled', () => {
      expect(isAIEnabled()).toBe(false);
    });
  });

  describe('hasOpenAIKey', () => {
    it('should return false when no key is set', () => {
      expect(hasOpenAIKey()).toBe(false);
    });
  });

  describe('generateRuleBasedInsight', () => {
    it('should return empty array for empty data', () => {
      const insights = generateRuleBasedInsight([]);
      expect(insights).toEqual([]);
    });

    it('should suggest chart for multiple columns', () => {
      const data = [{ col1: 'a', col2: 'b' }];
      const insights = generateRuleBasedInsight(data);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0].type).toBe('chart_suggestion');
    });

    it('should detect numeric columns for trends', () => {
      const data = [
        { sales: 100, profit: 50 },
        { sales: 200, profit: 75 },
      ];
      const insights = generateRuleBasedInsight(data);
      const trendInsight = insights.find((i) => i.type === 'trend');
      expect(trendInsight).toBeDefined();
    });
  });

  describe('getAIInsights', () => {
    it('should return rule-based insights when AI disabled', async () => {
      const request = { context: 'dashboard', data: [{ col1: 'a', col2: 'b' }] };
      const insights = await getAIInsights(request);
      expect(insights.length).toBeGreaterThan(0);
    });
  });

  describe('selectChartType', () => {
    it('should select bar chart for analytics', () => {
      expect(selectChartType('analytics', {})).toBe('bar');
    });

    it('should select table for reporting', () => {
      expect(selectChartType('reporting', {})).toBe('table');
    });

    it('should select line for monitoring', () => {
      expect(selectChartType('monitoring', {})).toBe('line');
    });

    it('should select area for forecasting', () => {
      expect(selectChartType('forecasting', {})).toBe('area');
    });

    it('should default to bar for unknown goal', () => {
      expect(selectChartType('unknown', {})).toBe('bar');
    });
  });
});
