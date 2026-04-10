import { describe, it, expect } from 'vitest';
import { onboardingSchema, dashboardGoalsSchema, generateSlug } from '@/lib/schemas';

describe('Schemas', () => {
  describe('onboardingSchema', () => {
    it('should validate valid onboarding data', () => {
      const data = {
        orgName: 'Test Org',
        slug: 'test-org',
        domain: 'https://testorg.com',
        plan: 'pro',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(onboardingSchema.parse(data)).toEqual(data);
    });

    it('should reject empty org name', () => {
      const data = {
        orgName: '',
        slug: 'test-org',
        plan: 'free',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });

    it('should reject invalid slug', () => {
      const data = {
        orgName: 'Test Org',
        slug: 'Test Org',
        plan: 'free',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });

    it('should reject invalid color format', () => {
      const data = {
        orgName: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        primaryColor: 'blue',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });

    it('should reject invalid plan', () => {
      const data = {
        orgName: 'Test Org',
        slug: 'test-org',
        plan: 'invalid',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(() => onboardingSchema.parse(data)).toThrow();
    });

    it('should accept optional domain', () => {
      const data = {
        orgName: 'Test Org',
        slug: 'test-org',
        plan: 'free',
        primaryColor: '#3B82F6',
        currency: 'USD',
      };
      expect(onboardingSchema.parse(data)).toBeDefined();
    });
  });

  describe('dashboardGoalsSchema', () => {
    it('should validate valid dashboard goals', () => {
      const data = {
        dashboardName: 'Sales Dashboard',
        description: 'Sales analytics',
        chartTypes: ['bar', 'line'],
        dataSourceName: 'Sales Data',
        primaryGoal: 'analytics',
      };
      expect(dashboardGoalsSchema.parse(data)).toEqual(data);
    });

    it('should reject empty dashboard name', () => {
      const data = {
        dashboardName: '',
        chartTypes: ['bar'],
        dataSourceName: 'Sales Data',
        primaryGoal: 'analytics',
      };
      expect(() => dashboardGoalsSchema.parse(data)).toThrow();
    });

    it('should reject empty chart types', () => {
      const data = {
        dashboardName: 'Sales Dashboard',
        chartTypes: [],
        dataSourceName: 'Sales Data',
        primaryGoal: 'analytics',
      };
      expect(() => dashboardGoalsSchema.parse(data)).toThrow();
    });

    it('should reject invalid chart type', () => {
      const data = {
        dashboardName: 'Sales Dashboard',
        chartTypes: ['invalid'],
        dataSourceName: 'Sales Data',
        primaryGoal: 'analytics',
      };
      expect(() => dashboardGoalsSchema.parse(data)).toThrow();
    });

    it('should reject invalid primary goal', () => {
      const data = {
        dashboardName: 'Sales Dashboard',
        chartTypes: ['bar'],
        dataSourceName: 'Sales Data',
        primaryGoal: 'invalid',
      };
      expect(() => dashboardGoalsSchema.parse(data)).toThrow();
    });
  });

  describe('generateSlug', () => {
    it('should convert name to lowercase slug', () => {
      expect(generateSlug('Test Org')).toBe('test-org');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('Test Organization')).toBe('test-organization');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Test @ Org!')).toBe('test-org');
    });

    it('should trim leading/trailing hyphens', () => {
      expect(generateSlug('  Test Org  ')).toBe('test-org');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });
  });
});
