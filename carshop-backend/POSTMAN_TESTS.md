# CarShop Backend API - Postman Test Collection

This document provides a complete Postman test collection for the CarShop Backend API. You can import these tests into Postman to validate all API endpoints.

## 📋 Collection Overview

**Collection Name**: CarShop Backend API Tests  
**Base URL**: `http://localhost:3000`  
**Environment**: Development  

## 🔧 Environment Variables

Create a Postman environment with these variables:

```json
{
  "base_url": "http://localhost:3000",
  "auth_token": "",
  "test_user_email": "test@example.com",
  "test_user_password": "testpassword123",
  "test_product_id": "",
  "test_cart_item_id": "",
  "test_order_id": ""
}
```

## 📁 Test Collection Structure

### 1. Public Endpoints (No Authentication)

#### 1.1 Health Check
- **Method**: GET
- **URL**: `{{base_url}}/api/health`
- **Description**: Test API health status
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "environment": "development"
  }
}
```

#### 1.2 Store Location
- **Method**: GET
- **URL**: `{{base_url}}/api/store/location`
- **Description**: Get store location coordinates
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "latitude": 10.8231,
    "longitude": 106.6297,
    "address": "123 Car Street, Ho Chi Minh City, Vietnam",
    "coordinates": {
      "lat": 10.8231,
      "lng": 106.6297
    }
  }
}
```

#### 1.3 Products List
- **Method**: GET
- **URL**: `{{base_url}}/api/products`
- **Description**: Get paginated list of products
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `sort` (optional): Sort order (price_asc, price_desc, name_asc, name_desc, created_at)
  - `brand` (optional): Filter by brand
  - `model` (optional): Filter by model
  - `minPrice` (optional): Minimum price filter
  - `maxPrice` (optional): Maximum price filter
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product-id",
        "name": "Car Name",
        "description": "Car description",
        "price": 25000.00,
        "brand": "Brand",
        "model": "Model",
        "year": 2024,
        "mileage": 10000,
        "fuelType": "Gasoline",
        "transmission": "Automatic",
        "engineSize": "2.0L",
        "color": "Red",
        "imageUrls": ["https://example.com/image.jpg"],
        "inStock": true,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalCount": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 1.4 Product Detail
- **Method**: GET
- **URL**: `{{base_url}}/api/products/{{test_product_id}}`
- **Description**: Get detailed product information
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "product-id",
    "name": "Car Name",
    "description": "Car description",
    "price": 25000.00,
    "brand": "Brand",
    "model": "Model",
    "year": 2024,
    "mileage": 10000,
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "engineSize": "2.0L",
    "color": "Red",
    "imageUrls": ["https://example.com/image.jpg"],
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Authentication Endpoints

#### 2.1 User Signup
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/signup`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "{{test_user_email}}",
  "password": "{{test_user_password}}",
  "username": "testuser",
  "phone": "+1234567890",
  "address": "123 Test Street, Test City"
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "test@example.com",
    "username": "testuser",
    "phone": "+1234567890",
    "address": "123 Test Street, Test City"
  },
  "message": "User registered successfully"
}
```

#### 2.2 User Login
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "{{test_user_email}}",
  "password": "{{test_user_password}}"
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "test@example.com",
    "username": "testuser",
    "phone": "+1234567890",
    "address": "123 Test Street, Test City",
    "accessToken": "jwt-token-here"
  },
  "message": "Login successful"
}
```

### 3. Protected Endpoints (Authentication Required)

#### 3.1 Get Cart
- **Method**: GET
- **URL**: `{{base_url}}/api/cart`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart-item-id",
        "productId": "product-id",
        "productName": "Car Name",
        "quantity": 1,
        "price": 25000.00,
        "totalPrice": 25000.00
      }
    ],
    "totalAmount": 25000.00,
    "itemCount": 1
  }
}
```

#### 3.2 Add to Cart
- **Method**: POST
- **URL**: `{{base_url}}/api/cart`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "productId": "{{test_product_id}}",
  "quantity": 1
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "cart-item-id",
    "productId": "product-id",
    "quantity": 1,
    "totalPrice": 25000.00
  },
  "message": "Item added to cart successfully"
}
```

#### 3.3 Update Cart Item
- **Method**: PUT
- **URL**: `{{base_url}}/api/cart`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "productId": "{{test_product_id}}",
  "quantity": 2
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "cart-item-id",
    "productId": "product-id",
    "quantity": 2,
    "totalPrice": 50000.00
  },
  "message": "Cart item updated successfully"
}
```

#### 3.4 Remove from Cart
- **Method**: DELETE
- **URL**: `{{base_url}}/api/cart`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "productId": "{{test_product_id}}"
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

#### 3.5 Clear Cart
- **Method**: DELETE
- **URL**: `{{base_url}}/api/cart`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "clearAll": true
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "message": "Cart cleared successfully"
}
```

#### 3.6 Get Notifications
- **Method**: GET
- **URL**: `{{base_url}}/api/notifications`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "cartItemCount": 2,
    "totalAmount": 50000.00,
    "hasItems": true
  }
}
```

#### 3.7 Get Chat Messages
- **Method**: GET
- **URL**: `{{base_url}}/api/chat`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": [
    {
      "id": "message-id",
      "content": "Hello, I need help with a car",
      "senderId": "user-id",
      "senderName": "testuser",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 3.8 Send Chat Message
- **Method**: POST
- **URL**: `{{base_url}}/api/chat`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "content": "Hello, I need help with a car purchase"
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "id": "message-id",
    "content": "Hello, I need help with a car purchase",
    "senderId": "user-id",
    "senderName": "testuser",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "Message sent successfully"
}
```

#### 3.9 Process Billing
- **Method**: POST
- **URL**: `{{base_url}}/api/billing`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- **Body**:
```json
{
  "cartItemIds": ["{{test_cart_item_id}}"],
  "billingAddress": "123 Billing Street, City",
  "shippingAddress": "123 Shipping Street, City"
}
```
- **Expected Response**: 200 OK
```json
{
  "success": true,
  "data": {
    "orderId": "order-id",
    "paymentIntentId": "pi_test_123",
    "totalAmount": 25000.00,
    "status": "pending"
  },
  "message": "Order created successfully"
}
```

### 4. Webhook Endpoints

#### 4.1 Stripe Webhook
- **Method**: POST
- **URL**: `{{base_url}}/api/webhooks/stripe`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_test_123",
      "metadata": {
        "orderId": "{{test_order_id}}"
      }
    }
  }
}
```
- **Expected Response**: 200 OK
```json
{
  "received": true,
  "message": "Webhook processed successfully"
}
```

## 🧪 Test Scripts

### Pre-request Scripts

#### For Authentication Tests
```javascript
// Set test user data
pm.environment.set("test_user_email", "test@example.com");
pm.environment.set("test_user_password", "testpassword123");
```

#### For Protected Endpoints
```javascript
// Check if auth token exists
if (!pm.environment.get("auth_token")) {
    console.log("No auth token found. Please run login test first.");
}
```

### Test Scripts

#### Health Check Test
```javascript
pm.test("Health check should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have correct structure", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.status).to.eql("healthy");
    pm.expect(response.data.version).to.be.a("string");
    pm.expect(response.data.timestamp).to.be.a("string");
});
```

#### Store Location Test
```javascript
pm.test("Store location should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have coordinates", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.latitude).to.be.a("number");
    pm.expect(response.data.longitude).to.be.a("number");
    pm.expect(response.data.address).to.be.a("string");
});
```

#### Products List Test
```javascript
pm.test("Products list should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have products array", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.products).to.be.an("array");
    pm.expect(response.data.pagination).to.be.an("object");
    
    // Store first product ID for other tests
    if (response.data.products.length > 0) {
        pm.environment.set("test_product_id", response.data.products[0].id);
    }
});
```

#### User Signup Test
```javascript
pm.test("User signup should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have user data", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.id).to.be.a("string");
    pm.expect(response.data.email).to.eql(pm.environment.get("test_user_email"));
});
```

#### User Login Test
```javascript
pm.test("User login should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have access token", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.accessToken).to.be.a("string");
    
    // Store auth token for other tests
    pm.environment.set("auth_token", response.data.accessToken);
});
```

#### Cart Tests
```javascript
pm.test("Cart endpoint should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have cart data", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.items).to.be.an("array");
    pm.expect(response.data.totalAmount).to.be.a("number");
    pm.expect(response.data.itemCount).to.be.a("number");
});
```

#### Billing Test
```javascript
pm.test("Billing should return 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response should have order data", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.orderId).to.be.a("string");
    pm.expect(response.data.paymentIntentId).to.be.a("string");
    pm.expect(response.data.totalAmount).to.be.a("number");
    
    // Store order ID for webhook tests
    pm.environment.set("test_order_id", response.data.orderId);
});
```

## 🔄 Test Flow

### 1. Setup Tests
1. **Health Check** - Verify API is running
2. **Store Location** - Verify store data is available
3. **Products List** - Get available products and store product ID

### 2. Authentication Tests
1. **User Signup** - Create test user account
2. **User Login** - Authenticate and get access token

### 3. Protected Endpoint Tests
1. **Get Cart** - Verify empty cart
2. **Add to Cart** - Add product to cart
3. **Get Cart** - Verify cart has items
4. **Update Cart** - Modify item quantity
5. **Get Notifications** - Check cart count
6. **Send Chat Message** - Test chat functionality
7. **Get Chat Messages** - Verify message was sent
8. **Process Billing** - Create order and payment intent

### 4. Webhook Tests
1. **Stripe Webhook** - Test payment webhook processing

## 🚨 Error Handling Tests

### Invalid Authentication
- **Method**: GET
- **URL**: `{{base_url}}/api/cart`
- **Headers**: `Content-Type: application/json`
- **Expected Response**: 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Invalid Product ID
- **Method**: GET
- **URL**: `{{base_url}}/api/products/invalid-id`
- **Expected Response**: 404 Not Found
```json
{
  "success": false,
  "error": "Product not found"
}
```

### Invalid Input Data
- **Method**: POST
- **URL**: `{{base_url}}/api/auth/signup`
- **Body**:
```json
{
  "email": "invalid-email",
  "password": "123"
}
```
- **Expected Response**: 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data",
  "details": [...]
}
```

## 📊 Test Results Validation

### Success Criteria
- ✅ All endpoints return expected status codes
- ✅ Response structure matches API documentation
- ✅ Authentication works correctly
- ✅ Error handling works as expected
- ✅ Data validation functions properly

### Performance Criteria
- ✅ Response time < 500ms for public endpoints
- ✅ Response time < 1000ms for authenticated endpoints
- ✅ Response time < 2000ms for database operations

## 🔧 Import Instructions

1. **Create New Collection** in Postman
2. **Import Environment Variables** from the JSON above
3. **Add Each Request** following the structure above
4. **Add Test Scripts** to each request
5. **Run Collection** to validate all endpoints

## 📝 Notes

- **Base URL**: Update `base_url` environment variable for different environments
- **Authentication**: Run login test first to get auth token
- **Test Data**: Some tests depend on previous test results (product ID, order ID, etc.)
- **Error Handling**: Test both success and failure scenarios
- **Performance**: Monitor response times during testing

---

**Last Updated**: January 2024  
**API Version**: 1.0.0  
**Contact**: trandinhhung717@gmail.com 