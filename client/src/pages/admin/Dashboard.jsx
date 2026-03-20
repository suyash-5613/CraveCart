import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FiUsers, FiShoppingBag, FiDollarSign, FiGrid } from 'react-icons/fi';
import '../restaurant/Restaurant.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="dashboard-content"><div className="skeleton" style={{height:400}}></div></div>;

  return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Platform overview and analytics</p>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--accent-lavender)' }}><FiUsers /></div>
          <div className="stat-info"><div className="stat-value">{stats?.totalUsers || 0}</div><div className="stat-label">Total Customers</div></div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent-amber)' }}><FiGrid /></div>
          <div className="stat-info"><div className="stat-value">{stats?.totalRestaurants || 0}</div><div className="stat-label">Restaurants</div></div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--accent-sky)' }}><FiShoppingBag /></div>
          <div className="stat-info"><div className="stat-value">{stats?.totalOrders || 0}</div><div className="stat-label">Total Orders</div></div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--accent-mint)' }}><FiDollarSign /></div>
          <div className="stat-info"><div className="stat-value">₹{(stats?.totalRevenue || 0).toLocaleString()}</div><div className="stat-label">Total Revenue</div></div>
        </div>
      </div>

      <div className="section-card glass">
        <h2>Recent Orders</h2>
        {stats?.recentOrders?.length === 0 ? <p style={{color:'var(--text-muted)'}}>No orders yet</p> : (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Restaurant</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.customer?.name || 'N/A'}</td>
                    <td>{order.restaurant?.name || 'N/A'}</td>
                    <td className="text-amber">₹{order.totalAmount}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status.replace(/_/g,' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
