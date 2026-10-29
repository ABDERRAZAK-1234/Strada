const BoardingService = require('../../src/modules/boarding/boarding.service');

const FIXED_TIME = new Date('2027-03-15T08:45:00Z');
const FAKE_SESSION = { name: 'fake-session' };
const AGENT = { userId: 'agent-1', role: 'agent', fullName: 'Karim Agent' };

function buildService(overrides = {}) {
  const dependencies = {
    boardingRepository: {
      create: jest.fn().mockResolvedValue({
        _id: 'record-1',
        bookingId: 'booking-1',
        departureId: 'departure-1',
        agentId: 'agent-1',
        checkedAt: FIXED_TIME,
      }),
    },
    reservationsApi: {
      consumeTicket: jest.fn().mockResolvedValue({
        bookingId: 'booking-1',
        seatNumber: 2,
        passengerName: 'Sara Amrani',
      }),
    },
    catalogueApi: {
      guardDeparture: jest.fn().mockResolvedValue({}),
    },
    clock: { now: () => FIXED_TIME },
    transactionRunner: { run: async (callback) => callback(FAKE_SESSION) },
    ...overrides,
  };

  return { service: new BoardingService(dependencies), dependencies };
}

function errorWithCode(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

describe('BoardingService.checkTicket', () => {
  test('creates the record with the agent id and the clock time', async () => {
    const { service, dependencies } = buildService();

    const result = await service.checkTicket('departure-1', 'CODE-1', AGENT);

    expect(dependencies.boardingRepository.create).toHaveBeenCalledWith(
      {
        bookingId: 'booking-1',
        departureId: 'departure-1',
        agentId: 'agent-1',
        checkedAt: FIXED_TIME,
      },
      FAKE_SESSION
    );
    expect(result.seatNumber).toBe(2);
    expect(result.passengerName).toBe('Sara Amrani');
  });

  test('uses the same session for every step', async () => {
    const { service, dependencies } = buildService();

    await service.checkTicket('departure-1', 'CODE-1', AGENT);

    expect(dependencies.catalogueApi.guardDeparture).toHaveBeenCalledWith('departure-1', 'BOARDING', FAKE_SESSION);
    expect(dependencies.reservationsApi.consumeTicket).toHaveBeenCalledWith('CODE-1', 'departure-1', FAKE_SESSION);
    expect(dependencies.boardingRepository.create.mock.calls[0][1]).toBe(FAKE_SESSION);
  });

  test('refuses with BOARDING_CLOSED when the departure is not in BOARDING state', async () => {
    const { service, dependencies } = buildService({
      catalogueApi: {
        guardDeparture: jest.fn().mockRejectedValue(errorWithCode('DEPARTURE_STATE_MISMATCH')),
      },
    });

    await expect(service.checkTicket('departure-1', 'CODE-1', AGENT)).rejects.toMatchObject({
      statusCode: 409,
      code: 'BOARDING_CLOSED',
    });
    expect(dependencies.reservationsApi.consumeTicket).not.toHaveBeenCalled();
    expect(dependencies.boardingRepository.create).not.toHaveBeenCalled();
  });

  test('lets other errors from Catalogue pass unchanged (unknown departure)', async () => {
    const { service } = buildService({
      catalogueApi: {
        guardDeparture: jest.fn().mockRejectedValue(errorWithCode('RESOURCE_NOT_FOUND')),
      },
    });

    await expect(service.checkTicket('departure-1', 'CODE-1', AGENT)).rejects.toMatchObject({
      code: 'RESOURCE_NOT_FOUND',
    });
  });

  test('creates no record when Reservations refuses the ticket', async () => {
    const refusals = ['TICKET_NOT_FOUND', 'WRONG_DEPARTURE', 'TICKET_NOT_VALID'];

    for (const code of refusals) {
      const { service, dependencies } = buildService({
        reservationsApi: {
          consumeTicket: jest.fn().mockRejectedValue(errorWithCode(code)),
        },
      });

      await expect(service.checkTicket('departure-1', 'CODE-1', AGENT)).rejects.toMatchObject({ code: code });
      expect(dependencies.boardingRepository.create).not.toHaveBeenCalled();
    }
  });

  test('passes the error up when saving the record fails', async () => {
    const { service } = buildService({
      boardingRepository: {
        create: jest.fn().mockRejectedValue(new Error('Database write failed')),
      },
    });

    await expect(service.checkTicket('departure-1', 'CODE-1', AGENT)).rejects.toThrow('Database write failed');
  });
});
