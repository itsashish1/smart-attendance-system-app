import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PlusCircle, MessageSquare, Clock, Tag, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', description: '', category: 'other', priority: 'medium' });
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/support');
      setTickets(data);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/support', form);
      toast.success('Ticket raised successfully!');
      setShowForm(false);
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
      fetchTickets();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit ticket'); }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/support/${selected._id}/reply`, { message: reply });
      toast.success('Reply sent!');
      setReply('');
      const { data } = await api.get(`/support/${selected._id}`);
      setSelected(data);
      // Update the ticket in the list as well
      setTickets(tickets.map(t => t._id === data._id ? data : t));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send reply'); }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { data } = await api.put(`/support/${selected._id}/status`, { status: newStatus });
      toast.success(`Ticket status updated to ${newStatus.replace('_', ' ')}`);
      setSelected(data);
      setTickets(tickets.map(t => t._id === data._id ? data : t));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const statusColor = { 
    open: { bg: '#fee2e2', text: '#ef4444' }, 
    in_progress: { bg: '#fef3c7', text: '#f59e0b' }, 
    resolved: { bg: '#dcfce7', text: '#10b981' }, 
    closed: { bg: '#f1f5f9', text: '#64748b' } 
  };

  return (
    <div className="page-container animate-in">

      <div className="module-hero">
        <h1>{isAdmin ? 'System Support Management' : 'Help & Support'}</h1>
        <p>{isAdmin ? 'Manage student complaints, technical issues, and administrative requests.' : 'Raise tickets for IT issues, campus registration, or general queries.'}</p>
        {!isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ marginTop: '1.5rem', background: '#fff', color: 'var(--primary)', fontWeight: '600' }}>
            {showForm ? 'Cancel Ticket' : <><PlusCircle size={18} /> New Ticket</>}
          </button>
        )}
      </div>

      {showForm && !isAdmin && (
        <form onSubmit={handleCreate} className="list-card glass animate-in" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>

          <h3 style={{color: 'var(--primary)', marginBottom: '1rem'}}>Create Support Request</h3>
          
          <input 
            placeholder="Subject summary (e.g. Can't access LMS)" 
            value={form.subject} 
            onChange={(e) => setForm({ ...form, subject: e.target.value })} 
            required 
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
          />
          
          <textarea 
            placeholder="Describe the issue in detail..." 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            required 
            rows="5"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical'}}
          />
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Category</label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
              >
                {['technical', 'academic', 'registration', 'account', 'other'].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Priority</label>
              <select 
                value={form.priority} 
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
              >
                {['low', 'medium', 'high'].map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
          </div>
          
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="btn-primary">Submit Ticket</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <div className="list-layout staggered-entry">

          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text)' }}>
            {isAdmin ? 'All Active Support Tickets' : 'Your Tickets'}
          </h2>
          {tickets.map((t) => {
            const statusStyle = statusColor[t.status] || statusColor.closed;
            
            return (
              <div key={t._id} className="list-card glass" onClick={() => setSelected(t)} style={{ cursor: 'pointer', marginBottom: '1rem' }}>

                <div className="list-card-content flex-1">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: 'var(--text)', margin: 0 }}>{t.subject}</h3>
                    {isAdmin && <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: t.priority === 'high' ? '#ef4444' : '#64748b' }}>{t.priority}</span>}
                  </div>
                  <div className="list-card-meta">
                    {isAdmin && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><UserIcon size={16} /> {t.raisedBy?.name || 'Unknown'}</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'capitalize' }}><Tag size={16} /> {t.category}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={16} /> {new Date(t.createdAt).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={16} /> {t.replies?.length || 0} Replies</span>
                  </div>
                </div>
                
                <span className="badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            );
          })}
          {tickets.length === 0 && (
            <div className="empty-state">
              <h2>No support tickets found</h2>
              <p>{isAdmin ? 'Great! All issues are currently handled.' : 'Experiencing issues? Create a new ticket to get help.'}</p>
            </div>
          )}
        </div>
      )}

      {selected && (
        <div className="modal-overlay animate-in" onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '700px', borderRadius: 'var(--radius-lg)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>{selected.subject}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Raised by <strong>{selected.raisedBy?.name}</strong> on {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {isAdmin ? (
                  <select 
                    value={selected.status} 
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: '500' }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <span className="badge" style={{ backgroundColor: (statusColor[selected.status] || statusColor.closed).bg, color: (statusColor[selected.status] || statusColor.closed).text }}>
                    {selected.status.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text)', whiteSpace: 'pre-wrap', margin: 0 }}>{selected.description}</p>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <MessageSquare size={18} /> Discussion ({selected.replies?.length || 0})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {selected.replies?.map((r, i) => (
                <div key={i} style={{ 
                  background: r.isAdminReply ? '#eff6ff' : '#f1f5f9', 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius)',
                  borderLeft: '4px solid ' + (r.isAdminReply ? '#3b82f6' : '#94a3b8'),
                  alignSelf: r.isAdminReply ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: r.isAdminReply ? '#2563eb' : '#475569' }}>
                      {r.isAdminReply ? 'Support Agent' : (selected.raisedBy?.name || 'User')}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(r.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{r.message}</p>
                </div>
              ))}
              {(!selected.replies || selected.replies.length === 0) && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
                  No discussion yet. {isAdmin ? 'Provide a response to initiate the resolution.' : 'Our staff will respond shortly.'}
                </div>
              )}
            </div>
            
            {selected.status !== 'closed' && selected.status !== 'resolved' && (
              <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea 
                  placeholder={isAdmin ? "Type your official response..." : "Type your reply here..."} 
                  value={reply} 
                  onChange={(e) => setReply(e.target.value)} 
                  required 
                  rows="3"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Close</button>
                  <button type="submit" className="btn-primary" style={{ background: isAdmin ? '#2563eb' : 'var(--primary)' }}>
                    {isAdmin ? 'Send official Response' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
            
            {(selected.status === 'closed' || selected.status === 'resolved') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>This ticket is marked as <strong>{selected.status}</strong> and is locked for replies.</p>
                <button type="button" onClick={() => setSelected(null)} className="btn-secondary">Close Window</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
