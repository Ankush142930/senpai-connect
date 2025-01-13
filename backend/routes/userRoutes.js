const express = require('express');
const {
  registerUser,
  authUser,
  allUsers,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

//One way of writing the routes
router.route('/').post(registerUser).get(protect, allUsers);

//Second way of writing the routes
router.post('/login', authUser);

module.exports = router;
