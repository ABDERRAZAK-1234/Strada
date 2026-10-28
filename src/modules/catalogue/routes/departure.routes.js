const express = require('express');
const { createDepartureRules, idParamRule } = require('../validators/departure.validator');

module.exports = ({ departureController, validateRequest, authenticate, authorize }) => {
  const router = express.Router();

  router.get('/', departureController.list);
  router.get('/:id', idParamRule, validateRequest, departureController.getById);
  router.post('/', authenticate, authorize('admin'), createDepartureRules, validateRequest, departureController.create);

  return router;
};