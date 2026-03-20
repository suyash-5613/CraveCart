const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, getRestaurants,
  approveRestaurant, toggleUserStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/restaurants', getRestaurants);
router.put('/restaurants/:id/approve', approveRestaurant);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
