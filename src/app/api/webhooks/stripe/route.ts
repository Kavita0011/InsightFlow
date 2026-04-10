import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.payment_status === 'paid') {
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              paid_at: new Date().toISOString(),
              method: 'card',
            })
            .eq('payment_id', session.id);

          if (session.metadata?.orgId && session.metadata?.plan) {
            await supabase
              .from('orgs')
              .update({ plan: session.metadata.plan })
              .eq('id', session.metadata.orgId);
          }
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        if (subscription.status === 'active') {
          const { data: org } = await supabase
            .from('orgs')
            .select('id')
            .eq('stripe_customer_id', subscription.customer)
            .single();

          if (org) {
            await supabase
              .from('orgs')
              .update({ 
                plan: subscription.items.data[0]?.price?.product?.toString() || 'pro',
                stripe_subscription_id: subscription.id,
              })
              .eq('id', org.id);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { data: org } = await supabase
          .from('orgs')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (org) {
          await supabase
            .from('orgs')
            .update({ plan: 'free' })
            .eq('id', org.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
