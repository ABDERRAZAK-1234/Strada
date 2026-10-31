import { Booking } from '../models/booking.model.js';

export class BookingRepository {
  constructor(model = Booking) {
    this.model = model;
  }

  create(data, session = null) {
    return this.model.create([data], { session }).then(r => r[0]);
  }

  findActiveByDepartureAndSeat(departureId, seatNumber, session = null) {
    return this.model
      .findOne({ departureId, seatNumber, occupiesSeat: true })
      .session(session);
  }

  findActiveByDepartureAndPassenger(departureId, passengerId, session = null) {
    return this.model
      .findOne({ departureId, passengerId, occupiesSeat: true })
      .session(session);
  }

  findById(id, session = null) {
    return this.model.findById(id).session(session);
  }

  save(doc, session = null) {
    return doc.save({ session });
  }
}