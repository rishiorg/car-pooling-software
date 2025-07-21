const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile
} = require('../controllers/users');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;