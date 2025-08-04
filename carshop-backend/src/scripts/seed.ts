import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Sample car products
  const products = [
    {
      name: 'Toyota Camry 2023',
      description: 'Reliable sedan with excellent fuel economy and safety features',
      price: 25000.00,
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '2.5L',
      color: 'White',
      imageUrls: [
        'https://example.com/camry-1.jpg',
        'https://example.com/camry-2.jpg',
        'https://example.com/camry-3.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Honda Civic 2023',
      description: 'Sporty compact car with great handling and modern technology',
      price: 22000.00,
      brand: 'Honda',
      model: 'Civic',
      year: 2023,
      mileage: 12000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '1.5L Turbo',
      color: 'Blue',
      imageUrls: [
        'https://example.com/civic-1.jpg',
        'https://example.com/civic-2.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Ford Mustang 2023',
      description: 'Iconic muscle car with powerful performance and classic styling',
      price: 45000.00,
      brand: 'Ford',
      model: 'Mustang',
      year: 2023,
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      engineSize: '5.0L V8',
      color: 'Red',
      imageUrls: [
        'https://example.com/mustang-1.jpg',
        'https://example.com/mustang-2.jpg',
        'https://example.com/mustang-3.jpg'
      ],
      inStock: true,
    },
    {
      name: 'BMW 3 Series 2023',
      description: 'Luxury sedan with premium features and excellent driving dynamics',
      price: 55000.00,
      brand: 'BMW',
      model: '3 Series',
      year: 2023,
      mileage: 5000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '2.0L Turbo',
      color: 'Black',
      imageUrls: [
        'https://example.com/bmw3-1.jpg',
        'https://example.com/bmw3-2.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Tesla Model 3 2023',
      description: 'Electric vehicle with cutting-edge technology and instant acceleration',
      price: 42000.00,
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      mileage: 3000,
      fuelType: 'Electric',
      transmission: 'Single-speed',
      engineSize: 'Dual Motor',
      color: 'Silver',
      imageUrls: [
        'https://example.com/tesla3-1.jpg',
        'https://example.com/tesla3-2.jpg',
        'https://example.com/tesla3-3.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Mercedes-Benz C-Class 2023',
      description: 'Premium luxury sedan with sophisticated design and advanced features',
      price: 48000.00,
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2023,
      mileage: 7000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '2.0L Turbo',
      color: 'White',
      imageUrls: [
        'https://example.com/mercedes-c-1.jpg',
        'https://example.com/mercedes-c-2.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Audi A4 2023',
      description: 'Sporty luxury sedan with quattro all-wheel drive and premium interior',
      price: 46000.00,
      brand: 'Audi',
      model: 'A4',
      year: 2023,
      mileage: 6000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '2.0L Turbo',
      color: 'Gray',
      imageUrls: [
        'https://example.com/audi-a4-1.jpg',
        'https://example.com/audi-a4-2.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Lexus ES 2023',
      description: 'Comfortable luxury sedan with exceptional reliability and smooth ride',
      price: 44000.00,
      brand: 'Lexus',
      model: 'ES',
      year: 2023,
      mileage: 4000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '2.5L',
      color: 'Black',
      imageUrls: [
        'https://example.com/lexus-es-1.jpg',
        'https://example.com/lexus-es-2.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Volkswagen Golf GTI 2023',
      description: 'Hot hatch with sporty performance and practical daily usability',
      price: 32000.00,
      brand: 'Volkswagen',
      model: 'Golf GTI',
      year: 2023,
      mileage: 9000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      engineSize: '2.0L Turbo',
      color: 'Red',
      imageUrls: [
        'https://example.com/golf-gti-1.jpg',
        'https://example.com/golf-gti-2.jpg'
      ],
      inStock: true,
    },
    {
      name: 'Subaru Outback 2023',
      description: 'Versatile crossover with all-wheel drive and excellent safety ratings',
      price: 38000.00,
      brand: 'Subaru',
      model: 'Outback',
      year: 2023,
      mileage: 11000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      engineSize: '2.5L',
      color: 'Green',
      imageUrls: [
        'https://example.com/outback-1.jpg',
        'https://example.com/outback-2.jpg'
      ],
      inStock: true,
    },
  ]

  // Clear existing products
  await prisma.product.deleteMany()

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log(`✅ Created ${products.length} products`)
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 