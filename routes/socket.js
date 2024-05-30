// In your Node.js server using Socket.IO and MongoDB
const io = require('socket.io')(httpServer);
const User = require('./models/user'); // Assuming you have a User model

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('insertUser', async (userData) => {
    try {
      // Insert user data into MongoDB
      const user = new User(userData);
      await user.save();

      // Join the user into the "live user" room
      socket.join('live user');

      // Store user's email, name, and socket ID in local variable
      const userSocketInfo = {
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        socketId: socket.id,
      };
      // You can store this info in a global object or an array
      // For example: connectedUsers.push(userSocketInfo);

      // Emit an event to update clients about the new user
      io.to('live user').emit('userJoined', userSocketInfo);
    } catch (error) {
      console.error('Error inserting user:', error);
    }
  });
});
