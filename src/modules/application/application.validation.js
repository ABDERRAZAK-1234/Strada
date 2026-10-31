const Joi = require('joi');
const { validateRequest } = require('../shared/validate-request');

const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/i;

const validateDepartureId = validateRequest({
  params: Joi.object({
    id: Joi.string()
      .pattern(OBJECT_ID_PATTERN)
      .required()
      .messages({ 'string.pattern.base': 'The departure id is not valid.' }),
  }),
  body: Joi.object({}),
});

module.exports = { validateDepartureId };
