import { generateToken, verifyToken, hashPassword, comparePassword } from '../lib/auth'

async function testAuth() {
  console.log('🧪 Testing JWT Authentication...')

  // Test password hashing
  console.log('\n1. Testing password hashing...')
  const password = 'testpassword123'
  const hashedPassword = await hashPassword(password)
  console.log('✅ Password hashed successfully')
  
  const isMatch = await comparePassword(password, hashedPassword)
  console.log(`✅ Password verification: ${isMatch ? 'PASS' : 'FAIL'}`)

  // Test JWT token generation
  console.log('\n2. Testing JWT token generation...')
  const testUser = {
    id: 'test-user-id',
    authId: 'test-auth-id',
    email: 'test@example.com',
    username: 'testuser',
    phone: '+1234567890',
    address: '123 Test St',
  }

  const token = generateToken(testUser)
  console.log('✅ JWT token generated successfully')
  console.log(`Token: ${token.substring(0, 50)}...`)

  // Test JWT token verification
  console.log('\n3. Testing JWT token verification...')
  const payload = verifyToken(token)
  if (payload) {
    console.log('✅ JWT token verified successfully')
    console.log('Claims:', {
      userId: payload.userId,
      email: payload.email,
      username: payload.username,
      exp: new Date(payload.exp! * 1000).toISOString(),
    })
  } else {
    console.log('❌ JWT token verification failed')
  }

  // Test invalid token
  console.log('\n4. Testing invalid token...')
  const invalidPayload = verifyToken('invalid-token')
  console.log(`✅ Invalid token handling: ${invalidPayload === null ? 'PASS' : 'FAIL'}`)

  console.log('\n🎉 All authentication tests completed!')
}

testAuth().catch(console.error) 