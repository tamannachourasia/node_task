// const express = require('express');
// var router = express.Router();
// const bodyParser = require('body-parser');

// const User = require('./models/user');

//  router.post('/users', async function (req, res, next) {
// //   // To submit the data(post)
//  try {
//   const user = new User(req.body);
//   await user.save();
//   res.status(201).send(user);
//  } catch (error) {
//    res.status(400).send(error);
//  }
// //   //To display the data(get)
// //   try {
// //     const users = await User.find(); // Fetch all users from MongoDB
// //     res.status(200).json(users);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Internal Server Error' });
// //   }
// });


// module.exports = router;

// routes/server.js
const express = require('express');
const router = express.Router();
const User = require('./models/user');
const Item = require('./models/item');

// POST request to create a new user
router.post('/create', async (req, res) => {
  try {
    const newUser = new User(req.body); // Assuming req.body contains user data
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET request to fetch items
router.get('/display_data', async function (req, res,next) {
  try {
    const users = await User.find({});
    console.log('Fetched users:', users); // Log the fetched users
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send(err);
  }
});

module.exports = router;
