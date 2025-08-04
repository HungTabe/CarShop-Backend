import { NextRequest } from 'next/server'
import { billingSchema } from '@/types'
import { requireAuth, AuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export const POST = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const body = await request.json()
    const validatedData = billingSchema.parse(body)

    const { cartItemIds, billingAddress, shippingAddress } = validatedData

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId: user.id,
      },
      include: {
        product: true,
      },
    })

    if (cartItems.length === 0) {
      return Response.json(
        { success: false, error: 'No valid cart items found' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        billingAddress,
        shippingAddress,
      },
    })

    // Create order items
    const orderItems = await Promise.all(
      cartItems.map((cartItem) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: Number(cartItem.product.price),
          },
        })
      )
    )

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: user.id,
      },
    })

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripePaymentId: paymentIntent.id,
        amount: totalAmount,
        status: 'PENDING',
      },
    })

    // Remove cart items after successful order creation
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        userId: user.id,
      },
    })

    return Response.json({
      success: true,
      data: {
        orderId: order.id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalAmount,
      },
      message: 'Order created successfully',
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Billing error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}) 