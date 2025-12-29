import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Service Information
  serviceId: {
    type: Number,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  serviceIcon: {
    type: String,
    default: '🏥'
  },
  serviceType: {
    type: String,
    enum: ['baby-care', 'elderly-care', 'special-care'],
    default: 'baby-care'
  },
  serviceRate: {
    type: Number,
    required: true
  },
  
  // Personal Details
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Duration
  durationType: {
    type: String,
    enum: ['hours', 'days'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  
  // Timing (computed from booking)
  date: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: String,
    default: 'TBD'
  },
  endTime: {
    type: String,
    default: 'TBD'
  },
  
  // Location
  division: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  
  // Computed location string
  location: {
    type: String
  },
  
  // Additional Information
  notes: {
    type: String,
    default: ''
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  
  // Pricing
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  // Booking Date
  bookingDate: {
    type: Date,
    default: Date.now
  },
  
  // Caregiver Assignment
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    default: null
  },
  caregiverName: {
    type: String,
    default: 'Pending Assignment'
  },
  
  // Payment Information
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'mobile banking', 'bank transfer'],
    default: 'card'
  },
  
  // Cancellation
  cancellationReason: {
    type: String,
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  collection: 'bookings'
});

// Indexes for better query performance
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ phone: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1, date: 1 });
BookingSchema.index({ createdAt: -1 });

// Pre-save middleware to set location string
BookingSchema.pre('save', function(next) {
  if (this.area && this.city) {
    this.location = `${this.area}, ${this.city}`;
  }
  if (this.notes) {
    this.specialRequirements = this.notes;
  }
  next();
});

// Virtual for formatted time
BookingSchema.virtual('time').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for display ID
BookingSchema.virtual('displayId').get(function() {
  return `#${this._id.toString().slice(-8).toUpperCase()}`;
});

// Method to check if booking can be cancelled
BookingSchema.methods.canBeCancelled = function() {
  return this.status === 'pending';
};

// Configure toJSON to include virtuals
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

// Delete existing model to prevent OverwriteModelError
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;