const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// @desc    Get user cart
// @route   GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('restaurant', 'name image deliveryTime')
      .populate('items.menuItem', 'name price image isVeg isAvailable');
    if (!cart) {
      cart = { items: [], restaurant: null };
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, restaurantId, quantity } = req.body;
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart && cart.restaurant && cart.restaurant.toString() !== restaurantId) {
      // Different restaurant - clear cart first
      cart.items = [];
      cart.restaurant = restaurantId;
    }

    if (!cart) {
      cart = new Cart({ user: req.user._id, restaurant: restaurantId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += (quantity || 1);
    } else {
      cart.items.push({
        menuItem: menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity || 1
      });
    }

    cart.restaurant = restaurantId;
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('restaurant', 'name image deliveryTime')
      .populate('items.menuItem', 'name price image isVeg isAvailable');

    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
exports.updateCartItem = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);
    } else {
      const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.json({ success: true, data: { items: [], restaurant: null } });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id)
      .populate('restaurant', 'name image deliveryTime')
      .populate('items.menuItem', 'name price image isVeg isAvailable');

    res.json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
