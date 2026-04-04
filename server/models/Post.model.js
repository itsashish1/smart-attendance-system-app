import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'general', 'announcement', 'help', 'placement'],
      default: 'general',
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema],
    views: { type: Number, default: 0 },
    isClosed: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
