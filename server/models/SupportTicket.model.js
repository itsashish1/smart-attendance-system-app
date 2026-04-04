import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAdminReply: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['technical', 'academic', 'registration', 'account', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model('SupportTicket', supportTicketSchema);
