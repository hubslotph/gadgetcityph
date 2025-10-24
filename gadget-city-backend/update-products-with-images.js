const mongoose = require('mongoose');
const Product = require('./models/Product');
const PhoneImageFetcher = require('./fetch-phone-images');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Phone model to image mapping
const phoneModelMapping = {
  'iPhone 15 Pro Max': 'iPhone 15 Pro Max',
  'Samsung Galaxy S24 Ultra': 'Samsung Galaxy S24 Ultra',
  'OnePlus 12': 'OnePlus 12',
  'MacBook Pro 16-inch M3 Max': 'MacBook Pro',
  'Dell XPS 13 Plus': 'Dell XPS 13',
  'Sony WH-1000XM5': 'Sony WH-1000XM5 headphones',
  'Apple AirPods Pro 2': 'Apple AirPods Pro',
  'PlayStation 5': 'PlayStation 5',
  'Apple Watch Series 9': 'Apple Watch Series 9',
  'iPad Pro 12.9-inch M2': 'iPad Pro',
  'Anker PowerCore 20,000mAh Power Bank': 'power bank',
  'Sony Alpha 7 IV': 'Sony Alpha 7 IV camera'
};

async function updateProductsWithRealImages() {
  try {
    console.log('🚀 Starting to update products with real images...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gadget-city');
    console.log('✅ Connected to MongoDB');

    // Load fetched images data
    const imagesPath = path.join(__dirname, 'phone-images.json');
    if (!fs.existsSync(imagesPath)) {
      console.log('❌ No images data found. Run fetch-phone-images.js first!');
      return;
    }

    const imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
    console.log(`📊 Loaded images for ${Object.keys(imagesData).length} products`);

    // Update each product
    let updatedCount = 0;
    for (const [productName, images] of Object.entries(imagesData)) {
      if (images.length === 0) continue;

      // Find the corresponding product in database
      const product = await Product.findOne({ name: productName });
      if (!product) {
        console.log(`⚠️ Product not found: ${productName}`);
        continue;
      }

      // Update product with real images
      product.images = images.map(img => ({
        url: img.url,
        alt: img.alt,
        // Keep other fields as they are
      }));

      await product.save();
      updatedCount++;
      console.log(`✅ Updated ${productName} with ${images.length} real images`);
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} products with real images!`);

    // Show sample of updated data
    const sampleProduct = await Product.findOne({ name: 'iPhone 15 Pro Max' });
    if (sampleProduct && sampleProduct.images.length > 0) {
      console.log('\n📱 Sample updated product:');
      console.log(`Name: ${sampleProduct.name}`);
      console.log(`Images: ${sampleProduct.images.length}`);
      console.log(`First image URL: ${sampleProduct.images[0].url}`);
    }

  } catch (error) {
    console.error('❌ Error updating products with real images:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Main execution
async function main() {
  console.log('🔄 Checking if images need to be fetched first...\n');

  // Check if images data exists
  const imagesPath = path.join(__dirname, 'phone-images.json');
  if (!fs.existsSync(imagesPath)) {
    console.log('📥 No images data found. You need to:');
    console.log('1. Get free API keys (see GET_API_KEYS.md)');
    console.log('2. Update your .env file with the API keys');
    console.log('3. Run: node fetch-phone-images.js');
    console.log('4. Then run this script again');
    return;
  }

  // Check if API keys are configured
  const hasApiKeys = process.env.UNSPLASH_ACCESS_KEY &&
                    process.env.PEXELS_API_KEY &&
                    process.env.PIXABAY_API_KEY;

  if (!hasApiKeys || process.env.UNSPLASH_ACCESS_KEY === 'your_unsplash_key_here') {
    console.log('🔑 API keys not configured. Please:');
    console.log('1. Read GET_API_KEYS.md for instructions');
    console.log('2. Get free API keys from Unsplash, Pexels, and Pixabay');
    console.log('3. Update your .env file with real API keys');
    console.log('4. Run: node fetch-phone-images.js');
    return;
  }

  // Update products with real images
  await updateProductsWithRealImages();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { updateProductsWithRealImages };
