const express = require('express');
const router = express.Router();
const {
  getMenuItems, createMenuItem, updateMenuItem,
  deleteMenuItem, toggleAvailability
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', getMenuItems);
router.post('/', protect, authorize('restaurant', 'admin'), createMenuItem);
router.put('/:id', protect, authorize('restaurant', 'admin'), updateMenuItem);
router.put('/:id/toggle', protect, authorize('restaurant', 'admin'), toggleAvailability);
router.delete('/:id', protect, authorize('restaurant', 'admin'), deleteMenuItem);

module.exports = router;
