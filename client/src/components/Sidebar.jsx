import { NavLink } from 'react-router-dom';
import { FiGrid, FiList, FiShoppingBag, FiSettings, FiUsers, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();

  const restaurantLinks = [
    { to: '/restaurant', icon: <FiGrid />, label: 'Dashboard', end: true },
    { to: '/restaurant/menu', icon: <FiList />, label: 'Menu Management' },
    { to: '/restaurant/orders', icon: <FiShoppingBag />, label: 'Orders' },
    { to: '/restaurant/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <FiGrid />, label: 'Dashboard', end: true },
    { to: '/admin/restaurants', icon: <FiCheckCircle />, label: 'Restaurants' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
    { to: '/admin/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
  ];

  const links = user?.role === 'admin' ? adminLinks : restaurantLinks;

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h4>{user?.name}</h4>
          <span className="badge badge-amber">{user?.role}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
