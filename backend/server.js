const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Task = require('./models/Task');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Update CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // In production, allow specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-frontend.vercel.app',
      'https://task-manager-frontend.vercel.app'
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Serve frontend in production (optional)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync database
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Create associations
    User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Task.belongsTo(User, { foreignKey: 'userId' });

    // Sync models
    await sequelize.sync();
    console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer();