import React, { useEffect } from 'react'; // Import React and useEffect hook
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link
} from '@mui/material'; // Import UI components from Material-UI
import { useFormik } from 'formik'; // Import hook for form management
import * as Yup from 'yup'; // Import validation library
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import routing hooks and components
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { login, clearError } from '../store/authSlice'; // Import login action and error clearer

// Validation schema for login form
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address') // Must be valid email
    .required('Email is required'), // Required field
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters') // Minimum length
    .required('Password is required') // Required field
});

// Login Page Component
const Login = () => {
  const dispatch = useDispatch(); // Hook to dispatch actions
  const navigate = useNavigate(); // Hook for navigation
  // Select auth state from Redux store
  const { loading, error, token } = useSelector((state) => state.auth);

  // Effect to redirect to dashboard if user is already logged in
  useEffect(() => {
    if (token) {
      navigate('/dashboard'); // Go to dashboard
    }
  }, [token, navigate]);

  // Effect to clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Initialize formik for form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema, // Apply validation rules
    onSubmit: (values) => {
      dispatch(login(values)); // Dispatch login action with form values
    }
  });

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header */}
          <Typography variant="h4" align="center" gutterBottom>
            Task Manager
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to manage your tasks
          </Typography>


          {/* Show error alert if login fails */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Email Input */}
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)} // Show error state
                helperText={formik.touched.email && formik.errors.email} // Show error message
              />

              {/* Password Input */}
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading} // Disable while loading
                fullWidth
              >
                {/* Show spinner or text */}
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              {/* Sign Up Link */}
              <Typography align="center">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; // Export Login page