import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>CarShop Backend API</h1>
        <p className={styles.description}>
          RESTful API for car purchasing mobile application
        </p>

        <div className={styles.section}>
          <h2>Features</h2>
          <ul>
            <li>🔐 User Authentication (Supabase Auth)</li>
            <li>🚗 Product Browsing & Filtering</li>
            <li>🛒 Cart Management</li>
            <li>💳 Secure Payments (Stripe)</li>
            <li>💬 Real-time Chat</li>
            <li>📍 Store Location Mapping</li>
            <li>🔔 Cart Notifications</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>API Endpoints</h2>
          <div className={styles.endpoints}>
            <div className={styles.endpoint}>
              <strong>POST /api/auth/signup</strong> - Register new user
            </div>
            <div className={styles.endpoint}>
              <strong>POST /api/auth/login</strong> - User login
            </div>
            <div className={styles.endpoint}>
              <strong>GET /api/products</strong> - Fetch products with filtering
            </div>
            <div className={styles.endpoint}>
              <strong>GET /api/products/[id]</strong> - Get product details
            </div>
            <div className={styles.endpoint}>
              <strong>GET /api/cart</strong> - View user's cart
            </div>
            <div className={styles.endpoint}>
              <strong>POST /api/cart</strong> - Add item to cart
            </div>
            <div className={styles.endpoint}>
              <strong>PUT /api/cart</strong> - Update cart item
            </div>
            <div className={styles.endpoint}>
              <strong>DELETE /api/cart</strong> - Remove from cart
            </div>
            <div className={styles.endpoint}>
              <strong>POST /api/billing</strong> - Process payment
            </div>
            <div className={styles.endpoint}>
              <strong>GET /api/notifications</strong> - Get cart count
            </div>
            <div className={styles.endpoint}>
              <strong>GET /api/store/location</strong> - Get store location
            </div>
            <div className={styles.endpoint}>
              <strong>GET /api/chat</strong> - Fetch chat messages
            </div>
            <div className={styles.endpoint}>
              <strong>POST /api/chat</strong> - Send message
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Tech Stack</h2>
          <ul>
            <li>Next.js 15 (App Router, TypeScript)</li>
            <li>PostgreSQL (via Supabase)</li>
            <li>Prisma ORM</li>
            <li>Supabase Auth & Realtime</li>
            <li>Stripe Payments</li>
            <li>Zod Validation</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Setup Instructions</h2>
          <ol>
            <li>Copy <code className={styles.code}>env.example</code> to <code className={styles.code}>.env.local</code></li>
            <li>Configure your environment variables</li>
            <li>Run <code className={styles.code}>npm install</code></li>
            <li>Run <code className={styles.code}>npm run db:generate</code></li>
            <li>Run <code className={styles.code}>npm run db:push</code></li>
            <li>Run <code className={styles.code}>npm run dev</code></li>
          </ol>
        </div>

        <div className={styles.section}>
          <h2>Contact</h2>
          <p>For questions or support, contact: trandinhhung717@gmail.com</p>
        </div>
      </main>
    </div>
  )
}
