import { NextRequest } from 'next/server'
import { signupSchema } from '@/types'
import { createServerSupabaseClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    const supabase = createServerSupabaseClient()

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
    })

    if (authError) {
      return Response.json(
        { success: false, error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return Response.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        authId: authData.user.id,
        email: validatedData.email,
        username: validatedData.username,
        phone: validatedData.phone,
        address: validatedData.address,
      },
    })

    return Response.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        address: user.address,
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