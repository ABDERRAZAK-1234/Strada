const { body, param } = require('express-validator');

const createLineRules = [
  body('code').isString().trim().notEmpty(),
  body('label').isString().trim().notEmpty(),
  body('stops').isArray({ min: 2 }),
  body('stops.*').isMongoId()
];

const updateLineRules = [
  param('id').isMongoId(),
  body('code').optional().isString().trim().notEmpty(),
  body('label').optional().isString().trim().notEmpty(),
  body('stops').optional().isArray({ min: 2 }),
  body('stops.*').optional().isMongoId()
];

const idParamRule = [param('id').isMongoId()];

module.exports = { createLineRules, updateLineRules, idParamRule };