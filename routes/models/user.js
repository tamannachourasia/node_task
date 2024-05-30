// // models/user.js
// const mongoose = require('mongoose');
// const validator = require('validator');

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   mobileNo: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (v) => /^\d{10}$/.test(v),
//       message: '{VALUE} is not a valid mobile number!'
//     }
//   },
//   email: {
//     type: String,
//     required: true,
//     validate: {
//       validator: validator.isEmail,
//       message: '{VALUE} is not a valid email!'
//     }
//   },
//   address: {
//     street: { type: String, required: true },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     country: { type: String, required: true },
//   },
//   loginId: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (v) => /^[a-zA-Z0-9]{6,}$/.test(v),
//       message: '{VALUE} is not a valid login ID!'
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/.test(v),
//       message: 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, and one special character.'
//     }
//   },
//   creationTime: { type: Date, default: Date.now },
//   lastUpdatedOn: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: String,
  email: String,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
  },
  loginId: String,
  password: String,
  creationTime: { type: Date, default: Date.now },
  lastUpdatedOn: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
