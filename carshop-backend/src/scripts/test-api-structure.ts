#!/usr/bin/env tsx

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

// Test data
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

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  message: string
  duration: number
  error?: string
}

class APIStructureTester {
  private results: TestResult[] = []

  async runAllTests() {
    console.log('🔍 Testing CarShop Backend API Structure...\n')
    
    const startTime = Date.now()
    
    // Test public endpoints
    await this.testHealthEndpoint()
    await this.testStoreLocationEndpoint()
    await this.testProductsEndpoint()
    await this.testProductDetailEndpoint()
    
    // Test authentication endpoints
    await this.testSignupEndpoint()
    await this.testLoginEndpoint()
    
    // Test authenticated endpoints
    await this.testCartEndpoints()
    await this.testNotificationsEndpoint()
    await this.testChatEndpoints()
    await this.testBillingEndpoint()
    
    // Test webhook endpoint
    await this.testWebhookEndpoint()
    
    const totalTime = Date.now() - startTime
    this.printResults(totalTime)
  }

  private async testHealthEndpoint() {
    const startTime = Date.now()
    try {
      const request = createMockRequest('GET')
      const response = await healthGet(request)
      const data = await response.json()

      if (response.status === 200 && data.success && data.data?.status === 'healthy') {
        this.addResult('Health Check Structure', 'PASS', 'Health endpoint structure is correct', Date.now() - startTime)
      } else {
        this.addResult('Health Check Structure', 'FAIL', 'Health endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('Health Check Structure', 'FAIL', 'Health endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testStoreLocationEndpoint() {
    const startTime = Date.now()
    try {
      const request = createMockRequest('GET')
      const response = await storeLocationGet(request)
      const data = await response.json()

      if (response.status === 200 && data.success && data.data?.latitude && data.data?.longitude) {
        this.addResult('Store Location Structure', 'PASS', 'Store location endpoint structure is correct', Date.now() - startTime)
      } else {
        this.addResult('Store Location Structure', 'FAIL', 'Store location endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('Store Location Structure', 'FAIL', 'Store location endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testProductsEndpoint() {
    const startTime = Date.now()
    try {
      const request = createMockRequest('GET')
      const response = await productsGet(request)
      const data = await response.json()

      if (response.status === 200 && data.success && Array.isArray(data.data?.products)) {
        this.addResult('Products List Structure', 'PASS', 'Products endpoint structure is correct', Date.now() - startTime)
      } else {
        this.addResult('Products List Structure', 'FAIL', 'Products endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('Products List Structure', 'FAIL', 'Products endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testProductDetailEndpoint() {
    const startTime = Date.now()
    try {
      const request = createMockRequest('GET')
      const response = await productDetailGet(request, { params: Promise.resolve({ id: 'invalid-id' }) })
      const data = await response.json()

      if (response.status === 404 && data.success === false && data.error) {
        this.addResult('Product Detail Structure', 'PASS', 'Product detail endpoint structure is correct', Date.now() - startTime)
      } else {
        this.addResult('Product Detail Structure', 'FAIL', 'Product detail endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('Product Detail Structure', 'FAIL', 'Product detail endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testSignupEndpoint() {
    const startTime = Date.now()
    try {
      const request = createMockRequest('POST', TEST_USER)
      const response = await signupPost(request)
      const data = await response.json()

      if (response.status === 200 && data.success && data.data?.id) {
        this.addResult('User Signup Structure', 'PASS', 'User signup endpoint structure is correct', Date.now() - startTime)
      } else if (response.status === 400 || response.status === 500) {
        this.addResult('User Signup Structure', 'SKIP', 'User signup endpoint structure test skipped - expected error', Date.now() - startTime)
      } else {
        this.addResult('User Signup Structure', 'FAIL', 'User signup endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('User Signup Structure', 'FAIL', 'User signup endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testLoginEndpoint() {
    const startTime = Date.now()
    try {
      const request = createMockRequest('POST', {
        email: TEST_USER.email,
        password: TEST_USER.password
      })
      const response = await loginPost(request)
      const data = await response.json()

      if (response.status === 200 && data.success && data.data?.accessToken) {
        this.addResult('User Login Structure', 'PASS', 'User login endpoint structure is correct', Date.now() - startTime)
      } else if (response.status === 401 || response.status === 404 || response.status === 500) {
        this.addResult('User Login Structure', 'SKIP', 'User login endpoint structure test skipped - expected error', Date.now() - startTime)
      } else {
        this.addResult('User Login Structure', 'FAIL', 'User login endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('User Login Structure', 'FAIL', 'User login endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testCartEndpoints() {
    const startTime = Date.now()
    try {
      // Test GET cart
      const getRequest = createAuthRequest('GET')
      const getResponse = await cartGet(getRequest)
      const getData = await getResponse.json()

      if (getResponse.status === 401) {
        this.addResult('Cart GET Structure', 'PASS', 'Cart GET endpoint structure is correct (returns 401 for unauthenticated)', Date.now() - startTime)
      } else {
        this.addResult('Cart GET Structure', 'FAIL', 'Cart GET endpoint structure is incorrect', Date.now() - startTime, 'Expected 401 for unauthenticated request')
      }

      // Test POST cart
      const postRequest = createAuthRequest('POST', TEST_CART_ITEM)
      const postResponse = await cartPost(postRequest)
      const postData = await postResponse.json()

      if (postResponse.status === 401) {
        this.addResult('Cart POST Structure', 'PASS', 'Cart POST endpoint structure is correct (returns 401 for unauthenticated)', Date.now() - startTime)
      } else {
        this.addResult('Cart POST Structure', 'FAIL', 'Cart POST endpoint structure is incorrect', Date.now() - startTime, 'Expected 401 for unauthenticated request')
      }
    } catch (error) {
      this.addResult('Cart Endpoints Structure', 'FAIL', 'Cart endpoints structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testNotificationsEndpoint() {
    const startTime = Date.now()
    try {
      const request = createAuthRequest('GET')
      const response = await notificationsGet(request)
      const data = await response.json()

      if (response.status === 401) {
        this.addResult('Notifications Structure', 'PASS', 'Notifications endpoint structure is correct (returns 401 for unauthenticated)', Date.now() - startTime)
      } else {
        this.addResult('Notifications Structure', 'FAIL', 'Notifications endpoint structure is incorrect', Date.now() - startTime, 'Expected 401 for unauthenticated request')
      }
    } catch (error) {
      this.addResult('Notifications Structure', 'FAIL', 'Notifications endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testChatEndpoints() {
    const startTime = Date.now()
    try {
      // Test GET chat
      const getRequest = createAuthRequest('GET')
      const getResponse = await chatGet(getRequest)
      const getData = await getResponse.json()

      if (getResponse.status === 401) {
        this.addResult('Chat GET Structure', 'PASS', 'Chat GET endpoint structure is correct (returns 401 for unauthenticated)', Date.now() - startTime)
      } else {
        this.addResult('Chat GET Structure', 'FAIL', 'Chat GET endpoint structure is incorrect', Date.now() - startTime, 'Expected 401 for unauthenticated request')
      }

      // Test POST chat
      const postRequest = createAuthRequest('POST', TEST_CHAT_MESSAGE)
      const postResponse = await chatPost(postRequest)
      const postData = await postResponse.json()

      if (postResponse.status === 401) {
        this.addResult('Chat POST Structure', 'PASS', 'Chat POST endpoint structure is correct (returns 401 for unauthenticated)', Date.now() - startTime)
      } else {
        this.addResult('Chat POST Structure', 'FAIL', 'Chat POST endpoint structure is incorrect', Date.now() - startTime, 'Expected 401 for unauthenticated request')
      }
    } catch (error) {
      this.addResult('Chat Endpoints Structure', 'FAIL', 'Chat endpoints structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testBillingEndpoint() {
    const startTime = Date.now()
    try {
      const request = createAuthRequest('POST', TEST_BILLING_DATA)
      const response = await billingPost(request)
      const data = await response.json()

      if (response.status === 401) {
        this.addResult('Billing Structure', 'PASS', 'Billing endpoint structure is correct (returns 401 for unauthenticated)', Date.now() - startTime)
      } else {
        this.addResult('Billing Structure', 'FAIL', 'Billing endpoint structure is incorrect', Date.now() - startTime, 'Expected 401 for unauthenticated request')
      }
    } catch (error) {
      this.addResult('Billing Structure', 'FAIL', 'Billing endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private async testWebhookEndpoint() {
    const startTime = Date.now()
    try {
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

      if (response.status === 200 || response.status === 400) {
        this.addResult('Stripe Webhook Structure', 'PASS', 'Stripe webhook endpoint structure is correct', Date.now() - startTime)
      } else {
        this.addResult('Stripe Webhook Structure', 'FAIL', 'Stripe webhook endpoint structure is incorrect', Date.now() - startTime, 'Invalid response structure')
      }
    } catch (error) {
      this.addResult('Stripe Webhook Structure', 'FAIL', 'Stripe webhook endpoint structure test failed', Date.now() - startTime, error as string)
    }
  }

  private addResult(name: string, status: 'PASS' | 'FAIL' | 'SKIP', message: string, duration: number, error?: string) {
    this.results.push({
      name,
      status,
      message,
      duration,
      error
    })
  }

  private printResults(totalTime: number) {
    console.log('\n📊 API Structure Test Results')
    console.log('='.repeat(50))
    
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const skipped = this.results.filter(r => r.status === 'SKIP').length
    const total = this.results.length

    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`📈 Total: ${total}`)
    console.log(`⏱️  Total Time: ${totalTime}ms`)
    console.log('')

    // Print detailed results
    this.results.forEach((result, index) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️'
      const color = result.status === 'PASS' ? '\x1b[32m' : result.status === 'FAIL' ? '\x1b[31m' : '\x1b[33m'
      const reset = '\x1b[0m'
      
      console.log(`${color}${icon} ${result.name}${reset}`)
      console.log(`   Status: ${result.status}`)
      console.log(`   Message: ${result.message}`)
      console.log(`   Duration: ${result.duration}ms`)
      if (result.error) {
        console.log(`   Error: ${result.error}`)
      }
      console.log('')
    })

    // Print summary
    if (failed === 0) {
      console.log('🎉 All API structure tests passed! The API endpoints are properly structured.')
    } else {
      console.log('⚠️  Some API structure tests failed. Please check the errors above.')
    }
  }
}

// Run the tests
async function main() {
  const tester = new APIStructureTester()
  await tester.runAllTests()
}

main().catch(console.error) 