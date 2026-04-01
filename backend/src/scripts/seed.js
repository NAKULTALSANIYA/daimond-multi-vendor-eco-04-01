import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Address } from '../models/Address.js';
import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Review } from '../models/Review.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { ORDER_STATUS, PAYMENT_STATUS, ROLES } from '../constants/roles.js';

const SALT_ROUNDS = 10;
const SEED_TAG = '[seed-demo]';

// Seed data is namespaced using fixed emails/slugs/SKUs so we can safely re-run.
const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and accessories' },
  { name: 'Clothing', slug: 'clothing', description: 'Men, women, and kids fashion' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, appliances, and décor' },
  { name: 'Books', slug: 'books', description: 'Fiction, non-fiction, and academic books' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and activewear' },
  { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', description: 'Skincare, grooming, and wellness essentials' },
  { name: 'Toys & Games', slug: 'toys-games', description: 'Fun toys, board games, and learning kits' },
  { name: 'Groceries', slug: 'groceries', description: 'Daily essentials, snacks, and pantry products' },
];

const CUSTOMER_USERS = [
  {
    name: 'Rahul Sharma',
    email: 'customer1@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000001001',
    role: ROLES.USER,
  },
  {
    name: 'Priya Nair',
    email: 'customer2@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000001002',
    role: ROLES.USER,
  },
  {
    name: 'Arjun Verma',
    email: 'customer3@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000001003',
    role: ROLES.USER,
  },
];

const VENDOR_USERS = [
  {
    name: 'Tech Store Owner',
    email: 'vendor1@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000002001',
    role: ROLES.VENDOR,
  },
  {
    name: 'Fashion Hub Owner',
    email: 'vendor2@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000002002',
    role: ROLES.VENDOR,
  },
  {
    name: 'Home Essentials Owner',
    email: 'vendor3@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000002003',
    role: ROLES.VENDOR,
  },
  {
    name: 'Book Bazaar Owner',
    email: 'vendor4@seed.nanostack.com',
    password: 'Password@123',
    phone: '9000002004',
    role: ROLES.VENDOR,
  },
];

const VENDOR_PROFILES = [
  {
    storeName: 'Tech Store',
    businessEmail: 'vendor1-biz@seed.nanostack.com',
    businessPhone: '9000002001',
    gstNumber: 'GSTTECH001',
    address: '12, Tech Park, Bengaluru, Karnataka - 560001',
    description: `${SEED_TAG} Your one-stop shop for the latest gadgets and electronics.`,
    approvalStatus: 'APPROVED',
    commissionRate: 8,
  },
  {
    storeName: 'Fashion Hub',
    businessEmail: 'vendor2-biz@seed.nanostack.com',
    businessPhone: '9000002002',
    gstNumber: 'GSTFASH002',
    address: '45, Style Street, Mumbai, Maharashtra - 400001',
    description: `${SEED_TAG} Trendy clothing and accessories for every occasion.`,
    approvalStatus: 'APPROVED',
    commissionRate: 12,
  },
  {
    storeName: 'Home Essentials',
    businessEmail: 'vendor3-biz@seed.nanostack.com',
    businessPhone: '9000002003',
    gstNumber: 'GSTHOME003',
    address: '9, Green Avenue, Pune, Maharashtra - 411001',
    description: `${SEED_TAG} Everyday products for home, kitchen, and lifestyle.`,
    approvalStatus: 'APPROVED',
    commissionRate: 9,
  },
  {
    storeName: 'Book Bazaar',
    businessEmail: 'vendor4-biz@seed.nanostack.com',
    businessPhone: '9000002004',
    gstNumber: 'GSTBOOK004',
    address: '77, Library Road, Jaipur, Rajasthan - 302001',
    description: `${SEED_TAG} Curated books, journals, and learning kits.`,
    approvalStatus: 'APPROVED',
    commissionRate: 7,
  },
];

const buildProducts = (vendorIds, categoryMap) => [
  {
    vendor: vendorIds[0],
    category: categoryMap['electronics'],
    name: 'Gaming Laptop Pro 16',
    slug: 'gaming-laptop-pro-16',
    description: 'High-performance gaming laptop with RTX 4060, 16GB RAM, and 512GB SSD. Ideal for gaming and content creation.',
    price: 85000,
    discountPrice: 74999,
    sku: 'SEED-SKU-LAPTOP-001',
    stock: 15,
    images: [{ url: 'https://placehold.co/600x400?text=Gaming+Laptop', publicId: 'products/gaming-laptop-001' }],
    tags: ['gaming', 'laptop', 'electronics', 'rtx4060'],
    averageRating: 4.5,
    totalReviews: 32,
  },
  {
    vendor: vendorIds[0],
    category: categoryMap['electronics'],
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-noise-cancelling-headphones',
    description: 'Premium over-ear headphones with 40-hour battery life, active noise cancellation, and Hi-Res audio support.',
    price: 12000,
    discountPrice: 9499,
    sku: 'SEED-SKU-HEAD-002',
    stock: 40,
    images: [{ url: 'https://placehold.co/600x400?text=Headphones', publicId: 'products/headphones-002' }],
    tags: ['headphones', 'audio', 'wireless', 'anc'],
    averageRating: 4.7,
    totalReviews: 58,
  },
  {
    vendor: vendorIds[0],
    category: categoryMap['electronics'],
    name: '4K Smart TV 55"',
    slug: '4k-smart-tv-55-inch',
    description: '55-inch 4K UHD Smart TV with Dolby Vision, HDR10+, built-in Android TV, and voice remote.',
    price: 55000,
    discountPrice: 44999,
    sku: 'SEED-SKU-TV-003',
    stock: 10,
    images: [{ url: 'https://placehold.co/600x400?text=Smart+TV', publicId: 'products/smart-tv-003' }],
    tags: ['tv', '4k', 'smart-tv', 'electronics'],
    averageRating: 4.3,
    totalReviews: 21,
  },
  {
    vendor: vendorIds[0],
    category: categoryMap['electronics'],
    name: 'Mechanical Keyboard RGB',
    slug: 'mechanical-keyboard-rgb',
    description: 'TKL mechanical keyboard with Cherry MX Red switches, per-key RGB lighting, and aluminum frame.',
    price: 6500,
    discountPrice: 5199,
    sku: 'SEED-SKU-KB-004',
    stock: 60,
    images: [{ url: 'https://placehold.co/600x400?text=Keyboard', publicId: 'products/keyboard-004' }],
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming'],
    averageRating: 4.6,
    totalReviews: 44,
  },
  {
    vendor: vendorIds[0],
    category: categoryMap['electronics'],
    name: 'Smartphone X12 Pro',
    slug: 'smartphone-x12-pro',
    description: '6.7" AMOLED display, 108MP triple camera, 5000mAh battery, and 5G connectivity.',
    price: 42000,
    discountPrice: 36999,
    sku: 'SEED-SKU-PHONE-005',
    stock: 25,
    images: [{ url: 'https://placehold.co/600x400?text=Smartphone', publicId: 'products/smartphone-005' }],
    tags: ['smartphone', 'mobile', '5g', 'android'],
    averageRating: 4.4,
    totalReviews: 76,
  },

  {
    vendor: vendorIds[1],
    category: categoryMap['clothing'],
    name: 'Men\'s Slim Fit Chinos',
    slug: 'mens-slim-fit-chinos',
    description: 'Classic slim-fit chinos in stretch cotton blend. Available in multiple colors. Machine washable.',
    price: 1800,
    discountPrice: 1399,
    sku: 'SEED-SKU-CHIN-006',
    stock: 120,
    images: [{ url: 'https://placehold.co/600x400?text=Chinos', publicId: 'products/chinos-006' }],
    tags: ['men', 'chinos', 'pants', 'casual'],
    averageRating: 4.2,
    totalReviews: 89,
  },
  {
    vendor: vendorIds[1],
    category: categoryMap['clothing'],
    name: 'Women\'s Floral Kurti',
    slug: 'womens-floral-kurti',
    description: 'Lightweight rayon kurti with floral print. Perfect for casual and semi-formal occasions.',
    price: 1200,
    discountPrice: 899,
    sku: 'SEED-SKU-KURT-007',
    stock: 200,
    images: [{ url: 'https://placehold.co/600x400?text=Kurti', publicId: 'products/kurti-007' }],
    tags: ['women', 'kurti', 'ethnic', 'casual'],
    averageRating: 4.5,
    totalReviews: 143,
  },
  {
    vendor: vendorIds[1],
    category: categoryMap['clothing'],
    name: 'Unisex Hoodie – Classic Fit',
    slug: 'unisex-hoodie-classic-fit',
    description: '300gsm fleece hoodie with kangaroo pocket, ribbed cuffs, and drawstring hood.',
    price: 2500,
    discountPrice: 1999,
    sku: 'SEED-SKU-HOOD-008',
    stock: 80,
    images: [{ url: 'https://placehold.co/600x400?text=Hoodie', publicId: 'products/hoodie-008' }],
    tags: ['hoodie', 'unisex', 'winter', 'casual'],
    averageRating: 4.6,
    totalReviews: 62,
  },
  {
    vendor: vendorIds[1],
    category: categoryMap['sports'],
    name: 'Running Shoes – AirStride V2',
    slug: 'running-shoes-airstride-v2',
    description: 'Lightweight mesh running shoes with cushioned midsole, breathable upper, and non-slip outsole.',
    price: 4500,
    discountPrice: 3499,
    sku: 'SEED-SKU-SHOE-009',
    stock: 55,
    images: [{ url: 'https://placehold.co/600x400?text=Running+Shoes', publicId: 'products/shoes-009' }],
    tags: ['shoes', 'running', 'sports', 'fitness'],
    averageRating: 4.4,
    totalReviews: 37,
  },
  {
    vendor: vendorIds[1],
    category: categoryMap['sports'],
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: '6mm thick eco-friendly TPE yoga mat with non-slip surface, alignment lines, and carry strap.',
    price: 1500,
    discountPrice: 1099,
    sku: 'SEED-SKU-YOGA-010',
    stock: 90,
    images: [{ url: 'https://placehold.co/600x400?text=Yoga+Mat', publicId: 'products/yoga-mat-010' }],
    tags: ['yoga', 'mat', 'fitness', 'sports'],
    averageRating: 4.8,
    totalReviews: 112,
  },
  {
    vendor: vendorIds[2],
    category: categoryMap['home-kitchen'],
    name: 'Non-Stick Cookware Set 5-Piece',
    slug: 'non-stick-cookware-set-5-piece',
    description: 'Durable non-stick cookware set with induction-compatible base and cool-touch handles.',
    price: 5999,
    discountPrice: 4799,
    sku: 'SEED-SKU-COOK-011',
    stock: 70,
    images: [{ url: 'https://placehold.co/600x400?text=Cookware+Set', publicId: 'products/cookware-011' }],
    tags: ['kitchen', 'cookware', 'home'],
    averageRating: 4.3,
    totalReviews: 39,
  },
  {
    vendor: vendorIds[2],
    category: categoryMap['home-kitchen'],
    name: 'Microfiber Bedsheet King Size',
    slug: 'microfiber-bedsheet-king-size',
    description: 'Soft breathable king-size bedsheet with two pillow covers and fade-resistant print.',
    price: 2199,
    discountPrice: 1649,
    sku: 'SEED-SKU-BED-012',
    stock: 95,
    images: [{ url: 'https://placehold.co/600x400?text=Bedsheet', publicId: 'products/bedsheet-012' }],
    tags: ['bedsheet', 'home', 'decor'],
    averageRating: 4.1,
    totalReviews: 26,
  },
  {
    vendor: vendorIds[2],
    category: categoryMap['groceries'],
    name: 'Cold Pressed Mustard Oil 1L',
    slug: 'cold-pressed-mustard-oil-1l',
    description: 'Traditional cold-pressed mustard oil, rich aroma, ideal for Indian cooking.',
    price: 320,
    discountPrice: 289,
    sku: 'SEED-SKU-OIL-013',
    stock: 260,
    images: [{ url: 'https://placehold.co/600x400?text=Mustard+Oil', publicId: 'products/oil-013' }],
    tags: ['groceries', 'oil', 'kitchen'],
    averageRating: 4.4,
    totalReviews: 75,
  },
  {
    vendor: vendorIds[3],
    category: categoryMap['books'],
    name: 'System Design Interview Handbook',
    slug: 'system-design-interview-handbook',
    description: 'Comprehensive guide to scalable architecture, trade-offs, and real-world design patterns.',
    price: 899,
    discountPrice: 749,
    sku: 'SEED-SKU-BOOK-014',
    stock: 130,
    images: [{ url: 'https://placehold.co/600x400?text=System+Design+Book', publicId: 'products/book-014' }],
    tags: ['books', 'tech', 'learning'],
    averageRating: 4.9,
    totalReviews: 180,
  },
  {
    vendor: vendorIds[3],
    category: categoryMap['books'],
    name: 'Children Puzzle Stories Set',
    slug: 'children-puzzle-stories-set',
    description: 'Interactive story and puzzle combo for kids aged 6-10 with colorful illustrations.',
    price: 649,
    discountPrice: 549,
    sku: 'SEED-SKU-BOOK-015',
    stock: 110,
    images: [{ url: 'https://placehold.co/600x400?text=Kids+Stories', publicId: 'products/book-015' }],
    tags: ['books', 'kids', 'puzzles'],
    averageRating: 4.5,
    totalReviews: 54,
  },
  {
    vendor: vendorIds[3],
    category: categoryMap['toys-games'],
    name: 'Family Strategy Board Game',
    slug: 'family-strategy-board-game',
    description: 'Fast-paced strategy board game for 2-6 players, suitable for ages 10 and above.',
    price: 1299,
    discountPrice: 999,
    sku: 'SEED-SKU-GAME-016',
    stock: 85,
    images: [{ url: 'https://placehold.co/600x400?text=Board+Game', publicId: 'products/game-016' }],
    tags: ['boardgame', 'toys', 'family'],
    averageRating: 4.6,
    totalReviews: 41,
  },
];

const ORDER_DEFINITIONS = [
  {
    customerIndex: 0,
    itemIndexes: [0, 5, 10],
    status: ORDER_STATUS.CONFIRMED,
    paymentStatus: PAYMENT_STATUS.PAID,
    paymentMethod: 'RAZORPAY',
  },
  {
    customerIndex: 1,
    itemIndexes: [3, 8, 13],
    status: ORDER_STATUS.SHIPPED,
    paymentStatus: PAYMENT_STATUS.PAID,
    paymentMethod: 'MOCK',
  },
  {
    customerIndex: 2,
    itemIndexes: [1, 11, 15],
    status: ORDER_STATUS.PLACED,
    paymentStatus: PAYMENT_STATUS.PENDING,
    paymentMethod: 'COD',
  },
  {
    customerIndex: 0,
    itemIndexes: [2, 9, 14],
    status: ORDER_STATUS.DELIVERED,
    paymentStatus: PAYMENT_STATUS.PAID,
    paymentMethod: 'RAZORPAY',
  },
];

const REVIEW_DEFINITIONS = [
  { customerIndex: 0, productIndex: 0, rating: 5, title: 'Excellent performance', comment: 'Super smooth and handles heavy workloads easily.' },
  { customerIndex: 0, productIndex: 5, rating: 4, title: 'Comfortable fit', comment: 'Great everyday wear and good fabric quality.' },
  { customerIndex: 1, productIndex: 1, rating: 5, title: 'Best ANC at this price', comment: 'Battery life and sound are both impressive.' },
  { customerIndex: 1, productIndex: 10, rating: 4, title: 'Useful cookware', comment: 'Heats evenly and easy to clean after cooking.' },
  { customerIndex: 2, productIndex: 13, rating: 5, title: 'Must read', comment: 'Crisp explanations with practical examples.' },
  { customerIndex: 2, productIndex: 15, rating: 4, title: 'Fun family game', comment: 'Good replay value and rules are easy to learn.' },
];

function makeOrderNumber(index) {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `SEED-ORD-${y}${m}${d}-${String(index + 1).padStart(3, '0')}`;
}

async function insertUsers() {
  const allSeedUsers = [...CUSTOMER_USERS, ...VENDOR_USERS];
  const docs = [];
  for (const user of allSeedUsers) {
    const hashed = await bcrypt.hash(user.password, SALT_ROUNDS);
    docs.push({ ...user, password: hashed });
  }
  const inserted = await User.insertMany(docs);
  return {
    customers: inserted.filter((u) => u.role === ROLES.USER),
    vendors: inserted.filter((u) => u.role === ROLES.VENDOR),
  };
}

function buildAddresses(customerDocs) {
  return customerDocs.flatMap((customer, index) => [
    {
      user: customer._id,
      fullName: customer.name,
      phone: customer.phone,
      line1: `Flat ${100 + index}, Sunrise Residency`,
      line2: 'Near City Center',
      city: index === 0 ? 'Bengaluru' : index === 1 ? 'Kochi' : 'Indore',
      state: index === 0 ? 'Karnataka' : index === 1 ? 'Kerala' : 'Madhya Pradesh',
      country: 'India',
      postalCode: index === 0 ? '560034' : index === 1 ? '682020' : '452001',
      label: 'HOME',
      isDefault: true,
    },
    {
      user: customer._id,
      fullName: customer.name,
      phone: customer.phone,
      line1: `Office ${20 + index}, Business Bay`,
      line2: 'Sector 2',
      city: index === 0 ? 'Bengaluru' : index === 1 ? 'Kochi' : 'Indore',
      state: index === 0 ? 'Karnataka' : index === 1 ? 'Kerala' : 'Madhya Pradesh',
      country: 'India',
      postalCode: index === 0 ? '560095' : index === 1 ? '682018' : '452010',
      label: 'WORK',
      isDefault: false,
    },
  ]);
}

function buildCarts(customers, products) {
  return [
    {
      user: customers[0]._id,
      couponCode: 'WELCOME10',
      items: [
        { product: products[0]._id, vendor: products[0].vendor, quantity: 1, unitPrice: products[0].discountPrice || products[0].price },
        { product: products[6]._id, vendor: products[6].vendor, quantity: 2, unitPrice: products[6].discountPrice || products[6].price },
      ],
    },
    {
      user: customers[1]._id,
      items: [
        { product: products[11]._id, vendor: products[11].vendor, quantity: 1, unitPrice: products[11].discountPrice || products[11].price },
        { product: products[14]._id, vendor: products[14].vendor, quantity: 1, unitPrice: products[14].discountPrice || products[14].price },
      ],
    },
    {
      user: customers[2]._id,
      items: [
        { product: products[3]._id, vendor: products[3].vendor, quantity: 1, unitPrice: products[3].discountPrice || products[3].price },
      ],
    },
  ];
}

function buildOrders(customers, addressByUser, products) {
  return ORDER_DEFINITIONS.map((def, idx) => {
    const user = customers[def.customerIndex];
    const orderItems = def.itemIndexes.map((productIndex) => {
      const product = products[productIndex];
      const quantity = productIndex % 2 === 0 ? 1 : 2;
      const unitPrice = product.discountPrice || product.price;
      return {
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.05);
    const shippingFee = subtotal > 1000 ? 0 : 80;
    const discount = idx === 0 ? Math.round(subtotal * 0.1) : idx === 3 ? 150 : 0;
    const totalAmount = subtotal + tax + shippingFee - discount;

    return {
      orderNumber: makeOrderNumber(idx),
      user: user._id,
      address: addressByUser[user._id.toString()],
      items: orderItems,
      subtotal,
      tax,
      shippingFee,
      discount,
      totalAmount,
      paymentStatus: def.paymentStatus,
      orderStatus: def.status,
      paymentMethod: def.paymentMethod,
      notes: `${SEED_TAG} sample order ${idx + 1}`,
    };
  });
}

function buildPayments(orders) {
  return orders.map((order, idx) => ({
    order: order._id,
    user: order.user,
    provider: order.paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'MOCK',
    providerOrderId: `seed_provider_order_${idx + 1}`,
    providerPaymentId: order.paymentStatus === PAYMENT_STATUS.PAID ? `seed_payment_${idx + 1}` : undefined,
    amount: order.totalAmount,
    currency: 'INR',
    status: order.paymentStatus,
    rawResponse: {
      source: 'seed-script',
      orderNumber: order.orderNumber,
      status: order.paymentStatus,
    },
  }));
}

function buildReviews(customers, products) {
  return REVIEW_DEFINITIONS.map((r) => ({
    product: products[r.productIndex]._id,
    user: customers[r.customerIndex]._id,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
  }));
}

function buildRefreshTokens(customers) {
  const now = Date.now();
  return customers.flatMap((customer, index) => {
    const plainA = `seed-refresh-${customer._id}-a-${now}`;
    const plainB = `seed-refresh-${customer._id}-b-${now}`;
    return [
      {
        user: customer._id,
        tokenHash: RefreshToken.hashToken(plainA),
        expiresAt: new Date(now + (7 + index) * 24 * 60 * 60 * 1000),
      },
      {
        user: customer._id,
        tokenHash: RefreshToken.hashToken(plainB),
        expiresAt: new Date(now + (10 + index) * 24 * 60 * 60 * 1000),
      },
    ];
  });
}

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  const seedCategorySlugs = CATEGORIES.map((c) => c.slug);
  const seedUserEmails = [...CUSTOMER_USERS.map((u) => u.email), ...VENDOR_USERS.map((u) => u.email)];
  const seedBusinessEmails = VENDOR_PROFILES.map((v) => v.businessEmail);
  const seedProductSlugs = buildProducts([new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()], {
    electronics: new mongoose.Types.ObjectId(),
    clothing: new mongoose.Types.ObjectId(),
    sports: new mongoose.Types.ObjectId(),
    'home-kitchen': new mongoose.Types.ObjectId(),
    groceries: new mongoose.Types.ObjectId(),
    books: new mongoose.Types.ObjectId(),
    'toys-games': new mongoose.Types.ObjectId(),
  }).map((p) => p.slug);
  const seedSkus = buildProducts([new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()], {
    electronics: new mongoose.Types.ObjectId(),
    clothing: new mongoose.Types.ObjectId(),
    sports: new mongoose.Types.ObjectId(),
    'home-kitchen': new mongoose.Types.ObjectId(),
    groceries: new mongoose.Types.ObjectId(),
    books: new mongoose.Types.ObjectId(),
    'toys-games': new mongoose.Types.ObjectId(),
  }).map((p) => p.sku);

  await Promise.all([
    Category.deleteMany({ slug: { $in: seedCategorySlugs } }),
    Product.deleteMany({ $or: [{ slug: { $in: seedProductSlugs } }, { sku: { $in: seedSkus } }] }),
    Vendor.deleteMany({ businessEmail: { $in: seedBusinessEmails } }),
    User.deleteMany({ email: { $in: seedUserEmails } }),
  ]);
  console.log('Cleared existing seed users/vendors/categories/products');

  const categories = await Category.insertMany(CATEGORIES);
  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c._id]));
  console.log(`Inserted ${categories.length} categories`);

  const { customers, vendors: vendorUsers } = await insertUsers();
  console.log(`Inserted ${customers.length} customer users and ${vendorUsers.length} vendor users`);

  const vendorDocs = VENDOR_PROFILES.map((v, i) => ({ ...v, user: vendorUsers[i]._id }));
  const vendors = await Vendor.insertMany(vendorDocs);
  const vendorIds = vendors.map((v) => v._id);
  console.log(`Inserted ${vendors.length} vendors`);

  const products = await Product.insertMany(buildProducts(vendorIds, categoryMap));
  console.log(`Inserted ${products.length} products`);

  const addresses = await Address.insertMany(buildAddresses(customers));
  console.log(`Inserted ${addresses.length} addresses`);

  const addressByUser = addresses.reduce((acc, address) => {
    if (address.isDefault) {
      acc[address.user.toString()] = address._id;
    }
    return acc;
  }, {});

  await Cart.insertMany(buildCarts(customers, products));
  console.log(`Inserted ${customers.length} carts`);

  const orders = await Order.insertMany(buildOrders(customers, addressByUser, products));
  console.log(`Inserted ${orders.length} orders`);

  const payments = await Payment.insertMany(buildPayments(orders));
  console.log(`Inserted ${payments.length} payments`);

  const reviews = await Review.insertMany(buildReviews(customers, products));
  console.log(`Inserted ${reviews.length} reviews`);

  const refreshTokens = await RefreshToken.insertMany(buildRefreshTokens(customers));
  console.log(`Inserted ${refreshTokens.length} refresh tokens`);

  console.log('\nSeed complete!');
  console.log('\nLogin credentials:');
  CUSTOMER_USERS.forEach((u) => console.log(`  [Customer] ${u.email}  /  ${u.password}`));
  VENDOR_USERS.forEach((u) => console.log(`  [Vendor]   ${u.email}  /  ${u.password}`));

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
