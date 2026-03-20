import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import Home from './pages/customer/Home';
import Browse from './pages/customer/Browse';
import RestaurantDetail from './pages/customer/RestaurantDetail';
import Cart from './pages/customer/Cart';
import Orders from './pages/customer/Orders';
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';
import Profile from './pages/customer/Profile';

// Restaurant Pages
import RestDashboard from './pages/restaurant/Dashboard';
import MenuManage from './pages/restaurant/MenuManage';
import RestaurantOrders from './pages/restaurant/RestaurantOrders';
import Settings from './pages/restaurant/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageUsers from './pages/admin/ManageUsers';
import Analytics from './pages/admin/Analytics';

import './App.css';

function CustomerLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Outlet />
      </main>
    </>
  );
}

function PortalLayout() {
  return (
    <>
      <Navbar />
      <div className="portal-container">
        <Sidebar />
        <main className="portal-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth pages (no navbar layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />
              <Route path="/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute roles={['customer']}><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute roles={['customer']}><Profile /></ProtectedRoute>} />
            </Route>

            {/* Restaurant Portal */}
            <Route element={<ProtectedRoute roles={['restaurant']}><PortalLayout /></ProtectedRoute>}>
              <Route path="/restaurant" element={<RestDashboard />} />
              <Route path="/restaurant/menu" element={<MenuManage />} />
              <Route path="/restaurant/orders" element={<RestaurantOrders />} />
              <Route path="/restaurant/settings" element={<Settings />} />
            </Route>

            {/* Admin Portal */}
            <Route element={<ProtectedRoute roles={['admin']}><PortalLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/restaurants" element={<ManageRestaurants />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
