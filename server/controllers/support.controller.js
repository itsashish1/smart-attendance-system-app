import SupportTicket from '../models/SupportTicket.model.js';

// GET /api/support (user's own tickets / admin gets all)
export const getTickets = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { raisedBy: req.user._id };
    const tickets = await SupportTicket.find(filter)
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/support/:id
export const getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('raisedBy', 'name email')
      .populate('replies.repliedBy', 'name role');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.raisedBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/support
export const createTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create({ ...req.body, raisedBy: req.user._id });
    res.status(201).json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/support/:id/reply
export const replyToTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.replies.push({ message: req.body.message, repliedBy: req.user._id, isAdminReply: req.user.role === 'admin' });
    if (req.user.role === 'admin' && ticket.status === 'open') ticket.status = 'in_progress';
    await ticket.save();
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PUT /api/support/:id/status (admin only)
export const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
