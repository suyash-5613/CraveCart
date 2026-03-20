import { useState, useEffect } from 'react';
import { restaurantAPI, orderAPI } from '../../services/api';
import './Restaurant.css';

const statusFlow = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function RestaurantOrders() {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const restRes = await restaurantAPI.getMine();
      if (restRes.data.data.length > 0) {
        const rest = restRes.data.data[0];
        setRestaurant(rest);
        const ordRes = await orderAPI.getRestaurantOrders(rest._id);
        setOrders(ordRes.data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      loadData();
    } catch (err) { console.error(err); }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Orders</h1>
      <p className="page-subtitle">{orders.length} total orders</p>

      <div className="order-actions" style={{ marginBottom: 24 }}>
        <button className={`order-action-btn ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>All</button>
        {statusFlow.map(s => (
          <button key={s} className={`order-action-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? <div className="skeleton" style={{ height: 300 }}></div> : filtered.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">📦</span><h3>No orders</h3></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(order => {
                const currentIdx = statusFlow.indexOf(order.status);
                const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;
                return (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.customer?.name || 'N/A'}<br/><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{order.customer?.phone}</span></td>
                    <td>{order.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}</td>
                    <td className="text-amber">₹{order.totalAmount}</td>
                    <td><span className={`status-badge status-${order.status}`}>{order.status.replace(/_/g,' ')}</span></td>
                    <td>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          {nextStatus && (
                            <button className="btn btn-primary btn-sm" onClick={() => updateStatus(order._id, nextStatus)}>
                              → {nextStatus.replace(/_/g,' ')}
                            </button>
                          )}
                          <button className="btn btn-sm" style={{ background:'rgba(251,113,133,0.1)', color:'var(--accent-rose)' }}
                            onClick={() => updateStatus(order._id, 'cancelled')}>Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
