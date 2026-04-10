import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dashboardId: string }> }
) {
  try {
    const { dashboardId } = await params;

    const { data: dashboard, error: dashboardError } = await supabase
      .from('dashboards')
      .select('*, org:orgs(*)')
      .eq('id', dashboardId)
      .single();

    if (dashboardError || !dashboard) {
      return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
    }

    const isPublic = dashboard.is_public;
    
    if (!isPublic) {
      return NextResponse.json({ error: 'This dashboard is private' }, { status: 403 });
    }

    const { data: charts } = await supabase
      .from('charts')
      .select('*')
      .eq('dashboard_id', dashboardId)
      .order('created_at', { ascending: true });

    const widgets = (charts || []).map((chart: Record<string, unknown>) => ({
      id: chart.id,
      type: chart.type,
      title: chart.title,
      data: (chart.data_config as Record<string, unknown>)?.data || [],
    }));

    return NextResponse.json({
      dashboard: {
        id: dashboard.id,
        name: dashboard.name,
        layout: dashboard.layout,
        is_public: dashboard.is_public,
      },
      org: {
        id: dashboard.org?.id,
        name: dashboard.org?.name,
        primary_color: dashboard.org?.primary_color,
        logo_url: dashboard.org?.logo_url,
      },
      widgets,
    });
  } catch (error) {
    console.error('Embed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
