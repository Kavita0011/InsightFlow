import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    if (RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    switch (eventType) {
      case 'payment.captured': {
        const paymentEntity = event.payload?.payment?.entity;
        if (paymentEntity) {
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              paid_at: new Date(paymentEntity.created_at * 1000).toISOString(),
              method: paymentEntity.method,
            })
            .eq('payment_id', paymentEntity.order_id);
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = event.payload?.payment?.entity;
        if (paymentEntity) {
          await supabase
            .from('payments')
            .update({
              status: 'failed',
            })
            .eq('payment_id', paymentEntity.order_id);
        }
        break;
      }

      case 'order.paid': {
        const orderEntity = event.payload?.order?.entity;
        if (orderEntity) {
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              paid_at: new Date(orderEntity.created_at * 1000).toISOString(),
            })
            .eq('payment_id', orderEntity.id);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
