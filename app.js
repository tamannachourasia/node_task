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

const port = 3001;

// MongoDB connection
mongoose.connect("mongodb+srv://tamannachaurasiya17:5h.bSEUW_Yzs9Vy@tamanna.zpdpqpk.mongodb.net/?retryWrites=true&w=majority&appName=Tamanna");

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB Atlas:', err);
});

// User model
const User = require('./routes/models/user');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serverRouter = require('./routes/server');
var socketRouter = require('./routes/socket');
var createuserRouter = require('./routes/createuser');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);
app.use('/createuser', createuserRouter);
app.use('/socket', socketRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Socket.IO logic
let liveUsers = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinLiveUserRoom', (userData) => {
    const user = { ...userData, socketId: socket.id };
    liveUsers.push(user);
    io.emit('updateUserList', liveUsers);
  });

  socket.on('disconnect', () => {
    liveUsers = liveUsers.filter(user => user.socketId !== socket.id);
    io.emit('updateUserList', liveUsers);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
