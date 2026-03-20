import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantAPI, menuAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiStar, FiClock, FiCheck } from 'react-icons/fi';
import './Customer.css';

export default function RestaurantDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState(new Set());

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [restRes, menuRes] = await Promise.all([
        restaurantAPI.getOne(id),
        menuAPI.getByRestaurant(id)
      ]);
      setRestaurant(restRes.data.data);
      setMenuItems(menuRes.data.grouped || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    const success = await addToCart(item._id, id);
    if (success) {
      setAddedItems(prev => new Set([...prev, item._id]));
      setTimeout(() => {
        setAddedItems(prev => { const next = new Set(prev); next.delete(item._id); return next; });
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="skeleton" style={{ height: 320 }}></div>
        <div className="container" style={{ padding: '32px 24px' }}>
          <div className="skeleton" style={{ height: 32, width: '40%', marginBottom: 16 }}></div>
          <div className="skeleton" style={{ height: 16, width: '60%' }}></div>
        </div>
      </div>
    );
  }

  if (!restaurant) return <div className="container" style={{ paddingTop: 120 }}><h2>Restaurant not found</h2></div>;

  return (
    <div className="detail-page page-enter">
      <div className="detail-hero">
        <img src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'} alt={restaurant.name} />
        <div className="detail-hero-overlay"></div>
      </div>

      <div className="container">
        <div className="detail-info">
          <h1>{restaurant.name}</h1>
          <div className="detail-meta">
            <span className="star-rating"><FiStar /> {restaurant.rating} ({restaurant.totalRatings} ratings)</span>
            <span className="meta-item"><FiClock /> {restaurant.deliveryTime}</span>
            <span className="price-range">{restaurant.priceRange}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>{restaurant.description}</p>
          <div className="detail-tags">
            {restaurant.cuisine.map(c => <span key={c} className="badge badge-lavender">{c}</span>)}
          </div>
        </div>

        <div className="menu-section">
          {Object.keys(menuItems).length === 0 ? (
            <div className="empty-state"><span className="empty-icon">📋</span><h3>No menu items yet</h3></div>
          ) : (
            Object.entries(menuItems).map(([category, items]) => (
              <div key={category} className="menu-category">
                <h2>{category}</h2>
                <div className="menu-grid">
                  {items.map(item => (
                    <div key={item._id} className="menu-item-card">
                      {item.image && <img src={item.image} alt={item.name} className="menu-item-img" loading="lazy" />}
                      <div className="menu-item-info">
                        <div className="menu-item-header">
                          <span className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}></span>
                          <span className="menu-item-name">{item.name}</span>
                        </div>
                        <p className="menu-item-desc">{item.description}</p>
                        <div className="menu-item-footer">
                          <span className="menu-item-price">₹{item.price}</span>
                          <button
                            className={`add-btn ${addedItems.has(item._id) ? 'added' : ''}`}
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable}
                            id={`add-${item._id}`}
                          >
                            {addedItems.has(item._id) ? <><FiCheck /> Added</> : item.isAvailable ? 'ADD' : 'N/A'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
