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
var User=require('./routes/models/user')
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

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);
app.use('/socket', socketRouter);
app.use('/USER',User);

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.post('/checkUser', async function(req, res)  {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    res.json({ exists: true, user });
  } else {
    res.json({ exists: false });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join-live-user', async ({ email, name }) => {
    const user = await User.findOneAndUpdate({ email }, { socketId: socket.id }, { new: true });
    if (user) {
      io.emit('new-user', user);
      console.log(`${name} joined with socket ID: ${socket.id}`);
    }
  });

  socket.on('disconnect', async () => {
    const user = await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
    if (user) {
      io.emit('user-disconnected', socket.id);
      console.log(`User with socket ID ${socket.id} disconnected`);
    }
  });
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
