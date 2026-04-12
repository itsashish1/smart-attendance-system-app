const dotenv = require('dotenv');
// Load .env only for local development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const studentRoutes = require('./routes/students');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health checks (Render-friendly)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/reports', reportRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI;

  // Fail fast on Render/production if env is missing
  if (process.env.NODE_ENV === 'production' && !mongoUri) {
    console.error('Missing required env var: MONGODB_URI');
    process.exit(1);
  }

  // For local dev, keep existing fallback
  const uri = mongoUri || 'mongodb://localhost:27017/smart-attendance';

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Error:', err);
    // If DB is down in production, exit to let Render restart
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();

module.exports = app;