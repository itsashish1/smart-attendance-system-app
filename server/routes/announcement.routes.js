import express from 'express';
import { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', protect, authorize('admin', 'faculty'), createAnnouncement);
router.put('/:id', protect, authorize('admin', 'faculty'), updateAnnouncement);
router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

export default router;
