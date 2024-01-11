const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum : ['admin','user'], //Add more roles here
    default: 'user',
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  NIC: {
    type: String,
    required: true,
  },
  isActive : {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
    default: '',
  },
  registeredDate: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
