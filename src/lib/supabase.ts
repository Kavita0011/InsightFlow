import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function createServerClient() {
  return supabase;
}

export const TABLES = {
  ORGS: 'orgs',
  USERS: 'users',
  DASHBOARDS: 'dashboards',
  CHARTS: 'charts',
  DATA_SOURCES: 'data_sources',
  DATA_UPLOADS: 'data_uploads',
  PAYMENTS: 'payments',
  INVOICES: 'invoices',
  TEMPLATES: 'templates',
} as const;
