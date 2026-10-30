class SeatViewService {
  constructor({ catalogueApi, reservationsApi }) {
    this.catalogueApi = catalogueApi;
    this.reservationsApi = reservationsApi;
  }

  async getSeats(departureId) {
    const departure = await this.catalogueApi.getDeparture(departureId);

    const occupiedSeats = await this.reservationsApi.getOccupiedSeats(departureId);

    const seats = [];
    for (const seatNumber of departure.seatNumbers) {
      seats.push({
        seatNumber: seatNumber,
        available: !occupiedSeats.includes(seatNumber),
      });
    }

    return { departureId: departureId, seats: seats };
  }
}

module.exports = SeatViewService;
