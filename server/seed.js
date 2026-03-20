const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});

    // Create users
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@cravecart.com',
      password: 'admin123',
      role: 'admin',
      phone: '9999999999'
    });

    const restaurantOwner1 = await User.create({
      name: 'Raj Sharma',
      email: 'raj@restaurant.com',
      password: 'restaurant123',
      role: 'restaurant',
      phone: '9888888888'
    });

    const restaurantOwner2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@restaurant.com',
      password: 'restaurant123',
      role: 'restaurant',
      phone: '9777777777'
    });

    const customer1 = await User.create({
      name: 'Arjun Kumar',
      email: 'arjun@email.com',
      password: 'customer123',
      role: 'customer',
      phone: '9666666666',
      address: { street: '42 MG Road', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' }
    });

    const customer2 = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha@email.com',
      password: 'customer123',
      role: 'customer',
      phone: '9555555555',
      address: { street: '15 Park Street', city: 'Mumbai', state: 'Maharashtra', zipCode: '400012' }
    });

    console.log('Users created!');

    // Create restaurants
    const r1 = await Restaurant.create({
      owner: restaurantOwner1._id,
      name: 'Spice Symphony',
      description: 'Authentic Indian cuisine with a modern twist. Our chefs bring traditional flavors to life with premium ingredients.',
      cuisine: ['Indian', 'North Indian', 'Mughlai'],
      address: { street: '10 Colaba', city: 'Mumbai', state: 'Maharashtra', zipCode: '400005' },
      rating: 4.5,
      totalRatings: 342,
      deliveryTime: '25-35 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
      isActive: true,
      isApproved: true,
      tags: ['bestseller', 'popular', 'premium'],
      mood: ['spicy', 'comfort']
    });

    const r2 = await Restaurant.create({
      owner: restaurantOwner1._id,
      name: 'The Burger Barn',
      description: 'Juicy, flame-grilled burgers crafted with premium Angus beef and fresh toppings. Satisfaction guaranteed.',
      cuisine: ['American', 'Burgers', 'Fast Food'],
      address: { street: '25 Bandra West', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050' },
      rating: 4.3,
      totalRatings: 528,
      deliveryTime: '20-30 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      isActive: true,
      isApproved: true,
      tags: ['fast-delivery', 'popular'],
      mood: ['comfort', 'quick']
    });

    const r3 = await Restaurant.create({
      owner: restaurantOwner2._id,
      name: 'Sakura Japanese Kitchen',
      description: 'Experience authentic Japanese flavors from sushi to ramen, prepared by master chefs.',
      cuisine: ['Japanese', 'Sushi', 'Asian'],
      address: { street: '5 Juhu', city: 'Mumbai', state: 'Maharashtra', zipCode: '400049' },
      rating: 4.7,
      totalRatings: 189,
      deliveryTime: '30-45 min',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
      isActive: true,
      isApproved: true,
      tags: ['premium', 'trending'],
      mood: ['premium', 'healthy']
    });

    const r4 = await Restaurant.create({
      owner: restaurantOwner2._id,
      name: 'Sweet Bliss Desserts',
      description: 'Handcrafted desserts, artisan cakes, and creamy gelatos that satisfy every sweet craving.',
      cuisine: ['Desserts', 'Bakery', 'Ice Cream'],
      address: { street: '18 Andheri', city: 'Mumbai', state: 'Maharashtra', zipCode: '400058' },
      rating: 4.6,
      totalRatings: 412,
      deliveryTime: '15-25 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
      isActive: true,
      isApproved: true,
      tags: ['bestseller', 'trending'],
      mood: ['sweet']
    });

    const r5 = await Restaurant.create({
      owner: restaurantOwner1._id,
      name: 'Green Bowl Salads',
      description: 'Fresh, nutritious salads and smoothie bowls made with organic, locally-sourced ingredients.',
      cuisine: ['Healthy', 'Salads', 'Vegan'],
      address: { street: '8 Powai', city: 'Mumbai', state: 'Maharashtra', zipCode: '400076' },
      rating: 4.4,
      totalRatings: 156,
      deliveryTime: '20-30 min',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      isActive: true,
      isApproved: true,
      tags: ['healthy', 'organic'],
      mood: ['healthy']
    });

    console.log('Restaurants created!');

    // Menu items for Spice Symphony (r1)
    const menuItems = await MenuItem.insertMany([
      // Spice Symphony
      { restaurant: r1._id, name: 'Butter Chicken', description: 'Creamy tomato-based curry with tender chicken pieces', price: 320, category: 'Main Course', isVeg: false, rating: 4.7, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', preparationTime: '20-25 min', tags: ['bestseller'] },
      { restaurant: r1._id, name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in rich spiced gravy', price: 280, category: 'Main Course', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', preparationTime: '18-22 min' },
      { restaurant: r1._id, name: 'Biryani Hyderabadi', description: 'Fragrant basmati rice layered with spiced meat', price: 350, category: 'Rice', isVeg: false, rating: 4.8, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', preparationTime: '25-30 min', tags: ['bestseller'] },
      { restaurant: r1._id, name: 'Dal Makhani', description: 'Slow-cooked black lentils in buttery gravy', price: 220, category: 'Main Course', isVeg: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', preparationTime: '15-20 min' },
      { restaurant: r1._id, name: 'Garlic Naan', description: 'Soft tandoori bread with garlic and butter', price: 60, category: 'Breads', isVeg: true, rating: 4.3, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', preparationTime: '10 min' },
      { restaurant: r1._id, name: 'Samosa (2 pcs)', description: 'Crispy pastry filled with spiced potatoes', price: 80, category: 'Starters', isVeg: true, rating: 4.2, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', preparationTime: '10 min' },
      { restaurant: r1._id, name: 'Chicken Tikka', description: 'Smoky tandoori chicken chunks with mint chutney', price: 260, category: 'Starters', isVeg: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', preparationTime: '15 min' },
      { restaurant: r1._id, name: 'Mango Lassi', description: 'Sweet yogurt drink with fresh mangoes', price: 100, category: 'Beverages', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1527685609591-44b0aef2400b?w=400', preparationTime: '5 min' },

      // Burger Barn
      { restaurant: r2._id, name: 'Classic Smash Burger', description: 'Double smashed patty with American cheese and special sauce', price: 250, category: 'Burgers', isVeg: false, rating: 4.5, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', preparationTime: '12-15 min', tags: ['bestseller'] },
      { restaurant: r2._id, name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, cheddar on Angus patty', price: 320, category: 'Burgers', isVeg: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', preparationTime: '15 min' },
      { restaurant: r2._id, name: 'Veggie Supreme Burger', description: 'Plant-based patty with avocado, lettuce, and garlic aioli', price: 220, category: 'Burgers', isVeg: true, rating: 4.3, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', preparationTime: '12 min' },
      { restaurant: r2._id, name: 'Loaded Fries', description: 'Crispy fries with cheese sauce, jalapenos, and bacon bits', price: 180, category: 'Sides', isVeg: false, rating: 4.4, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', preparationTime: '10 min' },
      { restaurant: r2._id, name: 'Onion Rings', description: 'Beer-battered golden onion rings', price: 120, category: 'Sides', isVeg: true, rating: 4.1, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', preparationTime: '8 min' },
      { restaurant: r2._id, name: 'Chocolate Shake', description: 'Rich and creamy chocolate milkshake', price: 150, category: 'Beverages', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', preparationTime: '5 min' },
      { restaurant: r2._id, name: 'Chicken Wings (8 pcs)', description: 'Crispy wings tossed in buffalo sauce', price: 280, category: 'Starters', isVeg: false, rating: 4.7, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400', preparationTime: '15 min', tags: ['bestseller'] },

      // Sakura Japanese Kitchen
      { restaurant: r3._id, name: 'Salmon Sashimi', description: 'Fresh Norwegian salmon, sliced thin, served with wasabi', price: 450, category: 'Sashimi', isVeg: false, rating: 4.8, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', preparationTime: '10 min', tags: ['premium'] },
      { restaurant: r3._id, name: 'Dragon Roll', description: 'Tempura shrimp, avocado, eel sauce, sesame seeds', price: 380, category: 'Sushi Rolls', isVeg: false, rating: 4.7, image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', preparationTime: '15 min' },
      { restaurant: r3._id, name: 'Tonkotsu Ramen', description: 'Rich pork bone broth, chashu, soft egg, nori', price: 350, category: 'Ramen', isVeg: false, rating: 4.9, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', preparationTime: '20 min', tags: ['bestseller'] },
      { restaurant: r3._id, name: 'Vegetable Tempura', description: 'Lightly battered seasonal vegetables, deep fried', price: 250, category: 'Starters', isVeg: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?w=400', preparationTime: '12 min' },
      { restaurant: r3._id, name: 'Edamame', description: 'Steamed soybean pods with sea salt', price: 120, category: 'Starters', isVeg: true, rating: 4.2, image: 'https://images.unsplash.com/photo-1564093497595-593b96d80571?w=400', preparationTime: '5 min' },
      { restaurant: r3._id, name: 'Matcha Ice Cream', description: 'Authentic Japanese green tea ice cream', price: 180, category: 'Desserts', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', preparationTime: '5 min' },

      // Sweet Bliss Desserts
      { restaurant: r4._id, name: 'Belgian Chocolate Cake', description: 'Three-layer moist chocolate cake with ganache', price: 280, category: 'Cakes', isVeg: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', preparationTime: '5 min', tags: ['bestseller'] },
      { restaurant: r4._id, name: 'Tiramisu', description: 'Classic Italian coffee-flavored layered dessert', price: 250, category: 'Desserts', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', preparationTime: '5 min' },
      { restaurant: r4._id, name: 'Pistachio Gelato', description: 'Authentic Italian gelato with real pistachios', price: 180, category: 'Ice Cream', isVeg: true, rating: 4.6, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400', preparationTime: '3 min' },
      { restaurant: r4._id, name: 'Red Velvet Cupcake', description: 'Classic red velvet with cream cheese frosting', price: 150, category: 'Cupcakes', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', preparationTime: '3 min' },
      { restaurant: r4._id, name: 'Cheesecake New York', description: 'Dense, creamy cheesecake with berry compote', price: 300, category: 'Cakes', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', preparationTime: '5 min' },
      { restaurant: r4._id, name: 'Brownie Sundae', description: 'Warm chocolate brownie, vanilla ice cream, hot fudge', price: 220, category: 'Desserts', isVeg: true, rating: 4.8, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', preparationTime: '8 min', tags: ['bestseller'] },

      // Green Bowl Salads
      { restaurant: r5._id, name: 'Caesar Salad', description: 'Crisp romaine, parmesan, croutons, classic Caesar dressing', price: 220, category: 'Salads', isVeg: true, rating: 4.4, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', preparationTime: '10 min' },
      { restaurant: r5._id, name: 'Grilled Chicken Bowl', description: 'Quinoa, grilled chicken, avocado, cherry tomatoes, tahini', price: 320, category: 'Bowls', isVeg: false, rating: 4.6, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', preparationTime: '12 min', tags: ['bestseller'] },
      { restaurant: r5._id, name: 'Acai Smoothie Bowl', description: 'Blended acai, granola, fresh berries, coconut flakes', price: 280, category: 'Bowls', isVeg: true, rating: 4.7, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', preparationTime: '8 min' },
      { restaurant: r5._id, name: 'Greek Salad', description: 'Feta, olives, cucumber, tomato, red onion, olive oil', price: 200, category: 'Salads', isVeg: true, rating: 4.3, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', preparationTime: '8 min' },
      { restaurant: r5._id, name: 'Green Detox Smoothie', description: 'Spinach, banana, apple, ginger, chia seeds', price: 180, category: 'Smoothies', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400', preparationTime: '5 min' },
      { restaurant: r5._id, name: 'Protein Power Bowl', description: 'Brown rice, tofu, edamame, avocado, peanut sauce', price: 300, category: 'Bowls', isVeg: true, rating: 4.5, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', preparationTime: '12 min' },
    ]);

    console.log(`${menuItems.length} menu items created!`);

    // Create some sample orders
    const sampleMenuItems = menuItems.slice(0, 3);
    await Order.create({
      customer: customer1._id,
      restaurant: r1._id,
      items: [
        { menuItem: sampleMenuItems[0]._id, name: sampleMenuItems[0].name, quantity: 2, price: sampleMenuItems[0].price },
        { menuItem: sampleMenuItems[1]._id, name: sampleMenuItems[1].name, quantity: 1, price: sampleMenuItems[1].price }
      ],
      totalAmount: sampleMenuItems[0].price * 2 + sampleMenuItems[1].price + 40 + 46,
      deliveryFee: 40,
      tax: 46,
      status: 'delivered',
      deliveryAddress: customer1.address,
      paymentMethod: 'online'
    });

    await Order.create({
      customer: customer2._id,
      restaurant: r2._id,
      items: [
        { menuItem: menuItems[8]._id, name: menuItems[8].name, quantity: 1, price: menuItems[8].price },
        { menuItem: menuItems[11]._id, name: menuItems[11].name, quantity: 1, price: menuItems[11].price }
      ],
      totalAmount: menuItems[8].price + menuItems[11].price + 40 + 22,
      deliveryFee: 40,
      tax: 22,
      status: 'preparing',
      deliveryAddress: customer2.address,
      paymentMethod: 'cod'
    });

    await Order.create({
      customer: customer1._id,
      restaurant: r3._id,
      items: [
        { menuItem: menuItems[17]._id, name: menuItems[17].name, quantity: 1, price: menuItems[17].price },
        { menuItem: menuItems[15]._id, name: menuItems[15].name, quantity: 2, price: menuItems[15].price }
      ],
      totalAmount: menuItems[17].price + menuItems[15].price * 2 + 40 + 63,
      deliveryFee: 40,
      tax: 63,
      status: 'placed',
      deliveryAddress: customer1.address,
      paymentMethod: 'online'
    });

    console.log('Sample orders created!');
    console.log('\n--- Seed Complete ---');
    console.log('Login credentials:');
    console.log('Admin:      admin@cravecart.com / admin123');
    console.log('Restaurant: raj@restaurant.com / restaurant123');
    console.log('Restaurant: priya@restaurant.com / restaurant123');
    console.log('Customer:   arjun@email.com / customer123');
    console.log('Customer:   sneha@email.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
