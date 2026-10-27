const departureSchema = new mongoose.Schema({
  lineId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Line',  required: true },
  coachId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime:   { type: Date, required: true },
  fareCents:     { type: Number, required: true, min: 0 },
  status:        { type: String, enum: ['OPEN','BOARDING','DEPARTED','CANCELLED'], default: 'OPEN' },
  revision:      { type: Number, default: 0 },
  snapshot: {
    lineLabel:          String,
    coachRegistration:  String,
    seatPlan:           [Number],
    fareCents:          Number
  }
}, { timestamps: true });

departureSchema.index({ status: 1, departureTime: 1 });
departureSchema.index({ lineId: 1 });
departureSchema.index({ _id: 1, revision: 1 }); 