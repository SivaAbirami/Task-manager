const express = require('express'); // Import express framework
const cors = require('cors'); // Import CORS middleware to handle Cross-Origin Resource Sharing
const path = require('path'); // Import path module for file path manipulations
const sequelize = require('./config/database'); // Import Sequelize database connection
require('dotenv').config(); // Load environment variables from .env file

// Import models
const User = require('./models/User'); // Import User model
const Task = require('./models/Task'); // Import Task model

// Import routes
const authRoutes = require('./routes/auth'); // Import authentication routes
const taskRoutes = require('./routes/tasks'); // Import task management routes

const app = express(); // Initialize Express application

// Update CORS configuration
// Define options for CORS policy
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development mode (no origin means same origin or non-browser request)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production, allow specific origins only
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-frontend.vercel.app',
      'https://task-manager-frontend.vercel.app'
    ];

    // Check if the origin of the request is in the allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow
    } else {
      callback(new Error('Not allowed by CORS')); // Deny
    }
  },
  credentials: true // Allow sending cookies/authorization headers
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS middleware with defined options
app.use(express.json()); // Parse incoming JSON requests

// Add health check endpoint
// Simple route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes at /api/auth
app.use('/api/tasks', taskRoutes); // Mount task routes at /api/tasks

// Serve frontend in production (optional)
// If in production, serve the built React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build'))); // Serve static files

  // Handle any other requests by returning index.html (for client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Database connection and server start
const PORT = process.env.PORT || 5000; // Set port from env or default to 5000

const startServer = async () => {
  try {
    // Sync database
    await sequelize.authenticate(); // Test the database connection
    console.log('Database connected successfully');

    // Create associations
    // Define relationship: User has many Tasks
    User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
    // Define relationship: Task belongs to a User
    Task.belongsTo(User, { foreignKey: 'userId' });

    // Sync models
    // Sync all defined models to the DB (create tables if not exist)
    await sequelize.sync();
    console.log('Database synced');

    // Start the server listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // Log error and exit if connection fails
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer(); // Execute the start function