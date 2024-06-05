const express = require('express');
const router = express.Router();
const User = require('./models/user');

// Assuming you have a route for handling the 'Join Room' form
router.post('/joinRoom', async (req, res) => {
  const { email } = req.body;
  try {
    // Find all users with the entered email
    const users = await User.find({ email });

    if (users.length > 0) {
      // Display details for all users with the entered email
      console.log('Users:', users);

      // Extract relevant user details
      const userData = users.map(user => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        socketId: user.socketId
      }));

      // Show a popup indicating 'JOINED [Email]'
      const joinedPopup = `JOINED ${email}`;
      console.log(joinedPopup);

      // Send the response with user details and popup message
      res.status(200).json({ users: userData, message: joinedPopup });
    } else {
      // If no users found, send an error response
      res.status(404).json({ error: 'No users found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
