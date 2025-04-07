const mongoose = require('mongoose');

const SocialAccountSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'tiktok', 'youtube'],
    required: true
  },
  accountId: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'manage']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastSynced: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
SocialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });
SocialAccountSchema.index({ accountId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('SocialAccount', SocialAccountSchema); 