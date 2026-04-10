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
      .select('org_id, role')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { data: org, error } = await supabase
      .from('orgs')
      .select('*')
      .eq('id', userData.org_id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ org });
  } catch (error) {
    console.error('Error fetching org settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id, role')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      name,
      primary_color,
      logo_url,
      domain,
      currency,
    } = await request.json();

    const { data: org, error } = await supabase
      .from('orgs')
      .update({
        name: name,
        primary_color: primary_color,
        logo_url: logo_url,
        domain: domain,
        currency: currency,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userData.org_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ org });
  } catch (error) {
    console.error('Error updating org settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
