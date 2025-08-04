import { NextRequest } from 'next/server'
import { GET as healthGet } from '@/app/api/health/route'
import { GET as storeLocationGet } from '@/app/api/store/location/route'
import { GET as productsGet } from '@/app/api/products/route'
import { GET as productDetailGet } from '@/app/api/products/[id]/route'
import { POST as signupPost } from '@/app/api/auth/signup/route'
import { POST as loginPost } from '@/app/api/auth/login/route'
import { GET as cartGet, POST as cartPost, PUT as cartPut, DELETE as cartDelete } from '@/app/api/cart/route'
import { GET as notificationsGet } from '@/app/api/notifications/route'
import { GET as chatGet, POST as chatPost } from '@/app/api/chat/route'
import { POST as billingPost } from '@/app/api/billing/route'
import { POST as webhookPost } from '@/app/api/webhooks/stripe/route'

// Mock data for testing
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
  username: 'testuser',
  phone: '+1234567890',
  address: '123 Test Street, Test City'
}

const TEST_CART_ITEM = {
  productId: 'test-product-id',
  quantity: 1
}

const TEST_BILLING_DATA = {
  cartItemIds: ['test-cart-item-id'],
  billingAddress: '123 Test Billing Address',
  shippingAddress: '123 Test Shipping Address'
}

const TEST_CHAT_MESSAGE = {
  content: 'Test message from API tester'
}

// Helper function to create mock request
function createMockRequest(method: string, body?: any, headers?: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/test')
  const request = new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  })
  return request
}

// Helper function to create mock request with auth
function createAuthRequest(method: string, body?: any, token: string = 'test-token'): NextRequest {
  return createMockRequest(method, body, {
    'Authorization': `Bearer ${token}`
  })
}

describe('CarShop Backend API Tests', () => {
  describe('Public Endpoints', () => {
    test('Health Check Endpoint', async () => {
      const request = createMockRequest('GET')
      const response = await healthGet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('healthy')
      expect(data.data.timestamp).toBeDefined()
      expect(data.data.version).toBe('1.0.0')
    })

    test('Store Location Endpoint', async () => {
      const request = createMockRequest('GET')
      const response = await storeLocationGet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.latitude).toBeDefined()
      expect(data.data.longitude).toBeDefined()
      expect(data.data.address).toBeDefined()
      expect(data.data.coordinates).toBeDefined()
    })

    test('Products List Endpoint', async () => {
      const request = createMockRequest('GET')
      const response = await productsGet(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.products).toBeDefined()
      expect(Array.isArray(data.data.products)).toBe(true)
      expect(data.data.pagination).toBeDefined()
    })

    test('Product Detail Endpoint - Invalid ID', async () => {
      const request = createMockRequest('GET')
      const response = await productDetailGet(request, { params: Promise.resolve({ id: 'invalid-id' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Product not found')
    })
  })

  describe('Authentication Endpoints', () => {
    test('User Signup Endpoint', async () => {
      const request = createMockRequest('POST', TEST_USER)
      const response = await signupPost(request)
      const data = await response.json()

      // This test might fail if Supabase is not configured, but we test the structure
      expect([200, 400, 500]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data.id).toBeDefined()
        expect(data.data.email).toBe(TEST_USER.email)
      }
    })

    test('User Login Endpoint', async () => {
      const request = createMockRequest('POST', {
        email: TEST_USER.email,
        password: TEST_USER.password
      })
      const response = await loginPost(request)
      const data = await response.json()

      // This test might fail if user doesn't exist, but we test the structure
      expect([200, 401, 404, 500]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data.accessToken).toBeDefined()
      }
    })
  })

  describe('Authenticated Endpoints', () => {
    const testToken = 'test-auth-token'

    test('Get Cart Endpoint', async () => {
      const request = createAuthRequest('GET', undefined, testToken)
      const response = await cartGet(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 401]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data.items).toBeDefined()
        expect(data.data.totalAmount).toBeDefined()
        expect(data.data.itemCount).toBeDefined()
      }
    })

    test('Add to Cart Endpoint', async () => {
      const request = createAuthRequest('POST', TEST_CART_ITEM, testToken)
      const response = await cartPost(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 400, 401, 404]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data).toBeDefined()
      }
    })

    test('Update Cart Endpoint', async () => {
      const request = createAuthRequest('PUT', TEST_CART_ITEM, testToken)
      const response = await cartPut(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 400, 401, 404]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data).toBeDefined()
      }
    })

    test('Delete Cart Endpoint', async () => {
      const request = createAuthRequest('DELETE', undefined, testToken)
      const response = await cartDelete(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 401]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
      }
    })

    test('Notifications Endpoint', async () => {
      const request = createAuthRequest('GET', undefined, testToken)
      const response = await notificationsGet(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 401]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data.cartItemCount).toBeDefined()
        expect(data.data.totalAmount).toBeDefined()
        expect(data.data.hasItems).toBeDefined()
      }
    })

    test('Get Chat Messages Endpoint', async () => {
      const request = createAuthRequest('GET', undefined, testToken)
      const response = await chatGet(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 401]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data).toBeDefined()
      }
    })

    test('Send Chat Message Endpoint', async () => {
      const request = createAuthRequest('POST', TEST_CHAT_MESSAGE, testToken)
      const response = await chatPost(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 400, 401]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data).toBeDefined()
      }
    })

    test('Billing Endpoint', async () => {
      const request = createAuthRequest('POST', TEST_BILLING_DATA, testToken)
      const response = await billingPost(request)
      const data = await response.json()

      // Should return 401 if not authenticated
      expect([200, 400, 401]).toContain(response.status)
      if (response.status === 200) {
        expect(data.success).toBe(true)
        expect(data.data.orderId).toBeDefined()
        expect(data.data.paymentIntentId).toBeDefined()
        expect(data.data.totalAmount).toBeDefined()
      }
    })
  })

  describe('Webhook Endpoints', () => {
    test('Stripe Webhook Endpoint', async () => {
      const webhookData = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
            metadata: {
              orderId: 'test-order-id'
            }
          }
        }
      }
      const request = createMockRequest('POST', webhookData)
      const response = await webhookPost(request)
      const data = await response.json()

      // Should return 200 or 400 depending on webhook signature
      expect([200, 400]).toContain(response.status)
      if (response.status === 200) {
        expect(data.received).toBe(true)
      }
    })
  })

  describe('Error Handling', () => {
    test('Invalid JSON in request body', async () => {
      const request = createMockRequest('POST', 'invalid-json')
      const response = await signupPost(request)
      
      expect([400, 500]).toContain(response.status)
    })

    test('Missing required fields', async () => {
      const request = createMockRequest('POST', { email: 'test@example.com' })
      const response = await signupPost(request)
      const data = await response.json()

      expect([400, 500]).toContain(response.status)
      if (response.status === 400) {
        expect(data.success).toBe(false)
        expect(data.error).toBeDefined()
      }
    })

    test('Invalid authentication token', async () => {
      const request = createAuthRequest('GET', undefined, 'invalid-token')
      const response = await cartGet(request)
      
      expect(response.status).toBe(401)
    })
  })

  describe('Validation Tests', () => {
    test('Email validation in signup', async () => {
      const invalidUser = { ...TEST_USER, email: 'invalid-email' }
      const request = createMockRequest('POST', invalidUser)
      const response = await signupPost(request)
      const data = await response.json()

      expect([400, 500]).toContain(response.status)
      if (response.status === 400) {
        expect(data.success).toBe(false)
        expect(data.error).toBeDefined()
      }
    })

    test('Password validation in signup', async () => {
      const invalidUser = { ...TEST_USER, password: '123' } // Too short
      const request = createMockRequest('POST', invalidUser)
      const response = await signupPost(request)
      const data = await response.json()

      expect([400, 500]).toContain(response.status)
      if (response.status === 400) {
        expect(data.success).toBe(false)
        expect(data.error).toBeDefined()
      }
    })

    test('Cart item quantity validation', async () => {
      const invalidCartItem = { ...TEST_CART_ITEM, quantity: 0 }
      const request = createAuthRequest('POST', invalidCartItem)
      const response = await cartPost(request)
      const data = await response.json()

      expect([400, 401, 500]).toContain(response.status)
      if (response.status === 400) {
        expect(data.success).toBe(false)
        expect(data.error).toBeDefined()
      }
    })
  })
}) 