import express from 'express';
import { getFacultyList, getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../controllers/faculty.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getFacultyList);
router.get('/:id', getFaculty);
router.post('/', protect, authorize('admin'), createFaculty);
router.put('/:id', protect, authorize('admin'), updateFaculty);
router.delete('/:id', protect, authorize('admin'), deleteFaculty);

export default router;
