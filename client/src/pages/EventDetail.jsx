import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, MapPin, Users, Clock, ArrowLeft, CheckCircle2, XCircle, User } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user } = useAuth();
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
      if (user) setRegistered(data.registeredParticipants?.some((p) => p._id === user._id));
    } catch { toast.error('Failed to load event'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvent(); }, [id]);

  const handleRegister = async () => {
    try {
      await api.post(`/events/${id}/register`);
      toast.success('Registered successfully!');
      fetchEvent();
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  const handleUnregister = async () => {
    try {
      await api.post(`/events/${id}/unregister`);
      toast.success('Unregistered successfully');
      fetchEvent();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading || !event) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>
  );

  const spotsLeft = event.maxParticipants
    ? event.maxParticipants - (event.registeredParticipants?.length || 0)
    : null;

  const deadlinePassed = event.registrationDeadline && new Date() > new Date(event.registrationDeadline);

  return (
    <div className="page-container animate-in">
      {/* Back Navigation */}
      <Link to="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        <ArrowLeft size={18} /> Back to Events
      </Link>

      {/* Hero Banner */}
      <div className="module-hero" style={{
        background: event.image
          ? `linear-gradient(to bottom, rgba(15,31,54,0.7), rgba(15,31,54,0.9)), url(${event.image}) center/cover`
          : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
        textAlign: 'left', padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                {event.status?.toUpperCase()}
              </span>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                {event.category?.toUpperCase()}
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{event.title}</h1>
            {event.club && (
              <p style={{ opacity: 0.85, marginTop: '0.5rem', fontSize: '1rem' }}>
                Organized by <strong>{event.club.name || 'College Club'}</strong>
              </p>
            )}
          </div>

          {/* Date Card */}
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1rem 1.5rem',
            textAlign: 'center', boxShadow: 'var(--shadow-md)', color: 'var(--primary)', minWidth: '90px'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
              {new Date(event.startDate).getDate()}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>
              {new Date(event.startDate).toLocaleString('default', { month: 'short' })}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {new Date(event.startDate).getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>

        {/* Left Column - Details */}
        <div>
          {/* Description */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>About This Event</h3>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{event.description}</p>
          </div>

          {/* Participants */}
          <div className="card">
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
              <Users size={20} style={{ marginBottom: '-4px', marginRight: '0.5rem' }} />
              Registered Participants ({event.registeredParticipants?.length || 0}{event.maxParticipants ? ` / ${event.maxParticipants}` : ''})
            </h3>
            {event.registeredParticipants?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {event.registeredParticipants.map((p) => (
                  <div key={p._id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem', fontWeight: 500
                  }}>
                    <User size={14} /> {p.name}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No registrations yet. Be the first to register!</p>
            )}
          </div>
        </div>

        {/* Right Column - Info & Action */}
        <div>
          {/* Quick Info Card */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Event Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="meta-item" style={{ gap: '0.75rem' }}>
                <MapPin size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Venue</div>
                  <div style={{ fontWeight: 500 }}>{event.venue}</div>
                </div>
              </div>

              <div className="meta-item" style={{ gap: '0.75rem' }}>
                <Clock size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Start</div>
                  <div style={{ fontWeight: 500 }}>{new Date(event.startDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </div>
              </div>

              <div className="meta-item" style={{ gap: '0.75rem' }}>
                <Clock size={18} color="var(--secondary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>End</div>
                  <div style={{ fontWeight: 500 }}>{new Date(event.endDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="meta-item" style={{ gap: '0.75rem' }}>
                  <Calendar size={18} color={deadlinePassed ? 'var(--danger)' : 'var(--success)'} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Registration Deadline</div>
                    <div style={{ fontWeight: 500, color: deadlinePassed ? 'var(--danger)' : 'inherit' }}>
                      {new Date(event.registrationDeadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      {deadlinePassed && ' (Expired)'}
                    </div>
                  </div>
                </div>
              )}

              {event.organizer && (
                <div className="meta-item" style={{ gap: '0.75rem' }}>
                  <User size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Organizer</div>
                    <div style={{ fontWeight: 500 }}>{event.organizer.name}</div>
                  </div>
                </div>
              )}

              {spotsLeft !== null && (
                <div style={{
                  background: spotsLeft > 0 ? '#dcfce7' : '#fee2e2',
                  color: spotsLeft > 0 ? '#15803d' : '#dc2626',
                  padding: '0.75rem', borderRadius: 'var(--radius)', textAlign: 'center',
                  fontWeight: 600, fontSize: '0.9rem'
                }}>
                  {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Event is full'}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {user && event.status === 'upcoming' && (
            <div>
              {registered ? (
                <button onClick={handleUnregister} className="btn-secondary" style={{
                  width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  border: '2px solid var(--danger)', color: 'var(--danger)', background: '#fff', cursor: 'pointer'
                }}>
                  <XCircle size={20} /> Withdraw Registration
                </button>
              ) : (
                <button onClick={handleRegister} className="btn-primary" style={{
                  width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  cursor: 'pointer'
                }} disabled={deadlinePassed || spotsLeft === 0}>
                  <CheckCircle2 size={20} /> Register for this Event
                </button>
              )}
            </div>
          )}

          {!user && event.status === 'upcoming' && (
            <Link to="/login" className="btn-primary" style={{
              width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center'
            }}>
              Login to Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
