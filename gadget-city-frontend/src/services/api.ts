import axios from 'axios';

// Connect to our Gadget City backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // Get all products with real images
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    brand?: string;
  }) {
    const { data } = await axios.get(`${API_BASE_URL}/products`, { params });
    return data;
  },

  // Get single product details
  async getProduct(id: string) {
    const { data } = await axios.get(`${API_BASE_URL}/products/${id}`);
    return data;
  },

  // Get products by category
  async getProductsByCategory(category: string) {
    const { data } = await axios.get(`${API_BASE_URL}/products`, {
      params: { category }
    });
    return data;
  },

  // Search products
  async searchProducts(query: string) {
    const { data } = await axios.get(`${API_BASE_URL}/products`, {
      params: { search: query }
    });
    return data;
  },

  // Cart operations
  async getCart() {
    const { data } = await axios.get(`${API_BASE_URL}/cart`);
    return data;
  },

  async addToCart(productId: string, quantity: number = 1) {
    const { data } = await axios.post(`${API_BASE_URL}/cart/add`, {
      productId,
      quantity
    });
    return data;
  },

  async updateCartItem(productId: string, quantity: number) {
    const { data } = await axios.put(`${API_BASE_URL}/cart/${productId}`, {
      quantity
    });
    return data;
  },

  async removeFromCart(productId: string) {
    const { data } = await axios.delete(`${API_BASE_URL}/cart/${productId}`);
    return data;
  },

  async clearCart() {
    const { data } = await axios.delete(`${API_BASE_URL}/cart`);
    return data;
  },

  // Order operations
  async createOrder(orderData: {
    shippingAddress: {
      street: string;
      city: string;
      province: string;
      zipCode: string;
    };
    paymentMethod: string;
  }) {
    const { data } = await axios.post(`${API_BASE_URL}/orders/create`, orderData);
    return data;
  },

  async getOrders() {
    const { data } = await axios.get(`${API_BASE_URL}/orders`);
    return data;
  },

  async getOrder(id: string) {
    const { data } = await axios.get(`${API_BASE_URL}/orders/${id}`);
    return data;
  },

  // Image management (for admin)
  async uploadProductImages(productId: string, images: File[], altTexts?: string[]) {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', image);
    });
    if (altTexts) {
      altTexts.forEach((alt, index) => {
        formData.append(`altTexts[${index}]`, alt);
      });
    }

    const { data } = await axios.post(`${API_BASE_URL}/images/upload/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async deleteProductImage(productId: string, imageIndex: number) {
    const { data } = await axios.delete(`${API_BASE_URL}/images/${productId}/${imageIndex}`);
    return data;
  },

  async reorderProductImages(productId: string, imageOrder: number[]) {
    const { data } = await axios.put(`${API_BASE_URL}/images/reorder/${productId}`, {
      imageOrder
    });
    return data;
  }
};

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for authentication (when implemented)
axios.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);