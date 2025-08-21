import Joi from 'joi';

export const headersValidation = Joi.object({
  authorization: Joi.string()
    .pattern(/^bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid token format (Expected Bearer token)',
      'string.empty': 'Authorization header is required',
    }),
}).unknown(true);
