import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => (
  <div className="page-container animate-in" style={{ 
    textAlign: 'center', 
    paddingTop: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '70vh',
    justifyContent: 'center'
  }}>
    <div style={{
      fontSize: '8rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      lineHeight: 1,
      marginBottom: '1rem'
    }}>
      404
    </div>
    <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.6 }}>
      The page you're looking for doesn't exist or has been moved. Let's get you back on track.
    </p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      <Link to="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Home size={18} /> Go Home
      </Link>
      <button onClick={() => window.history.back()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ArrowLeft size={18} /> Go Back
      </button>
    </div>
  </div>
);

export default NotFound;
