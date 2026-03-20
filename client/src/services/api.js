import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cravecart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Restaurant API
export const restaurantAPI = {
  getAll: (params) => API.get('/restaurants', { params }),
  getOne: (id) => API.get(`/restaurants/${id}`),
  create: (data) => API.post('/restaurants', data),
  update: (id, data) => API.put(`/restaurants/${id}`, data),
  delete: (id) => API.delete(`/restaurants/${id}`),
  getMine: () => API.get('/restaurants/my/list'),
};

// Menu API
export const menuAPI = {
  getByRestaurant: (restaurantId) => API.get(`/menu/restaurant/${restaurantId}`),
  create: (data) => API.post('/menu', data),
  update: (id, data) => API.put(`/menu/${id}`, data),
  delete: (id) => API.delete(`/menu/${id}`),
  toggle: (id) => API.put(`/menu/${id}/toggle`),
};

// Order API
export const orderAPI = {
  place: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getRestaurantOrders: (restaurantId, status) =>
    API.get(`/orders/restaurant/${restaurantId}`, { params: { status } }),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  getAll: () => API.get('/orders/all'),
};

// Cart API
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart/add', data),
  update: (data) => API.put('/cart/update', data),
  clear: () => API.delete('/cart/clear'),
};

// Admin API
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  getRestaurants: () => API.get('/admin/restaurants'),
  approveRestaurant: (id, isApproved) => API.put(`/admin/restaurants/${id}/approve`, { isApproved }),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
};

export default API;
