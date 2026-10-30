const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    category: { type: String, enum: ['Standard', 'Deluxe', 'Suite'], required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['available', 'occupied'], default: 'available' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
