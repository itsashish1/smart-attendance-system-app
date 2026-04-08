const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// GET all students
router.get('/', auth, async (req, res) => {
  try {
    const { branch, semester, section } = req.query;
    let filter = { isActive: true };
    if (branch) filter.branch = branch;
    if (semester) filter.semester = parseInt(semester);
    if (section) filter.section = section;
    const students = await Student.find(filter).sort({ rollNumber: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new student
router.post('/', auth, async (req, res) => {
  try {
    const { name, rollNumber, email, branch, semester, section, phone } = req.body;
    if (!name || !rollNumber || !email || !branch || !semester) {
      return res.status(400).json({ message: 'name, rollNumber, email, branch, semester are required' });
    }
    const existing = await Student.findOne({ $or: [{ rollNumber: rollNumber.toUpperCase() }, { email }] });
    if (existing) return res.status(400).json({ message: 'Student with this roll number or email already exists' });

    const student = new Student({ name, rollNumber: rollNumber.toUpperCase(), email, branch, semester, section: section || 'A', phone });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update student
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE (soft delete) student
router.delete('/:id', auth, async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Student removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
