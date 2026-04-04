import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, year, enrollmentNo } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role, department, year, enrollmentNo });
    res.status(201).json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });
    res.json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
