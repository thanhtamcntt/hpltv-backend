const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.model('Category', Category);
