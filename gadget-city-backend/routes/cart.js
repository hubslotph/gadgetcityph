const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// Middleware to get or create cart for user
const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId; // Assuming user authentication middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    let cart = await Cart.findOne({ user: userId, isActive: true });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }

    req.cart = cart;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while retrieving cart'
    });
  }
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', getCart, async (req, res) => {
  try {
    await req.cart.populate('items.product');
    await req.cart.calculateTotals();

    res.json({
      success: true,
      data: req.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching cart'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', getCart, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    // Check if product exists and is in stock
    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (!product.isInStock()) {
      return res.status(400).json({
        success: false,
        error: 'Product is out of stock'
      });
    }

    // Add item to cart
    await req.cart.addItem(product, parseInt(quantity));
    await req.cart.populate('items.product');
    await req.cart.calculateTotals();

    res.json({
      success: true,
      data: req.cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    if (error.message === 'Insufficient stock') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while adding item to cart'
    });
  }
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
router.put('/update', getCart, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Product ID and quantity are required'
      });
    }

    // Check if product exists
    const product = await Product.findOne({ _id: productId, isActive: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await req.cart.removeItem(productId);
    } else {
      // Check stock availability
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock'
        });
      }

      await req.cart.updateItemQuantity(productId, parseInt(quantity));
    }

    await req.cart.populate('items.product');
    await req.cart.calculateTotals();

    res.json({
      success: true,
      data: req.cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    if (error.message === 'Item not found in cart' || error.message === 'Insufficient stock') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while updating cart'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
router.delete('/remove/:productId', getCart, async (req, res) => {
  try {
    await req.cart.removeItem(req.params.productId);
    await req.cart.populate('items.product');
    await req.cart.calculateTotals();

    res.json({
      success: true,
      data: req.cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while removing item from cart'
    });
  }
});

// @desc    Clear entire cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', getCart, async (req, res) => {
  try {
    await req.cart.clearCart();

    res.json({
      success: true,
      data: req.cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while clearing cart'
    });
  }
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/apply-coupon
// @access  Private
router.post('/apply-coupon', getCart, async (req, res) => {
  try {
    const { couponCode, discount, discountType = 'percentage' } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        error: 'Coupon code is required'
      });
    }

    await req.cart.applyCoupon(couponCode, discount, discountType);
    await req.cart.calculateTotals();

    res.json({
      success: true,
      data: req.cart,
      message: 'Coupon applied successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while applying coupon'
    });
  }
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/remove-coupon
// @access  Private
router.delete('/remove-coupon', getCart, async (req, res) => {
  try {
    await req.cart.removeCoupon();
    await req.cart.calculateTotals();

    res.json({
      success: true,
      data: req.cart,
      message: 'Coupon removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while removing coupon'
    });
  }
});

// @desc    Get cart summary (for checkout)
// @route   GET /api/cart/summary
// @access  Private
router.get('/summary', getCart, async (req, res) => {
  try {
    await req.cart.populate('items.product');
    await req.cart.calculateTotals();

    const summary = {
      itemCount: req.cart.itemCount,
      subtotal: req.cart.subtotal,
      discount: req.cart.discount,
      tax: req.cart.tax,
      shipping: req.cart.shipping,
      total: req.cart.total,
      currency: req.cart.currency,
      coupon: req.cart.coupon,
      items: req.cart.items.map(item => ({
        product: {
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images[0]?.url
        },
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      }))
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching cart summary'
    });
  }
});

// @desc    Check cart availability (stock check)
// @route   GET /api/cart/check-availability
// @access  Private
router.get('/check-availability', getCart, async (req, res) => {
  try {
    await req.cart.populate('items.product');

    const unavailableItems = [];
    const updatedItems = [];

    for (const item of req.cart.items) {
      if (!item.product.isActive) {
        unavailableItems.push({
          productId: item.product._id,
          name: item.product.name,
          reason: 'Product is no longer available'
        });
      } else if (item.quantity > item.product.stock) {
        updatedItems.push({
          productId: item.product._id,
          name: item.product.name,
          requested: item.quantity,
          available: item.product.stock,
          newQuantity: item.product.stock
        });
      }
    }

    res.json({
      success: true,
      available: unavailableItems.length === 0 && updatedItems.length === 0,
      unavailableItems,
      updatedItems,
      message: unavailableItems.length > 0 ?
        'Some items in your cart are no longer available' :
        updatedItems.length > 0 ?
        'Some items have limited stock' :
        'All items are available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while checking cart availability'
    });
  }
});

module.exports = router;
