import { describe, it, expect } from 'vitest';
import { onboardingSchema, dashboardGoalsSchema, generateSlug } from '@/lib/schemas';

describe('Forms Validation', () => {
  describe('onboardingSchema', () => {
    it('should validate valid onboarding data', () => {
      const data = {
        orgName: 'Test Company',
        slug: 'test-company',
        plan: 'pro',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).not.toThrow();
    });

    it('should fail with empty org name', () => {
      const data = {
        orgName: '',
        slug: 'test',
        plan: 'free',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });

    it('should fail with invalid slug characters', () => {
      const data = {
        orgName: 'Test',
        slug: 'Test Org',
        plan: 'free',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });

    it('should fail with invalid color format', () => {
      const data = {
        orgName: 'Test',
        slug: 'test',
        plan: 'free',
        primaryColor: 'invalid',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });
  });

  describe('dashboardGoalsSchema', () => {
    it('should validate valid dashboard goals', () => {
      const data = {
        dashboardName: 'Sales Dashboard',
        chartTypes: ['bar', 'line'],
        dataSourceName: 'Sales Data',
        primaryGoal: 'analytics',
      };
      expect(() => dashboardGoalsSchema.parse(data)).not.toThrow();
    });

    it('should fail with empty chart types', () => {
      const data = {
        dashboardName: 'Test',
        chartTypes: [],
        dataSourceName: 'Data',
        primaryGoal: 'analytics',
      };
      expect(() => dashboardGoalsSchema.parse(data)).toThrow();
    });

    it('should fail with invalid chart type', () => {
      const data = {
        dashboardName: 'Test',
        chartTypes: ['invalid'],
        dataSourceName: 'Data',
        primaryGoal: 'analytics',
      };
      expect(() => dashboardGoalsSchema.parse(data)).toThrow();
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slug from name', () => {
      expect(generateSlug('My Company')).toBe('my-company');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Test@Company!')).toBe('test-company');
    });
  });
});
