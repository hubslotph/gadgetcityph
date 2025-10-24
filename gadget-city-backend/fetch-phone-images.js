const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Free APIs for phone images
const APIS = {
  unsplash: {
    baseURL: 'https://api.unsplash.com',
    key: process.env.UNSPLASH_ACCESS_KEY,
    search: '/search/photos'
  },
  pexels: {
    baseURL: 'https://api.pexels.com/v1',
    key: process.env.PEXELS_API_KEY,
    search: '/search'
  },
  pixabay: {
    baseURL: 'https://pixabay.com/api',
    key: process.env.PIXABAY_API_KEY,
    search: '/'
  }
};

// Phone models to get images for
const phoneModels = [
  'iPhone 15 Pro Max',
  'Samsung Galaxy S24 Ultra',
  'OnePlus 12',
  'iPhone 14 Pro',
  'Samsung Galaxy S23',
  'Google Pixel 8 Pro',
  'Xiaomi 14 Ultra',
  'Huawei P60 Pro',
  'iPhone 13 Pro',
  'Samsung Galaxy Z Fold 5'
];

class PhoneImageFetcher {
  constructor() {
    this.images = new Map();
  }

  // Fetch images from multiple sources
  async fetchAllPhoneImages() {
    console.log('🔍 Starting to fetch real phone images...');

    for (const phoneModel of phoneModels) {
      console.log(`📱 Fetching images for: ${phoneModel}`);

      try {
        // Try Unsplash first (best quality)
        let images = await this.fetchFromUnsplash(phoneModel);

        // Fallback to Pexels
        if (images.length === 0) {
          images = await this.fetchFromPexels(phoneModel);
        }

        // Final fallback to Pixabay
        if (images.length === 0) {
          images = await this.fetchFromPixabay(phoneModel);
        }

        this.images.set(phoneModel, images.slice(0, 3)); // Max 3 images per phone
        console.log(`✅ Found ${images.length} images for ${phoneModel}`);

        // Rate limiting
        await this.sleep(1000);

      } catch (error) {
        console.error(`❌ Error fetching images for ${phoneModel}:`, error.message);
        this.images.set(phoneModel, []);
      }
    }

    return this.images;
  }

  // Fetch from Unsplash API
  async fetchFromUnsplash(phoneModel) {
    try {
      const response = await axios.get(`${APIS.unsplash.baseURL}${APIS.unsplash.search}`, {
        params: {
          query: phoneModel,
          per_page: 5,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${APIS.unsplash.key}`
        }
      });

      return response.data.results.map(photo => ({
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        alt: `${phoneModel} - ${photo.alt_description || 'Smartphone'}`,
        source: 'unsplash',
        photographer: photo.user.name,
        width: photo.width,
        height: photo.height
      }));

    } catch (error) {
      console.log(`Unsplash API failed for ${phoneModel}:`, error.response?.status || error.message);
      return [];
    }
  }

  // Fetch from Pexels API
  async fetchFromPexels(phoneModel) {
    try {
      const response = await axios.get(`${APIS.pexels.baseURL}${APIS.pexels.search}`, {
        params: {
          query: phoneModel,
          per_page: 5,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': APIS.pexels.key
        }
      });

      return response.data.photos.map(photo => ({
        url: photo.src.large,
        thumbnail: photo.src.medium,
        alt: `${phoneModel} - ${photo.alt || 'Smartphone'}`,
        source: 'pexels',
        photographer: photo.photographer,
        width: photo.width,
        height: photo.height
      }));

    } catch (error) {
      console.log(`Pexels API failed for ${phoneModel}:`, error.response?.status || error.message);
      return [];
    }
  }

  // Fetch from Pixabay API
  async fetchFromPixabay(phoneModel) {
    try {
      const response = await axios.get(APIS.pixabay.baseURL, {
        params: {
          key: APIS.pixabay.key,
          q: phoneModel,
          image_type: 'photo',
          per_page: 5,
          orientation: 'horizontal'
        }
      });

      return response.data.hits.map(hit => ({
        url: hit.largeImageURL,
        thumbnail: hit.previewURL,
        alt: `${phoneModel} - ${hit.tags}`,
        source: 'pixabay',
        photographer: hit.user,
        width: hit.imageWidth,
        height: hit.imageHeight
      }));

    } catch (error) {
      console.log(`Pixabay API failed for ${phoneModel}:`, error.response?.status || error.message);
      return [];
    }
  }

  // Save images data to JSON file
  saveToJSON() {
    const data = Object.fromEntries(this.images);
    const filePath = path.join(__dirname, 'phone-images.json');

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`💾 Saved images data to ${filePath}`);

    return data;
  }

  // Generate updated seed data with real images
  generateUpdatedSeedData() {
    const imagesData = Object.fromEntries(this.images);
    const updatedProducts = [];

    // This would need to be integrated with your existing seed.js
    console.log('\n📋 Updated seed data structure:');
    console.log(JSON.stringify({
      name: 'iPhone 15 Pro Max',
      images: imagesData['iPhone 15 Pro Max'] || []
    }, null, 2));

    return imagesData;
  }

  // Utility function for rate limiting
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  console.log('🚀 Phone Image Fetcher Starting...\n');

  const fetcher = new PhoneImageFetcher();

  try {
    // Fetch all phone images
    await fetcher.fetchAllPhoneImages();

    // Save results
    const imagesData = fetcher.saveToJSON();

    // Show summary
    console.log('\n📊 Summary:');
    Object.entries(imagesData).forEach(([phone, images]) => {
      console.log(`  ${phone}: ${images.length} images`);
    });

    console.log('\n✅ Phone image fetching completed!');
    console.log('\n🔑 To use these images:');
    console.log('1. Get API keys from:');
    console.log('   • Unsplash: https://unsplash.com/developers');
    console.log('   • Pexels: https://www.pexels.com/api/');
    console.log('   • Pixabay: https://pixabay.com/api/docs/');
    console.log('2. Add keys to your .env file');
    console.log('3. Update your seed.js to use the fetched image URLs');

  } catch (error) {
    console.error('❌ Error in main execution:', error);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PhoneImageFetcher;
