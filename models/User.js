import mongoose from "mongoose";

const fileSubSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true }, // Cloudinary public_id
  type: { type: String, required: true }, // PDF, Image, DOC, etc.
  size: { type: String, required: true }, // "240KB", "1.2MB"
  uploadedAt: { type: Date, default: Date.now },
  qrUrl: { type: String }, // URL to verify document
  qrCode: { type: String }, // Base64 QR code image
  access: { 
    type: String, 
    enum: ['public', 'private'], 
    default: 'private' 
  },
  status: { 
    type: String, 
    enum: ['verified', 'pending', 'expired'], 
    default: 'verified' 
  },
  folder: { type: String, default: 'root' }, // For organization
  tags: [{ type: String }], // Optional tags for categorization
  expiresAt: { type: Date }, // Optional expiry (null = permanent)
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // For email/password auth
  image: { type: String }, // For OAuth profile image
  provider: { 
    type: String, 
    enum: ['credentials', 'google'], 
    default: 'credentials' 
  },
  storageUsed: { type: Number, default: 0 }, // In bytes
  storageLimit: { type: Number, default: 5368709120 }, // 5GB default
  files: [fileSubSchema],
  folders: [{ 
    name: String, 
    createdAt: { type: Date, default: Date.now } 
  }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'files.id': 1 });

export default mongoose.models.User || mongoose.model("User", userSchema);
