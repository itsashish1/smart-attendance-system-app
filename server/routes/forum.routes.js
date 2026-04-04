import express from 'express';
import { getPosts, getPost, createPost, addReply, upvotePost, deletePost } from '../controllers/forum.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', protect, createPost);
router.post('/:id/reply', protect, addReply);
router.post('/:id/upvote', protect, upvotePost);
router.delete('/:id', protect, deletePost);

export default router;
