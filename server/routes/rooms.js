const express = require('express');
const Room = require('../models/Room');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { roomNumber, category, price, status } = req.body;
    if (!roomNumber || !category || price === undefined) {
      return res.status(400).json({ message: 'Room number, category, and price are required' });
    }

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const room = await Room.create({ roomNumber, category, price, status });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
