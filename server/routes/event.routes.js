import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent } from '../controllers/event.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('admin', 'club_admin', 'faculty'), createEvent);
router.put('/:id', protect, authorize('admin', 'club_admin', 'faculty'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);

export default router;
