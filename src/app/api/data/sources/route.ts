import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: dataSources, error } = await supabase
      .from('data_sources')
      .select('*')
      .eq('org_id', userData.org_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dataSources });
  } catch (error) {
    console.error('Error fetching data sources:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type = 'manual', fields = [] } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Data source name required' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: dataSource, error } = await supabase
      .from('data_sources')
      .insert({
        org_id: userData.org_id,
        name,
        type,
        config: { fields },
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ dataSource });
  } catch (error) {
    console.error('Error creating data source:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
