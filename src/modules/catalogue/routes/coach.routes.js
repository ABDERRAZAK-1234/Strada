const express = require('express');
const { createCoachRules, updateCoachRules, idParamRule } = require('../validators/coach.validator');

module.exports = ({ coachController, validateRequest, authenticate, authorize }) => {
  const router = express.Router();

  router.get('/', authenticate, authorize('admin'), coachController.list);
  router.post('/', authenticate, authorize('admin'), createCoachRules, validateRequest, coachController.create);
  router.patch('/:id', authenticate, authorize('admin'), updateCoachRules, validateRequest, coachController.update);
  router.delete('/:id', authenticate, authorize('admin'), idParamRule, validateRequest, coachController.archive);

  return router;
};