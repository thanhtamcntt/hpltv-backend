const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const FilmForSeries = new Schema({
  title: {
    type: String,
    required: true,
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
  duration: { type: Number, required: true },
  view: { type: Number, required: true, default: 5000 },
  createAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('FilmForSeries', FilmForSeries);
