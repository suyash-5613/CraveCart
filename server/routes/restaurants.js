const express = require('express');
const router = express.Router();
const {
  getRestaurants, getRestaurant, createRestaurant,
  updateRestaurant, deleteRestaurant, getMyRestaurants
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getRestaurants);
router.get('/my/list', protect, authorize('restaurant'), getMyRestaurants);
router.get('/:id', getRestaurant);
router.post('/', protect, authorize('restaurant', 'admin'), createRestaurant);
router.put('/:id', protect, authorize('restaurant', 'admin'), updateRestaurant);
router.delete('/:id', protect, authorize('restaurant', 'admin'), deleteRestaurant);

module.exports = router;
