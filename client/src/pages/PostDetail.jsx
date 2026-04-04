import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft, ThumbsUp, MessageCircle, Eye, CheckCircle, Send, Clock, User, Tag } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPost = async () => {
    try {
      const { data } = await api.get(`/forum/${id}`);
      setPost(data);
    } catch { toast.error('Failed to load post'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      await api.post(`/forum/${id}/reply`, { content: reply });
      toast.success('Reply added!');
      setReply('');
      fetchPost();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to reply'); }
  };

  const handleUpvote = async () => {
    try {
      await api.post(`/forum/${id}/upvote`);
      fetchPost();
    } catch { toast.error('Login to upvote'); }
  };

  if (loading || !post) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading discussion...</p>
    </div>
  );

  const hasUpvoted = user && post.upvotes?.includes(user._id);

  const categoryColors = {
    academic: '#6366f1', general: '#6b7280', announcement: '#ef4444', help: '#f59e0b', placement: '#10b981'
  };
  const catColor = categoryColors[post.category] || categoryColors.general;

  return (
    <div className="page-container animate-in">
      {/* Back Navigation */}
      <Link to="/forum" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        <ArrowLeft size={18} /> Back to Forum
      </Link>

      {/* Post Card */}
      <div className="card" style={{ marginBottom: '2rem', border: post.isPinned ? '2px solid var(--primary)' : undefined }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-full)',
              background: `${catColor}20`, color: catColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem', flexShrink: 0
            }}>
              {post.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{post.author?.name || 'Anonymous'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                {post.author?.role && <> · <span style={{ textTransform: 'capitalize' }}>{post.author.role}</span></>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}40`,
              padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase'
            }}>
              {post.category}
            </span>
            {post.isPinned && (
              <span style={{
                background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a',
                padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem', fontWeight: 600
              }}>📌 PINNED</span>
            )}
            {post.isClosed && (
              <span style={{
                background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca',
                padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem', fontWeight: 600
              }}>🔒 CLOSED</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
          {post.title}
        </h1>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {post.tags.map((tag, i) => (
              <span key={i} style={{
                background: '#f1f5f9', color: '#475569',
                padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}>
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{
          color: 'var(--text)', lineHeight: 1.85, whiteSpace: 'pre-wrap',
          padding: '1.25rem', background: 'var(--background)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', marginBottom: '1.25rem'
        }}>
          {post.content}
        </div>

        {/* Metrics Bar */}
        <div style={{
          display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap',
          paddingTop: '1rem', borderTop: '1px solid var(--border)'
        }}>
          <button
            onClick={handleUpvote}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none',
              background: hasUpvoted ? 'var(--primary)' : '#f1f5f9',
              color: hasUpvoted ? '#fff' : 'var(--text)',
              padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
              fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s'
            }}
          >
            <ThumbsUp size={16} /> {post.upvotes?.length || 0} Upvotes
          </button>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <MessageCircle size={16} /> {post.replies?.length || 0} replies
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Eye size={16} /> {post.views} views
          </span>
        </div>
      </div>

      {/* Replies Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle size={22} /> {post.replies?.length || 0} Replies
        </h2>

        {post.replies?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {post.replies.map((r) => (
              <div key={r._id} className="card" style={{
                border: r.isAccepted ? '2px solid #10b981' : undefined,
                position: 'relative'
              }}>
                {r.isAccepted && (
                  <div style={{
                    position: 'absolute', top: '-10px', right: '1rem',
                    background: '#10b981', color: '#fff',
                    padding: '0.2rem 0.75rem', borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem'
                  }}>
                    <CheckCircle size={12} /> ACCEPTED ANSWER
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-full)',
                    background: r.isAccepted ? '#dcfce7' : '#f1f5f9',
                    color: r.isAccepted ? '#16a34a' : 'var(--text)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                  }}>
                    {r.author?.name?.charAt(0) || <User size={14} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{r.author?.name || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={10} /> {new Date(r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      {r.author?.role && <> · <span style={{ textTransform: 'capitalize' }}>{r.author.role}</span></>}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{r.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No replies yet. Be the first to contribute!
          </div>
        )}
      </div>

      {/* Reply Form */}
      {user && !post.isClosed ? (
        <div className="card" style={{ border: '2px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} /> Write a Reply
          </h3>
          <form onSubmit={handleReply}>
            <textarea
              placeholder="Share your thoughts..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
              style={{
                width: '100%', minHeight: '120px', padding: '1rem',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontSize: '0.95rem', lineHeight: 1.6, resize: 'vertical',
                background: 'var(--background)', color: 'var(--text)',
                fontFamily: 'inherit'
              }}
            />
            <button type="submit" className="btn-primary" style={{
              marginTop: '1rem', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Send size={16} /> Submit Reply
            </button>
          </form>
        </div>
      ) : !user ? (
        <Link to="/login" className="card" style={{
          textAlign: 'center', padding: '1.5rem', display: 'block',
          color: 'var(--primary)', fontWeight: 600, textDecoration: 'none',
          border: '2px dashed var(--border)'
        }}>
          Login to join this discussion
        </Link>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', background: '#fef3c7' }}>
          🔒 This discussion has been closed and no longer accepts replies.
        </div>
      )}
    </div>
  );
};

export default PostDetail;
