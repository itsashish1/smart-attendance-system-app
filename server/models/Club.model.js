import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['technical', 'cultural', 'sports', 'social', 'other'],
      default: 'other',
    },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    socialLinks: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Club', clubSchema);
