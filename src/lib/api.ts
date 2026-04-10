import { supabase } from './supabase';
import type { Dashboard, Chart, DataSource } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function getDashboards(orgId: string): Promise<Dashboard[]> {
  const { data, error } = await supabase
    .from('dashboards')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getDashboard(id: string, orgId: string): Promise<Dashboard | null> {
  const { data, error } = await supabase
    .from('dashboards')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (error) throw error;
  return data;
}

export async function createDashboard(
  orgId: string,
  dashboard: Partial<Dashboard>
): Promise<Dashboard> {
  const { data, error } = await supabase
    .from('dashboards')
    .insert({
      id: uuidv4(),
      org_id: orgId,
      name: dashboard.name,
      description: dashboard.description,
      layout: dashboard.layout || {},
      is_public: dashboard.is_public || false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDashboard(
  id: string,
  orgId: string,
  updates: Partial<Dashboard>
): Promise<Dashboard> {
  const { data, error } = await supabase
    .from('dashboards')
    .update({
      name: updates.name,
      description: updates.description,
      layout: updates.layout,
      is_public: updates.is_public,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDashboard(id: string, orgId: string): Promise<void> {
  const { error } = await supabase
    .from('dashboards')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) throw error;
}

export async function getCharts(dashboardId: string): Promise<Chart[]> {
  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('dashboard_id', dashboardId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createChart(
  dashboardId: string,
  chart: Partial<Chart>
): Promise<Chart> {
  const { data, error } = await supabase
    .from('charts')
    .insert({
      id: uuidv4(),
      dashboard_id: dashboardId,
      type: chart.type,
      title: chart.title,
      data_config: chart.data_config || {},
      position: chart.position || { x: 0, y: 0, w: 4, h: 3 },
      style: chart.style || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChart(
  id: string,
  updates: Partial<Chart>
): Promise<Chart> {
  const { data, error } = await supabase
    .from('charts')
    .update({
      type: updates.type,
      title: updates.title,
      data_config: updates.data_config,
      position: updates.position,
      style: updates.style,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteChart(id: string): Promise<void> {
  const { error } = await supabase
    .from('charts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getDataSources(orgId: string): Promise<DataSource[]> {
  const { data, error } = await supabase
    .from('data_sources')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createDataSource(
  orgId: string,
  dataSource: Partial<DataSource>
): Promise<DataSource> {
  const { data, error } = await supabase
    .from('data_sources')
    .insert({
      id: uuidv4(),
      org_id: orgId,
      name: dataSource.name,
      type: dataSource.type || 'manual',
      config: dataSource.config || {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function generateEmbedCode(dashboardId: string): Promise<string> {
  return `https://insightflow.app/embed/${dashboardId}`;
}
