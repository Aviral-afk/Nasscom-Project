const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/', verifyToken, authorizeRoles('guest'), async (req, res) => {
  try {
    const { room: roomIdInput, roomId, checkIn, checkOut } = req.body;
    const targetRoomId = roomIdInput || roomId;

    if (!targetRoomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Room, check-in, and check-out dates are required' });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date' });
    }

    const room = await Room.findById(targetRoomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const overlap = await Booking.findOne({
      room: room._id,
      status: { $ne: 'cancelled' },
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });

    if (overlap) {
      return res.status(400).json({ message: 'Room is already booked for the selected dates' });
    }

    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.price;

    const booking = await Booking.create({
      user: req.user._id,
      room: room._id,
      checkIn: start,
      checkOut: end,
      totalPrice,
      status: 'confirmed',
      paid: false
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', verifyToken, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'guest' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/pay', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role === 'guest' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    booking.paid = true;
    await booking.save();

    res.json({ message: 'Payment marked as completed', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/checkin', verifyToken, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'checked-in';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'occupied' });

    res.json({ message: 'Check-in successful', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/checkout', verifyToken, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'checked-out';
    await booking.save();
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });

    res.json({ message: 'Check-out successful', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
