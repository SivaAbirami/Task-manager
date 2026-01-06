const { DataTypes } = require('sequelize'); // Import DataTypes from sequelize for defining schema types
const sequelize = require('../config/database'); // Import database connection instance
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Define User Model
// This model represents the 'Users' table in the database
const User = sequelize.define('User', {
  // Define ID field
  id: {
    type: DataTypes.UUID, // Use UUID (Universally Unique Identifier) for IDs
    defaultValue: DataTypes.UUIDV4, // Automatically generate UUID v4
    primaryKey: true // Mark as primary key
  },
  // Define name field
  name: {
    type: DataTypes.STRING,
    allowNull: false // Name is required
  },
  // Define email field
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Email is required
    unique: true, // Email must be unique
    validate: {
      isEmail: true // Validate that value is an email format
    }
  },
  // Define password field
  password: {
    type: DataTypes.STRING,
    allowNull: false // Password is required
  }
}, {
  // Define hooks (lifecycle events)
  hooks: {
    // Before creating a new user, hash the password
    beforeCreate: async (user) => {
      // Hash password with salt round 10
      user.password = await bcrypt.hash(user.password, 10);
    },
    // Before updating a user, check if password changed
    beforeUpdate: async (user) => {
      // If password field is modified, hash the new password
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// instance Method to compare passwords
// Checks if the provided password matches the hashed password
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User; // Export the User model