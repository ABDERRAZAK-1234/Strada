class StopRepository {
  constructor(model) {
    this.model = model;
  }

  create(data, session = null) {
    return this.model.create([data], { session }).then((r) => r[0]);
  }

  findById(id, session = null) {
    return this.model.findById(id).session(session);
  }

  findByIds(ids, session = null) {
    return this.model.find({ _id: { $in: ids } }).session(session);
  }

  findAll(session = null) {
    return this.model.find().session(session);
  }
}

module.exports = StopRepository;