const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Series = new Schema({
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
  releaseDate: {
    type: Number,
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
  listCategoryId: [
    { type: mongoose.Types.ObjectId, required: true, ref: 'Category' },
  ],
  rating: { type: Number, required: true, default: 4.8 },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
  createBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Series', Series);
