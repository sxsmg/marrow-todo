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

    const { priority, tags, sort } = req.query;
    const query = { user: req.user._id };

    if (priority) {
      query.priority = priority;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $all: tagArray.map(tag => new RegExp(tag, 'i')) };
    }

    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      if (field === 'priority') {
        // Custom sort order for priority: High > Medium > Low
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        if (order === 'desc') {
          sortOptions[field] = { $sort: { $subtract: [0, { $arrayElemAt: [Object.values(priorityOrder), { $indexOfArray: [Object.keys(priorityOrder), `$${field}`] }] }] } };
        } else {
          sortOptions[field] = { $sort: { $arrayElemAt: [Object.values(priorityOrder), { $indexOfArray: [Object.keys(priorityOrder), `$${field}`] }] } };
        }
      } else {
        sortOptions[field] = order === 'desc' ? -1 : 1;
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const todos = await Todo.find(query)
      .sort(sortOptions)
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
