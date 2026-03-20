import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import '../restaurant/Restaurant.css';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await adminAPI.getStats(); setStats(res.data.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="dashboard-content"><div className="skeleton" style={{height:400}}></div></div>;

  const completionRate = stats?.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0;

  return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Analytics</h1>
      <p className="page-subtitle">Platform performance insights</p>

      <div className="analytics-grid">
        <div className="section-card glass">
          <h2>Order Completion Rate</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              background: `conic-gradient(var(--accent-mint) ${completionRate}%, var(--bg-glass) ${completionRate}%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%', background: 'var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800
              }}>
                {completionRate}%
              </div>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {stats?.deliveredOrders} of {stats?.totalOrders} orders delivered
              </p>
            </div>
          </div>
        </div>

        <div className="section-card glass">
          <h2>Revenue Summary</h2>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Revenue</span>
              <strong style={{ color: 'var(--accent-amber)' }}>₹{(stats?.totalRevenue || 0).toLocaleString()}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Restaurants</span>
              <strong>{stats?.activeRestaurants}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Avg Order Value</span>
              <strong>₹{stats?.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.deliveredOrders) : 0}</strong>
            </div>
          </div>
        </div>

        <div className="section-card glass">
          <h2>Platform Stats</h2>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Customers</span>
              <strong style={{ color: 'var(--accent-lavender)' }}>{stats?.totalUsers}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Restaurants</span>
              <strong style={{ color: 'var(--accent-amber)' }}>{stats?.totalRestaurants}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Orders</span>
              <strong style={{ color: 'var(--accent-sky)' }}>{stats?.totalOrders}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
