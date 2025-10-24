const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort = '-createdAt',
      search,
      featured,
      inStock
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (search) {
      query.$text = { $search: search };
    }
    if (featured === 'true') query.isFeatured = true;
    if (inStock === 'true') query.stock = { $gt: 0 };

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (rating) query.rating = { $gte: parseFloat(rating) };

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with population
    const products = await Product.find(query)
      .populate('category')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching products'
    });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Get related products (same category, different product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      data: product,
      related: relatedProducts
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
      error: 'Server error while fetching product'
    });
  }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({
      category: req.params.category,
      isActive: true
    })
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({
      category: req.params.category,
      isActive: true
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching products by category'
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured/all', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching featured products'
    });
  }
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: [],
        suggestions: []
      });
    }

    const products = await Product.find(
      {
        $text: { $search: q },
        isActive: true
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    // Get unique brands and categories for suggestions
    const brands = await Product.distinct('brand', {
      $text: { $search: q },
      isActive: true
    });

    const categories = await Product.distinct('category', {
      $text: { $search: q },
      isActive: true
    });

    res.json({
      success: true,
      data: products,
      suggestions: {
        brands: brands.slice(0, 3),
        categories: categories.slice(0, 3)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while searching products'
    });
  }
});

// @desc    Create new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while creating product'
    });
  }
});

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors
      });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while updating product'
    });
  }
});

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
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
      error: 'Server error while deleting product'
    });
  }
});

// @desc    Get product statistics
// @route   GET /api/products/stats/overview
// @access  Private/Admin
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
          averagePrice: { $avg: '$price' },
          lowStock: {
            $sum: {
              $cond: [{ $lte: ['$stock', 5] }, 1, 0]
            }
          },
          outOfStock: {
            $sum: {
              $cond: [{ $eq: ['$stock', 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        categories: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching product statistics'
    });
  }
});

module.exports = router;
