const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router object
const auth = require('../middleware/auth'); // Import auth middleware to protect routes
const Task = require('../models/Task'); // Import Task model for database operations
const { Op } = require('sequelize'); // Import Sequelize operators if needed

// Create Task Route
// This route handles creating a new task
router.post('/', auth, async (req, res) => {
  try {
    // Create a new task in the database
    // Spread the request body (title, description, etc.) and add the authenticated user's ID
    const task = await Task.create({
      ...req.body,
      userId: req.user.id // Assign the task to the logged-in user (from auth middleware)
    });
    // Return the created task with a 201 Created status
    res.status(201).json(task);
  } catch (error) {
    // Handle validation errors or bad requests
    res.status(400).json({ error: error.message });
  }
});

// Get All Tasks Route
// This route fetches all tasks for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // Find all tasks where userId matches the logged-in user's ID
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']] // Order by creation date descending (newest first)
    });
    // Return the list of tasks
    res.json(tasks);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: error.message });
  }
});

// Get Task Statistics Route
// This route calculates statistics (count by status) for the user's tasks
router.get('/stats', auth, async (req, res) => {
  try {
    // Group tasks by status and count them
    const stats = await Task.findAll({
      where: { userId: req.user.id },
      attributes: [
        'status',
        [Task.sequelize.fn('COUNT', Task.sequelize.col('id')), 'count'] // SQL COUNT function
      ],
      group: ['status'] // Group results by 'status' column
    });

    // Initialize default stats object
    const formattedStats = {
      Todo: 0,
      'In Progress': 0,
      Completed: 0
    };

    // Iterate over the results and update the formattedStats object
    stats.forEach(stat => {
      // Ensure the count is parsed as an integer
      formattedStats[stat.status] = parseInt(stat.dataValues.count);
    });

    // Return the formatted statistics
    res.json(formattedStats);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: error.message });
  }
});

// Update Task Route
// This route updates an existing task by ID
router.put('/:id', auth, async (req, res) => {
  try {
    // Find the task by ID ensuring it belongs to the logged-in user
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    // If task not found or doesn't belong to user, return 404
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task with the new data from request body
    await task.update(req.body);
    // Return the updated task
    res.json(task);
  } catch (error) {
    // Handle validation errors or bad requests
    res.status(400).json({ error: error.message });
  }
});

// Delete Task Route
// This route deletes a task by ID
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the task by ID ensuring it belongs to the logged-in user
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    // If task not found, return 404
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Delete the task from the database
    await task.destroy();
    // Return success message
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; // Export the router