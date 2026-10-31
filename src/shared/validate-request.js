const { AppError } = require('./errors');

function validateRequest(schemas) {
  const partsToCheck = ['params', 'body'];

  return function validate(req, res, next) {
    for (const part of partsToCheck) {
      const schema = schemas[part];

      if (!schema) {
        continue;
      }

      const result = schema.validate(req[part] || {});

      if (result.error) {
        return next(new AppError(400, 'VALIDATION_ERROR', result.error.details[0].message));
      }

      req[part] = result.value;
    }

    next();
  };
}

module.exports = { validateRequest };
