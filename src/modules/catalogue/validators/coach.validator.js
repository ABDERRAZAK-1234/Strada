const { body, param } = require('express-validator');

const createCoachRules = [
  body('registration').isString().trim().notEmpty(),
  body('seatNumbers').isArray({ min: 1 }),
  body('seatNumbers.*').isInt({ min: 1 })
];

const updateCoachRules = [
  param('id').isMongoId(),
  body('registration').optional().isString().trim().notEmpty(),
  body('seatNumbers').optional().isArray({ min: 1 }),
  body('seatNumbers.*').optional().isInt({ min: 1 })
];

const idParamRule = [param('id').isMongoId()];

module.exports = { createCoachRules, updateCoachRules, idParamRule };