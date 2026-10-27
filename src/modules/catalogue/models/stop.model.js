const stopSchema = new mongoose.Schema({
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  name:   { type: String, required: true, trim: true }
}, { timestamps: true });

stopSchema.index({ cityId: 1, name: 1 }, { unique: true });