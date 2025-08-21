import { headersValidation } from '../utils/generalRules.js';

// middlewares/validation.middleware.js
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body
    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    // Validate file
    if (schema.file && req.file) {
      const { error } = schema.file.validate(req.file, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    // Validate params
    if (schema.params) {
      const { error } = schema.params.validate(req.params, {
        abortEarly: false,
      });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    // Validate query
    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((d) => d.message));
      }
    }

    // If errors exist
    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: errors.join(', '),
      });
    }

    next();
  };
};

// middlewares/validationMiddleware.js
export const validateHeaders = (req, res, next) => {
  const { error } = headersValidation.validate(req.headers, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      message: 'Header Validation Error',
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};
