const { body, param } = require('express-validator');

const createDepartureRules = [
  body('lineId').isMongoId(),
  body('coachId').isMongoId(),
  body('departureTime').isISO8601(),
  body('arrivalTime').isISO8601(),
  body('fareCents').isInt({ min: 0 }),
  body('status').not().exists(),
  body('snapshot').not().exists(),
  body('revision').not().exists()
];

const idParamRule = [param('id').isMongoId()];

module.exports = { createDepartureRules, idParamRule };