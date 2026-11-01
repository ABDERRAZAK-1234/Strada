export class ReservationsController {
  constructor({ reservationsService }) {
    this.reservationsService = reservationsService;
  }

  createBooking = async (req, res, next) => {
    try {
      const departureId = req.params.id;
      const { seatNumber } = req.body;
      const user = req.user;

      const booking = await this.reservationsService.createBooking({
        departureId,
        seatNumber,
        user
      });

      return res.status(201).json({
        data: booking
      });
    } catch (error) {
      next(error);
    }
  };
}