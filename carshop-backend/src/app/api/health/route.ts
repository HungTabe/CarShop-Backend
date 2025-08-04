import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  return successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  })
} 