import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
}

interface RazorpayPayment {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: number;
}

async function createRazorpayOrder(amount: number, currency: string = 'INR') {
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    }),
  });

  return response.json() as Promise<RazorpayOrder>;
}

async function getRazorpayPayment(paymentId: string) {
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`,
    },
  });

  return response.json() as Promise<RazorpayPayment>;
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency = 'INR', plan } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('org_id')
      .eq('clerk_user_id', user.id)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const order = await createRazorpayOrder(amount, currency);

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        org_id: userData.org_id,
        amount: amount * 100,
        currency,
        status: 'pending',
        gateway: 'razorpay',
        payment_id: order.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { paymentId, status } = await request.json();

    const payment = await getRazorpayPayment(paymentId);

    const { error } = await supabase
      .from('payments')
      .update({
        status: payment.status === 'captured' ? 'completed' : 'failed',
        paid_at: payment.status === 'captured' ? new Date(payment.created_at * 1000).toISOString() : null,
        method: payment.method,
      })
      .eq('payment_id', paymentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
