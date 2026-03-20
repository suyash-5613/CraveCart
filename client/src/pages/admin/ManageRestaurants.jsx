import { useState, useEffect } from 'react';
import { adminAPI, restaurantAPI } from '../../services/api';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import '../restaurant/Restaurant.css';

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    cuisine: '',
    priceRange: '$$',
    deliveryTime: '',
    image: '',
    owner: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [restRes, usersRes] = await Promise.all([
        adminAPI.getRestaurants(),
        adminAPI.getUsers()
      ]);
      setRestaurants(restRes.data.data);
      setUsers(usersRes.data.data.filter(u => u.role === 'restaurant' || u.role === 'admin'));
    }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleApproval = async (id, current) => {
    try { await adminAPI.approveRestaurant(id, !current); loadData(); }
    catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely remove this restaurant?')) return;
    try {
      await restaurantAPI.delete(id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete restaurant');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        cuisine: form.cuisine.split(',').map(c => c.trim()).filter(Boolean)
      };
      await restaurantAPI.create(payload);
      setShowModal(false);
      setForm({ name: '', description: '', cuisine: '', priceRange: '$$', deliveryTime: '', image: '', owner: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create restaurant');
    }
  };

  return (
    <div className="dashboard-content page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Manage Restaurants</h1>
          <p className="page-subtitle">{restaurants.length} registered restaurants</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Restaurant
        </button>
      </div>

      {loading ? <div className="skeleton" style={{height:300}}></div> : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Restaurant</th><th>Owner</th><th>Cuisine</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      {r.image && <img src={r.image} alt="" style={{width:40,height:40,borderRadius:8,objectFit:'cover'}} />}
                      <strong style={{color:'var(--text-primary)'}}>{r.name}</strong>
                    </div>
                  </td>
                  <td>{r.owner?.name || 'N/A'}<br/><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{r.owner?.email}</span></td>
                  <td>{r.cuisine?.join(', ')}</td>
                  <td className="text-amber">{r.rating}</td>
                  <td>
                    <span className={`badge ${r.isApproved ? 'badge-mint' : 'badge-rose'}`}>
                      {r.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button className={`toggle-btn ${r.isApproved ? 'active' : 'inactive'}`} onClick={() => toggleApproval(r._id, r.isApproved)}>
                        {r.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                      <button className="btn btn-sm" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--accent-rose)' }} onClick={() => handleDelete(r._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-strong" onClick={e => e.stopPropagation()}>
            <h2>Add New Restaurant</h2>
            <form onSubmit={handleCreate} className="portal-form">
              <div className="form-group">
                <label>Restaurant Name</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Assign Owner User</label>
                  <select className="input" required value={form.owner} onChange={e => setForm({...form, owner: e.target.value})}>
                    <option value="" disabled>Select an owner...</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price Range</label>
                  <select className="input" value={form.priceRange} onChange={e => setForm({...form, priceRange: e.target.value})}>
                    <option value="$">$ - Budget</option>
                    <option value="$$">$$ - Mid-range</option>
                    <option value="$$$">$$$ - Premium</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cuisines (comma separated)</label>
                  <input className="input" placeholder="Indian, Fast Food" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Delivery Time</label>
                  <input className="input" placeholder="e.g. 30-40 min" value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime: e.target.value})} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input className="input" placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary">Create Restaurant</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
