# CarShop Backend API Testing Guide

This document provides comprehensive testing instructions for the CarShop Backend API. The testing system includes both automated tests and manual testing procedures.

## 🚀 Quick Start

### Automated API Testing

Run all API tests with a single command:

```bash
# Start the development server first
npm run dev

# In another terminal, run the API tests
npm run test:api
```

### Jest Unit Tests

Run comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📋 Test Coverage

### Public Endpoints (No Authentication Required)

| Endpoint | Method | Test Description | Expected Result |
|----------|--------|------------------|-----------------|
| `/api/health` | GET | Health check endpoint | Returns API status and version |
| `/api/store/location` | GET | Store location data | Returns coordinates and address |
| `/api/products` | GET | Product listing with filters | Returns paginated product list |
| `/api/products/[id]` | GET | Individual product details | Returns product data or 404 |

### Authentication Endpoints

| Endpoint | Method | Test Description | Expected Result |
|----------|--------|------------------|-----------------|
| `/api/auth/signup` | POST | User registration | Creates new user account |
| `/api/auth/login` | POST | User authentication | Returns access token |

### Protected Endpoints (Authentication Required)

| Endpoint | Method | Test Description | Expected Result |
|----------|--------|------------------|-----------------|
| `/api/cart` | GET | View user's cart | Returns cart items and total |
| `/api/cart` | POST | Add item to cart | Adds product to cart |
| `/api/cart` | PUT | Update cart item | Updates item quantity |
| `/api/cart` | DELETE | Remove from cart | Removes item or clears cart |
| `/api/notifications` | GET | Get cart notifications | Returns cart count for badges |
| `/api/chat` | GET | Fetch chat messages | Returns user's chat history |
| `/api/chat` | POST | Send chat message | Creates new message |
| `/api/billing` | POST | Process payment | Creates order and payment intent |

### Webhook Endpoints

| Endpoint | Method | Test Description | Expected Result |
|----------|--------|------------------|-----------------|
| `/api/webhooks/stripe` | POST | Stripe webhook processing | Handles payment events |

## 🧪 Test Categories

### 1. Functional Tests

**Purpose**: Verify that each endpoint performs its intended function correctly.

**Test Cases**:
- ✅ Health check returns correct status
- ✅ Store location returns valid coordinates
- ✅ Products endpoint returns paginated results
- ✅ Authentication creates and validates users
- ✅ Cart operations work correctly
- ✅ Chat functionality operates properly
- ✅ Payment processing works as expected

### 2. Validation Tests

**Purpose**: Ensure proper input validation and error handling.

**Test Cases**:
- ✅ Invalid email format returns 400
- ✅ Short password returns 400
- ✅ Missing required fields returns 400
- ✅ Invalid product ID returns 404
- ✅ Invalid cart item quantity returns 400
- ✅ Empty chat message returns 400

### 3. Authentication Tests

**Purpose**: Verify security and access control.

**Test Cases**:
- ✅ Unauthenticated requests return 401
- ✅ Valid tokens allow access
- ✅ Invalid tokens are rejected
- ✅ Expired tokens are handled properly

### 4. Error Handling Tests

**Purpose**: Ensure graceful error handling.

**Test Cases**:
- ✅ Invalid JSON returns 400
- ✅ Database errors are handled
- ✅ External service failures are handled
- ✅ Network timeouts are handled

## 📊 Test Results Interpretation

### Success Indicators

- **✅ PASS**: Endpoint is working correctly
- **❌ FAIL**: Endpoint has issues that need fixing
- **⏭️ SKIP**: Test was skipped due to dependencies

### Common Test Scenarios

#### 1. Public Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Store location
curl http://localhost:3000/api/store/location

# Products list
curl http://localhost:3000/api/products
```

#### 2. Authentication Flow
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

#### 3. Protected Endpoints
```bash
# Add to cart (requires auth token)
curl -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"test-id","quantity":1}'

# Get cart
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Test Configuration

### Environment Setup

1. **Development Environment**:
   ```bash
   npm run dev
   ```

2. **Test Database** (Optional):
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Environment Variables**:
   ```env
   # For testing, these can be placeholder values
   DATABASE_URL="postgresql://test:test@localhost:5432/test"
   NEXT_PUBLIC_SUPABASE_URL="https://test.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="test-key"
   STRIPE_SECRET_KEY="sk_test_test"
   ```

### Test Data

The test suite uses the following test data:

```typescript
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
```

## 🐛 Troubleshooting

### Common Issues

1. **Server Not Running**:
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3000
   ```
   **Solution**: Start the development server with `npm run dev`

2. **Database Connection Issues**:
   ```
   Error: Environment variable not found: DATABASE_URL
   ```
   **Solution**: Set up your environment variables in `.env.local`

3. **Authentication Failures**:
   ```
   Error: Unauthorized
   ```
   **Solution**: Ensure Supabase is properly configured

4. **Test Timeouts**:
   ```
   Error: Timeout of 5000ms exceeded
   ```
   **Solution**: Increase timeout in test configuration

### Debug Mode

Run tests with verbose output:

```bash
# Enable debug logging
DEBUG=* npm run test:api

# Run specific test
npm run test:api -- --grep "Health Check"
```

## 📈 Performance Testing

### Load Testing (Optional)

For performance testing, you can use tools like:

```bash
# Install artillery for load testing
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 http://localhost:3000/api/health
```

### Response Time Benchmarks

Expected response times:

- **Health Check**: < 100ms
- **Public Endpoints**: < 200ms
- **Authenticated Endpoints**: < 500ms
- **Database Operations**: < 1000ms

## 🔄 Continuous Integration

### GitHub Actions (Optional)

Create `.github/workflows/test.yml`:

```yaml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
```

## 📝 Test Reports

### Coverage Report

After running tests with coverage:

```bash
npm run test:coverage
```

This generates a coverage report showing:
- Line coverage percentage
- Branch coverage percentage
- Function coverage percentage
- Uncovered lines

### Test Results Summary

The automated test script provides:

```
📊 Test Results Summary
==================================================
✅ Passed: 12
❌ Failed: 0
⏭️  Skipped: 2
📈 Total: 14
⏱️  Total Time: 2345ms
```

## 🎯 Best Practices

1. **Run Tests Before Deployment**: Always run the full test suite before deploying
2. **Monitor Test Results**: Track test pass/fail rates over time
3. **Update Tests**: Keep tests updated when API changes
4. **Test Edge Cases**: Include boundary and error condition tests
5. **Document Test Failures**: Document any test failures and their resolutions

## 📞 Support

For testing issues or questions:

- **Test Failures**: Check the error messages and common issues above
- **Configuration**: Verify environment variables and database setup
- **Performance**: Monitor response times and optimize slow endpoints
- **Coverage**: Aim for >80% test coverage for critical endpoints

---

**Note**: This testing system is designed to be comprehensive and automated. Run `npm run test:api` to test all endpoints with a single command! 