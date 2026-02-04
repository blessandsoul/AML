import {
  PrismaClient,
  UserRole,
  BlogPostStatus,
  OrderStatus,
  CompletedDealPhotoType,
} from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

// Helper to generate random tracking code
function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AML-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to generate order number
function generateOrderNumber(index: number): string {
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(index).padStart(5, '0')}`;
}

// Helper to create slug from title
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function main() {
  console.log('[SEED] Starting database seed...\n');

  // ============================================
  // USERS
  // ============================================
  console.log('[USERS] Creating users...');

  const adminPassword = await argon2.hash('Admin123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aml.ge' },
    update: {},
    create: {
      email: 'admin@aml.ge',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log(`  [OK] Admin: ${admin.email}`);

  const userPassword = await argon2.hash('User1234!');
  const user = await prisma.user.upsert({
    where: { email: 'user@aml.ge' },
    update: {},
    create: {
      email: 'user@aml.ge',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      isActive: true,
    },
  });
  console.log(`  [OK] User: ${user.email}`);

  // ============================================
  // BLOG CATEGORIES
  // ============================================
  console.log('\n[BLOG] Creating categories...');

  const categories = [
    {
      name: 'Buying Guide',
      slug: 'buying-guide',
      description: 'Tips and guides for buying cars from US auctions',
      color: '#3B82F6',
    },
    {
      name: 'Import Process',
      slug: 'import-process',
      description: 'Everything about the car import process to Georgia',
      color: '#10B981',
    },
    {
      name: 'Market Analysis',
      slug: 'market-analysis',
      description: 'Current trends and analysis of the car market',
      color: '#8B5CF6',
    },
    {
      name: 'Maintenance',
      slug: 'maintenance',
      description: 'Car care and maintenance tips',
      color: '#F59E0B',
    },
    {
      name: 'News',
      slug: 'news',
      description: 'Latest news about auto auctions and imports',
      color: '#EF4444',
    },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories.push(category);
    console.log(`  [OK] Category: ${category.name}`);
  }

  // ============================================
  // BLOG TAGS
  // ============================================
  console.log('\n[BLOG] Creating tags...');

  const tags = [
    { name: 'Copart', slug: 'copart' },
    { name: 'IAAI', slug: 'iaai' },
    { name: 'Salvage', slug: 'salvage' },
    { name: 'Clean Title', slug: 'clean-title' },
    { name: 'Shipping', slug: 'shipping' },
    { name: 'Customs', slug: 'customs' },
    { name: 'Insurance', slug: 'insurance' },
    { name: 'BMW', slug: 'bmw' },
    { name: 'Mercedes', slug: 'mercedes' },
    { name: 'Toyota', slug: 'toyota' },
  ];

  const createdTags = [];
  for (const tag of tags) {
    const created = await prisma.blogTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    createdTags.push(created);
    console.log(`  [OK] Tag: ${created.name}`);
  }

  // ============================================
  // BLOG POSTS
  // ============================================
  console.log('\n[BLOG] Creating posts...');

  const posts = [
    {
      title: 'Complete Guide to Buying Cars from Copart',
      content: `
# Complete Guide to Buying Cars from Copart

Copart is one of the largest online vehicle auction platforms in the United States. Here's everything you need to know about buying cars from Copart.

## What is Copart?

Copart operates over 200 locations across the US and sells a wide variety of vehicles including clean title, salvage, and insurance vehicles.

## How to Get Started

1. **Create an Account** - Register on Copart.com
2. **Get a Deposit** - You'll need to make a deposit to bid
3. **Browse Vehicles** - Search by make, model, year, damage type, etc.
4. **Place Bids** - You can bid in advance or during live auctions

## Tips for Success

- Always check the vehicle history report
- Review all photos carefully
- Understand the damage codes
- Factor in shipping and repair costs

## Conclusion

With proper research and patience, you can find excellent deals on Copart.
      `.trim(),
      excerpt: 'Learn everything about buying cars from Copart auctions, from registration to winning bids.',
      featuredImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
      status: BlogPostStatus.PUBLISHED,
      authorName: 'Admin',
      authorBio: 'Car import specialist with 10+ years of experience',
      publishedAt: new Date('2024-01-15'),
      viewCount: 1250,
      readingTime: 8,
      categoryId: createdCategories[0].id,
      authorId: admin.id,
      tagIds: [createdTags[0].id, createdTags[2].id, createdTags[4].id],
    },
    {
      title: 'Understanding Salvage Titles: What You Need to Know',
      content: `
# Understanding Salvage Titles

A salvage title is issued when an insurance company declares a vehicle a total loss. But does that mean the car is worthless? Not necessarily.

## Types of Damage

- **Collision Damage** - Impact from accidents
- **Flood Damage** - Water exposure
- **Theft Recovery** - Stolen vehicles found later
- **Vandalism** - Intentional damage

## Is It Worth Buying?

Many salvage vehicles can be repaired and provide excellent value. The key is understanding:

- The extent of damage
- Repair costs
- Resale value after repair

## Our Recommendations

Work with experienced mechanics and get detailed inspections before purchasing.
      `.trim(),
      excerpt: 'Everything you need to know about salvage titles and whether buying salvage cars is right for you.',
      featuredImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      status: BlogPostStatus.PUBLISHED,
      authorName: 'Admin',
      publishedAt: new Date('2024-02-01'),
      viewCount: 980,
      readingTime: 6,
      categoryId: createdCategories[0].id,
      authorId: admin.id,
      tagIds: [createdTags[2].id, createdTags[6].id],
    },
    {
      title: 'Car Import Process to Georgia: Step by Step',
      content: `
# Car Import Process to Georgia

Importing a car from the USA to Georgia involves several steps. Here's your complete guide.

## Step 1: Purchase the Vehicle

Buy from Copart, IAAI, or other US auctions.

## Step 2: Shipping to Port

The vehicle is transported to a US port (usually Savannah or New Jersey).

## Step 3: Ocean Freight

Ships typically take 4-6 weeks to reach Poti or Batumi.

## Step 4: Customs Clearance

Complete documentation and pay applicable duties.

## Step 5: Registration

Register your vehicle with the Georgian authorities.

## Timeline

The entire process typically takes 6-10 weeks from purchase to registration.
      `.trim(),
      excerpt: 'A comprehensive guide to importing your car from the USA to Georgia.',
      featuredImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
      status: BlogPostStatus.PUBLISHED,
      authorName: 'Admin',
      publishedAt: new Date('2024-02-15'),
      viewCount: 2100,
      readingTime: 10,
      categoryId: createdCategories[1].id,
      authorId: admin.id,
      tagIds: [createdTags[4].id, createdTags[5].id],
    },
    {
      title: '2024 Best Cars to Import from US Auctions',
      content: `
# 2024 Best Cars to Import

Here are our top picks for the best value cars to import in 2024.

## Best Sedans

1. Toyota Camry 2019-2022
2. Honda Accord 2018-2021
3. BMW 3 Series 2017-2020

## Best SUVs

1. Toyota RAV4 2018-2021
2. Honda CR-V 2019-2022
3. BMW X3 2018-2020

## Best Luxury

1. Mercedes E-Class 2017-2020
2. BMW 5 Series 2018-2021
3. Audi A6 2019-2021

## Why These Cars?

These vehicles offer the best combination of:
- Availability at auctions
- Repair part availability
- Resale value in Georgia
      `.trim(),
      excerpt: 'Our expert picks for the best cars to import from US auctions in 2024.',
      featuredImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      status: BlogPostStatus.PUBLISHED,
      authorName: 'Admin',
      publishedAt: new Date('2024-03-01'),
      viewCount: 1800,
      readingTime: 7,
      categoryId: createdCategories[2].id,
      authorId: admin.id,
      tagIds: [createdTags[7].id, createdTags[8].id, createdTags[9].id],
    },
    {
      title: 'Upcoming Changes to Georgian Import Regulations',
      content: `
# Upcoming Import Regulation Changes

Important updates about car import regulations in Georgia for 2024.

## New Emission Standards

Starting Q3 2024, stricter emission standards will apply to imported vehicles.

## Documentation Changes

New requirements for vehicle history documentation.

## Impact on Pricing

How these changes might affect import costs.

*This article is a draft and will be updated with confirmed information.*
      `.trim(),
      excerpt: 'Stay informed about upcoming changes to car import regulations in Georgia.',
      status: BlogPostStatus.DRAFT,
      authorName: 'Admin',
      viewCount: 0,
      readingTime: 5,
      categoryId: createdCategories[4].id,
      authorId: admin.id,
      tagIds: [createdTags[5].id],
    },
    {
      title: 'IAAI vs Copart: Which Auction is Better?',
      content: `
# IAAI vs Copart Comparison

Both IAAI and Copart are major US auto auction platforms. Let's compare them.

## Vehicle Selection

Copart generally has more vehicles, but IAAI often has better clean title options.

## Fees

Both have similar fee structures, but there are differences in:
- Buyer fees
- Transaction fees
- Storage fees

## Bidding Process

- Copart uses VB2 (Virtual Bidding)
- IAAI uses ACV Auctions platform

## Our Verdict

Both platforms are excellent. Your choice should depend on:
- Available vehicles
- Location of yards
- Personal preference
      `.trim(),
      excerpt: 'A detailed comparison of IAAI and Copart auto auctions to help you choose.',
      featuredImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      status: BlogPostStatus.PUBLISHED,
      authorName: 'Admin',
      publishedAt: new Date('2024-03-15'),
      viewCount: 1450,
      readingTime: 6,
      categoryId: createdCategories[0].id,
      authorId: admin.id,
      tagIds: [createdTags[0].id, createdTags[1].id],
    },
  ];

  for (const post of posts) {
    const { tagIds, ...postData } = post;
    const slug = slugify(post.title);

    const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existingPost) {
      const createdPost = await prisma.blogPost.create({
        data: {
          ...postData,
          slug,
          tags: {
            create: tagIds.map(tagId => ({ tagId })),
          },
        },
      });
      console.log(`  [OK] Post: ${createdPost.title.substring(0, 40)}...`);
    } else {
      console.log(`  [SKIP] Post exists: ${slug}`);
    }
  }

  // ============================================
  // ORDERS
  // ============================================
  console.log('\n[ORDERS] Creating orders...');

  const orders = [
    {
      carMake: 'BMW',
      carModel: '330i',
      carYear: 2021,
      carVin: 'WBA5R1C55M5K12345',
      carColor: 'Alpine White',
      auctionPrice: 18500,
      shippingCost: 2200,
      totalPrice: 20700,
      customerName: 'Giorgi Beridze',
      customerPhone: '+995 555 123 456',
      customerEmail: 'giorgi@example.com',
      status: OrderStatus.DELIVERED,
      currentStage: 5,
      auctionSource: 'Copart',
      lotNumber: '54321678',
      originPort: 'Savannah, GA',
      destinationPort: 'Poti',
      vesselName: 'MSC Regina',
    },
    {
      carMake: 'Mercedes-Benz',
      carModel: 'E300',
      carYear: 2020,
      carVin: 'WDDZF4JB5LA123456',
      carColor: 'Obsidian Black',
      auctionPrice: 24000,
      shippingCost: 2400,
      totalPrice: 26400,
      customerName: 'Nino Kapanadze',
      customerPhone: '+995 599 234 567',
      customerEmail: 'nino@example.com',
      status: OrderStatus.PORT,
      currentStage: 4,
      auctionSource: 'IAAI',
      lotNumber: '34567891',
      originPort: 'Newark, NJ',
      destinationPort: 'Batumi',
      vesselName: 'Maersk Sealand',
      estimatedArrival: new Date('2024-04-15'),
    },
    {
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: 2022,
      carVin: '4T1BZ1HK7NU123456',
      carColor: 'Celestial Silver',
      auctionPrice: 16500,
      shippingCost: 2100,
      totalPrice: 18600,
      customerName: 'Davit Gogichaishvili',
      customerPhone: '+995 577 345 678',
      status: OrderStatus.SHIPPING,
      currentStage: 3,
      auctionSource: 'Copart',
      lotNumber: '45678912',
      originPort: 'Savannah, GA',
      destinationPort: 'Poti',
      vesselName: 'CMA CGM Adriatic',
      estimatedArrival: new Date('2024-04-25'),
    },
    {
      carMake: 'Honda',
      carModel: 'Accord',
      carYear: 2021,
      carVin: '1HGCV1F31MA123456',
      carColor: 'Modern Steel',
      auctionPrice: 15800,
      shippingCost: 2000,
      totalPrice: 17800,
      customerName: 'Tamar Lomidze',
      customerPhone: '+995 591 456 789',
      customerEmail: 'tamar@example.com',
      status: OrderStatus.PAID,
      currentStage: 2,
      auctionSource: 'IAAI',
      lotNumber: '56789123',
    },
    {
      carMake: 'BMW',
      carModel: 'X3',
      carYear: 2020,
      carVin: '5UXTY5C05L9123456',
      carColor: 'Phytonic Blue',
      auctionPrice: 22000,
      shippingCost: 2500,
      totalPrice: 24500,
      customerName: 'Levan Chikovani',
      customerPhone: '+995 558 567 890',
      status: OrderStatus.WON,
      currentStage: 1,
      auctionSource: 'Copart',
      lotNumber: '67891234',
    },
    {
      carMake: 'Lexus',
      carModel: 'ES350',
      carYear: 2021,
      carVin: '58ABK1GG5MU123456',
      carColor: 'Eminent White',
      auctionPrice: 26500,
      shippingCost: 2300,
      totalPrice: 28800,
      customerName: 'Ana Tsereteli',
      customerPhone: '+995 593 678 901',
      customerEmail: 'ana@example.com',
      status: OrderStatus.DELIVERED,
      currentStage: 5,
      auctionSource: 'Copart',
      lotNumber: '78912345',
      originPort: 'Savannah, GA',
      destinationPort: 'Poti',
      vesselName: 'MSC Pamela',
    },
  ];

  for (let i = 0; i < orders.length; i++) {
    const orderData = orders[i];
    const orderNumber = generateOrderNumber(i + 1);
    const trackingCode = generateTrackingCode();

    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderNumber,
        trackingCode,
        auctionPrice: orderData.auctionPrice,
        shippingCost: orderData.shippingCost,
        totalPrice: orderData.totalPrice,
      },
    });

    // Create status history
    const statuses: OrderStatus[] = ['WON', 'PAID', 'SHIPPING', 'PORT', 'DELIVERED'];
    const currentStageIndex = orderData.currentStage;

    for (let stage = 1; stage <= currentStageIndex; stage++) {
      await prisma.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: statuses[stage - 1],
          stage,
          note: `Order ${statuses[stage - 1].toLowerCase()}`,
          changedBy: 'System',
          createdAt: new Date(Date.now() - (currentStageIndex - stage) * 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    console.log(`  [OK] Order: ${order.orderNumber} - ${order.carMake} ${order.carModel}`);
  }

  // ============================================
  // REVIEWS
  // ============================================
  console.log('\n[REVIEWS] Creating reviews...');

  const reviews = [
    {
      customerName: 'Giorgi M.',
      customerCity: 'Tbilisi',
      rating: 5,
      text: 'Excellent service! My BMW arrived exactly as described. The team was very professional and kept me updated throughout the entire process. Highly recommended!',
      carMake: 'BMW',
      carModel: '530i',
      carYear: 2020,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400'],
    },
    {
      customerName: 'Nino K.',
      customerCity: 'Batumi',
      rating: 5,
      text: 'Second car I bought through AML. Fast, reliable, and honest. The whole import process was smooth and hassle-free.',
      carMake: 'Mercedes-Benz',
      carModel: 'C300',
      carYear: 2019,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400'],
    },
    {
      customerName: 'Davit G.',
      customerCity: 'Kutaisi',
      rating: 4,
      text: 'Good experience overall. Shipping took a bit longer than expected but communication was great. Car was in better condition than I anticipated.',
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: 2021,
      isVerified: true,
    },
    {
      customerName: 'Tamar L.',
      customerCity: 'Tbilisi',
      rating: 5,
      text: 'Amazing team! They helped me find the perfect car within my budget. The tracking system is very convenient.',
      carMake: 'Lexus',
      carModel: 'RX350',
      carYear: 2020,
      isVerified: true,
      photos: [
        'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400',
        'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=400',
      ],
    },
    {
      customerName: 'Levan C.',
      customerCity: 'Rustavi',
      rating: 5,
      text: 'Professional service from start to finish. Would definitely use again!',
      isVerified: false,
    },
    {
      customerName: 'Ana T.',
      customerCity: 'Tbilisi',
      rating: 4,
      text: 'Very satisfied with my purchase. The car was exactly as shown in the auction photos. Great customer support.',
      carMake: 'Honda',
      carModel: 'Accord',
      carYear: 2021,
      isVerified: true,
    },
    {
      customerName: 'Sandro B.',
      customerCity: 'Gori',
      rating: 5,
      text: 'Best car buying experience ever! They handled everything - auction, shipping, customs. All I had to do was pick up my car.',
      carMake: 'BMW',
      carModel: 'X5',
      carYear: 2019,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    },
    {
      customerName: 'Mariam J.',
      customerCity: 'Zugdidi',
      rating: 5,
      text: 'Transparent pricing, no hidden fees. The car arrived in perfect condition. Thank you!',
      carMake: 'Toyota',
      carModel: 'RAV4',
      carYear: 2020,
      isVerified: true,
    },
    {
      customerName: 'Irakli S.',
      customerCity: 'Tbilisi',
      rating: 4,
      text: 'Good service, reasonable prices. Will recommend to friends.',
      carMake: 'Mazda',
      carModel: 'CX-5',
      carYear: 2021,
      isVerified: false,
    },
    {
      customerName: 'Keti M.',
      customerCity: 'Batumi',
      rating: 5,
      text: 'Third car from AML. Always reliable, always professional. The best in the business!',
      carMake: 'Audi',
      carModel: 'A4',
      carYear: 2020,
      isVerified: true,
      photos: ['https://images.unsplash.com/photo-1606664666983-8bc1a0ed0c2b?w=400'],
    },
  ];

  for (const reviewData of reviews) {
    const { photos, ...data } = reviewData;
    const review = await prisma.review.create({
      data: {
        ...data,
        photos: photos
          ? {
              create: photos.map((url, index) => ({
                url,
                altText: `${data.carMake || 'Car'} photo ${index + 1}`,
                sortOrder: index,
              })),
            }
          : undefined,
      },
    });
    console.log(`  [OK] Review: ${review.customerName} - ${review.rating} stars`);
  }

  // ============================================
  // COMPLETED DEALS
  // ============================================
  console.log('\n[DEALS] Creating completed deals...');

  const deals = [
    {
      carMake: 'BMW',
      carModel: '330i',
      carYear: 2021,
      carVin: 'WBA5R1C55M5K99999',
      auctionPrice: 18500,
      marketPrice: 32000,
      savings: 13500,
      deliveryCity: 'Tbilisi',
      description: 'Clean title, minor front damage repaired. Perfect condition after restoration.',
      photos: [
        { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600', type: 'AFTER' },
        { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600', type: 'BEFORE' },
      ],
    },
    {
      carMake: 'Mercedes-Benz',
      carModel: 'E300',
      carYear: 2020,
      auctionPrice: 24000,
      marketPrice: 42000,
      savings: 18000,
      deliveryCity: 'Batumi',
      description: 'Salvage title, rear collision repaired professionally. Like new condition.',
      photos: [
        { url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600', type: 'AFTER' },
      ],
    },
    {
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: 2022,
      auctionPrice: 16500,
      marketPrice: 28000,
      savings: 11500,
      deliveryCity: 'Kutaisi',
      description: 'Clean title, minor hail damage. Excellent value!',
      photos: [
        { url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600', type: 'AFTER' },
      ],
    },
    {
      carMake: 'Lexus',
      carModel: 'ES350',
      carYear: 2021,
      auctionPrice: 26500,
      marketPrice: 45000,
      savings: 18500,
      deliveryCity: 'Tbilisi',
      description: 'Insurance claim for theft recovery. No damage, all original parts.',
      photos: [
        { url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600', type: 'AFTER' },
      ],
    },
    {
      carMake: 'BMW',
      carModel: 'X3',
      carYear: 2020,
      auctionPrice: 22000,
      marketPrice: 38000,
      savings: 16000,
      deliveryCity: 'Rustavi',
      description: 'Salvage title, side impact repaired. Premium package with all features.',
      photos: [
        { url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600', type: 'AFTER' },
        { url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600', type: 'BEFORE' },
      ],
    },
    {
      carMake: 'Honda',
      carModel: 'Accord',
      carYear: 2021,
      auctionPrice: 15800,
      marketPrice: 27000,
      savings: 11200,
      deliveryCity: 'Tbilisi',
      description: 'Clean title, minor front bumper damage. Sport edition.',
    },
  ];

  for (const dealData of deals) {
    const { photos, ...data } = dealData;
    const deal = await prisma.completedDeal.create({
      data: {
        ...data,
        photos: photos
          ? {
              create: photos.map((photo, index) => ({
                url: photo.url,
                altText: `${data.carMake} ${data.carModel} ${photo.type.toLowerCase()}`,
                photoType: photo.type as CompletedDealPhotoType,
                sortOrder: index,
              })),
            }
          : undefined,
      },
    });
    console.log(`  [OK] Deal: ${deal.carMake} ${deal.carModel} - Saved $${deal.savings}`);
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('[DONE] Seed completed successfully!');
  console.log('='.repeat(50));
  console.log('\nTest Accounts:');
  console.log('  Admin: admin@aml.ge / Admin123!');
  console.log('  User:  user@aml.ge / User1234!');
  console.log('\nCreated:');
  console.log(`  - ${categories.length} blog categories`);
  console.log(`  - ${tags.length} blog tags`);
  console.log(`  - ${posts.length} blog posts`);
  console.log(`  - ${orders.length} orders`);
  console.log(`  - ${reviews.length} reviews`);
  console.log(`  - ${deals.length} completed deals`);
}

main()
  .catch((e) => {
    console.error('[ERROR] Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
