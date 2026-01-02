const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const { Op } = require('sequelize');

// Create Task
router.post('/', auth, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Task Statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Task.findAll({
      where: { userId: req.user.id },
      attributes: [
        'status',
        [Task.sequelize.fn('COUNT', Task.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const formattedStats = {
      Todo: 0,
      'In Progress': 0,
      Completed: 0
    };

    stats.forEach(stat => {
      formattedStats[stat.status] = parseInt(stat.dataValues.count);
    });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;