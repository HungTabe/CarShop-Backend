import { NextRequest } from 'next/server'
import { signupSchema } from '@/types'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return Response.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        authId: `local_${Date.now()}`, // Generate local auth ID
        email: validatedData.email,
        password: hashedPassword,
        username: validatedData.username,
        phone: validatedData.phone,
        address: validatedData.address,
      },
    })

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      authId: user.authId,
      email: user.email,
      username: user.username || undefined,
      phone: user.phone || undefined,
      address: user.address || undefined,
    })

    return Response.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
        accessToken: token,
      },
      message: 'User registered successfully',
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 