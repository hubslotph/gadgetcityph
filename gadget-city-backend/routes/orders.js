const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// Middleware to get user's cart for checkout
const getCartForCheckout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    const cart = await Cart.findOne({ user: userId, isActive: true })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    req.cart = cart;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while retrieving cart for checkout'
    });
  }
};

// @desc    Create new order from cart
// @route   POST /api/orders/create
// @access  Private
router.post('/create', getCartForCheckout, async (req, res) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod = 'cod',
      notes,
      coupon
    } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required'
      });
    }

    // Check cart availability before creating order
    const availabilityCheck = await checkCartAvailability(req.cart);

    if (!availabilityCheck.available) {
      return res.status(400).json({
        success: false,
        error: 'Some items are no longer available',
        details: availabilityCheck
      });
    }

    // Update cart items with current prices and names
    const orderItems = req.cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name
    }));

    // Calculate totals
    const subtotal = req.cart.subtotal;
    const discount = req.cart.discount;
    const tax = (subtotal - discount) * 0.12; // 12% VAT
    const shipping = (subtotal - discount) >= 2000 ? 0 : 150; // Free shipping over ₱2000
    const total = subtotal - discount + tax + shipping;

    // Create order
    const order = new Order({
      user: req.cart.user,
      items: orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes,
      coupon: req.cart.coupon,
      currency: req.cart.currency
    });

    await order.save();

    // Reduce product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart after successful order
    req.cart.items = [];
    req.cart.subtotal = 0;
    req.cart.discount = 0;
    req.cart.tax = 0;
    req.cart.shipping = 0;
    req.cart.total = 0;
    req.cart.coupon = null;
    await req.cart.save();

    // Populate order for response
    await order.populate('items.product');

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while creating order'
    });
  }
});

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      sort = '-createdAt'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const query = { user: userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
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
      error: 'Server error while fetching orders'
    });
  }
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while fetching order'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    await order.cancelOrder();

    // Restore product stock when order is cancelled
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    if (error.message === 'Cannot cancel delivered or shipped orders') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error while cancelling order'
    });
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    await order.updateStatus(status);

    if (trackingNumber && status === 'shipped') {
      await order.addTrackingNumber(trackingNumber);
    }

    await order.populate('items.product');

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while updating order status'
    });
  }
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/stats/overview
// @access  Private/Admin
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$total' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const recentOrders = await Order.find()
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        statusBreakdown: statusStats,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching order statistics'
    });
  }
});

// Helper function to check cart availability
async function checkCartAvailability(cart) {
  const unavailableItems = [];
  const updatedItems = [];

  for (const item of cart.items) {
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
        available: item.product.stock
      });
    }
  }

  return {
    available: unavailableItems.length === 0 && updatedItems.length === 0,
    unavailableItems,
    updatedItems
  };
}

module.exports = router;
