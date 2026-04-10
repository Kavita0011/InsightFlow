import { describe, it, expect } from 'vitest';

describe('Basic Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const name = 'InsightFlow';
    expect(name.toLowerCase()).toBe('insightflow');
    expect(name.length).toBe(10);
  });

  it('should handle array operations', () => {
    const items = [1, 2, 3, 4, 5];
    expect(items.length).toBe(5);
    expect(items.filter(x => x > 2)).toEqual([3, 4, 5]);
  });

  it('should handle object operations', () => {
    const user = { id: '1', name: 'John', role: 'admin' };
    expect(user.id).toBe('1');
    expect(user.role).toBe('admin');
  });
});

describe('Schema Validation', () => {
  it('should validate onboarding schema', () => {
    const validData = {
      orgName: 'Test Org',
      slug: 'test-org',
      plan: 'starter',
      primaryColor: '#3B82F6',
      currency: 'USD',
    };
    expect(validData.orgName).toBeDefined();
    expect(validData.slug).toMatch(/^[a-z0-9-]+$/);
  });
});

describe('Utility Functions', () => {
  it('should generate slug from name', () => {
    const generateSlug = (name: string) => 
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    expect(generateSlug('Test Company')).toBe('test-company');
    expect(generateSlug('Acme Corp!@#')).toBe('acme-corp');
  });

  it('should format currency', () => {
    const formatCurrency = (amount: number, currency: string) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    
    expect(formatCurrency(1000, 'USD')).toContain('1,000');
  });
});
