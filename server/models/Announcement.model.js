import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'exam', 'event', 'holiday', 'placement', 'general'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'faculty', 'admins'],
      default: 'all',
    },
    expiresAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
    attachmentUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
