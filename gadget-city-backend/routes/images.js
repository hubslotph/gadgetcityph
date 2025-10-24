const express = require('express');
const Product = require('../models/Product');
const {
  uploadMultiple,
  moveToPermanent,
  createThumbnail,
  deleteOldImages,
  cleanTempDirectory
} = require('../middleware/imageUpload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// @desc    Upload images for a product
// @route   POST /api/images/upload/:productId
// @access  Private/Admin
router.post('/upload/:productId', uploadMultiple('images', 10), async (req, res) => {
  try {
    const { productId } = req.params;
    const { altTexts } = req.body; // Array of alt texts for images

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images uploaded'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const uploadedImages = [];

    // Process each uploaded file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const tempPath = file.path;

      try {
        // Move file to permanent location
        const permanentImage = moveToPermanent(tempPath, productId, i);

        // Create thumbnail
        const thumbnail = createThumbnail(permanentImage.path, productId, i);

        // Get alt text for this image
        const altText = altTexts && altTexts[i] ? altTexts[i] : `${product.name} - Image ${i + 1}`;

        uploadedImages.push({
          url: permanentImage.url,
          thumbnailUrl: thumbnail.url,
          alt: altText,
          filename: permanentImage.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        });

      } catch (error) {
        console.error(`Error processing image ${file.originalname}:`, error);
        // Clean up temp file if it still exists
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      }
    }

    // Update product with new images
    const currentImages = product.images || [];
    product.images = [...currentImages, ...uploadedImages];
    await product.save();

    // Clean up temp directory
    cleanTempDirectory();

    res.json({
      success: true,
      data: uploadedImages,
      message: `${uploadedImages.length} images uploaded successfully`
    });

  } catch (error) {
    // Clean up temp directory in case of error
    cleanTempDirectory();

    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while uploading images'
    });
  }
});

// @desc    Delete specific image from product
// @route   DELETE /api/images/:productId/:imageIndex
// @access  Private/Admin
router.delete('/:productId/:imageIndex', async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (!product.images || index >= product.images.length) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    // Get image info before deletion
    const imageToDelete = product.images[index];

    // Delete physical files
    if (imageToDelete.url) {
      const fullPath = path.join(process.cwd(), 'public', imageToDelete.url);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }

      // Also delete thumbnail if it exists
      const thumbnailPath = fullPath.replace('/products/', '/products/thumbnails/').replace(/\.[^.]+$/, '_thumb$&');
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    // Remove from product images array
    product.images.splice(index, 1);
    await product.save();

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting image'
    });
  }
});

// @desc    Reorder product images
// @route   PUT /api/images/reorder/:productId
// @access  Private/Admin
router.put('/reorder/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageOrder } = req.body; // Array of image indices in new order

    if (!Array.isArray(imageOrder)) {
      return res.status(400).json({
        success: false,
        error: 'imageOrder must be an array'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (!product.images || product.images.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product has no images to reorder'
      });
    }

    // Validate imageOrder array
    if (imageOrder.length !== product.images.length) {
      return res.status(400).json({
        success: false,
        error: 'imageOrder array length must match number of images'
      });
    }

    // Create new ordered array
    const reorderedImages = imageOrder.map(index => product.images[index]);
    product.images = reorderedImages;
    await product.save();

    res.json({
      success: true,
      data: product.images,
      message: 'Images reordered successfully'
    });

  } catch (error) {
    console.error('Image reorder error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while reordering images'
    });
  }
});

// @desc    Get all images for a product
// @route   GET /api/images/:productId
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product.images || []
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while fetching images'
    });
  }
});

// @desc    Serve product images statically
// @route   GET /images/products/:filename
// @access  Public
router.get('/products/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'public/images/products', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'Image not found'
    });
  }

  // Set appropriate headers
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

  // Send file
  res.sendFile(filePath);
});

// @desc    Serve product thumbnails
// @route   GET /images/products/thumbnails/:filename
// @access  Public
router.get('/products/thumbnails/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'public/images/products/thumbnails', filename);

  // Check if thumbnail exists, otherwise serve original
  if (!fs.existsSync(filePath)) {
    const originalPath = path.join(process.cwd(), 'public/images/products', filename.replace('_thumb', ''));
    if (fs.existsSync(originalPath)) {
      res.sendFile(originalPath);
      return;
    }
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      error: 'Thumbnail not found'
    });
  }

  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=31536000');

  res.sendFile(filePath);
});

module.exports = router;
