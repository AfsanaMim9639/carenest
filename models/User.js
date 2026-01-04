import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,  // ✅ ONLY unique, NO index here
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'credentials';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials'
  },
  providerId: {
    type: String,
    sparse: true
  },
  image: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  address: {
    division: String,
    district: String,
    city: String,
    area: String,
    fullAddress: String
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ✅ Indexes defined ONLY here
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

// Hash password
UserSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
});

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// toJSON
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Proper model cleanup
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;