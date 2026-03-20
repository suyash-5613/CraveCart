import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Customer.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'restaurant') navigate('/restaurant');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-strong animate-fade-in">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your CraveCart account</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})} required id="login-email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="input" placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})} required id="login-password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Demo Accounts:</strong><br/>
          Admin: admin@cravecart.com / admin123<br/>
          Restaurant: raj@restaurant.com / restaurant123<br/>
          Customer: arjun@email.com / customer123
        </div>
      </div>
    </div>
  );
}
