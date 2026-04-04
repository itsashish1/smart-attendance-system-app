import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', year: '', enrollmentNo: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register for CollegeBook</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password', 'department', 'year', 'enrollmentNo'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required={['name', 'email', 'password'].includes(field)}
              />
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
