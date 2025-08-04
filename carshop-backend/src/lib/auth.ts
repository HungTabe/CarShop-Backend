import { NextRequest } from 'next/server'
import { createServerSupabaseClient } from './supabase'
import { prisma } from './prisma'

export interface AuthenticatedUser {
  id: string
  authId: string
  email: string
  username?: string
  phone?: string
  address?: string
}

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const supabase = createServerSupabaseClient()
    
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    // Get user from our database
    const dbUser = await prisma.user.findUnique({
      where: { authId: user.id }
    })

    if (!dbUser) {
      return null
    }

    return {
      id: dbUser.id,
      authId: dbUser.authId,
      email: dbUser.email,
      username: dbUser.username || undefined,
      phone: dbUser.phone || undefined,
      address: dbUser.address || undefined,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await authenticateUser(request)
    
    if (!user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
} 