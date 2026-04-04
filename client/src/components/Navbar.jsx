import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, UserPlus, LogOut, User, Menu, X, Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'Events', path: '/events' },
    { name: 'Forum', path: '/forum' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Notices', path: '/announcements' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
          <GraduationCap size={28} color="var(--primary)" />
          CollegeBook
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
        {/* Desktop Links */}
        <ul className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link 
              to={link.path} 
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
        
        {/* Mobile Auth embedded in menu */}
        <li className="navbar-auth-mobile">
          {user ? (
            <div className="mobile-auth-buttons">
              <Link to="/profile" className="btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> {user.name}
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Logout">
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="btn-login" onClick={() => setMobileMenuOpen(false)}><LogIn size={18} /> Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setMobileMenuOpen(false)}><UserPlus size={18} /> Register</Link>
            </div>
          )}
        </li>
      </ul>

      {/* Desktop Auth */}
      <div className="navbar-auth desktop-only">
        {user ? (
          <>
            <Link to="/profile" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <User size={18} /> {user.name}
            </Link>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login"><LogIn size={18} /> Login</Link>
            <Link to="/register" className="btn-primary"><UserPlus size={18} /> Register</Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        <button 
          className="search-toggle-btn" 
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
          style={{ 
            background: 'rgba(26, 53, 91, 0.05)', 
            border: 'none', 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--primary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Search size={20} />
        </button>

        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </div>

    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  </nav>
  );
};

export default Navbar;
