import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import { FiStar, FiClock, FiSearch } from 'react-icons/fi';
import './Customer.css';

const cuisineFilters = ['All', 'Indian', 'American', 'Japanese', 'Desserts', 'Healthy', 'Italian', 'Chinese'];

export default function Browse() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCuisine, setActiveCuisine] = useState('All');

  useEffect(() => { loadRestaurants(); }, []);

  const loadRestaurants = async () => {
    try {
      const res = await restaurantAPI.getAll();
      setRestaurants(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchCuisine = activeCuisine === 'All' || r.cuisine.some(c => c.toLowerCase().includes(activeCuisine.toLowerCase()));
    return matchSearch && matchCuisine;
  });

  return (
    <div className="browse-page container page-enter">
      <div className="browse-header">
        <h1>Browse Restaurants</h1>
        <p>{filtered.length} restaurants available</p>
      </div>

      <div className="hero-search" style={{ marginBottom: 24, maxWidth: '100%' }}>
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search restaurants or cuisines..." className="search-input" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="browse-filters">
        {cuisineFilters.map(c => (
          <button key={c} className={`filter-chip ${activeCuisine === c ? 'active' : ''}`} onClick={() => setActiveCuisine(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="restaurant-grid">
          {[1,2,3,4].map(i => (<div key={i} className="skeleton-card"><div className="skeleton" style={{height:180}}></div><div style={{padding:16}}><div className="skeleton" style={{height:20,width:'70%',marginBottom:8}}></div><div className="skeleton" style={{height:14,width:'50%'}}></div></div></div>))}
        </div>
      ) : (
        <div className="restaurant-grid">
          {filtered.map((r, i) => (
            <Link to={`/restaurant/${r._id}`} key={r._id} className="restaurant-card glass" style={{animationDelay:`${i*0.05}s`}}>
              <div className="card-image">
                <img src={r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} alt={r.name} loading="lazy" />
                <div className="card-overlay"><span className="badge badge-amber"><FiStar /> {r.rating}</span></div>
              </div>
              <div className="card-body">
                <h3 className="card-title">{r.name}</h3>
                <p className="card-cuisine">{r.cuisine.join(' • ')}</p>
                <div className="card-meta"><span className="meta-item"><FiClock /> {r.deliveryTime}</span><span className="price-range">{r.priceRange}</span></div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
