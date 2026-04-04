import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['workshop', 'seminar', 'competition', 'cultural', 'sports', 'other'],
      default: 'other',
    },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    venue: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date },
    maxParticipants: { type: Number, default: null },
    registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isPublished: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
