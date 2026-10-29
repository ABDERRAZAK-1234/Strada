import express from 'express';
import { validateBoardingRequest } from './boarding.validation';

function createBoardingRouter({ boardingController, authenticate, requireRole }) {
  const router = express.Router();

  router.post(
    '/departures/:id/boarding-records',
    authenticate,
    requireRole('agent'),
    validateBoardingRequest,
    boardingController.checkTicket
  );

  return router;
}

export default createBoardingRouter;