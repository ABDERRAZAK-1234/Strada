class LineController {
  constructor({ lineService, paginationHelper }) {
    this.lineService = lineService;
    this.paginationHelper = paginationHelper;
  }

  list = async (req, res, next) => {
    try {
      const pagination = this.paginationHelper.parse(req.query);
      const result = await this.lineService.listActive(pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const line = await this.lineService.createLine(req.body);
      res.status(201).json({ data: line });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const line = await this.lineService.updateLine(req.params.id, req.body);
      res.json({ data: line });
    } catch (err) {
      next(err);
    }
  };

  archive = async (req, res, next) => {
    try {
      const result = await this.lineService.archiveLine(req.params.id);
      res.json({
        data: result.line,
        meta: { alreadyArchived: result.alreadyArchived }
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = LineController;