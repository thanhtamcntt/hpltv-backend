const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
require('dotenv').config();

const Subscriber = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  avatarUser: {
    imageId: {
      type: String,
      required: true,
      default: process.env.IMAGE_ID_DEFAULT,
    },
    url: {
      type: String,
      required: true,
      default: process.env.IMAGE_URL_DEFAULT,
    },
  },
  password: {
    type: String,
    required: true,
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
  },
  resetToken: String,
  tokenExpiration: Date,
});

module.exports = mongoose.model('Subscriber', Subscriber);
