import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Route imports
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import clubRoutes from './routes/club.routes.js';
import eventRoutes from './routes/event.routes.js';
import forumRoutes from './routes/forum.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import supportRoutes from './routes/support.routes.js';
import searchRoutes from './routes/search.routes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Production Middleware & Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(mongoSanitize());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/search', searchRoutes);
// Serve Frontend in Production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Health check for development
  app.get('/', (req, res) => {
    res.json({ message: 'UCIS API is running (Development)', status: 'ok' });
  });
  
  // 404 handler for development API
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message 
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
