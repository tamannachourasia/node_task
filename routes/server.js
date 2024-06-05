const express = require('express');
const router = express.Router();
const User = require('./models/user');

// POST request to create a new user
router.post('/create', async function (req, res) {
  
  try {
    const user = new User(req.body);
    await user.save();
    const liveUsers = req.liveUsers; // Access liveUsers from req object
    const io = req.io; // Access io from req object
    liveUsers[user.socketId] = user;
    io.emit('new-user', user);
    res.status(201).send('User created successfully');
  } catch (err) {
    console.error('Error creating user:', err); 
    res.status(500).send(err.message);
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
module.exports = router;
