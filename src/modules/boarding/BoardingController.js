function createBoardingController({ boardingService }) {
  async function checkTicket(req, res, next) {
    try {
      const departureId = req.params.id;
      const ticketCode = req.body.ticketCode;

      const record = await boardingService.checkTicket(departureId, ticketCode, agent);

      res.status(201).json({ data: record });
    } catch (error) {
      next(error);
    }
  }

  return { checkTicket };
}

module.exports = createBoardingController;