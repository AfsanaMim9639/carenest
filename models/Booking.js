import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    required: true,
    enum: ['Baby Care', 'Elderly Care', 'Special Care']
  },
  serviceRate: {
    type: Number,
    required: true
  },
  
  // Personal Information
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    sparse: true
  },
  
  // Duration
  durationType: {
    type: String,
    enum: ['hours', 'days'],
    required: true
  },
  duration: {
    type: Number,
    required: true
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
  
  // Additional
  notes: String,
  
  // Booking Details
  totalCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // Timestamps
  bookingDate: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ serviceId: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);