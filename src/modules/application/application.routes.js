const express = require('express');
const { validateDepartureId } = require('./application.validation');

function createApplicationRouter({ applicationController, authenticate, requireRole }) {
  const router = express.Router();

  router.post(
    '/departures/:id/cancel',
    authenticate,
    requireRole('admin'),
    validateDepartureId,
    applicationController.cancelDeparture
  );

  router.get(
    '/departures/:id/seats',
    validateDepartureId,
    applicationController.getSeats
  );

  return router;
}

module.exports = createApplicationRouter;
