import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orgName, slug, domain, plan, primaryColor, currency } = await request.json();

    if (!orgName || !slug) {
      return NextResponse.json({ error: 'Organization name and slug are required' }, { status: 400 });
    }

    const { data: existingOrg } = await supabase
      .from('orgs')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingOrg) {
      return NextResponse.json({ error: 'This slug is already taken' }, { status: 400 });
    }

    const { data: org, error } = await supabase
      .from('orgs')
      .insert({
        id: uuidv4(),
        name: orgName,
        slug,
        domain: domain || null,
        plan: plan || 'free',
        primary_color: primaryColor || '#3B82F6',
        currency: currency || 'USD',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        clerk_user_id: user.id,
        email,
        full_name: fullName,
        org_id: org.id,
        role: 'admin',
      })
      .select()
      .single();

    if (userError) {
      await supabase.from('orgs').delete().eq('id', org.id);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, org, user: userData });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
