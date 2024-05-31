const express = require('express');
const router = express.Router();
const User = require('./models/user');

// POST request to create a new user
router.post('/create', async function (req, res) {
  try {
    const newUser = new User(req.body); 
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request to fetch users
router.get('/display_data', async function (req, res) {
  try {
    const users = await User.find({});
    console.log('Fetched users:', users); // Log the fetched users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET request to fetch user information by email and socket ID
router.get('/getUserInfo', async (req, res) => {
  const { email, socketId } = req.query;
  try {
    const user = await User.findOne({ email, socketId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
