import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Import tools to create slice and async actions
import axios from 'axios'; // Import axios for making HTTP requests

// Define API URL from environment variables or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks

// Login Action
// Handles user login by making an API call
export const login = createAsyncThunk(
  'auth/login', // Action type prefix
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Send POST request to login endpoint
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      // Store token and user data in local storage for persistence
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Return the response data (user and token)
      return response.data;
    } catch (error) {
      // Return error message if login fails
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Register Action
// Handles user registration
export const register = createAsyncThunk(
  'auth/register', // Action type prefix
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Send POST request to register endpoint
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      // Store token and user data in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Return the response data
      return response.data;
    } catch (error) {
      // Return error message if registration fails
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

// Auth Slice
// Manages authentication state
const authSlice = createSlice({
  name: 'auth', // Slice name
  initialState: {
    // Initialize state from local storage if available
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false, // Loading state for async actions
    error: null // Error state
  },
  reducers: {
    // Logout reducer
    logout: (state) => {
      // Remove data from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Reset state
      state.user = null;
      state.token = null;
      state.error = null;
    },
    // Clear error reducer
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle login pending state
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle login success
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Handle login failure
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle register pending state
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle register success
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Handle register failure
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions and reducer
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;