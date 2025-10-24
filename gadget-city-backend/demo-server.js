const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve static files (for demo)
app.use(express.static(path.join(__dirname)));

// Load real images data
let imagesData = {};
try {
  const imagesPath = path.join(__dirname, 'phone-images.json');
  if (fs.existsSync(imagesPath)) {
    imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf8'));
  }
} catch (error) {
  console.error('Error loading images:', error.message);
}

// Demo API endpoint - shows available products with images
app.get('/api/products', (req, res) => {
  const products = Object.entries(imagesData).map(([name, images]) => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    price: Math.floor(Math.random() * 50000) + 10000, // Random price for demo
    images: images.slice(0, 1), // First image only for demo
    description: `Professional ${name} with exceptional features and build quality.`,
    category: name.includes('iPhone') || name.includes('iPad') ? 'apple' :
              name.includes('Samsung') ? 'samsung' :
              name.includes('Sony') ? 'sony' : 'other',
    inStock: Math.random() > 0.2 // 80% chance in stock
  }));

  res.json({
    success: true,
    data: products,
    total: products.length,
    message: 'Real product images loaded successfully!'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'image-demo.html'));
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    imagesLoaded: Object.keys(imagesData).length,
    message: 'Gadget City Image Demo Server Running!'
  });
});

// Image proxy endpoint (for external images)
app.get('/api/image-proxy/:url', async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.params.url);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Cache-Control', 'public, max-age=3600');
    response.body.pipe(res);

  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load image'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
🎉 Gadget City Image Demo Server Started!
📍 Server: http://localhost:${PORT}
📁 Demo Page: http://localhost:${PORT}/
🔗 API: http://localhost:${PORT}/api/products
❤️ Health: http://localhost:${PORT}/health
🖼️ Images: ${Object.keys(imagesData).length} products loaded
  `);
});

module.exports = app;
