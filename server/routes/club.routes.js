import express from 'express';
import { getClubs, getClub, createClub, updateClub, deleteClub, joinClub, leaveClub } from '../controllers/club.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/', protect, authorize('admin', 'club_admin'), createClub);
router.put('/:id', protect, authorize('admin', 'club_admin'), updateClub);
router.delete('/:id', protect, authorize('admin'), deleteClub);
router.post('/:id/join', protect, joinClub);
router.post('/:id/leave', protect, leaveClub);

export default router;
