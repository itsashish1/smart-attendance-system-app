import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Users, Info, ChevronRight, Search } from 'lucide-react';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const fetchClubs = async () => {
    try {
      const { data } = await api.get('/clubs', { params: category ? { category } : {} });
      setClubs(data);
    } catch { toast.error('Failed to load clubs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClubs(); }, [category]);

  const handleJoin = async (id) => {
    try {
      await api.post(`/clubs/${id}/join`);
      toast.success('Joined club!');
      fetchClubs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to join'); }
  };

  const categories = ['technical', 'cultural', 'sports', 'social', 'other'];

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container animate-in">

      <div className="module-hero">
        <h1>Clubs & Societies</h1>
        <p>Discover your passion, join communities, and participate in engaging activities.</p>
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search clubs by name or keywords..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-pills">
          <button className={`filter-pill ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>All Clubs</button>
          {categories.map((c) => (
            <button key={c} className={`filter-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading clubs...</p>
        </div>
      ) : (
        <div className="card-grid staggered-entry">

          {filteredClubs.map((club) => (
            <div key={club._id} className="module-card">
              <div className="card-banner bg-gradient-club">
                <span className="card-category">{club.category}</span>
              </div>
              <div className="card-body">
                <h3>{club.name}</h3>
                <p className="card-desc">{club.description?.slice(0, 100)}...</p>
                
                <div className="card-metadata">
                  <span className="meta-item"><Users size={16} /> {club.members?.length || 0} Members</span>
                </div>
                
                <div className="card-actions">
                  <Link to={`/clubs/${club._id}`} className="btn-secondary flex-1">
                    <Info size={16} /> Details
                  </Link>
                  {user && (
                    <button onClick={() => handleJoin(club._id)} className="btn-primary">
                      Join <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredClubs.length === 0 && (
            <div className="empty-state">
              <h2>No clubs found</h2>
              <p>Try adjusting your search criteria or category filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Clubs;
