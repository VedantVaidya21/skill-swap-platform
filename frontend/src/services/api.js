import axios from 'axios';

// Set base URL for API requests
const api = axios.create({
  baseURL: '/api',
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post('/api/token/refresh/', {
          refresh: refreshToken
        });
        
        // Update tokens
        localStorage.setItem('token', response.data.access);
        
        // Update auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  getProfile: () => api.get('/profile/'),
  updateProfile: (profileData) => api.put('/profile/', profileData),
};

// Skills endpoints
export const skillsAPI = {
  getAllSkills: () => api.get('/skills/'),
  getUserSkills: (type) => api.get(`/user-skills/${type ? `?type=${type}` : ''}`),
  addUserSkill: (skillData) => api.post('/user-skills/', skillData),
  deleteUserSkill: (skillId) => api.delete(`/user-skills/${skillId}/`),
};

// Search endpoints
export const searchAPI = {
  searchUsers: (query) => api.get(`/users/search/?q=${query}`),
};

// Swap request endpoints
export const swapAPI = {
  getSwapRequests: (filters) => api.get('/swaps/', { params: filters }),
  createSwapRequest: (swapData) => api.post('/swaps/', swapData),
  updateSwapRequest: (swapId, status) => api.patch(`/swaps/${swapId}/`, { status }),
  deleteSwapRequest: (swapId) => api.delete(`/swaps/${swapId}/`),
};

// Feedback endpoints
export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/feedback/', feedbackData),
  getUserFeedback: () => api.get('/feedback/received/'),
};

// Admin endpoints
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users/'),
  banUser: (userId) => api.post(`/admin/users/${userId}/ban/`),
  activateUser: (userId) => api.post(`/admin/users/${userId}/activate/`),
  getAllSkills: () => api.get('/admin/skills/'),
  approveSkill: (skillId) => api.post(`/admin/skills/${skillId}/approve/`),
  rejectSkill: (skillId) => api.post(`/admin/skills/${skillId}/reject/`),
  getAllSwaps: (status) => api.get('/admin/swaps/', { params: { status } }),
  exportData: (type) => api.get(`/admin/export/?type=${type}`, { responseType: 'blob' }),
};

export default api; 