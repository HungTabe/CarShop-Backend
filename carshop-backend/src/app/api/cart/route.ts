import { NextRequest } from 'next/server'
import { addToCartSchema, updateCartSchema } from '@/types'
import { requireAuth, AuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - View user's cart
async function handleGet(request: NextRequest, user: AuthenticatedUser) {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    return Response.json({
      success: true,
      data: {
        items: cartItems,
        totalAmount,
        itemCount: cartItems.length,
      },
    })
  } catch (error) {
    console.error('Cart fetch error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add item to cart
async function handlePost(request: NextRequest, user: AuthenticatedUser) {
  try {
    const body = await request.json()
    const validatedData = addToCartSchema.parse(body)

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    })

    if (!product) {
      return Response.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.inStock) {
      return Response.json(
        { success: false, error: 'Product is out of stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId,
        },
      },
    })

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + validatedData.quantity },
        include: { product: true },
      })

      return Response.json({
        success: true,
        data: updatedItem,
        message: 'Cart item updated successfully',
      })
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId: validatedData.productId,
          quantity: validatedData.quantity,
        },
        include: { product: true },
      })

      return Response.json({
        success: true,
        data: newItem,
        message: 'Item added to cart successfully',
      })
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Add to cart error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update cart item quantity
async function handlePut(request: NextRequest, user: AuthenticatedUser) {
  try {
    const body = await request.json()
    const validatedData = updateCartSchema.parse(body)

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: validatedData.productId,
        },
      },
    })

    if (!cartItem) {
      return Response.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (validatedData.quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      })

      return Response.json({
        success: true,
        message: 'Item removed from cart',
      })
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: validatedData.quantity },
        include: { product: true },
      })

      return Response.json({
        success: true,
        data: updatedItem,
        message: 'Cart item updated successfully',
      })
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update cart error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item or clear cart
async function handleDelete(request: NextRequest, user: AuthenticatedUser) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
      // Remove specific item
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      })

      if (!cartItem) {
        return Response.json(
          { success: false, error: 'Cart item not found' },
          { status: 404 }
        )
      }

      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      })

      return Response.json({
        success: true,
        message: 'Item removed from cart',
      })
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      })

      return Response.json({
        success: true,
        message: 'Cart cleared successfully',
      })
    }
  } catch (error) {
    console.error('Delete cart error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handleGet)
export const POST = requireAuth(handlePost)
export const PUT = requireAuth(handlePut)
export const DELETE = requireAuth(handleDelete) 