import React, { useState } from 'react'; // Import React hooks
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box
} from '@mui/material'; // Import UI components
import { useFormik } from 'formik'; // Import hook for form handling
import * as Yup from 'yup'; // Import validation library

// Validation schema for task form
const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters') // Minimum length
    .max(255, 'Title must be at most 255 characters') // Maximum length
    .required('Title is required'), // Required field
  status: Yup.string()
    .oneOf(['Todo', 'In Progress', 'Completed'], 'Invalid status') // Must be one of valid statuses
    .required('Status is required') // Required field
});

// TaskForm Component
// Renders a dialog for creating or editing tasks
const TaskForm = ({ open, onClose, onSubmit, initialValues, isEditing }) => {
  // Initialize formik
  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      status: 'Todo'
    },
    validationSchema, // Apply validation rules
    onSubmit: (values) => {
      onSubmit(values); // Call parent submit handler
      formik.resetForm(); // Reset form after submission
    },
    enableReinitialize: true // Re-initialize form if initialValues change (e.g. when opening edit for different task)
  });

  // Handle closing the dialog
  const handleClose = () => {
    formik.resetForm(); // Reset form
    onClose(); // Call parent close handler
  };

  return (
    // Dialog component controls visibility with 'open' prop
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {/* Dynamic title based on mode */}
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Title Input */}
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Task Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            {/* Status Select Input */}
            <TextField
              select
              fullWidth
              id="status"
              name="status"
              label="Status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.status && Boolean(formik.errors.status)}
              helperText={formik.touched.status && formik.errors.status}
            >
              <MenuItem value="Todo">Todo</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm; // Export the component