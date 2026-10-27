class LineRepository {
  constructor(model) { this.model = model; }

  create(data, session = null) {
    return this.model.create([data], { session }).then(r => r[0]);
  }
  findById(id, session = null) {
    return this.model.findById(id).session(session);
  }
  findActive({ skip, limit }, session = null) {
    return this.model.find({ status: 'ACTIVE' }).skip(skip).limit(limit).session(session);
  }
  countActive(session = null) {
    return this.model.countDocuments({ status: 'ACTIVE' }).session(session);
  }
  existsByCode(code, session = null) {
    return this.model.exists({ code }).session(session);
  }
  updateById(id, update, session = null) {
    return this.model.findByIdAndUpdate(id, update, { new: true, session });
  }
  archiveById(id, session = null) {
    return this.model.findByIdAndUpdate(id, { status: 'ARCHIVED' }, { new: true, session });
  }
  findActiveByIds(ids, session = null) {
    return this.model.find({ _id: { $in: ids }, status: 'ACTIVE' }).session(session);
  }
}