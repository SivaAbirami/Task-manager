import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Import Redux Toolkit functions
import axios from 'axios'; // Import axios for HTTP requests

// Define API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
// This instance will be used for all task-related requests
const api = axios.create({
  baseURL: API_URL
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Set Authorization header
  }
  return config;
});

// Async thunks

// Fetch Tasks Action
// Retrieves all tasks for the user
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks'); // GET request to /tasks
      return response.data; // Return the list of tasks
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

// Fetch Task Statistics Action
// Retrieves task counts by status
export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/tasks/stats'); // GET request to /tasks/stats
      return response.data; // Return statistics data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
);

// Create Task Action
// Creates a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post('/tasks', taskData); // POST request to /tasks
      return response.data; // Return the created task
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

// Update Task Action
// Updates an existing task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData); // PUT request to /tasks/:id
      return response.data; // Return the updated task
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

// Delete Task Action
// Deletes a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`); // DELETE request to /tasks/:id
      return id; // Return the ID of the deleted task
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

// Task Slice
// Manages task state
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [], // List of tasks
    stats: {}, // Task statistics
    loading: false, // Loading state
    error: null // Error state
  },
  reducers: {
    // Reducer to clear task errors
    clearTaskError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks handlers
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Update tasks list
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stats handlers
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload; // Update stats
      })
      // Create task handlers
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload); // Add new task to the beginning of the list
      })
      // Update task handlers
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload; // Update task in the list
        }
      })
      // Delete task handlers
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload); // Remove task from list
      });
  }
});

export const { clearTaskError } = taskSlice.actions; // Export actions
export default taskSlice.reducer; // Export reducer