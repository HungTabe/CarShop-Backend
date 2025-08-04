import { NextRequest } from 'next/server'
import { requireAuth, AuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const GET = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    // Get cart item count
    const cartItemCount = await prisma.cartItem.count({
      where: { userId: user.id },
    })

    // Get total cart value
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
    })

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    return Response.json({
      success: true,
      data: {
        cartItemCount,
        totalAmount,
        hasItems: cartItemCount > 0,
      },
    })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}) 