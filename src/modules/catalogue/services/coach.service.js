class CoachService {
  constructor({ coachRepository, errors }) {
    this.coachRepo = coachRepository;
    this.errors = errors;
  }

  async createCoach({ registration, seatNumbers }) {
    const normalizedReg = registration.trim().toUpperCase();

    this._validateSeatNumbers(seatNumbers);

    const exists = await this.coachRepo.existsByRegistration(normalizedReg);
    if (exists) throw this.errors.conflict('Coach registration already exists');

    try {
      return await this.coachRepo.create({
        registration: normalizedReg,
        seatNumbers: [...seatNumbers].sort((a, b) => a - b),
        status: 'ACTIVE'
      });
    } catch (err) {
      if (err.code === 11000) {
        throw this.errors.conflict('Coach registration already exists');
      }
      throw err;
    }
  }

  async listAll(pagination) {
    const { skip, limit, page } = pagination;
    const [data, total] = await Promise.all([
      this.coachRepo.findAll({ skip, limit }),
      this.coachRepo.countAll()
    ]);
    return { data, pagination: { page, limit, total } };
  }

  async updateCoach(id, { registration, seatNumbers }) {
    const coach = await this.coachRepo.findById(id);
    if (!coach) throw this.errors.notFound('Coach not found');
    if (coach.status === 'ARCHIVED') {
      throw this.errors.conflict('Cannot update an archived coach');
    }

    const update = {};

    if (registration !== undefined) {
      const normalized = registration.trim().toUpperCase();
      if (normalized !== coach.registration) {
        const exists = await this.coachRepo.existsByRegistration(normalized);
        if (exists) throw this.errors.conflict('Coach registration already exists');
        update.registration = normalized;
      }
    }

    if (seatNumbers !== undefined) {
      this._validateSeatNumbers(seatNumbers);
      update.seatNumbers = [...seatNumbers].sort((a, b) => a - b);
    }

    try {
      return await this.coachRepo.updateById(id, update);
    } catch (err) {
      if (err.code === 11000) {
        throw this.errors.conflict('Coach registration already exists');
      }
      throw err;
    }
  }

  async archiveCoach(id) {
    const coach = await this.coachRepo.findById(id);
    if (!coach) throw this.errors.notFound('Coach not found');
    if (coach.status === 'ARCHIVED') {
      return { coach, alreadyArchived: true };
    }
    const archived = await this.coachRepo.archiveById(id);
    return { coach: archived, alreadyArchived: false };
  }

  _validateSeatNumbers(seatNumbers) {
    if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      throw this.errors.validation('seatNumbers must be a non-empty array');
    }
    const unique = new Set(seatNumbers);
    if (unique.size !== seatNumbers.length) {
      throw this.errors.validation('seatNumbers must be unique');
    }
    for (const n of seatNumbers) {
      if (!Number.isInteger(n) || n <= 0) {
        throw this.errors.validation('seatNumbers must be positive integers');
      }
    }
  }
}

module.exports = CoachService;