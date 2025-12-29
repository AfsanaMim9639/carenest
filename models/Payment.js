import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'bdt',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'mobile banking', 'bank transfer'],
    default: 'card'
  },
  stripePaymentIntentId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  stripeChargeId: {
    type: String,
    sparse: true
  },
  paidAt: {
    type: Date,
    default: null
  },
  refundedAt: {
    type: Date,
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  collection: 'payments'
});

// Indexes for better query performance
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });

// Virtual for display amount
PaymentSchema.virtual('displayAmount').get(function() {
  return `৳${this.amount.toLocaleString()}`;
});

// Method to check if payment can be refunded
PaymentSchema.methods.canBeRefunded = function() {
  return this.status === 'completed' && !this.refundedAt;
};

// Configure toJSON to include virtuals
PaymentSchema.set('toJSON', { virtuals: true });
PaymentSchema.set('toObject', { virtuals: true });

// Delete existing model to prevent OverwriteModelError
if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;