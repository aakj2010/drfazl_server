const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  otp: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
