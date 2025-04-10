const express = require('express');
const todoController = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);

router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
