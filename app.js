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

// Middleware setup

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serverRouter = require('./routes/server')
//const User=require('./routes/models/user')
const createuserRouter = require('./routes/createuser')
var socketRouter = require('./routes/socket')


// Serve static files from the "views" directory
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


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'views')));

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


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);
app.use('/createuser', createuserRouter);
app.use('/socket', socketRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  socketId: String
});

const User = mongoose.model('User', UserSchema);
let liveUsers = {};

app.post('/add-user', async (req, res) => {
  console.log('Received request to /add-user');
  const { email, name } = req.body;
  console.log('Request body:', req.body); 
  const newUser = new User({ email, name });
  await newUser.save();

  res.status(201).send('User added');
});

app.get('/user-info', async (req, res) => {
  const { email, socketId } = req.query;
  let user;

  if (email) {
    user = await User.findOne({ email });
  } else if (socketId) {
    user = await User.findOne({ socketId });
  }

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('User not found');
  }
});



io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join-live-user', async (userData) => {
    const { email, name } = userData;

    liveUsers[socket.id] = { email, name, socketId: socket.id };

    const user = await User.findOneAndUpdate(
      { email },
      { socketId: socket.id },
      { new: true }
    );

    socket.join('live user');

    io.to('live user').emit('new-user', liveUsers);
  });

  socket.on('disconnect', () => {
    delete liveUsers[socket.id];
    io.to('live user').emit('user-disconnected', socket.id);
  });
});


// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
