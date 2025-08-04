import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const latitude = parseFloat(process.env.STORE_LATITUDE || '10.8231')
    const longitude = parseFloat(process.env.STORE_LONGITUDE || '106.6297')
    const address = process.env.STORE_ADDRESS || '123 Car Street, Ho Chi Minh City, Vietnam'

    return Response.json({
      success: true,
      data: {
        latitude,
        longitude,
        address,
        coordinates: {
          lat: latitude,
          lng: longitude,
        },
      },
    })
  } catch (error) {
    console.error('Store location fetch error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 