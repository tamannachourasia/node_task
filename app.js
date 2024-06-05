const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3003;

// MongoDB connection
mongoose.connect("mongodb+srv://tamannachaurasiya17:5h.bSEUW_Yzs9Vy@tamanna.zpdpqpk.mongodb.net/?retryWrites=true&w=majority&appName=Tamanna");

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB Atlas:', err);
});

// Import routers
//const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
const serverRouter = require('./routes/server');
//const socketRouter = require('./routes/socket');
const User = require('./routes/models/user');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static('public'));

// Set the correct MIME type for JavaScript files
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.set('Content-Type', 'application/javascript');
  }
  next();
});

// Route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Use routers
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/server', serverRouter);
//app.use('/socket', socketRouter);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Handle new user joining
  socket.on('join-live-user', async ({ email, name }) => {
    try {
      const user = await User.findOneAndUpdate(
        { email },
        { socketId: socket.id },
        { new: true }
      );

      if (user) {
        // Update the liveUsers object
        liveUsers[socket.id] = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          socketId: user.socketId
        };

        // Emit the updated list of live users to all clients
        io.emit('new-user', liveUsers);
        console.log(`${name} joined with socket ID: ${socket.id}`);
      }
    } catch (error) {
      console.error('Error updating user socket ID:', error);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null }
      );

      if (user) {
        // Remove the user from the liveUsers object
        delete liveUsers[socket.id];

        // Emit the updated list of live users to all clients
        io.emit('user-disconnected', liveUsers);
        console.log(`User with socket ID ${socket.id} disconnected`);
      }
    } catch (error) {
      console.error('Error handling user disconnect:', error);
    }
  });
});

app.post('/checkUser', async (req, res) => {
  const { email, socketId } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.socketId = socketId;
      await user.save();
      liveUsers[socketId] = user;
      io.emit('new-user', liveUsers); // Broadcast updated live users list to all clients
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
