const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true }
}, { timestamps: true });

citySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('City', citySchema);