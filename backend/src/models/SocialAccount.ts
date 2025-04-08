import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ISocialAccount extends Document {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  accountId: string;
  accountName: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  userId: mongoose.Types.ObjectId;
  permissions?: ('read' | 'write' | 'manage')[];
  isActive: boolean;
  lastSynced?: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const socialAccountSchema = new Schema({
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
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
socialAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });
socialAccountSchema.index({ accountId: 1, platform: 1 }, { unique: true });

export const SocialAccount = mongoose.model<ISocialAccount>('SocialAccount', socialAccountSchema); 