import { configureStore } from '@reduxjs/toolkit'; // Import configureStore from Redux Toolkit to create the store
import authReducer from './authSlice'; // Import the auth reducer
import taskReducer from './taskSlice'; // Import the task reducer

// Configure and export the Redux store
export const store = configureStore({
  // Combine reducers into a root reducer
  reducer: {
    auth: authReducer, // State slice for authentication will be managed by authReducer
    tasks: taskReducer // State slice for tasks will be managed by taskReducer
  }
});