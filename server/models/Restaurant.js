const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 500
  },
  cuisine: [{
    type: String,
    trim: true
  }],
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: 'Mumbai' },
    state: { type: String, default: 'Maharashtra' },
    zipCode: { type: String, default: '' }
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    default: '30-40 min'
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  openingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '23:00' }
  },
  tags: [{
    type: String,
    trim: true
  }],
  mood: [{
    type: String,
    enum: ['spicy', 'sweet', 'comfort', 'healthy', 'quick', 'premium'],
    default: []
  }]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
