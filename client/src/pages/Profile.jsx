import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, GraduationCap, Building2, Hash, Save, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    year: user?.year || '',
    enrollmentNo: user?.enrollmentNo || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const roleColors = {
    admin: { bg: '#fef2f2', text: '#dc2626', label: 'System Admin' },
    faculty: { bg: '#eff6ff', text: '#2563eb', label: 'Faculty' },
    club_admin: { bg: '#f0fdf4', text: '#16a34a', label: 'Club Admin' },
    student: { bg: '#faf5ff', text: '#9333ea', label: 'Student' }
  };

  const roleStyle = roleColors[user?.role] || roleColors.student;

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="page-container animate-in">

      <div className="module-hero" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f766e 100%)' }}>
        <h1>My Profile</h1>
        <p>Manage your account details and preferences.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '-2rem auto 2rem', padding: '0 1rem', position: 'relative', zIndex: 10 }}>

        {/* Profile Header Card */}
        <div className="glass" style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            flexShrink: 0
          }}>
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <Mail size={16} /> {user?.email}
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              background: roleStyle.bg,
              color: roleStyle.text
            }}>
              <Shield size={14} /> {roleStyle.label}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="glass" style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <User size={20} /> Edit Information
          </h3>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <User size={16} /> Full Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '1rem',
                background: 'var(--card-bg)',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <Building2 size={16} /> Department
              </label>
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. CSE, ECE"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '1rem',
                  background: 'var(--card-bg)'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <Calendar size={16} /> Year
              </label>
              <input
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 3rd Year"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '1rem',
                  background: 'var(--card-bg)'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Hash size={16} /> Enrollment Number
            </label>
            <input
              value={form.enrollmentNo}
              onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
              placeholder="Your university enrollment number"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '1rem',
                background: 'var(--card-bg)'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
