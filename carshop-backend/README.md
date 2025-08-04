# CarShop Backend

A RESTful API built with Next.js and Supabase (PostgreSQL) to power a mobile application for purchasing cars. The backend supports user authentication, product browsing, cart management, secure payments, real-time chat, store location mapping, and cart notifications.

## Features

- 🔐 **Authentication**: User signup and login with secure credential management via Supabase Auth
- 🚗 **Product Listing**: Fetch, sort, and filter car products with detailed views
- 🛒 **Cart Management**: Add, update, remove, and view cart items with dynamic total calculation
- 💳 **Billing**: Process payments using Stripe (sandbox mode; adaptable to VNPay/ZaloPay)
- 🔔 **Notifications**: Provide cart item count for badge updates on the mobile app
- 📍 **Map Integration**: Expose store location data for Google Maps display
- 💬 **Real-Time Chat**: Enable users to communicate with store representatives using Supabase's real-time subscriptions

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Payment Gateway**: Stripe (sandbox; adaptable to VNPay/ZaloPay)
- **Validation**: Zod
- **Deployment**: Vercel (recommended)
- **Other**: Supabase Realtime for chat, environment variables for configuration

## Prerequisites

- Node.js (v18 or higher)
- Supabase account and project
- Stripe account (for sandbox testing)
- Vercel account (for deployment)
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/carshop-backend.git
cd carshop-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Database
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# JWT Secret (for additional security)
JWT_SECRET="your-super-secret-jwt-key-here"

# Store Location (for map integration)
STORE_LATITUDE="10.8231"
STORE_LONGITUDE="106.6297"
STORE_ADDRESS="123 Car Street, Ho Chi Minh City, Vietnam"
```

**How to obtain the values:**

1. **DATABASE_URL and Supabase keys**: Get from your Supabase project dashboard
2. **STRIPE_SECRET_KEY**: Get from Stripe's dashboard (test mode)
3. **STRIPE_WEBHOOK_SECRET**: Create a webhook endpoint in Stripe dashboard and copy the signing secret

### 4. Set Up Database

Apply the schema to Supabase:

```bash
npx prisma db push
```

Enable Row-Level Security (RLS) in Supabase for tables with policies like:

```sql
CREATE POLICY user_cart_access ON "CartItem" USING (user_id = auth.uid());
CREATE POLICY user_order_access ON "Order" USING (user_id = auth.uid());
CREATE POLICY user_message_access ON "Message" USING (user_id = auth.uid());
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Run the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`.

## Database Schema

The database is managed by PostgreSQL via Supabase, with the following key tables:

- **User**: Stores user data (email, username, phone, address) linked to Supabase's auth.users via authId
- **Product**: Contains car details (name, price, image URLs, brand, model, specs, etc.)
- **CartItem**: Tracks products in a user's cart with quantities
- **Order**: Records purchases with billing/shipping info and status (PENDING, PAID, etc.)
- **OrderItem**: Links products to orders with purchase-time prices
- **Payment**: Logs Stripe payment details
- **Message**: Stores chat messages for real-time communication

See `prisma/schema.prisma` for the full schema.

## API Endpoints

All endpoints are prefixed with `/api`.

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/auth/signup` | POST | Register a new user | None |
| `/auth/login` | POST | Log in an existing user | None |
| `/products` | GET | Fetch products with sorting/filtering | None |
| `/products/[id]` | GET | Get detailed product information | None |
| `/cart` | GET | View user's cart | JWT (Supabase) |
| `/cart` | POST | Add item to cart | JWT |
| `/cart` | PUT | Update cart item quantity | JWT |
| `/cart` | DELETE | Remove item or clear cart | JWT |
| `/billing` | POST | Process payment and create order | JWT |
| `/notifications` | GET | Get cart item count for badge | JWT |
| `/store/location` | GET | Get store location for map display | None |
| `/chat` | GET/POST | Fetch or send chat messages | JWT |

### Example Request (Add to Cart)

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer <supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "uuid", "quantity": 1}'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "cart-item-id",
    "userId": "user-id",
    "productId": "product-id",
    "quantity": 1,
    "product": {
      "id": "product-id",
      "name": "Toyota Camry 2023",
      "price": 25000.00,
      "brand": "Toyota",
      "model": "Camry"
    }
  },
  "message": "Item added to cart successfully"
}
```

## Security

- **Authentication**: Custom JWT authentication with bcrypt password hashing
- **JWT Claims**: Tokens include user ID, email, username, and expiration time
- **Password Security**: Passwords are hashed using bcrypt with 12 salt rounds
- **Input Validation**: Zod validates API request bodies
- **Environment Variables**: Sensitive data (e.g., JWT secret, Stripe keys) stored securely in `.env.local`

## Deployment

### Supabase Setup

1. Create a project in Supabase
2. Apply the database schema using Prisma
3. Configure RLS policies
4. Set up authentication providers

### Vercel Deployment

1. Push the repository to GitHub
2. Import the project into Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Troubleshooting Common Vercel Deployment Issues:**

- **Prisma Client Error**: The build script now includes `prisma generate` to ensure the Prisma client is generated during build
- **ESLint Errors**: Simplified ESLint configuration to use Next.js defaults and avoid dependency conflicts
- **Dependency Conflicts**: Added `.npmrc` and `--legacy-peer-deps` to handle peer dependency conflicts
- **Environment Variables**: Make sure all required environment variables are set in Vercel dashboard
- **Database Connection**: Ensure your Supabase database is accessible from Vercel's servers

### Testing

- Use the seeded test user for authentication testing:
  - Email: `test@example.com`
  - Password: `password123`
- Use Stripe's test keys for payment testing
- Test all endpoints with proper authentication using JWT tokens
- Run `npm run db:seed` to reset database with sample data

## Development Notes

- **Real-Time Chat**: Implemented using Supabase Realtime subscriptions on the Message table
- **Payments**: Stripe is used for sandbox testing; adapt to VNPay/ZaloPay by updating the payment service with their APIs
- **Notifications**: The `/notifications` endpoint provides cart item counts for mobile app badge updates
- **Map**: The `/store/location` endpoint returns static or database-stored coordinates for Google Maps integration

## Future Improvements

- Add support for VNPay/ZaloPay for localized payments
- Implement advanced filtering (e.g., by car specifications)
- Add admin APIs for managing products and orders
- Enhance chat with multimedia support (e.g., images)
- Add order tracking and status updates
- Implement inventory management
- Add user profile management
- Implement push notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

For questions or support, contact [trandinhhung717@gmail.com] or open an issue on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
