const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(firebaseToken) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ token: firebaseToken }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Products endpoints
  async getProducts() {
    return this.request('/api/products');
  }

  async getProduct(id) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getLowStockProducts() {
    return this.request('/api/products/alerts/low-stock');
  }

  // Categories endpoints
  async getCategories() {
    return this.request('/api/categories');
  }

  async createCategory(categoryData) {
    return this.request('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async getOrders() {
    return this.request('/api/orders');
  }

  async getOrder(id) {
    return this.request(`/api/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async refundOrder(id) {
    return this.request(`/api/orders/${id}/refund`, {
      method: 'PUT',
    });
  }

  // Payment endpoints (Stripe)
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    return this.request('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, metadata }),
    });
  }

  async verifyPayment(paymentIntentId) {
    return this.request(`/api/payments/verify/${paymentIntentId}`);
  }

  // Users endpoints (Admin only)
  async getUsers() {
    return this.request('/api/users');
  }

  async getUser(id) {
    return this.request(`/api/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deactivateUser(id) {
    return this.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  async reactivateUser(id) {
    return this.request(`/api/users/${id}/reactivate`, {
      method: 'POST',
    });
  }

  async getUserStats() {
    return this.request('/api/users/stats/summary');
  }

  // Reports endpoints (Admin only)
  async getSalesSummary(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/reports/sales/summary${query}`);
  }

  async getDailySales(days = 7) {
    return this.request(`/api/reports/sales/daily?days=${days}`);
  }

  async getTopProducts(limit = 10, startDate, endDate) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return this.request(`/api/reports/products/top?${params.toString()}`);
  }

  async getSalesByCashier(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/reports/sales/by-cashier${query}`);
  }

  async getPaymentBreakdown(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/reports/payments/breakdown${query}`);
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/api/settings');
  }

  async updateSettings(settingsData) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  async resetSettings() {
    return this.request('/api/settings/reset', {
      method: 'POST',
    });
  }

  // Upload endpoints
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const url = `${this.baseURL}/api/upload/image`;
    const headers = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  async deleteImage(filename) {
    return this.request('/api/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({ filename }),
    });
  }

  getImageUrl(path) {
    if (!path) return null;
    // If it's already a full URL, return as-is
    if (path.startsWith('http')) return path;
    // Otherwise, prepend the API URL
    return `${this.baseURL}${path}`;
  }
}

const api = new ApiService();
export default api;
