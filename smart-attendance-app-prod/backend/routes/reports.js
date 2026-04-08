const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// GET overall report — all students with attendance %
router.get('/summary', auth, async (req, res) => {
  try {
    const { branch, semester, subject, startDate, endDate } = req.query;

    // Build student filter
    let studentFilter = { isActive: true };
    if (branch) studentFilter.branch = branch;
    if (semester) studentFilter.semester = parseInt(semester);
    const students = await Student.find(studentFilter).sort({ rollNumber: 1 });

    // Build attendance date filter
    let dateFilter = {};
    if (startDate) dateFilter.$gte = startDate;
    if (endDate) dateFilter.$lte = endDate;

    const report = await Promise.all(students.map(async (s) => {
      let attFilter = { student: s._id };
      if (subject) attFilter.subject = subject;
      if (startDate || endDate) attFilter.date = dateFilter;

      const records = await Attendance.find(attFilter);
      const total = records.length;
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const late = records.filter(r => r.status === 'late').length;
      const percentage = total ? Math.round(((present + late) / total) * 100) : 0;

      return {
        student: { id: s._id, name: s.name, rollNumber: s.rollNumber, branch: s.branch, semester: s.semester },
        total, present, absent, late, percentage,
        status: percentage >= 75 ? 'safe' : percentage >= 60 ? 'warning' : 'danger'
      };
    }));

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalAttendance = await Attendance.countDocuments();
    const todayRecords = await Attendance.find({ date: today });
    const todayPresent = todayRecords.filter(r => r.status === 'present').length;
    const todayAbsent = todayRecords.filter(r => r.status === 'absent').length;
    const todayLate = todayRecords.filter(r => r.status === 'late').length;

    // Monthly trend — last 30 days
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const recs = await Attendance.find({ date: dateStr });
      const p = recs.filter(r => r.status === 'present').length;
      const total = recs.length;
      last30.push({ date: dateStr, present: p, total, percentage: total ? Math.round((p / total) * 100) : 0 });
    }

    res.json({
      totalStudents,
      totalAttendance,
      today: { date: today, present: todayPresent, absent: todayAbsent, late: todayLate, total: todayRecords.length },
      trend: last30
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CSV export data
router.get('/export', auth, async (req, res) => {
  try {
    const { branch, semester, subject, startDate, endDate } = req.query;

    let attFilter = {};
    if (subject) attFilter.subject = subject;
    if (startDate || endDate) {
      attFilter.date = {};
      if (startDate) attFilter.date.$gte = startDate;
      if (endDate) attFilter.date.$lte = endDate;
    }

    let studentFilter = { isActive: true };
    if (branch) studentFilter.branch = branch;
    if (semester) studentFilter.semester = parseInt(semester);
    const students = await Student.find(studentFilter);
    const studentIds = students.map(s => s._id);
    if (studentIds.length) attFilter.student = { $in: studentIds };

    const records = await Attendance.find(attFilter)
      .populate('student', 'name rollNumber branch semester')
      .sort({ date: 1 });

    // Build CSV
    let csv = 'Roll Number,Name,Branch,Semester,Date,Subject,Status\n';
    records.forEach(r => {
      if (r.student) {
        csv += `${r.student.rollNumber},${r.student.name},${r.student.branch},${r.student.semester},${r.date},${r.subject},${r.status}\n`;
      }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
