// backend/models/data.js
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true,
      },
  date: {
    type: Date,
    required: true,
  },
  pH: {
    type: Number,
    required: true,
  },
  TSS: {
    type: Number,
    required: true,
  },
  TDS: {
    type: Number,
    required: true,
  },
  BOD: {
    type: Number,
    required: true,
  },
  COD: {
    type: Number,
    required: true,
  },
  chloride: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Data', dataSchema);
