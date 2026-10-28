class CoachController {
  constructor({ coachService, paginationHelper }) {
    this.coachService = coachService;
    this.paginationHelper = paginationHelper;
  }

  list = async (req, res, next) => {
    try {
      const pagination = this.paginationHelper.parse(req.query);
      const result = await this.coachService.listAll(pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const coach = await this.coachService.createCoach(req.body);
      res.status(201).json({ data: coach });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const coach = await this.coachService.updateCoach(req.params.id, req.body);
      res.json({ data: coach });
    } catch (err) {
      next(err);
    }
  };

  archive = async (req, res, next) => {
    try {
      const result = await this.coachService.archiveCoach(req.params.id);
      res.json({
        data: result.coach,
        meta: { alreadyArchived: result.alreadyArchived }
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CoachController;