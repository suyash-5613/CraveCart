import { useState, useEffect } from 'react';
import { restaurantAPI, orderAPI } from '../../services/api';
import { FiShoppingBag, FiDollarSign, FiStar, FiTrendingUp } from 'react-icons/fi';
import './Restaurant.css';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const restRes = await restaurantAPI.getMine();
      setRestaurants(restRes.data.data);
      if (restRes.data.data.length > 0) {
        const ordRes = await orderAPI.getRestaurantOrders(restRes.data.data[0]._id);
        setOrders(ordRes.data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Restaurant Dashboard</h1>
      <p className="page-subtitle">Welcome back! Here's your overview</p>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(245,166,35,0.15)', color: 'var(--accent-amber)' }}><FiShoppingBag /></div>
          <div className="stat-info">
            <div className="stat-value">{todayOrders.length}</div>
            <div className="stat-label">Orders Today</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--accent-mint)' }}><FiDollarSign /></div>
          <div className="stat-info">
            <div className="stat-value">₹{revenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--accent-lavender)' }}><FiStar /></div>
          <div className="stat-info">
            <div className="stat-value">{restaurants[0]?.rating || '0.0'}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(56,189,248,0.15)', color: 'var(--accent-sky)' }}><FiTrendingUp /></div>
          <div className="stat-info">
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
      </div>

      <div className="section-card glass">
        <h2>Recent Orders</h2>
        {loading ? <div className="skeleton" style={{ height: 200 }}></div> : orders.length === 0 ? (
          <div className="empty-state"><span className="empty-icon">📦</span><h3>No orders yet</h3></div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.customer?.name || 'N/A'}</td>
                    <td>{order.items.map(i => i.name).join(', ')}</td>
                    <td className="text-amber">₹{order.totalAmount}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status.replace(/_/g, ' ')}</span></td>
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
