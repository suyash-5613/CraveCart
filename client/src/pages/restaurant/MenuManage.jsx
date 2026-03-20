import { useState, useEffect } from 'react';
import { restaurantAPI, menuAPI } from '../../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import './Restaurant.css';

export default function MenuManage() {
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', image: '', isVeg: false });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const restRes = await restaurantAPI.getMine();
      if (restRes.data.data.length > 0) {
        const rest = restRes.data.data[0];
        setRestaurant(rest);
        const menuRes = await menuAPI.getByRestaurant(rest._id);
        setItems(menuRes.data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', description: '', price: '', category: '', image: '', isVeg: false });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: item.image, isVeg: item.isVeg });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, price: Number(form.price), restaurant: restaurant._id };
      if (editItem) {
        await menuAPI.update(editItem._id, data);
      } else {
        await menuAPI.create(data);
      }
      setShowModal(false);
      loadData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try { await menuAPI.delete(id); loadData(); } catch (err) { console.error(err); }
  };

  const handleToggle = async (id) => {
    try { await menuAPI.toggle(id); loadData(); } catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard-content page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">{items.length} items in your menu</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Item</button>
      </div>

      {loading ? <div className="skeleton" style={{ height: 300 }}></div> : (
        <div className="menu-manage-grid">
          {items.map(item => (
            <div key={item._id} className="manage-item-card">
              {item.image && <img src={item.image} alt={item.name} className="manage-item-img" />}
              <div className="manage-item-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}></span>
                    <strong>{item.name}</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.category}</div>
                </div>
                <span className="text-amber" style={{ fontWeight: 700 }}>₹{item.price}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 8 }}>{item.description}</p>
              <div className="manage-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}><FiEdit2 /> Edit</button>
                <button className="btn btn-sm" style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)' }} onClick={() => handleToggle(item._id)}>
                  {item.isAvailable ? <><FiToggleRight style={{color:'var(--accent-mint)'}}/> On</> : <><FiToggleLeft /> Off</>}
                </button>
                <button className="btn btn-sm" style={{ background: 'rgba(251,113,133,0.1)', color: 'var(--accent-rose)' }} onClick={() => handleDelete(item._id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content glass-strong" onClick={e => e.stopPropagation()}>
            <h2>{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
            <form onSubmit={handleSubmit} className="portal-form">
              <div className="form-group"><label>Name</label><input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea className="input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label>Price (₹)</label><input className="input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
                <div className="form-group"><label>Category</label><input className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required placeholder="e.g. Main Course" /></div>
              </div>
              <div className="form-group"><label>Image URL</label><input className="input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://..." /></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isVeg} onChange={e => setForm({...form, isVeg: e.target.checked})} /> Vegetarian
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary">{editItem ? 'Update' : 'Add Item'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
