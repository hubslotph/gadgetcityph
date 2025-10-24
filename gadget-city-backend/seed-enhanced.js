const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Enhanced product data with more items and better categorization
const sampleProducts = [
  // Smartphones - Premium
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most advanced iPhone with titanium design, A17 Pro chip, and professional camera system featuring 5x telephoto zoom.',
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
      'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto (5x)',
      'Battery': '4441 mAh',
      'OS': 'iOS 17'
    },
    features: [
      'Titanium Design',
      'Action Button',
      'Pro Camera System',
      'A17 Pro Chip',
      'USB-C Connector',
      '5x Telephoto Zoom'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', alt: 'iPhone 15 Pro Max - Front View' },
      { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800', alt: 'iPhone 15 Pro Max - Back View' }
    ],
    rating: 4.8,
    reviewCount: 1250,
    isActive: true,
    isFeatured: true,
    tags: ['flagship', 'premium', 'camera', 'apple', '5g'],
    warranty: '1 Year Apple Warranty'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, exceptional camera capabilities, and AI features powered by Snapdragon 8 Gen 3.',
    price: 79999,
    category: 'smartphones',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    stock: 18,
    specifications: {
      'Display': '6.8-inch Dynamic AMOLED 2X (1440x3120)',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '512GB',
      'Camera': '200MP Main, 50MP Periscope (5x), 10MP Telephoto (3x), 12MP Ultra Wide',
      'Battery': '5000 mAh',
      'OS': 'Android 14 with One UI 6.1'
    },
    features: [
      'S Pen Included',
      '200MP Camera',
      'AI Features',
      'Titanium Frame',
      '120Hz Display',
      'IP68 Water Resistance'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', alt: 'Samsung Galaxy S24 Ultra - Front' },
      { url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800', alt: 'Samsung Galaxy S24 Ultra - Camera' }
    ],
    rating: 4.7,
    reviewCount: 890,
    isActive: true,
    isFeatured: true,
    tags: ['android', 'flagship', 's-pen', 'camera', 'ai'],
    warranty: '2 Years Samsung Warranty'
  },
  {
    name: 'OnePlus 12',
    description: 'Fast and smooth flagship killer with exceptional performance, 100W fast charging, and Hasselblad camera partnership.',
    price: 45999,
    category: 'smartphones',
    brand: 'OnePlus',
    model: 'OnePlus 12',
    stock: 32,
    specifications: {
      'Display': '6.82-inch LTPO4 AMOLED (1440x3168)',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '16GB',
      'Storage': '512GB',
      'Camera': '64MP Main (OIS), 50MP Ultra Wide, 48MP Telephoto (3x)',
      'Battery': '5400 mAh with 100W charging',
      'OS': 'OxygenOS 14 based on Android 14'
    },
    features: [
      '100W SUPERVOOC Charging',
      'Hasselblad Camera',
      '16GB LPDDR5X RAM',
      'OxygenOS',
      'Premium Build Quality',
      'IP65 Rating'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: 'OnePlus 12 - Premium Design' }
    ],
    rating: 4.5,
    reviewCount: 567,
    isActive: true,
    isFeatured: false,
    tags: ['flagship-killer', 'fast-charging', 'performance', 'camera'],
    warranty: '1 Year OnePlus Warranty'
  },

  // Laptops - Professional
  {
    name: 'MacBook Pro 16-inch M3 Max',
    description: 'Professional laptop with M3 Max chip, perfect for content creation, development, and demanding workflows.',
    price: 249990,
    category: 'laptops',
    brand: 'Apple',
    model: 'MacBook Pro 16" M3 Max',
    stock: 8,
    specifications: {
      'Display': '16.2-inch Liquid Retina XDR (3456x2234)',
      'Processor': 'Apple M3 Max (16-core CPU, 40-core GPU)',
      'RAM': '36GB Unified Memory',
      'Storage': '1TB SSD',
      'Battery': 'Up to 22 hours',
      'OS': 'macOS Sonoma'
    },
    features: [
      'M3 Max Chip with 16-core CPU',
      '40-core GPU for intensive tasks',
      'Liquid Retina XDR Display',
      'All-day Battery Life',
      'MagSafe 3 Charging',
      'Studio Quality Microphones'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800', alt: 'MacBook Pro 16-inch - Professional Laptop' }
    ],
    rating: 4.9,
    reviewCount: 234,
    isActive: true,
    isFeatured: true,
    tags: ['professional', 'content-creation', 'apple-silicon', 'high-performance'],
    warranty: '1 Year Apple Warranty'
  },
  {
    name: 'Dell XPS 13 Plus',
    description: 'Ultra-portable laptop with stunning InfinityEdge display, premium build quality, and exceptional performance.',
    price: 89999,
    category: 'laptops',
    brand: 'Dell',
    model: 'XPS 13 Plus',
    stock: 15,
    specifications: {
      'Display': '13.4-inch OLED Touch (3456x2160)',
      'Processor': 'Intel Core i7-1280P',
      'RAM': '16GB LPDDR5',
      'Storage': '512GB SSD',
      'Battery': 'Up to 12 hours',
      'OS': 'Windows 11 Pro'
    },
    features: [
      'InfinityEdge Display',
      'Capacitive Touch Function Row',
      'Premium Aluminum Build',
      'Long Battery Life',
      'Ultra Portable Design',
      'Thunderbolt 4 Ports'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', alt: 'Dell XPS 13 Plus - Ultra Portable' }
    ],
    rating: 4.4,
    reviewCount: 456,
    isActive: true,
    isFeatured: false,
    tags: ['ultrabook', 'portable', 'premium', 'business'],
    warranty: '1 Year Dell Warranty'
  },

  // Audio Equipment
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality and 30-hour battery life.',
    price: 22999,
    category: 'headphones',
    brand: 'Sony',
    model: 'WH-1000XM5',
    stock: 45,
    specifications: {
      'Driver': '30mm Dynamic Drivers',
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
      'Multipoint Bluetooth Connection',
      'Quick Charge (3 min = 3 hours)',
      'Touch Sensor Controls'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800', alt: 'Sony WH-1000XM5 - Premium Headphones' }
    ],
    rating: 4.6,
    reviewCount: 1820,
    isActive: true,
    isFeatured: true,
    tags: ['noise-canceling', 'wireless', 'premium-audio', 'sony'],
    warranty: '1 Year Sony Warranty'
  },
  {
    name: 'Apple AirPods Pro 2',
    description: 'Wireless earbuds with active noise cancellation, spatial audio, and seamless iPhone integration.',
    price: 14990,
    category: 'headphones',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    stock: 67,
    specifications: {
      'Driver': 'Custom high-excursion Apple driver',
      'Battery Life': '6 hours (ANC on)',
      'Charging Case': '30 hours total',
      'Water Resistance': 'IPX4',
      'Connectivity': 'Bluetooth 5.3',
      'Chip': 'H2 chip'
    },
    features: [
      'Active Noise Cancellation',
      'Adaptive Transparency Mode',
      'Spatial Audio with Head Tracking',
      'MagSafe Charging Case',
      'Touch Controls',
      'Find My Integration'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800', alt: 'Apple AirPods Pro 2 - Wireless Earbuds' }
    ],
    rating: 4.7,
    reviewCount: 3456,
    isActive: true,
    isFeatured: false,
    tags: ['wireless-earbuds', 'anc', 'apple-ecosystem', 'spatial-audio'],
    warranty: '1 Year Apple Warranty'
  },

  // Gaming
  {
    name: 'PlayStation 5',
    description: 'Next-generation gaming console with ultra-high-speed SSD, ray tracing, and 4K gaming capabilities.',
    price: 32999,
    category: 'gaming',
    brand: 'Sony',
    model: 'PlayStation 5',
    stock: 12,
    specifications: {
      'CPU': 'AMD Zen 2-based CPU (8 cores at 3.5GHz)',
      'GPU': '10.28 TFLOPs, 36 CUs at 2.23GHz',
      'RAM': '16GB GDDR6/256-bit',
      'Storage': '825GB Custom SSD',
      'Optical': '4K UHD Blu-ray Drive',
      'Audio': '3D AudioTech'
    },
    features: [
      '4K Gaming at 120fps',
      'Ray Tracing Graphics',
      'Ultra-high-speed SSD',
      '3D Audio Technology',
      'Backward Compatible',
      'DualSense Controller'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800', alt: 'PlayStation 5 - Gaming Console' }
    ],
    rating: 4.8,
    reviewCount: 5423,
    isActive: true,
    isFeatured: true,
    tags: ['console', '4k-gaming', 'sony', 'next-gen'],
    warranty: '1 Year Sony Warranty'
  },

  // Wearables
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with health monitoring, GPS, and seamless iPhone integration with Double Tap gesture.',
    price: 25990,
    category: 'smartwatches',
    brand: 'Apple',
    model: 'Watch Series 9',
    stock: 28,
    specifications: {
      'Display': '45mm Retina LTPO OLED (396x484)',
      'Processor': 'S9 SiP with 64-bit dual-core',
      'Storage': '64GB',
      'Water Resistance': '50 meters (5ATM)',
      'Battery': 'All-day battery life (18 hours)',
      'OS': 'watchOS 10'
    },
    features: [
      'Advanced Health Monitoring',
      'GPS + Cellular models available',
      'Double Tap Gesture',
      'Precision Finding for iPhone',
      'watchOS 10 with Smart Stack',
      'ECG and Blood Oxygen monitoring'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1551818255-e6e10975cd4a?w=800', alt: 'Apple Watch Series 9 - Smartwatch' }
    ],
    rating: 4.6,
    reviewCount: 1234,
    isActive: true,
    isFeatured: false,
    tags: ['smartwatch', 'health', 'fitness', 'apple'],
    warranty: '1 Year Apple Warranty'
  },

  // Tablets
  {
    name: 'iPad Pro 12.9-inch M2',
    description: 'Professional tablet with M2 chip, perfect for creative work, productivity, and mobile computing.',
    price: 71990,
    category: 'tablets',
    brand: 'Apple',
    model: 'iPad Pro 12.9" M2',
    stock: 14,
    specifications: {
      'Display': '12.9-inch Liquid Retina XDR (2732x2048)',
      'Processor': 'Apple M2 chip',
      'RAM': '8GB/16GB options',
      'Storage': '128GB-2TB options',
      'Camera': '12MP Wide, 10MP Ultra Wide',
      'Battery': 'Up to 10 hours',
      'OS': 'iPadOS 17'
    },
    features: [
      'M2 Chip Performance',
      'Liquid Retina XDR Display',
      'Apple Pencil Support (2nd gen)',
      'Magic Keyboard Compatible',
      'All-day Battery Life',
      'Pro Camera System'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', alt: 'iPad Pro 12.9-inch - Professional Tablet' }
    ],
    rating: 4.8,
    reviewCount: 789,
    isActive: true,
    isFeatured: true,
    tags: ['tablet', 'productivity', 'creative', 'apple'],
    warranty: '1 Year Apple Warranty'
  },

  // Accessories
  {
    name: 'Anker PowerCore 20,000mAh Power Bank',
    description: 'High-capacity portable charger with fast charging technology, dual USB output, and premium components.',
    price: 2999,
    category: 'accessories',
    brand: 'Anker',
    model: 'PowerCore 20000',
    stock: 85,
    specifications: {
      'Capacity': '20,000mAh',
      'Output': 'USB-C 18W PD, USB-A 18W QC',
      'Input': 'USB-C 18W',
      'Weight': '356g',
      'Dimensions': '158 x 79 x 22 mm'
    },
    features: [
      '20,000mAh High Capacity',
      '18W Fast Charging',
      'Dual USB Output Ports',
      'Premium LG Battery Cells',
      'MultiProtect Safety System',
      '18-Month Warranty'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1609592960425-8e50a0a5b7e9?w=800', alt: 'Anker PowerCore 20000 - Power Bank' }
    ],
    rating: 4.5,
    reviewCount: 2156,
    isActive: true,
    isFeatured: false,
    tags: ['power-bank', 'portable-charger', 'travel', 'fast-charging'],
    warranty: '18 Months Anker Warranty'
  },

  // Cameras
  {
    name: 'Sony Alpha 7 IV',
    description: 'Professional mirrorless camera with 33MP sensor, 4K video capabilities, and advanced autofocus system.',
    price: 159999,
    category: 'cameras',
    brand: 'Sony',
    model: 'Alpha 7 IV',
    stock: 6,
    specifications: {
      'Sensor': '33MP Full-Frame Exmor R CMOS',
      'ISO': '100-51200 (expandable to 50-204800)',
      'Video': '4K 60p, 1080p 120p',
      'Viewfinder': '3.69M-dot OLED EVF',
      'LCD': '3-inch vari-angle touchscreen',
      'Stabilization': '5-axis in-body stabilization'
    },
    features: [
      '33MP Full-Frame Sensor',
      'Real-time Eye AF for humans/animals',
      '4K 60p Video Recording',
      '5-axis In-body Image Stabilization',
      '759-point Phase-detection AF',
      'Dual Card Slots (CFexpress Type A + SD)'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800', alt: 'Sony Alpha 7 IV - Mirrorless Camera' }
    ],
    rating: 4.7,
    reviewCount: 432,
    isActive: true,
    isFeatured: false,
    tags: ['mirrorless', 'professional', '4k-video', 'sony'],
    warranty: '1 Year Sony Warranty'
  },

  // New additions - More Smartphones
  {
    name: 'Google Pixel 8 Pro',
    description: 'AI-powered Android smartphone with exceptional computational photography and pure Google experience.',
    price: 64999,
    category: 'smartphones',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    stock: 22,
    specifications: {
      'Display': '6.7-inch LTPO OLED (1344x2992)',
      'Processor': 'Google Tensor G3',
      'RAM': '12GB',
      'Storage': '256GB',
      'Camera': '50MP Main, 48MP Ultra Wide, 48MP Telephoto (5x)',
      'Battery': '5050 mAh',
      'OS': 'Android 14'
    },
    features: [
      'Google Tensor G3 Chip',
      'Magic Eraser & Photo Unblur',
      '7 years of OS updates',
      'Temperature Sensor',
      'IP68 Water Resistance',
      'Pure Android Experience'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800', alt: 'Google Pixel 8 Pro - AI Smartphone' }
    ],
    rating: 4.4,
    reviewCount: 678,
    isActive: true,
    isFeatured: false,
    tags: ['android', 'ai', 'camera', 'google', 'photography'],
    warranty: '1 Year Google Warranty'
  },
  {
    name: 'Xiaomi 14 Ultra',
    description: 'Photography-focused flagship with Leica partnership, massive camera sensors, and premium build quality.',
    price: 69999,
    category: 'smartphones',
    brand: 'Xiaomi',
    model: '14 Ultra',
    stock: 16,
    specifications: {
      'Display': '6.73-inch AMOLED (1440x3200)',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '16GB',
      'Storage': '512GB',
      'Camera': '50MP Main (1-inch sensor), 50MP Ultra Wide, 50MP Telephoto (3.2x), 50MP Periscope (5x)',
      'Battery': '5300 mAh with 90W charging',
      'OS': 'HyperOS based on Android 14'
    },
    features: [
      'Leica Camera Partnership',
      '1-inch Main Camera Sensor',
      '90W Wired Charging',
      'Premium Vegan Leather',
      'IP68 Rating',
      'Satellite Communication'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', alt: 'Xiaomi 14 Ultra - Camera Phone' }
    ],
    rating: 4.3,
    reviewCount: 345,
    isActive: true,
    isFeatured: false,
    tags: ['camera', 'photography', 'flagship', 'xiaomi'],
    warranty: '1 Year Xiaomi Warranty'
  },

  // More Laptops
  {
    name: 'ASUS ROG Zephyrus G14',
    description: 'Compact gaming laptop with AMD Ryzen processor, RTX graphics, and exceptional battery life for gaming on the go.',
    price: 89999,
    category: 'laptops',
    brand: 'ASUS',
    model: 'ROG Zephyrus G14',
    stock: 11,
    specifications: {
      'Display': '14-inch QHD 120Hz (2560x1440)',
      'Processor': 'AMD Ryzen 9 7940HS',
      'RAM': '16GB DDR5',
      'Storage': '1TB SSD',
      'Graphics': 'RTX 4060 8GB',
      'Battery': 'Up to 10 hours',
      'OS': 'Windows 11 Home'
    },
    features: [
      'AMD Ryzen 9 Processor',
      'RTX 40-series Graphics',
      'Compact 14-inch Design',
      '120Hz QHD Display',
      'Long Battery Life',
      'AniMe Matrix LED Display'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', alt: 'ASUS ROG Zephyrus G14 - Gaming Laptop' }
    ],
    rating: 4.6,
    reviewCount: 523,
    isActive: true,
    isFeatured: false,
    tags: ['gaming', 'laptop', 'portable', 'amd'],
    warranty: '2 Years ASUS Warranty'
  },

  // More Audio
  {
    name: 'Bose QuietComfort 45',
    description: 'Premium wireless headphones with world-class noise cancellation and comfortable over-ear design.',
    price: 19999,
    category: 'headphones',
    brand: 'Bose',
    model: 'QuietComfort 45',
    stock: 33,
    specifications: {
      'Driver': '40mm Dynamic Drivers',
      'Battery Life': '22 hours (NC on)',
      'Charging': 'USB-C, 15 min = 3 hours',
      'Weight': '238g',
      'Connectivity': 'Bluetooth 5.1, USB-C, 3.5mm'
    },
    features: [
      'World-class Noise Cancellation',
      'High-fidelity Audio',
      'Comfortable Over-ear Design',
      'Quick Charge Technology',
      'Dual Device Connectivity',
      'EQ Control in Bose Music App'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', alt: 'Bose QuietComfort 45 - Noise Canceling' }
    ],
    rating: 4.4,
    reviewCount: 987,
    isActive: true,
    isFeatured: false,
    tags: ['noise-canceling', 'wireless', 'comfort', 'bose'],
    warranty: '1 Year Bose Warranty'
  },

  // Smart Home
  {
    name: 'Apple HomePod 2nd Gen',
    description: 'Smart speaker with spatial audio, temperature and humidity sensors, and seamless Apple ecosystem integration.',
    price: 17999,
    category: 'speakers',
    brand: 'Apple',
    model: 'HomePod 2',
    stock: 19,
    specifications: {
      'Drivers': '5 tweeters, 4-inch woofer',
      'Audio': 'Spatial Audio with Dolby Atmos',
      'Sensors': 'Temperature and humidity',
      'Connectivity': 'Wi-Fi 6E, Bluetooth 5.0',
      'Compatibility': 'iPhone, iPad, Mac, Apple TV'
    },
    features: [
      'Spatial Audio with Dolby Atmos',
      'Built-in Siri',
      'Temperature & Humidity Sensing',
      'Sound Recognition',
      'Multi-room Audio',
      'Matter Smart Home Support'
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800', alt: 'Apple HomePod 2 - Smart Speaker' }
    ],
    rating: 4.2,
    reviewCount: 445,
    isActive: true,
    isFeatured: false,
    tags: ['smart-home', 'apple', 'audio', 'siri'],
    warranty: '1 Year Apple Warranty'
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

    // Insert sample products with enhanced data
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} enhanced products`);

    // Display enhanced statistics
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          featuredCount: { $sum: { $cond: ['$isFeatured', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Enhanced Product Statistics:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} products, ₱${Math.round(stat.averagePrice)} avg price, ${stat.featuredCount} featured`);
    });

    // Show featured products
    const featuredProducts = await Product.find({ isFeatured: true }).select('name price category');
    console.log('\n⭐ Featured Products:');
    featuredProducts.forEach(product => {
      console.log(`  ${product.name} - ₱${product.price.toLocaleString()} (${product.category})`);
    });

    console.log('\n🎉 Enhanced database seeded successfully!');
    console.log('\n🖼️ All products now have:');
    console.log('  • Real, high-quality images');
    console.log('  • Detailed specifications');
    console.log('  • Professional features lists');
    console.log('  • Proper categorization');
    console.log('  • Stock management');
    console.log('  • Rating and review systems');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding enhanced database:', error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleProducts, seedDatabase };
