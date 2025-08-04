import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return Response.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET')
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return Response.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return Response.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return Response.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No orderId in payment intent metadata')
    return
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID' },
  })

  // Update payment status
  await prisma.payment.update({
    where: { orderId },
    data: { status: 'SUCCEEDED' },
  })

  console.log(`Order ${orderId} marked as paid`)
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId

  if (!orderId) {
    console.error('No orderId in payment intent metadata')
    return
  }

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  })

  // Update payment status
  await prisma.payment.update({
    where: { orderId },
    data: { status: 'FAILED' },
  })

  console.log(`Order ${orderId} payment failed`)
} 