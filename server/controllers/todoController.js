const Todo = require('../models/Todo');
const User = require('../models/User');

// Helper function to extract and validate mentioned users
const processMentions = async (tags) => {
  const mentions = tags
    .filter(tag => tag.startsWith('@'))
    .map(tag => tag.slice(1));

  if (mentions.length > 0) {
    const users = await User.find({ username: { $in: mentions } });
    if (users.length !== mentions.length) {
      throw new Error('One or more mentioned users not found');
    }
    return users.map(user => user._id);
  }
  return [];
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const mentionedUsers = await processMentions(req.body.tags || []);
    
    const todo = new Todo({
      ...req.body,
      mentionedUsers,
      user: req.user._id
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all todos
exports.getAllTodos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const todos = await Todo.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('mentionedUsers', 'username');

    const total = await Todo.countDocuments({ user: req.user._id });

    res.json({
      todos,
      page,
      totalPages: Math.ceil(total / limit),
      totalTodos: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single todo
exports.getTodo = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id })
      .populate('mentionedUsers', 'username');
      
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const mentionedUsers = await processMentions(req.body.tags || []);
    
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, mentionedUsers },
      { new: true, runValidators: true }
    ).populate('mentionedUsers', 'username');

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
