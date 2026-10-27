class DepartureRepository {
  constructor(model) { this.model = model; }

  create(data, session = null) {
    return this.model.create([data], { session }).then(r => r[0]);
  }
  findById(id, session = null) {
    return this.model.findById(id).session(session);
  }
  findAll({ lineId }, { skip, limit }, session = null) {
    const q = lineId ? { lineId } : {};
    return this.model.find(q).skip(skip).limit(limit).session(session);
  }
  countAll({ lineId }, session = null) {
    const q = lineId ? { lineId } : {};
    return this.model.countDocuments(q).session(session);
  }

  updateIfRevision(id, expectedRevision, update, session = null) {
    return this.model.findOneAndUpdate(
      { _id: id, revision: expectedRevision },
      { $set: update, $inc: { revision: 1 } },
      { new: true, session }
    );
  }
}