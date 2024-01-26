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
  listSeriesId: [{ type: mongoose.Types.ObjectId, required: false }],
  rating: { type: Number, required: true, default: 4.8 },
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
