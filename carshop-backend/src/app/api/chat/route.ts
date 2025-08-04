import { NextRequest } from 'next/server'
import { messageSchema } from '@/types'
import { requireAuth, AuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch chat messages
async function handleGet(request: NextRequest, user: AuthenticatedUser) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before')

    const where: any = { userId: user.id }

    if (before) {
      where.createdAt = { lt: new Date(before) }
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return Response.json({
      success: true,
      data: messages.reverse(), // Return in chronological order
    })
  } catch (error) {
    console.error('Chat messages fetch error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Send a message
async function handlePost(request: NextRequest, user: AuthenticatedUser) {
  try {
    const body = await request.json()
    const validatedData = messageSchema.parse(body)

    const message = await prisma.message.create({
      data: {
        userId: user.id,
        content: validatedData.content,
        isFromUser: true,
      },
    })

    return Response.json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Send message error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(handleGet)
export const POST = requireAuth(handlePost) 