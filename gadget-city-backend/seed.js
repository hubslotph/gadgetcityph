const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Sample product data for Gadget City
const sampleProducts = [
  // Smartphones
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone with titanium design, A17 Pro chip, and professional camera system.',
    price: 68990,
    originalPrice: 71990,
    category: 'smartphones',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    stock: 25,
    specifications: {
      'Display': '6.7-inch Super Retina XDR OLED',
      'Processor': 'A17 Pro chip',
      'RAM': '8GB',
      'Storage': '256GB',
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      'Battery': '4441 mAh',
      'OS': 'iOS 17'
    },
    features: [
      'Titanium Design',
      'Action Button',
      'Pro Camera System',
      'A17 Pro Chip',
      'USB-C Connector'
    ],
    rating: 4.8,
    reviewCount: 1250,
    isActive: true,
    isFeatured: true,
    tags: ['flagship', 'premium', 'camera', 'apple'],
    warranty: '1 Year Apple Warranty'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, exceptional camera capabilities, and AI features.',
    price: 79999,
    category: 'smartphones',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    stock: 18,
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '512GB',
      'Camera': '200MP Main, 50MP Periscope, 10MP Telephoto, 12MP Ultra Wide',
      'Battery': '5000 mAh',
      'OS': 'Android 14'
    },
    features: [
      'S Pen Included',
      '200MP Camera',
      'AI Features',
      'Titanium Frame',
      '120Hz Display'
    ],
    rating: 4.7,
    reviewCount: 890,
    isActive: true,
    isFeatured: true,
    tags: ['android', 'flagship', 's-pen', 'camera'],
    warranty: '2 Years Samsung Warranty'
  },
  {
    name: 'OnePlus 12',
    description: 'Fast and smooth flagship killer with exceptional performance and charging speeds.',
    price: 45999,
    category: 'smartphones',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    stock: 32,
    specifications: {
      'Display': '6.82-inch LTPO4 AMOLED',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '16GB',
      'Storage': '512GB',
      'Camera': '64MP Main, 50MP Ultra Wide, 48MP Telephoto',
      'Battery': '5400 mAh',
      'OS': 'OxygenOS 14'
    },
    features: [
      '100W Fast Charging',
      'Hasselblad Camera',
      '16GB RAM',
      'OxygenOS',
      'Premium Build'
    ],
    rating: 4.5,
    reviewCount: 567,
    isActive: true,
    isFeatured: false,
    tags: ['flagship-killer', 'fast-charging', 'performance'],
    warranty: '1 Year OnePlus Warranty'
  },

  // Laptops
  {
    name: 'MacBook Pro 16-inch M3 Max',
    description: 'Professional laptop with M3 Max chip, perfect for content creation and development.',
    price: 249990,
    category: 'laptops',
    brand: 'Apple',
    model: 'MacBook Pro 16" M3 Max',
    stock: 8,
    specifications: {
      'Display': '16.2-inch Liquid Retina XDR',
      'Processor': 'Apple M3 Max',
      'RAM': '36GB Unified Memory',
      'Storage': '1TB SSD',
      'Graphics': '40-core GPU',
      'OS': 'macOS Sonoma'
    },
    features: [
      'M3 Max Chip',
      'Liquid Retina XDR Display',
      'All-day Battery Life',
      'MagSafe Charging',
      'Studio Quality Mics'
    ],
    rating: 4.9,
    reviewCount: 234,
    isActive: true,
    isFeatured: true,
    tags: ['professional', 'content-creation', 'apple-silicon'],
    warranty: '1 Year Apple Warranty'
  },
  {
    name: 'Dell XPS 13 Plus',
    description: 'Ultra-portable laptop with stunning InfinityEdge display and premium build quality.',
    price: 89999,
    category: 'laptops',
    brand: 'Dell',
    model: 'XPS 13 Plus',
    stock: 15,
    specifications: {
      'Display': '13.4-inch OLED Touch',
      'Processor': 'Intel Core i7-1280P',
      'RAM': '16GB LPDDR5',
      'Storage': '512GB SSD',
      'OS': 'Windows 11 Pro'
    },
    features: [
      'InfinityEdge Display',
      'Capacitive Touch Function Row',
      'Premium Build',
      'Long Battery Life',
      'Ultra Portable'
    ],
    rating: 4.4,
    reviewCount: 456,
    isActive: true,
    isFeatured: false,
    tags: ['ultrabook', 'portable', 'premium'],
    warranty: '1 Year Dell Warranty'
  },

  // Headphones
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality.',
    price: 22999,
    category: 'headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    stock: 45,
    specifications: {
      'Driver': '30mm',
      'Frequency Response': '4 Hz-40,000 Hz',
      'Battery Life': '30 hours (NC on)',
      'Charging': 'USB-C, 3 min = 3 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.2, USB-C, 3.5mm'
    },
    features: [
      'Industry-leading Noise Canceling',
      '30-hour Battery Life',
      'Crystal Clear Hands-free Calling',
      'Multipoint Connection',
      'Quick Charge'
    ],
    rating: 4.6,
    reviewCount: 1820,
    isActive: true,
    isFeatured: true,
    tags: ['noise-canceling', 'wireless', 'premium-audio'],
    warranty: '1 Year Sony Warranty'
  },
  {
    name: 'Apple AirPods Pro 2',
    description: 'Wireless earbuds with active noise cancellation and spatial audio.',
    price: 14990,
    category: 'headphones',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    stock: 67,
    specifications: {
      'Driver': 'Custom high-excursion driver',
      'Battery Life': '6 hours (ANC on)',
      'Charging Case': '30 hours total',
      'Water Resistance': 'IPX4',
      'Connectivity': 'Bluetooth 5.3'
    },
    features: [
      'Active Noise Cancellation',
      'Adaptive Transparency',
      'Spatial Audio',
      'MagSafe Charging Case',
      'Touch Controls'
    ],
    rating: 4.7,
    reviewCount: 3456,
    isActive: true,
    isFeatured: false,
    tags: ['wireless-earbuds', 'anc', 'apple-ecosystem'],
    warranty: '1 Year Apple Warranty'
  },

  // Gaming
  {
    name: 'PlayStation 5',
    description: 'Next-generation gaming console with ultra-high-speed SSD and ray tracing.',
    price: 32999,
    category: 'gaming',
    brand: 'Sony',
    model: 'PlayStation 5',
    stock: 12,
    specifications: {
      'CPU': 'AMD Zen 2-based CPU',
      'GPU': '10.28 TFLOPs, 36 CUs at 2.23GHz',
      'RAM': '16GB GDDR6/256-bit',
      'Storage': '825GB SSD',
      'Optical': '4K UHD Blu-ray Drive'
    },
    features: [
      '4K Gaming',
      'Ray Tracing',
      'Ultra-high-speed SSD',
      '3D AudioTech',
      'Backward Compatible'
    ],
    rating: 4.8,
    reviewCount: 5423,
    isActive: true,
    isFeatured: true,
    tags: ['console', '4k-gaming', 'sony'],
    warranty: '1 Year Sony Warranty'
  },

  // Smartwatches
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with health monitoring and seamless iPhone integration.',
    price: 25990,
    category: 'smartwatches',
    brand: 'Apple',
    model: 'Watch Series 9',
    stock: 28,
    specifications: {
      'Display': '45mm Retina LTPO OLED',
      'Processor': 'S9 SiP',
      'Storage': '64GB',
      'Water Resistance': '50 meters',
      'Battery': 'All-day battery life'
    },
    features: [
      'Health Monitoring',
      'GPS + Cellular',
      'Double Tap Gesture',
      'Precision Finding',
      'WatchOS 10'
    ],
    rating: 4.6,
    reviewCount: 1234,
    isActive: true,
    isFeatured: false,
    tags: ['smartwatch', 'health', 'fitness'],
    warranty: '1 Year Apple Warranty'
  },

  // Tablets
  {
    name: 'iPad Pro 12.9-inch M2',
    description: 'Professional tablet with M2 chip, perfect for creative work and productivity.',
    price: 71990,
    category: 'tablets',
    brand: 'Apple',
    model: 'iPad Pro 12.9" M2',
    stock: 14,
    specifications: {
      'Display': '12.9-inch Liquid Retina XDR',
      'Processor': 'Apple M2',
      'RAM': '8GB/16GB options',
      'Storage': '128GB-2TB',
      'Camera': '12MP Wide, 10MP Ultra Wide'
    },
    features: [
      'M2 Chip',
      'Liquid Retina XDR Display',
      'Apple Pencil Support',
      'Magic Keyboard Compatible',
      'All-day Battery'
    ],
    rating: 4.8,
    reviewCount: 789,
    isActive: true,
    isFeatured: true,
    tags: ['tablet', 'productivity', 'creative'],
    warranty: '1 Year Apple Warranty'
  },

  // Accessories
  {
    name: 'Anker PowerCore 20,000mAh Power Bank',
    description: 'High-capacity portable charger with fast charging technology.',
    price: 2999,
    category: 'accessories',
    brand: 'Anker',
    model: 'PowerCore 20000',
    stock: 85,
    specifications: {
      'Capacity': '20,000mAh',
      'Output': 'USB-C 18W, USB-A 18W',
      'Input': 'USB-C 18W',
      'Weight': '356g'
    },
    features: [
      '20,000mAh Capacity',
      'Fast Charging',
      'Dual USB Output',
      'Premium Components',
      '18-Month Warranty'
    ],
    rating: 4.5,
    reviewCount: 2156,
    isActive: true,
    isFeatured: false,
    tags: ['power-bank', 'portable-charger', 'travel'],
    warranty: '18 Months Anker Warranty'
  },

  // Cameras
  {
    name: 'Sony Alpha 7 IV',
    description: 'Professional mirrorless camera with 33MP sensor and 4K video capabilities.',
    price: 159999,
    category: 'cameras',
    brand: 'Sony',
    model: 'Alpha 7 IV',
    stock: 6,
    specifications: {
      'Sensor': '33MP Full-Frame Exmor R CMOS',
      'ISO': '100-51200 (expandable)',
      'Video': '4K 60p, 1080p 120p',
      'Viewfinder': '3.69M-dot OLED',
      'LCD': '3-inch vari-angle touchscreen'
    },
    features: [
      '33MP Full-Frame Sensor',
      'Real-time Eye AF',
      '4K 60p Video',
      '5-axis In-body Stabilization',
      '759-point Phase-detection AF'
    ],
    rating: 4.7,
    reviewCount: 432,
    isActive: true,
    isFeatured: false,
    tags: ['mirrorless', 'professional', '4k-video'],
    warranty: '1 Year Sony Warranty'
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gadget-city');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Ensure images directory exists
    const publicDir = path.join(process.cwd(), 'public/images/products');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Insert sample products with placeholder images
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const product = new Product(productData);
      await product.save();
      
      // Add placeholder image
      product.images = [{
        url: `/images/products/${product._id}_1.jpg`,
        alt: `${product.name} - Main Image`
      }];
      await product.save();
      
      // Create placeholder image file
      const placeholderPath = path.join(publicDir, `${product._id}_1.jpg`);
      const placeholderContent = `Placeholder image for ${product.name}\nProduct ID: ${product._id}\nThis would be replaced with actual product image.`;
      fs.writeFileSync(placeholderPath, placeholderContent);
      
      createdProducts.push(product);
    }

    console.log(`✅ Created ${createdProducts.length} sample products with placeholder images`);

    // Display some stats
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Product Statistics by Category:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} products, ₱${Math.round(stat.averagePrice)} avg price`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Image Management Features:');
    console.log('  • Upload images via POST /api/images/upload/:productId');
    console.log('  • View images at GET /images/products/:filename');
    console.log('  • Delete images via DELETE /api/images/:productId/:imageIndex');
    console.log('  • Reorder images via PUT /api/images/reorder/:productId');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleProducts, seedDatabase };