export function validateRequest(schemas) {
  return (req, res, next) => {
    const requestParts = ['params', 'query', 'body'];

    for (const part of requestParts) {
      const schema = schemas[part];

      if (!schema) continue;

      const { error, value } = schema.validate(req[part], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }

      req[part] = value;
    }

    next();
  };
}
