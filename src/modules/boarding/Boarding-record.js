const mongoose = require('mongoose');
 
const boardingRecordSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  departureId: { type: mongoose.Schema.Types.ObjectId, required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkedAt: { type: Date, required: true },
});
 
module.exports = mongoose.model('BoardingRecord', boardingRecordSchema);
 