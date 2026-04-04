import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MessageSquare, Users, Eye, ArrowUp, Search, PenSquare } from 'lucide-react';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/forum', { params: { category: category || undefined, search: search || undefined } });
      setPosts(data);
    } catch {
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [category, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/forum', form);
      toast.success('Post created!');
      setShowForm(false);
      setForm({ title: '', content: '', category: 'general' });
      fetchPosts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const categories = ['academic', 'general', 'help', 'placement'];

  return (
    <div className="page-container">
      <div className="module-hero">
        <h1>Discussion Forum</h1>
        <p>Ask questions, share resources, and discuss college topics with peers.</p>
        {user && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ marginTop: '1.5rem', background: '#fff', color: 'var(--primary)', fontWeight: '600' }}>
            {showForm ? 'Cancel Post' : <><PenSquare size={16} style={{display:'inline', marginBottom:'-2px'}}/> New Discussion</>}
          </button>
        )}
      </div>

      <div className="filter-section">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            placeholder="Search discussions..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="search-input" 
          />
        </div>
        <div className="filter-pills">
          <button className={`filter-pill ${!category ? 'active' : ''}`} onClick={() => setCategory('')}>All Topics</button>
          {categories.map((c) => (
            <button key={c} className={`filter-pill ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="list-card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{color: 'var(--primary)', marginBottom: '1rem'}}>Start a New Discussion</h3>
          <input 
            placeholder="Discussion Title" 
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })} 
            required 
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
          />
          <textarea 
            placeholder="What's on your mind?" 
            value={form.content} 
            onChange={(e) => setForm({ ...form, content: e.target.value })} 
            required 
            rows="5"
            style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', resize: 'vertical'}}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <select 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)'}}
            >
              {categories.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
            <button type="submit" className="btn-primary">Post Discussion</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading discussions...</p>
        </div>
      ) : (
        <div className="list-layout">
          {posts.map((post) => (
            <Link key={post._id} to={`/forum/${post._id}`} className="list-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="list-card-content flex-1">
                <h3>{post.title}</h3>
                <p className="list-card-snippet">{post.content?.slice(0, 150)}...</p>
                <div className="list-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={16} /> {post.author?.name || 'Anonymous'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={16} /> {post.replies?.length || 0} Replies</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ArrowUp size={16} /> {post.upvotes?.length || 0} Upvotes</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Eye size={16} /> {post.views || 0} Views</span>
                </div>
              </div>
              <span className="badge" style={{ backgroundColor: '#f1f5f9', color: 'var(--primary)', border: '1px solid var(--border)' }}>{post.category}</span>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="empty-state">
              <h2>No discussions found</h2>
              <p>Be the first to start a conversation in this topic!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Forum;
