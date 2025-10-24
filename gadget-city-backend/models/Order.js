const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  name: {
    type: String,
    required: true
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true
  },
  country: {
    type: String,
    default: 'Philippines',
    trim: true
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
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
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'PHP'
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'gcash', 'maya', 'card', 'bank_transfer'],
    default: 'cod'
  },
  shippingAddress: shippingAddressSchema,
  billingAddress: {
    type: shippingAddressSchema,
    default: null
  },
  coupon: {
    code: { type: String, trim: true, uppercase: true },
    discount: { type: Number, min: 0 },
    discountType: { type: String, enum: ['percentage', 'fixed'] }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  estimatedDelivery: {
    type: Date
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

// Virtual for formatted total
orderSchema.virtual('formattedTotal').get(function() {
  return `${this.currency} ${this.total.toFixed(2)}`;
});

// Virtual for item count
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for full shipping address
orderSchema.virtual('fullShippingAddress').get(function() {
  if (!this.shippingAddress) return '';
  const { street, city, province, zipCode, country } = this.shippingAddress;
  return [street, city, province, zipCode, country]
    .filter(Boolean)
    .join(', ');
});

// Pre-save middleware to generate order number and calculate totals
orderSchema.pre('save', function(next) {
  // Generate order number if not exists
  if (!this.orderNumber) {
    this.orderNumber = 'GC' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // Set timestamps based on status
  if (this.isModified('status')) {
    if (this.status === 'shipped' && !this.shippedAt) {
      this.shippedAt = new Date();
    }
    if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
  }

  next();
});

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;

  if (newStatus === 'shipped' && !this.shippedAt) {
    this.shippedAt = new Date();
  }
  if (newStatus === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function() {
  if (['delivered', 'shipped'].includes(this.status)) {
    throw new Error('Cannot cancel delivered or shipped orders');
  }
  this.status = 'cancelled';
  return this.save();
};

// Instance method to add tracking number
orderSchema.methods.addTrackingNumber = function(trackingNumber) {
  this.trackingNumber = trackingNumber;
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
