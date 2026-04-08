const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true },   // "YYYY-MM-DD"
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' },
  subject: { type: String, default: 'General' },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index: one record per student per date per subject
AttendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
