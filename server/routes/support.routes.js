import express from 'express';
import { getTickets, getTicket, createTicket, replyToTicket, updateTicketStatus } from '../controllers/support.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getTickets);
router.get('/:id', protect, getTicket);
router.post('/', protect, createTicket);
router.post('/:id/reply', protect, replyToTicket);
router.put('/:id/status', protect, authorize('admin'), updateTicketStatus);

export default router;
