import { z } from 'zod'

// User schemas
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Product schemas
export const productQuerySchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'created_at']).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.string().optional().transform(val => parseFloat(val || '0')),
  maxPrice: z.string().optional().transform(val => parseFloat(val || '999999')),
})

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
})

export const updateCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
})

// Billing schemas
export const billingSchema = z.object({
  cartItemIds: z.array(z.string()),
  billingAddress: z.string(),
  shippingAddress: z.string(),
})

// Chat schemas
export const messageSchema = z.object({
  content: z.string().min(1),
})

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  brand: string
  model: string
  year?: number
  mileage?: number
  fuelType?: string
  transmission?: string
  engineSize?: string
  color?: string
  imageUrls: string[]
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  product: Product
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  billingAddress: string
  shippingAddress: string
  paymentIntentId?: string
  orderItems: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: Product
  createdAt: Date
}

export interface Message {
  id: string
  userId: string
  content: string
  isFromUser: boolean
  createdAt: Date
}

export interface StoreLocation {
  latitude: number
  longitude: number
  address: string
}

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProductQueryInput = z.infer<typeof productQuerySchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartInput = z.infer<typeof updateCartSchema>
export type BillingInput = z.infer<typeof billingSchema>
export type MessageInput = z.infer<typeof messageSchema> 