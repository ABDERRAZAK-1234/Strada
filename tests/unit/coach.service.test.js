const CoachService = require('../../src/modules/catalogue/services/coach.service');

const makeErrors = () => ({
  validation: (msg) => Object.assign(new Error(msg), { status: 400, code: 'VALIDATION' }),
  conflict: (msg) => Object.assign(new Error(msg), { status: 409, code: 'CONFLICT' }),
  notFound: (msg) => Object.assign(new Error(msg), { status: 404, code: 'NOT_FOUND' })
});

describe('CoachService', () => {
  let coachRepo;
  let service;

  beforeEach(() => {
    coachRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      countAll: jest.fn(),
      existsByRegistration: jest.fn(),
      updateById: jest.fn(),
      archiveById: jest.fn()
    };
    service = new CoachService({ coachRepository: coachRepo, errors: makeErrors() });
  });

  describe('createCoach', () => {
    it('creates coach with sorted seatNumbers', async () => {
      coachRepo.existsByRegistration.mockResolvedValue(false);
      coachRepo.create.mockImplementation(async (data) => ({ ...data, _id: 'c1' }));

      const result = await service.createCoach({
        registration: ' ab-123-cd ',
        seatNumbers: [5, 1, 3]
      });

      expect(result.registration).toBe('AB-123-CD');
      expect(result.seatNumbers).toEqual([1, 3, 5]);
      expect(result.status).toBe('ACTIVE');
    });

    it('rejects empty seatNumbers', async () => {
      await expect(service.createCoach({ registration: 'X', seatNumbers: [] }))
        .rejects.toThrow('non-empty');
    });

    it('rejects duplicate seatNumbers', async () => {
      await expect(service.createCoach({ registration: 'X', seatNumbers: [1, 1] }))
        .rejects.toThrow('unique');
    });

    it('rejects non-positive seatNumbers', async () => {
      await expect(service.createCoach({ registration: 'X', seatNumbers: [0] }))
        .rejects.toThrow('positive');
      await expect(service.createCoach({ registration: 'X', seatNumbers: [-1] }))
        .rejects.toThrow('positive');
    });

    it('rejects duplicate registration', async () => {
      coachRepo.existsByRegistration.mockResolvedValue(true);
      await expect(service.createCoach({ registration: 'X', seatNumbers: [1] }))
        .rejects.toMatchObject({ status: 409 });
    });
  });

  describe('updateCoach', () => {
    it('updates seatNumbers', async () => {
      coachRepo.findById.mockResolvedValue({ _id: 'c1', registration: 'X', status: 'ACTIVE' });
      coachRepo.updateById.mockResolvedValue({ _id: 'c1', seatNumbers: [1, 2] });

      const result = await service.updateCoach('c1', { seatNumbers: [2, 1] });
      expect(result.seatNumbers).toEqual([1, 2]);
    });

    it('rejects update of archived coach', async () => {
      coachRepo.findById.mockResolvedValue({ _id: 'c1', status: 'ARCHIVED' });
      await expect(service.updateCoach('c1', { registration: 'Y' })).rejects.toMatchObject({ status: 409 });
    });
  });

  describe('archiveCoach', () => {
    it('archives coach', async () => {
      coachRepo.findById.mockResolvedValue({ _id: 'c1', status: 'ACTIVE' });
      coachRepo.archiveById.mockResolvedValue({ _id: 'c1', status: 'ARCHIVED' });

      const result = await service.archiveCoach('c1');
      expect(result.alreadyArchived).toBe(false);
    });

    it('is idempotent on repeated archive', async () => {
      coachRepo.findById.mockResolvedValue({ _id: 'c1', status: 'ARCHIVED' });
      const result = await service.archiveCoach('c1');
      expect(result.alreadyArchived).toBe(true);
      expect(coachRepo.archiveById).not.toHaveBeenCalled();
    });
  });
});