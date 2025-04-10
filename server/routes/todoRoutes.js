const express = require('express');
const todoController = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Protect all routes
router.use(protect);

// Create a new todo
router.post('/', todoController.createTodo);

// Get all todos
router.get('/', todoController.getAllTodos);

// Get a single todo
router.get('/:id', todoController.getTodo);

// Update a todo
router.put('/:id', todoController.updateTodo);

// Delete a todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
