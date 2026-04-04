import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Users, UserPlus, UserMinus, Mail, Instagram, Linkedin, User, Calendar, Shield } from 'lucide-react';

const ClubDetail = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClub = async () => {
    try {
      const { data } = await api.get(`/clubs/${id}`);
      setClub(data);
    } catch { toast.error('Club not found'); }
    finally { setLoading(false); }
  };

  const fetchClubEvents = async () => {
    try {
      const { data } = await api.get(`/events?club=${id}`);
      setEvents(data);
    } catch { /* some clubs have no events */ }
  };

  useEffect(() => {
    fetchClub();
    fetchClubEvents();
  }, [id]);

  const isMember = user && club?.members?.some((m) =>
    typeof m === 'object' ? m._id === user._id : m === user._id
  );

  const handleJoin = async () => {
    try {
      await api.post(`/clubs/${id}/join`);
      toast.success('Joined successfully!');
      fetchClub();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to join'); }
  };

  const handleLeave = async () => {
    try {
      await api.post(`/clubs/${id}/leave`);
      toast.success('Left club');
      fetchClub();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to leave'); }
  };

  if (loading || !club) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading club details...</p>
    </div>
  );

  const categoryColors = {
    technical: '#6366f1', cultural: '#ec4899', sports: '#f59e0b', social: '#10b981', other: '#6b7280'
  };
  const catColor = categoryColors[club.category] || categoryColors.other;

  return (
    <div className="page-container animate-in">
      {/* Back navigation */}
      <Link to="/clubs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        <ArrowLeft size={18} /> Back to Clubs
      </Link>

      {/* Hero Banner */}
      <div className="module-hero" style={{
        background: `linear-gradient(135deg, ${catColor}dd 0%, ${catColor}88 100%)`,
        textAlign: 'left', padding: '3rem 2.5rem', borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Club logo / avatar */}
          <div style={{
            width: 100, height: 100, borderRadius: 'var(--radius)',
            background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', fontWeight: 900, color: '#fff', border: '3px solid rgba(255,255,255,0.4)',
            flexShrink: 0
          }}>
            {club.logo ? <img src={club.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} /> : club.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '0.75rem', display: 'inline-block' }}>
              {club.category?.toUpperCase()}
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>{club.name}</h1>
            <p style={{ opacity: 0.85, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} /> {club.members?.length || 0} members
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>

        {/* Left Column */}
        <div>
          {/* Description */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>About</h3>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{club.description}</p>
          </div>

          {/* Club Events */}
          <div className="card">
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.2rem' }}>
              <Calendar size={20} style={{ marginBottom: '-4px', marginRight: '0.5rem' }} />
              Events by {club.name}
            </h3>
            {events.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {events.map((ev) => (
                  <Link to={`/events/${ev._id}`} key={ev._id} className="card" style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                    textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                  >
                    <div style={{
                      background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius)',
                      width: 50, height: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1 }}>{new Date(ev.startDate).getDate()}</span>
                      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 600 }}>
                        {new Date(ev.startDate).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{ev.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.venue} • {ev.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No events listed for this club yet.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Quick Info */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Club Info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {club.coordinator && (
                <div className="meta-item" style={{ gap: '0.75rem' }}>
                  <Shield size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Coordinator</div>
                    <div style={{ fontWeight: 500 }}>{club.coordinator.name}</div>
                    {club.coordinator.email && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{club.coordinator.email}</div>}
                  </div>
                </div>
              )}

              <div className="meta-item" style={{ gap: '0.75rem' }}>
                <Users size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Members</div>
                  <div style={{ fontWeight: 500 }}>{club.members?.length || 0} active members</div>
                </div>
              </div>

              {/* Social Links */}
              {(club.socialLinks?.instagram || club.socialLinks?.linkedin || club.socialLinks?.email) && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>Connect</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {club.socialLinks.instagram && (
                      <a href={club.socialLinks.instagram} target="_blank" rel="noreferrer" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 38, borderRadius: 'var(--radius-full)',
                        background: '#fce7f3', color: '#ec4899'
                      }}>
                        <Instagram size={18} />
                      </a>
                    )}
                    {club.socialLinks.linkedin && (
                      <a href={club.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 38, borderRadius: 'var(--radius-full)',
                        background: '#dbeafe', color: '#3b82f6'
                      }}>
                        <Linkedin size={18} />
                      </a>
                    )}
                    {club.socialLinks.email && (
                      <a href={`mailto:${club.socialLinks.email}`} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 38, height: 38, borderRadius: 'var(--radius-full)',
                        background: '#dcfce7', color: '#16a34a'
                      }}>
                        <Mail size={18} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Join / Leave button */}
          {user && (
            <div>
              {isMember ? (
                <button onClick={handleLeave} style={{
                  width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  border: '2px solid var(--danger)', color: 'var(--danger)', background: '#fff', cursor: 'pointer', fontWeight: 600
                }}>
                  <UserMinus size={20} /> Leave Club
                </button>
              ) : (
                <button onClick={handleJoin} className="btn-primary" style={{
                  width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <UserPlus size={20} /> Join This Club
                </button>
              )}
            </div>
          )}

          {!user && (
            <Link to="/login" className="btn-primary" style={{
              width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textAlign: 'center'
            }}>
              Login to Join
            </Link>
          )}

          {/* Members Preview */}
          {club.members?.length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Members</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {club.members.slice(0, 12).map((m) => (
                  <div key={m._id || m} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', fontWeight: 500
                  }}>
                    <User size={12} /> {typeof m === 'object' ? m.name : 'Member'}
                  </div>
                ))}
                {club.members.length > 12 && (
                  <div style={{
                    background: 'var(--primary)', color: '#fff',
                    padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', fontWeight: 600
                  }}>
                    +{club.members.length - 12} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
