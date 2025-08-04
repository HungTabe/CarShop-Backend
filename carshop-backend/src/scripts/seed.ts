import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  // Clear existing data
  await prisma.cartItem.deleteMany()
  await prisma.user.deleteMany()
  await prisma.product.deleteMany()

  // Create sample user
  const user = await prisma.user.create({
    data: {
      authId: 'local_sample_user',
      email: 'test@example.com',
      password: hashedPassword,
      username: 'testuser',
      phone: '+1234567890',
      address: '123 Test Street, Test City',
    },
  })

  console.log(`✅ Created sample user: ${user.email}`)

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
        'https://static.wixstatic.com/media/b4dcef_c841d8cb9f6b4dbfabbf40ed29333abe~mv2.png/v1/fill/w_1000,h_600,al_c,q_90,usm_0.66_1.00_0.01/b4dcef_c841d8cb9f6b4dbfabbf40ed29333abe~mv2.png',
        'https://static.wixstatic.com/media/b4dcef_81f089da46a04ad1a5a84aad35095de9~mv2.png/v1/fill/w_568,h_378,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/b4dcef_81f089da46a04ad1a5a84aad35095de9~mv2.png',
        'https://banxemoi.com.vn/wp-content/uploads/2022/01/ban-xe-toyota-camry-2-5Q-2023-moi-mau-trang.jpg'
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNrr0aONbF8gdtpRGXM2dswAIUPPk53H1heN5pWoQQ-l-ST8epnouVV4wRiml4C8RlfxE&usqp=CAU',
        'https://cdn2.tuoitre.vn/thumb_w/1200/2022/7/14/honda-civic-type-r-2023-16577931498511853203114-crop-16577931605511897210137.jpg'
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVZt8IIA-5moG10jH1u7Ki2XftaAqr1FxaMd4aWgAa8otHhyAi7yB_sltOvlLZ7VpaeKM&usqp=CAU',
        'https://s3.ecompletocarros.dev/images/lojas/285/veiculos/107652/veiculoInfoVeiculoImagesMobile/vehicle_image_1657742771_d41d8cd98f00b204e9800998ecf8427e.jpeg',
        'https://hips.hearstapps.com/hmg-prod/images/2021-ford-mustang-mach-1-106-1622135359.jpg?crop=0.698xw:0.640xh;0.231xw,0.316xh&resize=980:*'
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuZXf6l_WzWbvqVRZsPTnAnY5yfZ7-JKwVMA&s',
        'https://www.topgear.com/sites/default/files/2022/09/1-BMW-3-Series.jpg'
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
        'https://images.prismic.io/carwow/aCxkIidWJ-7kSVx9_TeslaModel32025exteriorfrontthreequarterviewdriving.jpg?auto=format&cs=tinysrgb&fit=max&q=60',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7HegqLCd7BronUBwgU1_ECJcH_bTnKjzZsQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLGUnLEVANOboWGhX6FFVBkSJpqoHNL8LJMg&s'
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
        'https://langha-mercedes.com.vn/wp-content/uploads/2023/05/Mercedes-benz-c-class-moi.jpg',
        'https://editorial.pxcrush.net/carsales/general/editorial/mercedes-benz-c-300-214.jpg?width=1024&height=682'
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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-QMbLYkDCuYzP3MjGuJxi2VHZJDQ9Wq5nMq7Jrm10V_jXG6b6eAdPA7ETNxQSHYTcnEc&usqp=CAU',
        'https://autotraderau-res.cloudinary.com/image/upload/e_trim:10,f_auto/c_scale,t_cg_base,w_345/glasses/zIzVwMEM.jpg'
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
        'https://lexuscentersaigon.com/wp-content/uploads/2023/09/gia-xe-lexus-es250-2023.jpeg',
        'https://files01.danhgiaxe.com/2s-pQXFdMpF9pFYpoPn4ANBb218=/fit-in/1280x0/20221115/6-115449.jpg'
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
        'https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/86IMIVGAR3DRAsZGaevdjZVEEsBUaGnc6ts6BPNA.jpg',
        'https://di-uploads-pod27.dealerinspire.com/volkswagenfortwaltonbeach/uploads/2022/10/mlp-img-perf-2023-golf-gti.jpg'
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
        'https://files01.danhgiaxe.com/e7r9q0zcgwpix1jMy6GTXDTgYYI=/fit-in/1200x0/20221217/2023-subaru-outback-1658094385-1-103111.jpeg',
        'https://autopro8.mediacdn.vn/134505113543774208/2023/6/28/1687911110-347258215758624649055366950570828383718792n-1687913798886-168791379898946333648.jpg'
      ],
      inStock: true,
    },
  ]

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log(`✅ Created ${products.length} products`)
  console.log('🎉 Database seeding completed!')
  console.log('\n📝 Test credentials:')
  console.log('Email: test@example.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 