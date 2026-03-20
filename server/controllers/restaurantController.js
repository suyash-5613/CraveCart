const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants (public)
// @route   GET /api/restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const { cuisine, mood, search, sort } = req.query;
    let query = { isActive: true, isApproved: true };

    if (cuisine) query.cuisine = { $in: cuisine.split(',') };
    if (mood) query.mood = { $in: mood.split(',') };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = {};
    if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'delivery') sortOptions = { deliveryTime: 1 };
    else if (sort === 'name') sortOptions = { name: 1 };
    else sortOptions = { createdAt: -1 };

    const restaurants = await Restaurant.find(query).sort(sortOptions).populate('owner', 'name email');
    res.json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create restaurant (restaurant owner or admin)
// @route   POST /api/restaurants
exports.createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== 'admin' || !req.body.owner) {
      req.body.owner = req.user._id;
    }
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
exports.updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my restaurants (for restaurant owner)
// @route   GET /api/restaurants/my/list
exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
