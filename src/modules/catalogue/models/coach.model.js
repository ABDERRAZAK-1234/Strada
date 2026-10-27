const coachSchema = new mongoose.Schema({
  registration: { type: String, required: true, uppercase: true, trim: true },
  seatNumbers:  [{ type: Number, required: true, min: 1 }],
  status:       { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' }
}, { timestamps: true });

coachSchema.index({ registration: 1 }, { unique: true });
