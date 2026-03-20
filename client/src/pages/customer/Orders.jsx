import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import { FiPackage, FiCheck } from 'react-icons/fi';
import './Customer.css';

const statusSteps = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.getMyOrders();
      setOrders(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status) => statusSteps.indexOf(status);

  if (loading) return (
    <div className="orders-page container">
      <h1 style={{ marginBottom: 24, paddingTop: 16 }}>My Orders</h1>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 160, marginBottom: 16 }}></div>)}
    </div>
  );

  return (
    <div className="orders-page container page-enter">
      <h1 style={{ marginBottom: 8 }}>My Orders</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>{orders.length} orders</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>No orders yet</h3>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-restaurant">{order.restaurant?.name || 'Restaurant'}</div>
                <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <span className={`status-badge status-${order.status}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="order-progress">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStatusIndex(order.status);
                  return (
                    <div key={step} className="progress-step">
                      <div className={`progress-dot ${idx < currentIdx ? 'completed' : idx === currentIdx ? 'active' : ''}`}>
                        {idx < currentIdx ? <FiCheck /> : idx === currentIdx ? <FiPackage /> : (idx + 1)}
                      </div>
                      <span className="progress-label">{step.replace(/_/g, ' ')}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="order-items-list">
              {order.items.map((item, i) => (
                <div key={i} className="order-item-row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span className="order-total">₹{order.totalAmount}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
