class DepartureService {
  constructor({ departureRepository, lineRepository, coachRepository, clock, errors }) {
    this.departureRepo = departureRepository;
    this.lineRepo = lineRepository;
    this.coachRepo = coachRepository;
    this.clock = clock;
    this.errors = errors;
  }

  async createDeparture({ lineId, coachId, departureTime, arrivalTime, fareCents }) {
    const [line, coach] = await Promise.all([
      this.lineRepo.findById(lineId),
      this.coachRepo.findById(coachId)
    ]);
    if (!line || line.status !== 'ACTIVE') throw this.errors.validation('Invalid or inactive line');
    if (!coach || coach.status !== 'ACTIVE') throw this.errors.validation('Invalid or inactive coach');

    const depTime = new Date(departureTime);
    const arrTime = new Date(arrivalTime);
    if (isNaN(depTime) || isNaN(arrTime)) throw this.errors.validation('Invalid dates');
    if (depTime <= this.clock.now()) throw this.errors.validation('Departure must be in the future');
    if (arrTime <= depTime) throw this.errors.validation('Arrival must be after departure');

    if (!Number.isInteger(fareCents) || fareCents < 0) {
      throw this.errors.validation('fareCents must be a non-negative integer');
    }

    const snapshot = {
      lineLabel: line.label,
      coachRegistration: coach.registration,
      seatPlan: [...coach.seatNumbers],
      fareCents
    };

    return this.departureRepo.create({
      lineId,
      coachId,
      departureTime: depTime,
      arrivalTime: arrTime,
      fareCents,
      status: 'OPEN',
      revision: 0,
      snapshot
    });
  }

  async getDeparture(id, session = null) {
    return this.departureRepo.findById(id, session);
  }

  async listDepartures({ lineId }, pagination) {
    const { skip, limit, page } = pagination;
    const [data, total] = await Promise.all([
      this.departureRepo.findAll({ lineId }, { skip, limit }),
      this.departureRepo.countAll({ lineId })
    ]);
    return { data, pagination: { page, limit, total } };
  }

  async guardDeparture() {
    throw this.errors.notImplemented('guardDeparture not available yet');
  }

  async markCancelled() {
    throw this.errors.notImplemented('markCancelled not available yet');
  }
}

module.exports = DepartureService;