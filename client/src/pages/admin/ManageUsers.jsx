import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import '../restaurant/Restaurant.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { const res = await adminAPI.getUsers(); setUsers(res.data.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id) => {
    try { await adminAPI.toggleUser(id); loadData(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Manage Users</h1>
      <p className="page-subtitle">{users.length} registered users</p>

      {loading ? <div className="skeleton" style={{height:300}}></div> : (
        <div className="section-card glass">
          {users.map(user => (
            <div key={user._id} className="admin-user-row">
              <div className="admin-user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
              <div className="admin-user-info">
                <div className="admin-user-name">{user.name}</div>
                <div className="admin-user-email">{user.email}</div>
              </div>
              <span className={`badge ${user.role === 'admin' ? 'badge-amber' : user.role === 'restaurant' ? 'badge-lavender' : 'badge-sky'}`}>
                {user.role}
              </span>
              {user.role !== 'admin' && (
                <button className={`toggle-btn ${user.isActive ? 'active' : 'inactive'}`} onClick={() => toggleStatus(user._id)}>
                  {user.isActive ? 'Active' : 'Disabled'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
