import Joi from 'joi';

export const sendMessageSchema = {
  body: Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.empty': 'User ID is required',
        'string.pattern.base': 'User ID must be a valid ObjectId',
      }),

    content: Joi.string().min(1).max(1000).required().messages({
      'string.empty': 'Message content cannot be empty',
      'string.min': 'Message must contain at least 1 character',
      'string.max': 'Message cannot exceed 1000 characters',
    }),
  }),
};

export const readMessageSchema = {
  params: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.empty': 'Message ID is required',
        'string.pattern.base': 'Message ID must be a valid ObjectId',
      }),
  }),
};
