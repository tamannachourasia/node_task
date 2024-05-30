const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mobileNo: String,
  email: String,
  address: Object,
  loginId: String,
  password: String,
  creationTime: Date,
  lastUpdatedOn: Date,
});

module.exports = mongoose.model('Item', ItemSchema);
