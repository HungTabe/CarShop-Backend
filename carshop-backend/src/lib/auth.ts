import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
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

export interface JWTPayload {
  userId: string
  authId: string
  email: string
  username?: string
  iat?: number
  exp?: number
}

// Generate JWT token with user claims
export function generateToken(user: AuthenticatedUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    authId: user.authId,
    email: user.email,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  }

  const secret = process.env.JWT_SECRET || 'fallback-secret-key'
  return jwt.sign(payload, secret, { algorithm: 'HS256' })
}

// Verify JWT token and extract claims
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key'
    const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as JWTPayload
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Hash password for secure storage
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (!payload) {
      return null
    }

    // Get user from our database
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId }
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