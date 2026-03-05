import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to admin requests
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

// Orders
export const placeOrder = (data) => api.post('/order', data);
export const trackOrder = (orderNumber, phone) =>
  api.get('/order/track', { params: { orderNumber, phone } });

// Admin
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const getAdminOrders = (params) => api.get('/admin/orders', { params });
export const updateOrderStatus = (data) => api.put('/admin/order-status', data);
export const createProduct = (data) => api.post('/admin/products', data);
export const updateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);

export default api;
