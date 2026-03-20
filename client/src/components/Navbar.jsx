import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'restaurant') return '/restaurant';
    return '/';
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-inner container">
        <Link to={getDashboardLink()} className="navbar-brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">Crave<span className="brand-highlight">Cart</span></span>
        </Link>

        {user?.role === 'customer' || !isAuthenticated ? (
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/browse" onClick={() => setMenuOpen(false)}>Browse</Link>
            {isAuthenticated && <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>}
          </div>
        ) : null}

        <div className="navbar-actions">
          {isAuthenticated && user?.role === 'customer' && (
            <Link to="/cart" className="cart-btn" id="nav-cart-btn">
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <div className="user-avatar">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="hide-mobile user-name">{user?.name?.split(' ')[0]}</span>
              </button>
              {menuOpen && (
                <div className="user-dropdown glass-strong">
                  <div className="dropdown-header">
                    <strong>{user?.name}</strong>
                    <span className="badge badge-amber">{user?.role}</span>
                  </div>
                  {user?.role === 'customer' && (
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <FiUser /> Profile
                    </Link>
                  )}
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="mobile-toggle hide-desktop" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
