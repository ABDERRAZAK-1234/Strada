import test from 'node:test';
import assert from 'node:assert/strict';

import { errorHandler } from '../../../src/shared/middlewares/errorHandler.js';

test('should return the correct response for an AppError', () => {
  const error = {
    statusCode: 409,
    code: 'TICKET_NOT_VALID',
    message: 'This ticket has already been checked.',
  };

  const req = {};
  const res = {
    headersSent: false,
    statusCode: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.response = data;
      return this;
    },
  };

  errorHandler(error, req, res, () => {});

  assert.equal(res.statusCode, 409);

  assert.deepEqual(res.response, {
    status: 'error',
    code: 'TICKET_NOT_VALID',
    message: 'This ticket has already been checked.',
  });
});

test('should hide internal error details and return status 500', () => {
  const error = new Error('Database connection failed');

  const res = {
    headersSent: false,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.response = data;
      return this;
    },
  };

  errorHandler(error, {}, res, () => {});

  assert.equal(res.statusCode, 500);

  assert.deepEqual(res.response, {
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
  });
});

test('should call next when response headers have already been sent', () => {
  const error = new Error('Something went wrong');

  const res = {
    headersSent: true,
  };

  let forwardedError = null;

  errorHandler(error, {}, res, (nextError) => {
    forwardedError = nextError;
  });

  assert.equal(forwardedError, error);
});