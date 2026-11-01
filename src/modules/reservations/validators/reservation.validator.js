import Joi from 'joi';
import { validateRequest } from '../../../shared/middlewares/validateRequest.js';

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const validateCreateBooking = validateRequest({
  params: Joi.object({
    id: Joi.string()
      .pattern(OBJECT_ID_PATTERN)
      .required()
      .messages({
        'string.pattern.base': 'The departure id is not valid.'
      })
  }),
  body: Joi.object({
    seatNumber: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Seat number must be a number.',
        'number.integer': 'Seat number must be an integer.',
        'number.positive': 'Seat number must be strictly positive.',
        'any.required': 'Seat number is required.'
      })
  })
});