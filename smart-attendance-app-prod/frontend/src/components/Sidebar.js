import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: 'D', label: 'Dashboard' },
  { to: '/attendance', icon: 'A', label: 'Attendance' },
  { to: '/students', icon: 'S', label: 'Students' },
  { to: '/reports', icon: 'R', label: 'Reports' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside>
      <div className="brand">
        <div className="brand-icon">A</div>
        <div>
          <div className="brand-name">AttendEase</div>
          <div className="brand-sub">Smart Attendance</div>
        </div>
      </div>

      <nav>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
            <span style={{ fontSize: 14, width: 24, textAlign: 'center', fontWeight: 600 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="user-box">
        <div className="avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
        <div className="user-info">
          <div className="user-name">{user?.name}</div>
          <div className="user-role">{user?.role}</div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout">×</button>
      </div>
    </aside>
  );
}
