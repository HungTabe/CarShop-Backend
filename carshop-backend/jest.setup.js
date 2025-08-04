// Jest setup file
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_test'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_test'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.STORE_LATITUDE = '10.8231'
process.env.STORE_LONGITUDE = '106.6297'
process.env.STORE_ADDRESS = '123 Test Street, Test City'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test' 