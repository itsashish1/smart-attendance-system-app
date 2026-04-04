import Faculty from '../models/Faculty.model.js';

// GET /api/faculty
export const getFacultyList = async (req, res) => {
  try {
    const { department, search } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { subjects: { $regex: search, $options: 'i' } },
    ];
    const faculty = await Faculty.find(filter).sort({ name: 1 });
    res.json(faculty);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/faculty/:id
export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/faculty
export const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/faculty/:id
export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/faculty/:id
export const deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty record deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
