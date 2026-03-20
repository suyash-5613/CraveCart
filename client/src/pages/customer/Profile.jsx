import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Customer.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
  });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        address: { street: form.street, city: form.city, state: form.state, zipCode: form.zipCode }
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page container page-enter">
      <div className="profile-card glass-strong">
        <div className="profile-header">
          <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
          <div>
            <h2>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>

        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input type="text" className="input" value={form.street} onChange={e => setForm({...form, street: e.target.value})} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>City</label>
              <input type="text" className="input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="input" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>ZIP Code</label>
            <input type="text" className="input" value={form.zipCode} onChange={e => setForm({...form, zipCode: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
