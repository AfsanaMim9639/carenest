import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  serviceId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Baby Care', 'Elderly Care', 'Special Care']
  },
  rate: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['hour', 'day'],
    default: 'hour'
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: '/images/services/default.jpg'
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ serviceId: 1 });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);