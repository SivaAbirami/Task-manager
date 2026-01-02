const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 255]
    }
  },
  status: {
    type: DataTypes.ENUM('Todo', 'In Progress', 'Completed'),
    defaultValue: 'Todo'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

module.exports = Task;