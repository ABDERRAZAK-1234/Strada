class LineService {
  constructor({ lineRepository, stopRepository, errors }) {
    this.lineRepo = lineRepository;
    this.stopRepo = stopRepository;
    this.errors = errors;
  }

  async createLine({ code, label, stops }) {
    const normalizedCode = code.trim().toUpperCase();

    if (!Array.isArray(stops) || stops.length < 2) {
      throw this.errors.validation('A line requires at least 2 stops');
    }

    const uniqueStops = [...new Set(stops.map(String))];
    if (uniqueStops.length !== stops.length) {
      throw this.errors.validation('Stops must be distinct');
    }

    const existingStops = await this.stopRepo.findByIds(uniqueStops);
    if (existingStops.length !== uniqueStops.length) {
      throw this.errors.validation('One or more stops do not exist');
    }

    const exists = await this.lineRepo.existsByCode(normalizedCode);
    if (exists) {
      throw this.errors.conflict('Line code already exists');
    }

    try {
      return await this.lineRepo.create({
        code: normalizedCode,
        label: label.trim(),
        stops: uniqueStops,
        status: 'ACTIVE'
      });
    } catch (err) {
      if (err.code === 11000) {
        throw this.errors.conflict('Line code already exists');
      }
      throw err;
    }
  }

  async listActive(pagination) {
    const { skip, limit, page } = pagination;
    const [data, total] = await Promise.all([
      this.lineRepo.findActive({ skip, limit }),
      this.lineRepo.countActive()
    ]);
    return { data, pagination: { page, limit, total } };
  }

  async updateLine(id, { code, label, stops }) {
    const line = await this.lineRepo.findById(id);
    if (!line) throw this.errors.notFound('Line not found');
    if (line.status === 'ARCHIVED') {
      throw this.errors.conflict('Cannot update an archived line');
    }

    const update = {};

    if (code !== undefined) {
      const normalized = code.trim().toUpperCase();
      if (normalized !== line.code) {
        const exists = await this.lineRepo.existsByCode(normalized);
        if (exists) throw this.errors.conflict('Line code already exists');
        update.code = normalized;
      }
    }

    if (label !== undefined) update.label = label.trim();

    if (stops !== undefined) {
      if (!Array.isArray(stops) || stops.length < 2) {
        throw this.errors.validation('A line requires at least 2 stops');
      }
      const uniqueStops = [...new Set(stops.map(String))];
      if (uniqueStops.length !== stops.length) {
        throw this.errors.validation('Stops must be distinct');
      }
      const existing = await this.stopRepo.findByIds(uniqueStops);
      if (existing.length !== uniqueStops.length) {
        throw this.errors.validation('One or more stops do not exist');
      }
      update.stops = uniqueStops;
    }

    try {
      return await this.lineRepo.updateById(id, update);
    } catch (err) {
      if (err.code === 11000) {
        throw this.errors.conflict('Line code already exists');
      }
      throw err;
    }
  }

  async archiveLine(id) {
    const line = await this.lineRepo.findById(id);
    if (!line) throw this.errors.notFound('Line not found');

    if (line.status === 'ARCHIVED') {
      return { line, alreadyArchived: true };
    }

    const archived = await this.lineRepo.archiveById(id);
    return { line: archived, alreadyArchived: false };
  }
}

module.exports = LineService;