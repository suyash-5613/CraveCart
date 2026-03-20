import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import { useState } from 'react';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './Customer.css';

export default function Cart() {
  const { cart, cartCount, updateQuantity, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!cart.items || cart.items.length === 0) return;
    setPlacing(true);
    try {
      const orderData = {
        restaurant: cart.restaurant?._id || cart.restaurant,
        items: cart.items.map(item => ({
          menuItem: item.menuItem?._id || item.menuItem,
          quantity: item.quantity
        })),
        deliveryAddress: user?.address,
        paymentMethod: 'cod'
      };
      await orderAPI.place(orderData);
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page container page-enter">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <span className="empty-icon">🛒</span>
          <h3>Your cart is empty</h3>
          <p>Explore restaurants and add delicious items!</p>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/browse')}>
            <FiShoppingBag /> Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container page-enter">
      <h1 style={{ marginBottom: 8, fontSize: '1.8rem' }}>Your Cart</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        {cart.restaurant?.name && <>From <strong>{cart.restaurant.name}</strong> • </>}{cartCount} items
      </p>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => {
            const menuItem = item.menuItem || {};
            return (
              <div key={menuItem._id || item._id} className="cart-item">
                {menuItem.image && <img src={menuItem.image} alt={menuItem.name || item.name} className="cart-item-img" />}
                <div className="cart-item-info">
                  <div className="cart-item-name">{menuItem.name || item.name}</div>
                  <div className="cart-item-price">₹{(menuItem.price || item.price) * item.quantity}</div>
                </div>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(menuItem._id || item.menuItem, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(menuItem._id || item.menuItem, item.quantity + 1)}>+</button>
                </div>
              </div>
            );
          })}
          <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={clearCart}>
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        <div className="cart-summary glass">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
          <div className="summary-row"><span>Tax (5%)</span><span>₹{tax}</span></div>
          <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 24 }}
            onClick={handlePlaceOrder}
            disabled={placing}
            id="place-order-btn"
          >
            {placing ? 'Placing...' : `Place Order • ₹${total}`}
          </button>
        </div>
      </div>
    </div>
  );
}
