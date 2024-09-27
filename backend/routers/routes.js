// routes.js
const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const auth = require('../auth/auth');
const jwt = require('jsonwebtoken');

const router = new express.Router();

// User registration
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = jwt.sign({ _id: user._id }, 'secretkey');
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Check if username exists
router.get('/users/check-username', async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).send({ message: 'Username already exists' });
    }
    res.send({ message: 'Username is available' });
  } catch (e) {
    res.status(500).send(e);
  }
});

// User login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new Error();
    }
    const token = jwt.sign({ _id: user._id }, 'secretkey');
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: 'Login failed!' });
  }
});

// Create task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get tasks
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'dueDate', 'status'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;