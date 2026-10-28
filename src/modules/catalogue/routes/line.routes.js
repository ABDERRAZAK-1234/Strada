const express = require('express');
const { createLineRules, updateLineRules, idParamRule } = require('../validators/line.validator');

module.exports = ({ lineController, validateRequest, authenticate, authorize }) => {
  const router = express.Router();

  router.get('/', lineController.list);
  router.post('/', authenticate, authorize('admin'), createLineRules, validateRequest, lineController.create);
  router.patch('/:id', authenticate, authorize('admin'), updateLineRules, validateRequest, lineController.update);
  router.delete('/:id', authenticate, authorize('admin'), idParamRule, validateRequest, lineController.archive);

  return router;
};