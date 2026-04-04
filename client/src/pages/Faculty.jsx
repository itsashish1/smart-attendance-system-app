import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, BookOpen, Search } from 'lucide-react';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faculty').then(({ data }) => {
      setFaculty(data);
      const depts = [...new Set(data.map((f) => f.department).filter(Boolean))];
      setDepartments(depts);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load faculty');
      setLoading(false);
    });
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/faculty', { params: { search: search || undefined, department: department || undefined } });
      setFaculty(data);
    } catch {
      toast.error('Failed to filter faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, [search, department]);

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="page-container animate-in">
      <div className="module-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #14532d 100%)' }}>
        <h1>Faculty Directory</h1>
        <p>Connect with professors, find office hours, and explore academic departments.</p>
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            placeholder="Search faculty by name or subject..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="search-input" 
          />
        </div>
        <div className="filter-pills">
          <button className={`filter-pill ${!department ? 'active' : ''}`} onClick={() => setDepartment('')}>All Departments</button>
          {departments.map((d) => (
            <button key={d} className={`filter-pill ${department === d ? 'active' : ''}`} onClick={() => setDepartment(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading directory...</p>
        </div>
      ) : (
        <div className="card-grid staggered-entry">
          {faculty.map((f) => (
            <div key={f._id} className="module-card" style={{ overflow: 'hidden' }}>
              {/* Profile Header with Avatar */}
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.75rem'
              }}>
                {f.avatar ? (
                  <img 
                    src={f.avatar} 
                    alt={f.name} 
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }} 
                  />
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'white',
                    border: '3px solid rgba(255,255,255,0.3)'
                  }}>
                    {getInitial(f.name)}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '0.2rem' }}>{f.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '500', fontSize: '0.9rem' }}>{f.designation}</p>
                </div>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.25rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(4px)'
                }}>
                  {f.department}
                </span>
              </div>

              {/* Details */}
              <div className="card-body" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <Mail size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                    <a href={`mailto:${f.email}`} style={{ color: 'var(--primary)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.email}</a>
                  </div>
                  {f.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <Phone size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                      <span>{f.phone}</span>
                    </div>
                  )}
                  {f.cabin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <MapPin size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                      <span>{f.cabin}</span>
                    </div>
                  )}
                  {f.officeHours && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <Clock size={16} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                      <span>{f.officeHours}</span>
                    </div>
                  )}
                </div>

                {f.subjects?.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                      <BookOpen size={14} /> TEACHING
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {f.subjects.map(sub => (
                        <span key={sub} style={{
                          background: 'rgba(26, 53, 91, 0.08)',
                          color: 'var(--primary)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>{sub}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {faculty.length === 0 && (
            <div className="empty-state">
              <h2>No faculty found</h2>
              <p>Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Faculty;
