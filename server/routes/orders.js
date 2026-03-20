const express = require('express');
const router = express.Router();
const {
  placeOrder, getMyOrders, getRestaurantOrders,
  updateOrderStatus, getAllOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.get('/restaurant/:restaurantId', protect, authorize('restaurant', 'admin'), getRestaurantOrders);
router.put('/:id/status', protect, authorize('restaurant', 'admin'), updateOrderStatus);

module.exports = router;
