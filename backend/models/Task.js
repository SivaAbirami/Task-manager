const { DataTypes } = require('sequelize'); // Import Sequelize data types
const sequelize = require('../config/database'); // Import database connection

// Define Task Model
// This model represents the 'Tasks' table
const Task = sequelize.define('Task', {
  // Unique ID for the task
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Title of the task
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Title is required
    validate: {
      notEmpty: true, // Cannot be empty string
      len: [3, 255] // Length must be between 3 and 255 characters
    }
  },
  
  // Status of the task
  status: {
    type: DataTypes.ENUM('Todo', 'In Progress', 'Completed'), // Enum allows only specific values
    defaultValue: 'Todo' // Default status is 'Todo'
  },
  // Foreign key for the user who owns the task
  userId: {
    type: DataTypes.UUID,
    allowNull: false // Must belong to a user
  }
});

module.exports = Task; // Export the Task model