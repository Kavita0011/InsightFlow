import { describe, it, expect } from 'vitest';
import {
  plans,
  createPaymentIntent,
  createInvoice,
  calculateProratedAmount,
  formatCurrency,
} from '@/lib/payments';

describe('Payments', () => {
  describe('plans', () => {
    it('should have all required plans', () => {
      expect(plans).toHaveLength(4);
      expect(plans.map((p) => p.id)).toContain('free');
      expect(plans.map((p) => p.id)).toContain('starter');
      expect(plans.map((p) => p.id)).toContain('pro');
      expect(plans.map((p) => p.id)).toContain('enterprise');
    });

    it('should have correct prices', () => {
      expect(plans.find((p) => p.id === 'free')?.price).toBe(0);
      expect(plans.find((p) => p.id === 'starter')?.price).toBe(29);
      expect(plans.find((p) => p.id === 'pro')?.price).toBe(99);
      expect(plans.find((p) => p.id === 'enterprise')?.price).toBe(299);
    });
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      const result = await createPaymentIntent('org-123', 99, 'USD', 'razorpay');
      expect(result.clientSecret).toContain('pi_');
      expect(result.paymentId).toContain('pay_');
    });
  });

  describe('createInvoice', () => {
    it('should create invoice', async () => {
      const dueDate = new Date('2024-12-31');
      const invoice = await createInvoice('org-123', 99, dueDate);
      expect(invoice.org_id).toBe('org-123');
      expect(invoice.amount).toBe(99);
      expect(invoice.status).toBe('pending');
    });
  });

  describe('calculateProratedAmount', () => {
    it('should calculate prorated amount', () => {
      const amount = calculateProratedAmount('free', 'pro', 15);
      expect(amount).toBe(99 - (0 / 30) * 15);
    });

    it('should return 0 for invalid plans', () => {
      const amount = calculateProratedAmount('invalid', 'pro', 15);
      expect(amount).toBe(0);
    });

    it('should return 0 for downgrade or invalid', () => {
      const amount = calculateProratedAmount('pro', 'starter', 15);
      expect(amount).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD', () => {
      expect(formatCurrency(99, 'USD')).toBe('$99.00');
    });

    it('should format INR', () => {
      expect(formatCurrency(1000, 'INR')).toBe('₹1000.00');
    });

    it('should format EUR', () => {
      expect(formatCurrency(50, 'EUR')).toBe('€50.00');
    });

    it('should format GBP', () => {
      expect(formatCurrency(75, 'GBP')).toBe('£75.00');
    });
  });
});
