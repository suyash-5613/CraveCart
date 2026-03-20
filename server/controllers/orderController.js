const Order = require('../models/Order');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// @desc    Place order
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) continue;
      const qty = item.quantity || 1;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: qty,
        price: menuItem.price
      });
      totalAmount += menuItem.price * qty;
    }

    const deliveryFee = 40;
    const tax = Math.round(totalAmount * 0.05);

    const order = await Order.create({
      customer: req.user._id,
      restaurant,
      items: orderItems,
      totalAmount: totalAmount + deliveryFee + tax,
      deliveryFee,
      tax,
      deliveryAddress: deliveryAddress || req.user.address,
      paymentMethod: paymentMethod || 'cod'
    });

    // Clear cart after ordering
    await Cart.findOneAndDelete({ user: req.user._id });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant', 'name image')
      .populate('customer', 'name email');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my orders (customer)
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get restaurant orders (restaurant owner)
// @route   GET /api/orders/restaurant/:restaurantId
exports.getRestaurantOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { restaurant: req.params.restaurantId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('restaurant', 'name image').populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('restaurant', 'name')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
