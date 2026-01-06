import React from 'react'; // Import React library
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import router components for navigation
import { Provider } from 'react-redux'; // Import Provider to connect Redux store to React
import { store } from './store/store'; // Import the Redux store
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import Material-UI theme provider and creator
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline to kickstart an elegant, consistent, and simple baseline to build upon.
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component for protected routes
import Login from './pages/Login'; // Import Login page component
import Register from './pages/Register'; // Import Register page component
import Dashboard from './pages/Dashboard'; // Import Dashboard page component

// Create a custom theme for Material-UI
const theme = createTheme({
  palette: {
    mode: 'light', // Set the color mode to light
    primary: {
      main: '#1976d2', // Set primary color (blue)
    },
    secondary: {
      main: '#dc004e', // Set secondary color (pinkish-red)
    },
  },
});

// App Component
// This is the root component of the application
function App() {
  return (
    // Provide the Redux store to all components in the app
    <Provider store={store}>
      {/* Apply the custom Material-UI theme */}
      <ThemeProvider theme={theme}>
        {/* Normalize CSS across browsers */}
        <CssBaseline />
        {/* Set up the router for managing navigation */}
        <Router>
          {/* Define routes for the application */}
          <Routes>
            {/* Route for Login page */}
            <Route path="/login" element={<Login />} />
            {/* Route for Register page */}
            <Route path="/register" element={<Register />} />
            {/* Protected Route for Dashboard */}
            <Route
              path="/dashboard"
              element={
                // Wrap Dashboard with PrivateRoute to ensure authentication
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Default route redirects to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App; // Export the App component