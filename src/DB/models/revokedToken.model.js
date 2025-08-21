import mongoose from 'mongoose';

const revokedTokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      enum: ['logout', 'expired', 'compromised', 'manual'],
      default: 'manual',
    },
    revokedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date, // optional: to auto-clean expired tokens
    },
  },
  { timestamps: true }
);

// Optional: TTL index to auto-remove expired revoked tokens
revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const revokedTokenModel = mongoose.model('RevokedToken', revokedTokenSchema);
export default revokedTokenModel;
