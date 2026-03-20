import { useState, useEffect } from 'react';
import { restaurantAPI } from '../../services/api';
import './Restaurant.css';

export default function Settings() {
  const [restaurant, setRestaurant] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', cuisine: '', image: '', deliveryTime: '', priceRange: '$$' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await restaurantAPI.getMine();
      if (res.data.data.length > 0) {
        const r = res.data.data[0];
        setRestaurant(r);
        setForm({
          name: r.name, description: r.description, cuisine: r.cuisine.join(', '),
          image: r.image, deliveryTime: r.deliveryTime, priceRange: r.priceRange
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await restaurantAPI.update(restaurant._id, {
        ...form,
        cuisine: form.cuisine.split(',').map(c => c.trim())
      });
      setSuccess('Settings saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="dashboard-content"><div className="skeleton" style={{height:400}}></div></div>;

  if (!restaurant) return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Restaurant Setup</h1>
      <p className="page-subtitle">You haven't created a restaurant yet.</p>
      <p>Please register a restaurant first on the admin panel or contact support.</p>
    </div>
  );

  return (
    <div className="dashboard-content page-enter">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Update your restaurant information</p>

      {success && <div className="success-msg" style={{maxWidth:600}}>{success}</div>}

      <form onSubmit={handleSubmit} className="portal-form">
        <div className="form-group"><label>Restaurant Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
        <div className="form-group"><label>Description</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div className="form-group"><label>Cuisines (comma separated)</label><input className="input" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} placeholder="Indian, Chinese" /></div>
        <div className="form-row">
          <div className="form-group"><label>Delivery Time</label><input className="input" value={form.deliveryTime} onChange={e => setForm({...form, deliveryTime: e.target.value})} /></div>
          <div className="form-group">
            <label>Price Range</label>
            <select className="input" value={form.priceRange} onChange={e => setForm({...form, priceRange: e.target.value})}>
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Mid-range</option>
              <option value="$$$">$$$ - Premium</option>
              <option value="$$$$">$$$$ - Fine Dining</option>
            </select>
          </div>
        </div>
        <div className="form-group"><label>Image URL</label><input className="input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
