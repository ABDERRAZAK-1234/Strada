import { asClass, asFunction } from 'awilix';
import { BookingRepository } from './repositories/booking.repository.js';
import { ReservationsService } from './services/ReservationsService.js';
import { ReservationsController } from './controllers/reservations.controller.js';
import { createReservationsRouter } from './routes/reservations.routes.js';

export function registerReservationsModule(container) {
  container.register({
    bookingRepository: asClass(BookingRepository).singleton(),
    reservationsService: asClass(ReservationsService).singleton(),
    reservationsController: asClass(ReservationsController).singleton(),
    reservationsRouter: asFunction(createReservationsRouter).singleton()
  });
}

export { createReservationsRouter };