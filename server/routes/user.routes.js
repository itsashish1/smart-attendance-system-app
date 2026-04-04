import express from 'express';
import User from '../models/User.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin: get all users
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update own profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, department, year, enrollmentNo, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, department, year, enrollmentNo, avatar }, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: update user role
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: deactivate user
router.put('/:id/deactivate', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
