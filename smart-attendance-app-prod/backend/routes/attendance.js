const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// GET all attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { date, subject, studentId } = req.query;
    let filter = {};
    if (date) filter.date = date;
    if (subject) filter.subject = subject;
    if (studentId) filter.student = studentId;
    const attendance = await Attendance.find(filter)
      .populate('student', 'name rollNumber branch semester section')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST mark attendance (single)
router.post('/', auth, async (req, res) => {
  try {
    const { studentId, status, date, subject, remarks } = req.body;
    if (!studentId || !date) return res.status(400).json({ message: 'studentId and date are required' });

    // Upsert: update if exists, else create
    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, date, subject: subject || 'General' },
      { student: studentId, status, date, subject: subject || 'General', markedBy: req.user.id, remarks },
      { new: true, upsert: true }
    ).populate('student', 'name rollNumber');
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST bulk mark attendance for a whole class
router.post('/bulk', auth, async (req, res) => {
  try {
    const { records, date, subject } = req.body;
    // records: [{ studentId, status }]
    if (!records || !date) return res.status(400).json({ message: 'records and date are required' });

    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.studentId, date, subject: subject || 'General' },
        update: { student: r.studentId, status: r.status, date, subject: subject || 'General', markedBy: req.user.id },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(ops);
    const saved = await Attendance.find({ date, subject: subject || 'General' })
      .populate('student', 'name rollNumber');
    res.json({ message: 'Attendance marked successfully', count: saved.length, records: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET attendance by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ date: req.params.date })
      .populate('student', 'name rollNumber branch semester section')
      .sort({ 'student.rollNumber': 1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET student attendance summary
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId }).sort({ date: -1 });
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const percentage = total ? Math.round((present / total) * 100) : 0;
    res.json({ records, summary: { total, present, absent, late, percentage } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update attendance
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    ).populate('student', 'name rollNumber');
    if (!attendance) return res.status(404).json({ message: 'Record not found' });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE attendance record
router.delete('/:id', auth, async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
