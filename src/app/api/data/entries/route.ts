import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dataSourceId = searchParams.get('dataSourceId');

    if (!dataSourceId) {
      return NextResponse.json({ error: 'Data source ID required' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: dataSource } = await supabase
      .from('data_sources')
      .select('config')
      .eq('id', dataSourceId)
      .eq('org_id', userData.org_id)
      .single();

    if (!dataSource) {
      return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      fields: dataSource.config?.fields || [],
    });
  } catch (error) {
    console.error('Error fetching data entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dataSourceId, rows } = await request.json();

    if (!dataSourceId || !rows || rows.length === 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const rowCount = rows.length;
    const columnCount = columns.length;

    const { data: dataUpload, error } = await supabase
      .from('data_uploads')
      .insert({
        org_id: userData.org_id,
        data_source_id: dataSourceId,
        row_count: rowCount,
        column_count: columnCount,
        columns,
        parsed_data: rows,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from('data_sources')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', dataSourceId);

    return NextResponse.json({ dataUpload });
  } catch (error) {
    console.error('Error saving data entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
