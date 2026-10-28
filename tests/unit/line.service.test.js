const LineService = require('../../src/modules/catalogue/services/line.service');

const makeErrors = () => ({
  validation: (msg) => Object.assign(new Error(msg), { status: 400, code: 'VALIDATION' }),
  conflict: (msg) => Object.assign(new Error(msg), { status: 409, code: 'CONFLICT' }),
  notFound: (msg) => Object.assign(new Error(msg), { status: 404, code: 'NOT_FOUND' })
});

describe('LineService', () => {
  let lineRepo;
  let stopRepo;
  let service;

  beforeEach(() => {
    lineRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findActive: jest.fn(),
      countActive: jest.fn(),
      existsByCode: jest.fn(),
      updateById: jest.fn(),
      archiveById: jest.fn()
    };
    stopRepo = { findByIds: jest.fn() };
    service = new LineService({ lineRepository: lineRepo, stopRepository: stopRepo, errors: makeErrors() });
  });

  describe('createLine', () => {
    it('creates a line with normalized code', async () => {
      stopRepo.findByIds.mockResolvedValue([{ _id: 'a' }, { _id: 'b' }]);
      lineRepo.existsByCode.mockResolvedValue(false);
      lineRepo.create.mockImplementation(async (data) => ({ ...data, _id: 'line1' }));

      const result = await service.createLine({
        code: '  ab-12 ',
        label: 'Line A',
        stops: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
      });

      expect(result.code).toBe('AB-12');
      expect(result.status).toBe('ACTIVE');
    });

    it('rejects <2 stops', async () => {
      await expect(service.createLine({ code: 'X', label: 'L', stops: ['507f1f77bcf86cd799439011'] }))
        .rejects.toThrow('at least 2 stops');
    });

    it('rejects duplicate stops', async () => {
      const id = '507f1f77bcf86cd799439011';
      await expect(service.createLine({ code: 'X', label: 'L', stops: [id, id] }))
        .rejects.toThrow('distinct');
    });

    it('rejects non-existent stops', async () => {
      stopRepo.findByIds.mockResolvedValue([{ _id: 'a' }]);
      await expect(service.createLine({
        code: 'X',
        label: 'L',
        stops: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
      })).rejects.toThrow('do not exist');
    });

    it('rejects duplicate code', async () => {
      stopRepo.findByIds.mockResolvedValue([{ _id: 'a' }, { _id: 'b' }]);
      lineRepo.existsByCode.mockResolvedValue(true);
      await expect(service.createLine({
        code: 'X',
        label: 'L',
        stops: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
      })).rejects.toThrow('already exists');
    });

    it('maps DB unique index conflict to 409', async () => {
      stopRepo.findByIds.mockResolvedValue([{ _id: 'a' }, { _id: 'b' }]);
      lineRepo.existsByCode.mockResolvedValue(false);
      lineRepo.create.mockRejectedValue(Object.assign(new Error('dup'), { code: 11000 }));
      await expect(service.createLine({
        code: 'X',
        label: 'L',
        stops: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
      })).rejects.toMatchObject({ status: 409 });
    });
  });

  describe('listActive', () => {
    it('returns paginated ACTIVE lines', async () => {
      lineRepo.findActive.mockResolvedValue([{ _id: '1' }]);
      lineRepo.countActive.mockResolvedValue(1);

      const result = await service.listActive({ page: 1, limit: 20, skip: 0 });

      expect(result.data).toHaveLength(1);
      expect(result.pagination).toEqual({ page: 1, limit: 20, total: 1 });
    });
  });

  describe('updateLine', () => {
    it('updates label', async () => {
      lineRepo.findById.mockResolvedValue({ _id: 'l1', code: 'X', label: 'Old', status: 'ACTIVE' });
      lineRepo.updateById.mockResolvedValue({ _id: 'l1', label: 'New' });

      const result = await service.updateLine('l1', { label: 'New' });
      expect(result.label).toBe('New');
    });

    it('rejects update of archived line', async () => {
      lineRepo.findById.mockResolvedValue({ _id: 'l1', status: 'ARCHIVED' });
      await expect(service.updateLine('l1', { label: 'X' })).rejects.toMatchObject({ status: 409 });
    });

    it('rejects duplicate code on update', async () => {
      lineRepo.findById.mockResolvedValue({ _id: 'l1', code: 'OLD', status: 'ACTIVE' });
      lineRepo.existsByCode.mockResolvedValue(true);
      await expect(service.updateLine('l1', { code: 'NEW' })).rejects.toMatchObject({ status: 409 });
    });
  });

  describe('archiveLine', () => {
    it('archives ACTIVE line', async () => {
      lineRepo.findById.mockResolvedValue({ _id: 'l1', status: 'ACTIVE' });
      lineRepo.archiveById.mockResolvedValue({ _id: 'l1', status: 'ARCHIVED' });

      const result = await service.archiveLine('l1');
      expect(result.alreadyArchived).toBe(false);
      expect(result.line.status).toBe('ARCHIVED');
    });

    it('is idempotent on repeated archive', async () => {
      lineRepo.findById.mockResolvedValue({ _id: 'l1', status: 'ARCHIVED' });
      const result = await service.archiveLine('l1');
      expect(result.alreadyArchived).toBe(true);
      expect(lineRepo.archiveById).not.toHaveBeenCalled();
    });

    it('throws 404 if line not found', async () => {
      lineRepo.findById.mockResolvedValue(null);
      await expect(service.archiveLine('x')).rejects.toMatchObject({ status: 404 });
    });
  });
});