
# CarShop Backend

## Project Overview
CarShop Backend is a RESTful API built with **Next.js** and **Supabase (PostgreSQL)** to power a mobile application for purchasing cars. The backend supports user authentication, product browsing, cart management, secure payments, real-time chat, store location mapping, and cart notifications. It is designed to be scalable, secure, and integrated with Supabase for authentication and real-time features, using Prisma as the ORM for database interactions.

### Features
- **Authentication**: User signup and login with secure credential management via Supabase Auth.
- **Product Listing**: Fetch, sort, and filter car products with detailed views.
- **Cart Management**: Add, update, remove, and view cart items with dynamic total calculation.
- **Billing**: Process payments using Stripe (sandbox mode; adaptable to VNPay/ZaloPay).
- **Notifications**: Provide cart item count for badge updates on the mobile app.
- **Map Integration**: Expose store location data for Google Maps display.
- **Real-Time Chat**: Enable users to communicate with store representatives using Supabase’s real-time subscriptions.

## Tech Stack
- **Framework**: Next.js (App Router, TypeScript)
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
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/carshop-backend.git
   cd carshop-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory with the following:
   ```
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"
   STRIPE_SECRET_KEY="sk_test_..."
   ```
   - Obtain `DATABASE_URL` and Supabase keys from the Supabase dashboard.
   - Get `STRIPE_SECRET_KEY` from Stripe’s dashboard (test mode).

4. **Set Up Database**:
   - Define the schema in `prisma/schema.prisma` (see [Database Schema](#database-schema)).
   - Apply the schema to Supabase:
     ```bash
     npx prisma db push
     ```
   - Enable Row-Level Security (RLS) in Supabase for tables (`User`, `CartItem`, `Order`, etc.) with policies like:
     ```sql
     CREATE POLICY user_cart_access ON "CartItem" USING (user_id = auth.uid());
     ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

6. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000/api`.

## Database Schema
The database is managed by PostgreSQL via Supabase, with the following key tables:
- **User**: Stores user data (email, username, phone, address) linked to Supabase’s `auth.users` via `authId`.
- **Product**: Contains car details (name, price, image URLs, brand, model, specs, etc.).
- **CartItem**: Tracks products in a user’s cart with quantities.
- **Order**: Records purchases with billing/shipping info and status (PENDING, PAID, etc.).
- **OrderItem**: Links products to orders with purchase-time prices.
- **Payment**: Logs Stripe payment details.
- **Message**: Stores chat messages for real-time communication.

See `prisma/schema.prisma` for the full schema.

## API Endpoints
All endpoints are prefixed with `/api`.

| **Endpoint**            | **Method** | **Description**                              | **Authentication** |
|-------------------------|------------|----------------------------------------------|--------------------|
| `/auth/signup`          | POST       | Register a new user                          | None               |
| `/auth/login`           | POST       | Log in an existing user                      | None               |
| `/products`             | GET        | Fetch products with sorting/filtering        | None               |
| `/products/[id]`        | GET        | Get detailed product information             | None               |
| `/cart`                 | GET        | View user’s cart                             | JWT (Supabase)     |
| `/cart`                 | POST       | Add item to cart                             | JWT                |
| `/cart`                 | PUT        | Update cart item quantity                    | JWT                |
| `/cart`                 | DELETE     | Remove item or clear cart                    | JWT                |
| `/billing`              | POST       | Process payment and create order             | JWT                |
| `/notifications`        | GET        | Get cart item count for badge                | JWT                |
| `/store/location`       | GET        | Get store location for map display           | None               |
| `/chat`                 | GET/POST   | Fetch or send chat messages                  | JWT                |

### Example Request (Add to Cart)
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Authorization: Bearer <supabase-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"productId": "uuid", "quantity": 1}'
```

## Security
- **Authentication**: Supabase Auth handles user credentials and JWT issuance.
- **Row-Level Security**: Enabled in Supabase to restrict data access (e.g., users only see their own cart).
- **Input Validation**: Zod validates API request bodies.
- **Environment Variables**: Sensitive data (e.g., Stripe keys) stored securely in `.env.local`.

## Deployment
1. **Supabase**: Create a project, apply the schema, and configure RLS policies.
2. **Vercel**:
   - Push the repository to GitHub.
   - Import the project into Vercel, set environment variables, and deploy.
3. **Testing**: Use Supabase’s sandbox and Stripe’s test keys for development.

## Development Notes
- **Real-Time Chat**: Implemented using Supabase Realtime subscriptions on the `Message` table.
- **Payments**: Stripe is used for sandbox testing; adapt to VNPay/ZaloPay by updating the `paymentService.ts` with their APIs.
- **Notifications**: The `/notifications` endpoint provides cart item counts for mobile app badge updates (integrate with `NotificationCompat` on Android).
- **Map**: The `/store/location` endpoint returns static or database-stored coordinates for Google Maps integration.

## Future Improvements
- Add support for VNPay/ZaloPay for localized payments.
- Implement advanced filtering (e.g., by car specifications).
- Add admin APIs for managing products and orders.
- Enhance chat with multimedia support (e.g., images).

## Contributing
- Submit issues or pull requests to the GitHub repository.
- Follow the coding style (TypeScript, ESLint) and include tests for new features.


---

## Contact
For questions or support, contact [trandinhhung717@gmail.com] or open an issue on GitHub.

---
