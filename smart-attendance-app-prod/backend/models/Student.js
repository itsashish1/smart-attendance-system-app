const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, required: true, unique: true, uppercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  branch: { type: String, required: true, enum: ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE', 'Other'] },
  semester: { type: Number, required: true, min: 1, max: 8 },
  section: { type: String, default: 'A' },
  phone: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
