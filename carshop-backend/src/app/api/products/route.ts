import { NextRequest } from 'next/server'
import { productQuerySchema } from '@/types'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedData = productQuerySchema.parse(queryParams)

    const { page, limit, sort, brand, model, minPrice, maxPrice } = validatedData

    // Build where clause for filtering
    const where: any = {
      inStock: true,
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' }
    }

    if (model) {
      where.model = { contains: model, mode: 'insensitive' }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    // Build orderBy clause for sorting
    let orderBy: any = { createdAt: 'desc' }
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBy = { price: 'asc' }
          break
        case 'price_desc':
          orderBy = { price: 'desc' }
          break
        case 'name_asc':
          orderBy = { name: 'asc' }
          break
        case 'name_desc':
          orderBy = { name: 'desc' }
          break
        case 'created_at':
          orderBy = { createdAt: 'desc' }
          break
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return Response.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Products fetch error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 