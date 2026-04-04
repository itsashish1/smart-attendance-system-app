import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, Search as SearchIcon, Globe, Database, Loader2, Users, Calendar, MessageSquare, Briefcase, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [activeTab, setActiveTab] = useState('internal'); // 'internal' or 'external'
  const [searchQuery, setSearchQuery] = useState('');
  const [internalResults, setInternalResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Internal Search Logic
  const handleInternalSearch = async (e) => {
    e?.preventDefault();
    if (searchQuery.trim().length < 2) return;

    try {
      setLoading(true);
      const { data } = await api.get(`/search?q=${searchQuery}`);
      setInternalResults(data);
    } catch (err) {
      console.error('Internal search failed', err);
    } finally {
      setLoading(false);
    }
  };

  // Google CSE Logic (maintained for External tab)
  useEffect(() => {
    if (activeTab === 'external') {
      const cx = '03ba70a97049b46f6';
      const container = document.getElementById('google-cse-container');
      if (container) {
        container.innerHTML = '<div class="gcse-search"></div>';
      }

      const scriptId = 'google-cse-script';
      let existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://cse.google.com/cse.js?cx=${cx}`;
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if (window.google?.search?.cse) {
            window.google.search.cse.element.go();
          }
        }, 300);
      };
      document.head.appendChild(script);
    }
  }, [activeTab]);

  const renderInternalResults = () => {
    if (!internalResults) return (
      <div className="search-placeholder-main">
        <Database size={64} opacity={0.1} />
        <p>Search campus database for clubs, events, and people.</p>
      </div>
    );

    const hasResults = Object.values(internalResults).some(arr => arr.length > 0);

    if (!hasResults) return (
      <div className="search-empty-main">
        <h3>No campus records found</h3>
        <p>We couldn't find any results for "<strong>{searchQuery}</strong>" in our internal database.</p>
        <button onClick={() => setActiveTab('external')} className="btn-secondary" style={{ marginTop: '1rem' }}>
          Try External Web Search
        </button>
      </div>
    );

    return (
      <div className="internal-results-grid">
        {/* Simplified display for the main search page */}
        {internalResults.clubs?.length > 0 && (
          <div className="result-group">
            <h3><Users size={18} /> Clubs ({internalResults.clubs.length})</h3>
            <div className="result-list">
              {internalResults.clubs.map(club => (
                <div key={club._id} className="search-result-card" onClick={() => navigate(`/clubs/${club._id}`)}>
                  <div className="card-mini-icon">{club.name.charAt(0)}</div>
                  <div className="card-info">
                    <h4>{club.name}</h4>
                    <p>{club.category} • {club.description?.substring(0, 60)}...</p>
                  </div>
                  <ChevronRight size={18} />
                </div>
              ))}
            </div>
          </div>
        )}

        {internalResults.events?.length > 0 && (
          <div className="result-group">
            <h3><Calendar size={18} /> Events ({internalResults.events.length})</h3>
            <div className="result-list">
              {internalResults.events.map(event => (
                <div key={event._id} className="search-result-card" onClick={() => navigate(`/events/${event._id}`)}>
                  <div className="card-mini-icon bg-blue">{new Date(event.startDate).getDate()}</div>
                  <div className="card-info">
                    <h4>{event.title}</h4>
                    <p>{event.venue} • {new Date(event.startDate).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight size={18} />
                </div>
              ))}
            </div>
          </div>
        )}

        {internalResults.faculty?.length > 0 && (
          <div className="result-group">
            <h3><Briefcase size={18} /> Faculty ({internalResults.faculty.length})</h3>
            <div className="result-list">
              {internalResults.faculty.map(f => (
                <div key={f._id} className="search-result-card" onClick={() => navigate(`/faculty`)}>
                  <div className="card-mini-icon bg-green">{f.name.charAt(0)}</div>
                  <div className="card-info">
                    <h4>{f.name}</h4>
                    <p>{f.designation} • {f.department}</p>
                  </div>
                  <ChevronRight size={18} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container search-page">
      <section className="search-hero">
        <div className="search-hero-content">
          <h1>Campus Knowledge Engine</h1>
          <p>Find everything from academic documents to student clubs and event schedules.</p>
          
          <form className="main-search-bar" onSubmit={handleInternalSearch}>
            <SearchIcon size={20} className="bar-icon" />
            <input 
              type="text" 
              placeholder="Search across all modules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Search'}
            </button>
          </form>
        </div>
      </section>

      <div className="search-tabs">
        <button 
          className={`search-tab ${activeTab === 'internal' ? 'active' : ''}`}
          onClick={() => setActiveTab('internal')}
        >
          <Database size={18} /> Campus Database
        </button>
        <button 
          className={`search-tab ${activeTab === 'external' ? 'active' : ''}`}
          onClick={() => setActiveTab('external')}
        >
          <Globe size={18} /> External Web
        </button>
      </div>
      
      <div className="search-layout">
        <div className="search-main">
          {activeTab === 'internal' ? (
            <div className="internal-container">
              {renderInternalResults()}
            </div>
          ) : (
            <div className="search-container" id="google-cse-container">
              <div className="gcse-search"></div>
            </div>
          )}
        </div>

        <aside className="search-sidebar">
          <div className="search-tips-card">
            <h3><Lightbulb size={20} /> Search Tips</h3>
            <ul>
              <li>Use <strong>"quotes"</strong> for exact matches</li>
              <li>Type <strong>ext:pdf</strong> for documents</li>
              <li>Include <strong>department names</strong></li>
            </ul>
          </div>
          
          <div className="search-tips-card">
            <h3><TrendingUp size={20} /> Hot Topics</h3>
            <div className="popular-tags">
              <span className="tag" onClick={() => setSearchQuery('Tech Fest')}>Tech Fest</span>
              <span className="tag" onClick={() => setSearchQuery('Library')}>Library</span>
              <span className="tag" onClick={() => setSearchQuery('Placement')}>Placement</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Search;
