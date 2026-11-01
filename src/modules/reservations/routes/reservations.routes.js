import express from 'express';
import { validateCreateBooking } from '../validators/reservation.validator.js';

export function createReservationsRouter({ reservationsController, authenticate, requireRole } = {}) {
  const router = express.Router();

  const authMiddleware = authenticate || ((req, res, next) => next());
  const roleMiddleware = requireRole ? requireRole('passenger') : ((req, res, next) => next());

  router.post(
    '/departures/:id/bookings',
    authMiddleware,
    roleMiddleware,
    validateCreateBooking,
    reservationsController.createBooking
  );

  return router;
}