import Announcement from '../models/Announcement.model.js';

// GET /api/announcements
export const getAnnouncements = async (req, res) => {
  try {
    const { category, priority } = req.query;
    const filter = { isPublished: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] };
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    const announcements = await Announcement.find(filter)
      .populate('author', 'name role')
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/announcements/:id
export const getAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findById(req.params.id).populate('author', 'name role');
    if (!ann) return res.status(404).json({ message: 'Announcement not found' });
    res.json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/announcements
export const createAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, author: req.user._id });
    res.status(201).json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/announcements/:id
export const updateAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ann) return res.status(404).json({ message: 'Announcement not found' });
    res.json(ann);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/announcements/:id
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
