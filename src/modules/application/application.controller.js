function createApplicationController({ cancelDepartureService, seatViewService }) {
  async function cancelDeparture(req, res, next) {
    try {
      const departure = await cancelDepartureService.execute(req.params.id);
      res.status(200).json({ data: departure });
    } catch (error) {
      next(error);
    }
  }

  async function getSeats(req, res, next) {
    try {
      const seatPlan = await seatViewService.getSeats(req.params.id);
      res.status(200).json({ data: seatPlan });
    } catch (error) {
      next(error);
    }
  }

  return { cancelDeparture, getSeats };
}

module.exports = createApplicationController;
