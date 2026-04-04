import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: '' },
    department: { type: String, required: true },
    designation: { type: String, default: '' },
    subjects: [{ type: String }],
    cabin: { type: String, default: '' },
    avatar: { type: String, default: '' },
    officeHours: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Faculty', facultySchema);
