import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Search, ChevronRight, PlusCircle, X, Clock, Image as ImageIcon } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'workshop', club: '', venue: '', 
    startDate: '', endDate: '', registrationDeadline: '', maxParticipants: '', image: ''
  });
  
  const { user } = useAuth();
  const canCreate = ['admin', 'club_admin', 'faculty'].includes(user?.role);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/events', { params: status ? { status } : {} });
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  const fetchClubs = async () => {
    try {
      const { data } = await api.get('/clubs');
      // If club_admin, only show clubs they coordinate
      if (user?.role === 'club_admin') {
        setClubs(data.filter(c => c.coordinator?._id === user._id || c.coordinator === user._id));
      } else {
        setClubs(data);
      }
    } catch { toast.error('Failed to load clubs'); }
  };

  useEffect(() => { 
    fetchEvents(); 
    if (canCreate) fetchClubs();
  }, [status, user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', { 
        ...form, 
        isPublished: true,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null 
      });
      toast.success('Event scheduled successfully!');
      setShowModal(false);
      setForm({
        title: '', description: '', category: 'workshop', club: '', venue: '', 
        startDate: '', endDate: '', registrationDeadline: '', maxParticipants: '', image: ''
      });
      fetchEvents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create event'); }
  };

  const statuses = ['upcoming', 'ongoing', 'completed'];

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container animate-in">

      <div className="module-hero">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h1>Campus Events</h1>
            <p>Register for tech fests, cultural nights, academic workshops, and more.</p>
          </div>
          {canCreate && (
            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ background: '#fff', color: 'var(--primary)', fontWeight: '600' }}>
              <PlusCircle size={18} /> Plan New Event
            </button>
          )}
        </div>
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search events by name or venue..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-pills">
          <button className={`filter-pill ${!status ? 'active' : ''}`} onClick={() => setStatus('')}>All Events</button>
          {statuses.map((s) => (
            <button key={s} className={`filter-pill ${status === s ? 'active' : ''}`} onClick={() => setStatus(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="card-grid staggered-entry">

          {filteredEvents.map((event) => (
            <div key={event._id} className="module-card event-card">
              <div className={`card-banner bg-gradient-${event.status}`}>
                <span className="card-category badge">{event.status.replace('_', ' ')}</span>
                <div className="card-date-float">
                  <strong>{new Date(event.startDate).getDate()}</strong>
                  <span>{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                </div>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{event.title}</h3>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>{event.category}</span>
                </div>
                <p className="card-desc">{event.description?.slice(0, 100)}...</p>
                
                <div className="card-metadata-col">
                  <span className="meta-item"><MapPin size={16} /> {event.venue}</span>
                  <span className="meta-item"><Clock size={16} /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="meta-item"><Users size={16} /> {event.registeredParticipants?.length || 0} Registered</span>
                </div>
                
                <div className="card-actions-bottom">
                  <Link to={`/events/${event._id}`} className="btn-primary flex-1">
                    View Details & Register <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <h2>No events found</h2>
              <p>Try adjusting your search criteria or status filter.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay animate-in" onClick={() => setShowModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="modal glass" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '800px', borderRadius: 'var(--radius-lg)', padding: '2rem', maxHeight: '95vh', overflowY: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Plan New Campus Event</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleCreate} className="event-create-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Title</label>
                <input 
                  type="text" required 
                  placeholder="e.g. Annual Tech Summit 2024"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                <select 
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                >
                  {['workshop', 'seminar', 'competition', 'cultural', 'sports', 'other'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                <textarea 
                  required rows="4"
                  placeholder="Provide a detailed roadmap, speaker details, and what students will learn..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Organizing Club</label>
                <select 
                  required
                  value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                >
                  <option value="">Select a Club</option>
                  {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Venue</label>
                <input 
                  type="text" required 
                  placeholder="e.g. Auditorium, C-Block Hall"
                  value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date & Time</label>
                <input 
                  type="datetime-local" required 
                  value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date & Time</label>
                <input 
                  type="datetime-local" required 
                  value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Registration Deadline</label>
                <input 
                  type="datetime-local"
                  value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Max Participants (Optional)</label>
                <input 
                  type="number"
                  placeholder="Unset for unlimited"
                  value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}><ImageIcon size={16} /> Cover Image URL</label>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Schedule Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
