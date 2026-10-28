class DepartureController {
  constructor({ departureService, paginationHelper }) {
    this.departureService = departureService;
    this.paginationHelper = paginationHelper;
  }

  list = async (req, res, next) => {
    try {
      const pagination = this.paginationHelper.parse(req.query);
      const result = await this.departureService.listDepartures(
        { lineId: req.query.lineId },
        pagination
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const departure = await this.departureService.getDeparture(req.params.id);
      if (!departure) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Departure not found' } });
      }
      res.json({ data: departure });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const departure = await this.departureService.createDeparture(req.body);
      res.status(201).json({ data: departure });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = DepartureController;