import mongoose from 'mongoose';
import crypto from 'crypto';

const monitoredEmailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  emailHash: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastScanned: Date,
  breachCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate email hash before saving
monitoredEmailSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.emailHash = crypto.createHash('sha1')
      .update(this.email)
      .digest('hex')
      .toUpperCase();
  }
  next();
});

export default mongoose.model('MonitoredEmail', monitoredEmailSchema);