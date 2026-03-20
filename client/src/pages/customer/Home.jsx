import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import { FiStar, FiClock, FiSearch, FiArrowRight } from 'react-icons/fi';
import './Customer.css';

const moodOptions = [
  { key: 'spicy', emoji: '🌶️', label: 'Feeling Spicy' },
  { key: 'sweet', emoji: '🍰', label: 'Sweet Tooth' },
  { key: 'comfort', emoji: '🍜', label: 'Comfort Food' },
  { key: 'healthy', emoji: '🥗', label: 'Healthy Vibes' },
  { key: 'quick', emoji: '⚡', label: 'Quick Bite' },
  { key: 'premium', emoji: '✨', label: 'Premium Dining' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await restaurantAPI.getAll();
      setRestaurants(res.data.data);
      setFilteredRestaurants(res.data.data);
    } catch (err) {
      console.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...restaurants];
    if (selectedMood) {
      filtered = filtered.filter(r => r.mood?.includes(selectedMood));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(s) ||
        r.cuisine.some(c => c.toLowerCase().includes(s))
      );
    }
    setFilteredRestaurants(filtered);
  }, [selectedMood, search, restaurants]);

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content container">
          <h1 className="hero-title animate-slide-up">
            What are you <span className="text-amber">craving</span> today?
          </h1>
          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover amazing restaurants and get your favorite food delivered to your door
          </p>
          <div className="hero-search animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="home-search"
            />
          </div>
        </div>
      </section>

      {/* Craving Mood Selector */}
      <section className="mood-section container">
        <h2 className="section-title">Choose Your Mood</h2>
        <div className="mood-scroll">
          {moodOptions.map((mood) => (
            <button
              key={mood.key}
              className={`mood-chip ${selectedMood === mood.key ? 'active' : ''}`}
              onClick={() => setSelectedMood(selectedMood === mood.key ? null : mood.key)}
              id={`mood-${mood.key}`}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurants */}
      <section className="restaurants-section container">
        <div className="section-header">
          <h2 className="section-title">
            {selectedMood
              ? `${moodOptions.find(m => m.key === selectedMood)?.emoji} ${moodOptions.find(m => m.key === selectedMood)?.label}`
              : 'Popular Restaurants'}
          </h2>
          <Link to="/browse" className="view-all">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="restaurant-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-card">
                <div className="skeleton" style={{ height: 180 }}></div>
                <div style={{ padding: 16 }}>
                  <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8 }}></div>
                  <div className="skeleton" style={{ height: 14, width: '50%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No restaurants found</h3>
            <p>Try a different mood or search term</p>
          </div>
        ) : (
          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant, index) => (
              <Link
                to={`/restaurant/${restaurant._id}`}
                key={restaurant._id}
                className="restaurant-card glass"
                style={{ animationDelay: `${index * 0.05}s` }}
                id={`restaurant-${restaurant._id}`}
              >
                <div className="card-image">
                  <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                    alt={restaurant.name}
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <span className="badge badge-amber">
                      <FiStar /> {restaurant.rating}
                    </span>
                  </div>
                  {restaurant.tags?.includes('trending') && (
                    <span className="trending-badge">🔥 Trending</span>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="card-title">{restaurant.name}</h3>
                  <p className="card-cuisine">{restaurant.cuisine.join(' • ')}</p>
                  <div className="card-meta">
                    <span className="meta-item">
                      <FiClock /> {restaurant.deliveryTime}
                    </span>
                    <span className="price-range">{restaurant.priceRange}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
