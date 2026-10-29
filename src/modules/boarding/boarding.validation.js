import Joi from'joi';
import { validateRequest } from '../../shared/validate-request';

const OBJECT_ID_PATTERN = /^[0-9a-f]{24}$/i;

const validateBoardingRequest = validateRequest({
  params: Joi.object({
    id: Joi.string()
      .pattern(OBJECT_ID_PATTERN)
      .required()
      .messages({ 'string.pattern.base': 'The departure id is not valid.' }),
  }),
  body: Joi.object({
    ticketCode: Joi.string().trim().required(),
  }),
});

export { validateBoardingRequest };
