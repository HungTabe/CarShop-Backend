import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
  }

  if (message) {
    response.message = message
  }

  return NextResponse.json(response, { status })
}

export function errorResponse(error: string, status = 400) {
  const response: ApiResponse = {
    success: false,
    error,
  }

  return NextResponse.json(response, { status })
}

export function validationErrorResponse(errors: any[], status = 400) {
  const response: ApiResponse = {
    success: false,
    error: 'Invalid input data',
    data: { details: errors },
  }

  return NextResponse.json(response, { status })
}

export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} not found`, 404)
}

export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401)
}

export function forbiddenResponse() {
  return errorResponse('Forbidden', 403)
}

export function internalServerErrorResponse() {
  return errorResponse('Internal server error', 500)
} 