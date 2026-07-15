const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'dtc@g.batstate-u.edu.ph' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: dtc@g.batstate-u.edu.ph');
      process.exit(0);
    }

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'dtc@g.batstate-u.edu.ph',
      password: 'Admin123!',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: dtc@g.batstate-u.edu.ph');
    console.log('Password: Admin123!');
    console.log('Role:', adminUser.role);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();