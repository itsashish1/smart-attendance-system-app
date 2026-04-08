import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', rollNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>A</div>
          <h1 style={styles.logoText}>AttendEase</h1>
          <p style={styles.logoSub}>Smart Attendance System</p>
        </div>

        <div style={styles.tabRow}>
          <button style={isLogin ? styles.tabActive : styles.tab} onClick={() => setIsLogin(true)}>Sign In</button>
          <button style={!isLogin ? styles.tabActive : styles.tab} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} type="text" placeholder="Ashish Yadav" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Role</label>
                <select style={styles.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="student">Student</option>
                  <option value="admin">Admin / Faculty</option>
                </select>
              </div>
              {form.role === 'student' && (
                <div style={styles.field}>
                  <label style={styles.label}>Roll Number</label>
                  <input style={styles.input} type="text" placeholder="CS2021001"
                    value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} />
                </div>
              )}
            </>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@college.edu" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.hint}>
          Demo: <strong>admin@test.com</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)', position: 'relative', fontFamily: 'Inter, -apple-system, sans-serif' },
  bgGlow1: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(51,132,255,0.08) 0%, transparent 70%)', top: -50, right: -100 },
  bgGlow2: { position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(33,150,243,0.06) 0%, transparent 70%)', bottom: -50, left: -50 },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, boxShadow: '0 4px 32px rgba(0,0,0,0.08)' },
  logoWrap: { textAlign: 'center', marginBottom: 32 },
  logoIcon: { fontSize: 36, marginBottom: 12, fontWeight: 700, color: '#3b82f6' },
  logoText: { margin: 0, fontSize: 28, fontWeight: 800, color: '#1f2937', fontFamily: 'Inter, sans-serif' },
  logoSub: { margin: '6px 0 0', color: '#6b7280', fontSize: 14 },
  tabRow: { display: 'flex', background: '#f3f4f6', borderRadius: 12, padding: 4, marginBottom: 28 },
  tab: { flex: 1, padding: '10px 0', border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 600, transition: 'all 0.2s' },
  tabActive: { flex: 1, padding: '10px 0', border: 'none', background: '#ffffff', color: '#3b82f6', cursor: 'pointer', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 2px 8px rgba(59,130,246,0.15)' },
  error: { background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { color: '#374151', fontSize: 13, fontWeight: 600 },
  input: { background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '11px 14px', color: '#1f2937', fontSize: 14, outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' },
  btn: { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none', borderRadius: 12, padding: '12px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 12, boxShadow: '0 2px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s' },
  hint: { textAlign: 'center', color: '#9ca3af', fontSize: 12, marginTop: 20 }
};
