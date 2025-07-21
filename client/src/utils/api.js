import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add the auth token to requests
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if token is invalid or expired
      if (error.response.data.error === 'Invalid token' || 
          error.response.data.error === 'Token expired') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/users/updateprofile', userData);
  return response.data;
};

// Rides API calls
export const getAllRides = async (queryParams = {}) => {
  const response = await api.get('/rides', { params: queryParams });
  return response.data;
};

export const getRideById = async (rideId) => {
  const response = await api.get(`/rides/${rideId}`);
  return response.data;
};

export const createRide = async (rideData) => {
  const response = await api.post('/rides', rideData);
  return response.data;
};

export const updateRide = async (rideId, rideData) => {
  const response = await api.put(`/rides/${rideId}`, rideData);
  return response.data;
};

export const deleteRide = async (rideId) => {
  const response = await api.delete(`/rides/${rideId}`);
  return response.data;
};

export const getUserOfferedRides = async () => {
  const response = await api.get('/rides/user/offered');
  return response.data;
};

export const getUserJoinedRides = async () => {
  const response = await api.get('/rides/user/joined');
  return response.data;
};

export const getUserPendingRides = async () => {
  const response = await api.get('/rides/user/pending');
  return response.data;
};

export const joinRide = async (rideId) => {
  const response = await api.post(`/rides/${rideId}/join`);
  return response.data;
};

export const leaveRide = async (rideId) => {
  const response = await api.post(`/rides/${rideId}/leave`);
  return response.data;
};

export const cancelJoinRequest = async (rideId) => {
  const response = await api.post(`/rides/${rideId}/cancel`);
  return response.data;
};

export const respondToJoinRequest = async (rideId, userId, status) => {
  const response = await api.post(`/rides/${rideId}/respond/${userId}`, { status });
  return response.data;
};

export const calculateRouteMatch = async (rideId) => {
  const response = await api.get(`/rides/${rideId}/match`);
  return response.data;
};

export default api;