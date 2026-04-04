import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Bell, Calendar, User, AlertCircle, Pin, PlusSquare, X, Megaphone, Trash2 } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', priority: 'medium', isPinned: false });
  
  const { user } = useAuth();
  const canPost = ['admin', 'faculty'].includes(user?.role);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/announcements', { params: category ? { category } : {} });
      setAnnouncements(data);
    } catch {
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', form);
      toast.success('Announcement published successfully!');
      setShowModal(false);
      setForm({ title: '', content: '', category: 'general', priority: 'medium', isPinned: false });
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success('Notice deleted');
      fetchAnnouncements();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const categories = ['academic', 'exam', 'event', 'holiday', 'placement', 'general'];
  
  const priorityMap = {
    low: { color: '#64748b', bg: '#f1f5f9', icon: <Bell size={16} /> },
    medium: { color: '#2563eb', bg: '#eff6ff', icon: <Bell size={16} /> },
    high: { color: '#ea580c', bg: '#fff7ed', icon: <AlertCircle size={16} /> },
    urgent: { color: '#dc2626', bg: '#fef2f2', icon: <AlertCircle size={16} /> }
  };

  return (
    <div className="page-container animate-in">

      <div className="module-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Official Notice Board</h1>
            <p>Stay updated with the latest campus news, schedules, and important alerts.</p>
          </div>
          {canPost && (
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: '#fff', color: '#0f172a', fontWeight: '600' }}>
              <PlusSquare size={18} /> New Broadcast
            </button>
          )}
        </div>
      </div>

      <div className="filter-section" style={{ marginBottom: '2rem' }}>
        <div className="filter-pills">
          <button className={`filter-pill ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>All Notices</button>
          {categories.map((c) => (
            <button key={c} className={`filter-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="loading-screen animate-in">
          <div className="loading-spinner"></div>
          <p>Fetching latest notices...</p>
        </div>
      ) : (
        <div className="list-layout staggered-entry">
          {announcements.map((ann) => {
            const pStyle = priorityMap[ann.priority] || priorityMap.low;
            
            return (
              <div key={ann._id} className="list-card glass" style={{ 
                borderLeft: ann.isPinned ? '5px solid #eab308' : `5px solid ${pStyle.color}`,
                position: 'relative',
                marginBottom: '1.25rem'
              }}>
                <div className="list-card-content flex-1">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      {ann.isPinned && <Pin size={18} fill="#eab308" color="#eab308" style={{ transform: 'rotate(45deg)' }}/>}
                      {ann.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="badge" style={{ backgroundColor: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.color}40`, fontSize: '0.7rem' }}>
                        {ann.priority.toUpperCase()}
                      </span>
                      {user?.role === 'admin' && (
                        <button onClick={() => handleDelete(ann._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', opacity: 0.7 }} title="Delete notice">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="list-card-snippet" style={{ color: 'var(--text)', whiteSpace: 'pre-line', marginBottom: '1.25rem' }}>{ann.content}</p>
                  
                  <div className="list-card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={16} /> By {ann.author?.name || 'Academic Office'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={16} /> {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="badge" style={{ backgroundColor: '#e2e8f0', color: 'var(--text)', textTransform: 'capitalize' }}>{ann.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {announcements.length === 0 && (
            <div className="empty-state">
              <Megaphone size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }}/>
              <h2>No announcements right now</h2>
              <p>You're all caught up with the latest campus updates!</p>
            </div>
          )}
        </div>
      )}


      {showModal && (
        <div className="modal-overlay animate-in" onClick={() => setShowModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>Broadcast New Notice</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Notice Title</label>
                <input 
                  type="text" required 
                  placeholder="e.g., End Semester Examination Schedule - Spring 2024"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Context/Content</label>
                <textarea 
                  required rows="5"
                  placeholder="Provide all essential details here..."
                  value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Category</label>
                  <select 
                    value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>Priority Level</label>
                  <select 
                    value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                  >
                    {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" id="isPinned"
                  checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                  style={{ width: '1.1rem', height: '1.1rem', cursor: 'pointer' }}
                />
                <label htmlFor="isPinned" style={{ fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Pin size={16} /> Pin to top of board
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
