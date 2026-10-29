const express = require('express');
const { validateBoardingRequest } = require('./boarding.validation');

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

module.exports = createBoardingRouter;