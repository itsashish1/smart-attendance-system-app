import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Attendance', path: '/attendance' },
    { name: 'Students', path: '/students' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
          <BookOpen size={28} />
          AttendEase
        </Link>
      </div>

      <ul className={`navbar-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          </li>
        ))}
        
        <li className="navbar-auth-mobile">
          <div className="mobile-auth-buttons">
            <span className="navbar-user-name">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="btn-logout" title="Logout">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </li>
      </ul>

      <div className="navbar-auth desktop-only">
        <span className="navbar-user-name">{user?.name || 'User'}</span>
        <button onClick={handleLogout} className="btn-logout" title="Logout">
          <LogOut size={18} />
        </button>
      </div>

      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
    </nav>
  );
};

export default Navbar;
