const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

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
      default: 'image-webFilm/bn7cwddncp0ls6rlyczw',
    },
    url: {
      type: String,
      required: true,
      default:
        'https://res.cloudinary.com/dzxupp48t/image/upload/v1705319817/image-webFilm/bn7cwddncp0ls6rlyczw.png',
    },
  },
  password: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Subscriber', Subscriber);
