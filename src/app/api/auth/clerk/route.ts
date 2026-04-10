import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUserId = user.id;
    const email = user.emailAddresses[0]?.emailAddress;
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    const { data: orgs } = await supabase
      .from('orgs')
      .select('id')
      .limit(1)
      .single();

    const orgId = orgs?.id;

    if (!orgId) {
      return NextResponse.json({ 
        error: 'No organization found. Please contact admin.' 
      }, { status: 404 });
    }

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUserId,
        email,
        full_name: fullName,
        org_id: orgId,
        role: 'viewer',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
