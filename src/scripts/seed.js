import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

const SALT_ROUNDS = 10;

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets, devices, and accessories' },
  { name: 'Clothing', slug: 'clothing', description: 'Men, women, and kids fashion' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', description: 'Furniture, appliances, and décor' },
  { name: 'Books', slug: 'books', description: 'Fiction, non-fiction, and academic books' },
  { name: 'Sports', slug: 'sports', description: 'Sports equipment and activewear' },
];

// ── Customer user ─────────────────────────────────────────────────────────────
const CUSTOMER_USER = {
  name: 'Demo Customer',
  email: 'customer@demo.com',
  password: 'Password@123',
  phone: '9876543299',
  role: 'USER',
};

// ── Vendor users ──────────────────────────────────────────────────────────────
const VENDOR_USERS = [
  {
    name: 'Tech Store Owner',
    email: 'vendor1@techstore.com',
    password: 'Password@123',
    phone: '9876543210',
    role: 'VENDOR',
  },
  {
    name: 'Fashion Hub Owner',
    email: 'vendor2@fashionhub.com',
    password: 'Password@123',
    phone: '9876543211',
    role: 'VENDOR',
  },
];

// ── Vendor profiles ────────────────────────────────────────────────────────────
const VENDOR_PROFILES = [
  {
    storeName: 'Tech Store',
    businessEmail: 'contact@techstore.com',
    businessPhone: '9876543210',
    gstNumber: 'GSTTECH001',
    address: '12, Tech Park, Bengaluru, Karnataka - 560001',
    description: 'Your one-stop shop for the latest gadgets and electronics.',
    approvalStatus: 'APPROVED',
    commissionRate: 8,
  },
  {
    storeName: 'Fashion Hub',
    businessEmail: 'hello@fashionhub.com',
    businessPhone: '9876543211',
    gstNumber: 'GSTFASH002',
    address: '45, Style Street, Mumbai, Maharashtra - 400001',
    description: 'Trendy clothing and accessories for every occasion.',
    approvalStatus: 'APPROVED',
    commissionRate: 12,
  },
];

// ── Products factory ───────────────────────────────────────────────────────────
const buildProducts = (vendorIds, categoryMap) => [
  // Electronics – Tech Store
  {
    vendor: vendorIds[0],
    category: categoryMap['electronics'],
    name: 'Gaming Laptop Pro 16',
    slug: 'gaming-laptop-pro-16',
    description: 'High-performance gaming laptop with RTX 4060, 16GB RAM, and 512GB SSD. Ideal for gaming and content creation.',
    price: 85000,
    discountPrice: 74999,
    sku: 'SKU-LAPTOP-001',
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
    sku: 'SKU-HEAD-002',
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
    sku: 'SKU-TV-003',
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
    sku: 'SKU-KB-004',
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
    sku: 'SKU-PHONE-005',
    stock: 25,
    images: [{ url: 'https://placehold.co/600x400?text=Smartphone', publicId: 'products/smartphone-005' }],
    tags: ['smartphone', 'mobile', '5g', 'android'],
    averageRating: 4.4,
    totalReviews: 76,
  },

  // Clothing – Fashion Hub
  {
    vendor: vendorIds[1],
    category: categoryMap['clothing'],
    name: 'Men\'s Slim Fit Chinos',
    slug: 'mens-slim-fit-chinos',
    description: 'Classic slim-fit chinos in stretch cotton blend. Available in multiple colors. Machine washable.',
    price: 1800,
    discountPrice: 1399,
    sku: 'SKU-CHIN-006',
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
    sku: 'SKU-KURT-007',
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
    sku: 'SKU-HOOD-008',
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
    sku: 'SKU-SHOE-009',
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
    sku: 'SKU-YOGA-010',
    stock: 90,
    images: [{ url: 'https://placehold.co/600x400?text=Yoga+Mat', publicId: 'products/yoga-mat-010' }],
    tags: ['yoga', 'mat', 'fitness', 'sports'],
    averageRating: 4.8,
    totalReviews: 112,
  },
];

// ── Main seed function ─────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  // Clear existing seed data
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Vendor.deleteMany({ businessEmail: { $in: VENDOR_PROFILES.map(v => v.businessEmail) } }),
    User.deleteMany({ email: { $in: [...VENDOR_USERS.map(u => u.email), CUSTOMER_USER.email] } }),
  ]);
  console.log('Cleared existing seed data');

  // Insert categories
  const categories = await Category.insertMany(CATEGORIES);
  const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c._id]));
  console.log(`Inserted ${categories.length} categories`);

  // Insert customer user
  const customerHashed = await bcrypt.hash(CUSTOMER_USER.password, SALT_ROUNDS);
  await User.insertMany([{ ...CUSTOMER_USER, password: customerHashed }]);
  console.log('Inserted customer user');

  // Insert vendor users (password hashed via pre-save hook)
  const userDocs = [];
  for (const u of VENDOR_USERS) {
    const hashed = await bcrypt.hash(u.password, SALT_ROUNDS);
    userDocs.push({ ...u, password: hashed });
  }
  const users = await User.insertMany(userDocs);
  console.log(`Inserted ${users.length} vendor users`);

  // Insert vendor profiles
  const vendorDocs = VENDOR_PROFILES.map((v, i) => ({ ...v, user: users[i]._id }));
  const vendors = await Vendor.insertMany(vendorDocs);
  const vendorIds = vendors.map(v => v._id);
  console.log(`Inserted ${vendors.length} vendors`);

  // Insert products
  const products = await Product.insertMany(buildProducts(vendorIds, categoryMap));
  console.log(`Inserted ${products.length} products`);

  console.log('\nSeed complete!');
  console.log('\nLogin credentials:');
  console.log(`  [Customer] ${CUSTOMER_USER.email}  /  ${CUSTOMER_USER.password}`);
  VENDOR_USERS.forEach(u => console.log(`  [Vendor]   ${u.email}  /  ${u.password}`));

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
