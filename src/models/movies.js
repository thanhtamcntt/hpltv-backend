const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Movies = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    imageId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  videoUrl: {
    videoId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  cast: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  duration: { type: Number, required: true },
  rating: { type: Number, required: true, default: 5 },
  view: { type: Number, required: true, default: 5000 },
  productCompany: { type: String, required: true },
  createAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
  listCategoryId: [
    { type: mongoose.Types.ObjectId, required: true, ref: 'Category' },
  ],
  createBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Movies', Movies);
