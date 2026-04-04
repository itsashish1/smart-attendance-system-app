import Club from '../models/Club.model.js';
import Event from '../models/Event.model.js';
import Post from '../models/Post.model.js';
import Faculty from '../models/Faculty.model.js';
// GET /api/search?q=query
export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.status(400).json({ message: 'Query too short' });
    const regex = { $regex: q, $options: 'i' };

    const [clubs, events, posts, faculty] = await Promise.all([
      Club.find({ name: regex, isActive: true }).select('name description category logo').limit(5),
      Event.find({ title: regex, isPublished: true }).select('title description startDate venue status').limit(5),
      Post.find({ title: regex }).select('title category createdAt').populate('author', 'name').limit(5),
      Faculty.find({ $or: [{ name: regex }, { department: regex }], isActive: true }).select('name department email designation').limit(5),
    ]);

    res.json({ clubs, events, posts, faculty });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
