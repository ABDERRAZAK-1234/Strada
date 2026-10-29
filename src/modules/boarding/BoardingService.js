const { AppError } = require('../../shared/errors');

class BoardingService {
  constructor({ boardingRepository, reservationsApi, catalogueApi, clock, transactionRunner }) {
    this.boardingRepository = boardingRepository;
    this.reservationsApi = reservationsApi;
    this.catalogueApi = catalogueApi;
    this.clock = clock;
    this.transactionRunner = transactionRunner;
  }

  async checkTicket(departureId, ticketCode, agent) {
    return this.transactionRunner.run(async (session) => {
      await this.guardDepartureIsBoarding(departureId, session);

      const ticket = await this.reservationsApi.consumeTicket(ticketCode, departureId, session);

      const record = await this.boardingRepository.create(
        {
          bookingId: ticket.bookingId,
          departureId: departureId,
          agentId: agent.userId,
          checkedAt: this.clock.now(),
        },
        session
      );

      return toBoardingView(record, ticket);
    });
  }

  async guardDepartureIsBoarding(departureId, session) {
    try {
      await this.catalogueApi.guardDeparture(departureId, 'BOARDING', session);
    } catch (error) {
      if (error.code === 'DEPARTURE_STATE_MISMATCH') {
        throw new AppError(409, 'BOARDING_CLOSED', 'Boarding is not open for this departure.');
      }
      throw error;
    }
  }
}

function toBoardingView(record, ticket) {
  return {
    id: record._id,
    bookingId: record.bookingId,
    departureId: record.departureId,
    agentId: record.agentId,
    checkedAt: record.checkedAt,
    seatNumber: ticket.seatNumber,
    passengerName: ticket.passengerName,
  };
}

module.exports = BoardingService;