export type Role = 'admin' | 'editor' | 'viewer';

export interface Org {
  id: string;
  name: string;
  slug: string;
  plan: string;
  domain?: string;
  primary_color: string;
  logo_url?: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name?: string;
  org_id: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Dashboard {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  layout: Record<string, unknown>;
  is_public: boolean;
  embed_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Chart {
  id: string;
  dashboard_id: string;
  type: ChartType;
  title?: string;
  data_config: Record<string, unknown>;
  position: ChartPosition;
  style: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'table' | 'kpi';

export interface ChartPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DataSource {
  id: string;
  org_id: string;
  name: string;
  type: 'manual' | 'csv' | 'excel' | 'google_sheets';
  config: Record<string, unknown>;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface DataUpload {
  id: string;
  org_id: string;
  data_source_id?: string;
  file_name?: string;
  row_count: number;
  column_count: number;
  columns: string[];
  parsed_data: Record<string, unknown>[];
  created_at: string;
}

export interface Payment {
  id: string;
  org_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gateway: 'razorpay' | 'stripe';
  payment_id?: string;
  paid_at?: string;
  method?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  org_id: string;
  amount: number;
  due_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  layout: Record<string, unknown>;
  charts: Chart[];
  data_sources: DataSource[];
  created_at: string;
  updated_at: string;
}
