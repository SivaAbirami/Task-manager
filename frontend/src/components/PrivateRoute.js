import React from 'react'; // Import React
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection
import { useSelector } from 'react-redux'; // Import hook to access Redux store

// PrivateRoute Component
// Wraps child components and allows access only if authenticated
const PrivateRoute = ({ children }) => {
  // Get token from auth state in Redux store
  const { token } = useSelector((state) => state.auth);

  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child components (e.g., Dashboard)
  return children;
};

export default PrivateRoute; // Export the component