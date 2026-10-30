require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    await mongoose.connect(MONGO_URI);

    await Booking.deleteMany({});
    await Room.deleteMany({});
    await User.deleteMany({});

    const usersData = [
      { name: 'Admin User', email: 'admin@hotelpro.com', password: 'admin123', role: 'admin' },
      { name: 'Staff User', email: 'staff@hotelpro.com', password: 'staff123', role: 'staff' },
      { name: 'Guest User', email: 'guest@hotelpro.com', password: 'guest123', role: 'guest' }
    ];

    const users = await Promise.all(
      usersData.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return { ...u, password: hashedPassword };
      })
    );
    await User.insertMany(users);

    const rooms = [
      { roomNumber: '101', category: 'Standard', price: 80, status: 'available' },
      { roomNumber: '102', category: 'Standard', price: 85, status: 'available' },
      { roomNumber: '201', category: 'Deluxe', price: 150, status: 'available' },
      { roomNumber: '202', category: 'Deluxe', price: 160, status: 'available' },
      { roomNumber: '301', category: 'Suite', price: 250, status: 'available' },
      { roomNumber: '302', category: 'Suite', price: 300, status: 'available' }
    ];
    await Room.insertMany(rooms);

    console.log('--- Database Seeded Successfully ---');
    console.log('Users & Logins:');
    usersData.forEach((u) => {
      console.log(`Role: ${u.role.padEnd(5)} | Email: ${u.email.padEnd(20)} | Password: ${u.password}`);
    });
    console.log(`Rooms created: ${rooms.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
