const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [100, 'Quantity cannot exceed 100']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  coupon: {
    code: { type: String, trim: true, uppercase: true },
    discount: { type: Number, min: 0, max: 100 },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    }
  },
  subtotal: {
    type: Number,
    default: 0,
    min: [0, 'Subtotal cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  shipping: {
    type: Number,
    default: 0,
    min: [0, 'Shipping cost cannot be negative']
  },
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'PHP'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better performance
cartSchema.index({ user: 1, isActive: 1 });

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for formatted total
cartSchema.virtual('formattedTotal').get(function() {
  return `${this.currency} ${this.total.toFixed(2)}`;
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  this.calculateTotals();
  next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = function(product, quantity = 1) {
  const existingItem = this.items.find(
    item => item.product.toString() === product._id.toString()
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: product._id,
      quantity,
      price: product.price
    });
  }

  return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    this.removeItem(productId);
  } else {
    item.quantity = quantity;
  }

  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = null;
  this.subtotal = 0;
  this.discount = 0;
  this.tax = 0;
  this.shipping = 0;
  this.total = 0;
  return this.save();
};

// Instance method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discount, discountType = 'percentage') {
  this.coupon = {
    code: couponCode,
    discount,
    discountType
  };
  return this.save();
};

// Instance method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.coupon = null;
  return this.save();
};

// Instance method to calculate totals
cartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate discount
  if (this.coupon) {
    if (this.coupon.discountType === 'percentage') {
      this.discount = (this.subtotal * this.coupon.discount) / 100;
    } else {
      this.discount = Math.min(this.coupon.discount, this.subtotal);
    }
  } else {
    this.discount = 0;
  }

  // Calculate tax (12% VAT for Philippines)
  this.tax = (this.subtotal - this.discount) * 0.12;

  // Calculate shipping (free shipping for orders above ₱2000)
  this.shipping = (this.subtotal - this.discount) >= 2000 ? 0 : 150;

  // Calculate total
  this.total = this.subtotal - this.discount + this.tax + this.shipping;

  return this;
};

// Static method to find active cart for user
cartSchema.statics.findActiveCart = function(userId) {
  return this.findOne({ user: userId, isActive: true });
};

module.exports = mongoose.model('Cart', cartSchema);
