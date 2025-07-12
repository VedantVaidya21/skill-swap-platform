import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user profile
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/profile/');
      setCurrentUser(response.data);
      // Check if user is admin (has staff status)
      setIsAdmin(response.data.is_staff === true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, try to refresh
      refreshTokens().catch(() => {
        logout();
      });
    }
  };

  const refreshTokens = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      
      localStorage.setItem('token', response.data.access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      // Fetch user profile with new token
      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      setError('');
      const response = await axios.post('/api/login/', {
        username,
        password
      });
      
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.detail || 
        'Failed to login. Please check your credentials.'
      );
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await axios.post('/api/register/', userData);
      
      // Automatically log in after registration
      return await login(userData.username, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.detail || 
        Object.values(error.response?.data || {})[0]?.[0] ||
        'Failed to register. Please try again.'
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (profileData) => {
    try {
      setError('');
      const response = await axios.put('/api/profile/', profileData);
      setCurrentUser({...currentUser, ...response.data});
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      setError(
        error.response?.data?.detail || 
        'Failed to update profile. Please try again.'
      );
      return false;
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshTokens
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 