import type { Payment, Invoice } from '@/types';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: ['1 Dashboard', '5 Charts', 'Manual Data Entry', 'Email Support'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    currency: 'USD',
    features: ['5 Dashboards', '25 Charts', 'CSV Import', 'Priority Support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 99,
    currency: 'USD',
    features: ['Unlimited Dashboards', 'Unlimited Charts', 'All Import Types', '24/7 Support'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'USD',
    features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Manager', 'SLA'],
  },
];

export async function createPaymentIntent(
  orgId: string,
  amount: number,
  currency: string,
  gateway: 'razorpay' | 'stripe'
): Promise<{ clientSecret: string; paymentId: string }> {
  return {
    clientSecret: `pi_${Date.now()}_secret`,
    paymentId: `pay_${Date.now()}`,
  };
}

export async function createInvoice(
  orgId: string,
  amount: number,
  dueDate: Date
): Promise<Invoice> {
  const invoice: Invoice = {
    id: `inv_${Date.now()}`,
    org_id: orgId,
    amount,
    due_date: dueDate.toISOString(),
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return invoice;
}

export async function getPayments(orgId: string): Promise<Payment[]> {
  return [];
}

export async function getInvoices(orgId: string): Promise<Invoice[]> {
  return [];
}

export function calculateProratedAmount(
  currentPlan: string,
  newPlan: string,
  daysRemaining: number
): number {
  const current = plans.find((p) => p.id === currentPlan);
  const next = plans.find((p) => p.id === newPlan);
  if (!current || !next) return 0;

  const dailyRate = current.price / 30;
  const credit = dailyRate * daysRemaining;
  const charge = next.price - credit;
  return Math.max(0, charge);
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    GBP: '£',
  };
  return `${symbols[currency] || currency}${amount.toFixed(2)}`;
}
