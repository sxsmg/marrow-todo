const express = require('express');
const {
  registerUser,
  loginUser,
  verifyToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', protect, verifyToken);

module.exports = router;
