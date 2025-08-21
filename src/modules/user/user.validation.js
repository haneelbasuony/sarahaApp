// validation/user.validation.js
import Joi from 'joi';
import { userGender } from '../../DB/models/user.model.js';

export const signUpSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
      'string.base': 'Name must be a text',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 20 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
    phone: Joi.string().required().messages({
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required',
    }),
    gender: Joi.string().valid('male', 'female').required().messages({
      'any.only': 'Gender must be either male or female',
      'any.required': 'Gender is required',
    }),
    age: Joi.number().min(10).max(100).required().messages({
      'number.base': 'Age must be a number',
      'number.min': 'Age must be at least 10',
      'number.max': 'Age must not exceed 100',
      'any.required': 'Age is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
    cPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password',
      'any.required': 'Confirm password is required',
    }),
  }),
  file: Joi.object({
    fieldname: Joi.string().valid('file').required().messages({
      'any.only': "File field name must be 'file'",
      'any.required': 'File is required',
    }),
    originalname: Joi.string().required().messages({
      'string.empty': 'Original file name is required',
      'any.required': 'Original file name is required',
    }),
    mimetype: Joi.string()
      .valid('image/jpeg', 'image/png')
      .required()
      .messages({
        'any.only': 'Only JPEG or PNG images are allowed',
        'any.required': 'File type is required',
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required()
      .messages({
        'number.max': 'File size must not exceed 5 MB',
        'any.required': 'File size is required',
      }),
  }).unknown(true),
};

export const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    }),

  password: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot be longer than 30 characters',
  }),
});

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'Old password is required',
    'string.min': 'Old password must be at least 6 characters',
    'any.required': 'Old password is required',
  }),

  newPassword: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters',
    'string.pattern.base':
      'Password must include uppercase, lowercase, number, and special character',
  }),

  cPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Confirm password must match new password',
    'any.required': 'Confirm password is required',
  }),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required()
    .messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),

  otp: Joi.string()
    .length(5)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.length': 'OTP must be exactly 5 digits',
      'string.pattern.base': 'OTP must contain only numbers',
    }),

  newPassword: Joi.string().min(6).max(30).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters long',
    'string.max': 'New password must be less than or equal to 30 characters',
  }),

  cPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Confirm password must match new password',
    'string.empty': 'Confirm password is required',
  }),
});

// ===== Update Profile Schema =====
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(30).trim(),
  email: Joi.string().email().trim(),
  phone: Joi.string().pattern(/^01[0-2,5]{1}[0-9]{8}$/),
  age: Joi.number().min(12).max(100),
  gender: Joi.string().valid('male', 'female'),
})
  .min(1)
  .unknown(false);

export const freezeAccountSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    'string.length': 'id must be a 24-char hex string',
    'string.hex': 'id must be a valid hex string',
    'any.required': 'id is required',
  }),
});
