const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
      default: 'confirmed'
    },
    paid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
