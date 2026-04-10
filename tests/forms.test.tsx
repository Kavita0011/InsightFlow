import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingForm } from '../src/components/forms/OnboardingForm';

vi.mock('../src/lib/schemas', async () => {
  const actual = await vi.importActual('../src/lib/schemas');
  return {
    ...actual,
    onboardingSchema: actual.onboardingSchema,
  };
});

describe('OnboardingForm', () => {
  const mockSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders organization form fields', () => {
    render(<OnboardingForm onSubmit={mockSubmit} />);
    
    expect(screen.getByLabelText(/Organization Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL Slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Plan/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<OnboardingForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /Create/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  it('generates slug from org name', async () => {
    render(<OnboardingForm onSubmit={mockSubmit} />);
    
    const orgNameInput = screen.getByLabelText(/Organization Name/i);
    await userEvent.type(orgNameInput, 'Test Company');
    
    const slugInput = screen.getByLabelText(/URL Slug/i);
    expect(slugInput).toHaveValue('test-company');
  });

  it('submits form with valid data', async () => {
    render(<OnboardingForm onSubmit={mockSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/Organization Name/i), 'Acme Corp');
    await userEvent.selectOptions(screen.getByLabelText(/Plan/i), 'starter');
    
    await userEvent.click(screen.getByRole('button', { name: /Create/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
