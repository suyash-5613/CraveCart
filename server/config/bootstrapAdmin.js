const User = require('../models/User');

const ensureAdminUser = async () => {
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@cravecart.com').toLowerCase();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.DEFAULT_ADMIN_NAME || 'Admin';
  const adminPhone = process.env.DEFAULT_ADMIN_PHONE || '9999999999';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`Updated existing user to admin role: ${adminEmail}`);
    }
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    phone: adminPhone
  });

  console.log(`Default admin account is ready: ${adminEmail}`);
};

module.exports = ensureAdminUser;