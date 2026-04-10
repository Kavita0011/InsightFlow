import { z } from 'zod';

export const onboardingSchema = z.object({
  orgName: z.string().min(1, 'Organization name is required').max(255),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  domain: z.string().url('Invalid URL').optional().or(z.literal('')),
  plan: z.enum(['free', 'starter', 'pro', 'enterprise']),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP']),
});

export const dashboardGoalsSchema = z.object({
  dashboardName: z.string().min(1, 'Dashboard name is required').max(255),
  description: z.string().max(1000).optional(),
  chartTypes: z.array(z.enum(['bar', 'line', 'pie', 'area', 'table', 'kpi'])).min(1),
  dataSourceName: z.string().min(1, 'Data source name is required'),
  primaryGoal: z.enum(['analytics', 'reporting', 'monitoring', 'forecasting']),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
export type DashboardGoalsFormData = z.infer<typeof dashboardGoalsSchema>;

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
