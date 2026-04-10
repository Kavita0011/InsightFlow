import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BillingPage from '../src/app/billing/page';

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders billing page with current plan', () => {
    render(<BillingPage />);
    
    expect(screen.getByText(/Billing & Subscription/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Enterprise/i)).toBeInTheDocument();
  });

  it('renders payment methods section', () => {
    render(<BillingPage />);
    
    expect(screen.getByText(/Payment Methods/i)).toBeInTheDocument();
    expect(screen.getByText(/Razorpay/i)).toBeInTheDocument();
    expect(screen.getByText(/Stripe/i)).toBeInTheDocument();
  });

  it('renders billing history', () => {
    render(<BillingPage />);
    
    expect(screen.getByText(/Billing History/i)).toBeInTheDocument();
  });

  it('renders admin account info', () => {
    render(<BillingPage />);
    
    expect(screen.getByText(/Admin Account/i)).toBeInTheDocument();
  });

  it('renders payment details', () => {
    render(<BillingPage />);
    
    expect(screen.getByText(/Payment Details/i)).toBeInTheDocument();
    expect(screen.getByText(/UPI ID/i)).toBeInTheDocument();
  });
});
