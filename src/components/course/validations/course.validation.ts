import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Course validation schema
export const createCourseSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Course name is required',
      'string.min': 'Course name must be at least 3 characters long',
      'string.max': 'Course name must not exceed 200 characters',
      'any.required': 'Course name is required',
    }),
  code: Joi.string()
    .max(20)
    .allow('', null)
    .optional()
    .messages({
      'string.max': 'Course code must not exceed 20 characters',
    }),
  duration: Joi.number()
    .integer()
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be an integer',
      'number.positive': 'Duration must be a positive number',
    }),
  description: Joi.string()
    .max(1000)
    .allow('', null)
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters',
    }),
  coursesType: Joi.string()
    .max(100)
    .allow('', null)
    .optional()
    .messages({
      'string.max': 'Course type must not exceed 100 characters',
    }),
});

export const updateCourseSchema = createCourseSchema;

// Subject validation schema
export const createSubjectSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Subject name is required',
      'string.min': 'Subject name must be at least 3 characters long',
      'string.max': 'Subject name must not exceed 200 characters',
      'any.required': 'Subject name is required',
    }),
  courseId: Joi.string()
    .required()
    .messages({
      'string.empty': 'Course ID is required',
      'any.required': 'Course ID is required',
    }),
  semester: Joi.number()
    .integer()
    .min(1)
    .max(8)
    .allow(null, '')
    .optional()
    .messages({
      'number.base': 'Semester must be a number',
      'number.integer': 'Semester must be an integer',
      'number.min': 'Semester must be at least 1',
      'number.max': 'Semester must be at most 8',
    }),
  year: Joi.number()
    .integer()
    .min(1)
    .max(4)
    .allow(null, '')
    .optional()
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be at least 1',
      'number.max': 'Year must be at most 4',
    }),
  code: Joi.string()
    .max(20)
    .allow('', null)
    .optional()
    .messages({
      'string.max': 'Subject code must not exceed 20 characters',
    }),
  credits: Joi.number()
    .positive()
    .allow(null)
    .optional()
    .messages({
      'number.base': 'Credits must be a number',
      'number.positive': 'Credits must be a positive number',
    }),
}).custom((value, helpers) => {
  const hasSemester = value.semester !== undefined && value.semester !== null && value.semester !== '';
  const hasYear = value.year !== undefined && value.year !== null && value.year !== '';

  if (hasSemester && hasYear) {
    return helpers.error('custom.mutualExclusivity', {
      message: 'Provide either semester or year, not both',
    });
  }

  if (!hasSemester && !hasYear) {
    return helpers.error('custom.termRequired', {
      message: 'Either semester or year is required',
    });
  }

  return value;
}, 'Mutual exclusivity validation');

export const updateSubjectSchema = createSubjectSchema;

// Validation middleware functions
export const validateCreateCourse = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = createCourseSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors: Record<string, string> = {};
    error.details.forEach((detail) => {
      const field = detail.path.join('.');
      errors[field] = detail.message;
    });

    res.status(400).json({
      status: false,
      message: 'Validation error',
      errors,
    });
    return;
  }

  req.body = value;
  next();
};

export const validateUpdateCourse = validateCreateCourse;

export const validateCreateSubject = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = createSubjectSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors: Record<string, string> = {};
    error.details.forEach((detail) => {
      // Handle custom validation errors
      if (detail.type === 'custom.mutualExclusivity' || detail.type === 'custom.termRequired') {
        errors.semester = detail.message || 'Either semester or year is required';
        errors.year = detail.message || 'Either semester or year is required';
      } else {
        const field = detail.path.join('.');
        errors[field] = detail.message;
      }
    });

    // If mutual exclusivity error, set specific message
    const hasMutualExclusivityError = error.details.some(
      (d) => d.type === 'custom.mutualExclusivity'
    );
    const hasTermRequiredError = error.details.some(
      (d) => d.type === 'custom.termRequired'
    );

    let message = 'Validation error';
    if (hasMutualExclusivityError) {
      message = 'Provide either semester or year, not both';
    } else if (hasTermRequiredError) {
      message = 'Either semester or year is required';
    }

    res.status(400).json({
      status: false,
      message,
      errors,
    });
    return;
  }

  req.body = value;
  next();
};

export const validateUpdateSubject = validateCreateSubject;

