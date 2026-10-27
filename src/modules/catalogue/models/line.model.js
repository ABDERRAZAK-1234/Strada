const lineSchema = new mongoose.Schema({
  code:   { type: String, required: true, uppercase: true, trim: true },
  label:  { type: String, required: true, trim: true },
  stops:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true }],
  status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' }
}, { timestamps: true });

lineSchema.index({ code: 1 }, { unique: true });
lineSchema.index({ status: 1 });