import Joi from 'joi';

// Center registration validation schema
export const centerRegistrationSchema = Joi.object({
    // Center Details
    centerName: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Center name is required',
            'string.min': 'Center name must be at least 2 characters long',
            'string.max': 'Center name must not exceed 100 characters',
            'any.required': 'Center name is required'
        }),
    
    centerType: Joi.string()
        .valid('franchise', 'company', 'own', 'partner', 'other')
        .required()
        .messages({
            'any.only': 'Center type must be one of: franchise, company, own, partner, other',
            'any.required': 'Center type is required'
        }),
    
    yearOfEstablishment: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .required()
        .messages({
            'number.base': 'Year of establishment must be a number',
            'number.integer': 'Year of establishment must be an integer',
            'number.min': 'Year of establishment must be after 1900',
            'number.max': 'Year of establishment cannot be in the future',
            'any.required': 'Year of establishment is required'
        }),
    
    address: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            'string.empty': 'Address is required',
            'string.min': 'Address must be at least 10 characters long',
            'string.max': 'Address must not exceed 500 characters',
            'any.required': 'Address is required'
        }),
    
    city: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'City is required',
            'string.min': 'City must be at least 2 characters long',
            'string.max': 'City must not exceed 50 characters',
            'any.required': 'City is required'
        }),
    
    state: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'State is required',
            'string.min': 'State must be at least 2 characters long',
            'string.max': 'State must not exceed 50 characters',
            'any.required': 'State is required'
        }),
    
    pinCode: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .messages({
            'string.empty': 'Pin code is required',
            'string.pattern.base': 'Pin code must be exactly 6 digits',
            'any.required': 'Pin code is required'
        }),
    
    officialEmail: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Official email is required',
            'string.email': 'Official email must be a valid email address',
            'any.required': 'Official email is required'
        }),
    
    website: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.uri': 'Website must be a valid URL'
        }),
    
    // Authorized Person Details
    authName: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Authorized person name is required',
            'string.min': 'Authorized person name must be at least 2 characters long',
            'string.max': 'Authorized person name must not exceed 100 characters',
            'any.required': 'Authorized person name is required'
        }),
    
    designation: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Designation is required',
            'string.min': 'Designation must be at least 2 characters long',
            'string.max': 'Designation must not exceed 100 characters',
            'any.required': 'Designation is required'
        }),
    
    contactNo: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.empty': 'Contact number is required',
            'string.pattern.base': 'Contact number must be exactly 10 digits',
            'any.required': 'Contact number is required'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Authorized person email is required',
            'string.email': 'Authorized person email must be a valid email address',
            'any.required': 'Authorized person email is required'
        }),
    
    idProofNo: Joi.string()
        .min(10)
        .max(20)
        .required()
        .messages({
            'string.empty': 'ID proof number is required',
            'string.min': 'ID proof number must be at least 10 characters long',
            'string.max': 'ID proof number must not exceed 20 characters',
            'any.required': 'ID proof number is required'
        }),
    
    // Infrastructure Details
    numClassrooms: Joi.number()
        .integer()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'number.base': 'Number of classrooms must be a number',
            'number.integer': 'Number of classrooms must be an integer',
            'number.min': 'Number of classrooms must be at least 1',
            'number.max': 'Number of classrooms cannot exceed 1000',
            'any.required': 'Number of classrooms is required'
        }),
    
    numComputers: Joi.number()
        .integer()
        .min(0)
        .max(10000)
        .required()
        .messages({
            'number.base': 'Number of computers must be a number',
            'number.integer': 'Number of computers must be an integer',
            'number.min': 'Number of computers cannot be negative',
            'number.max': 'Number of computers cannot exceed 10000',
            'any.required': 'Number of computers is required'
        }),
    
    internetFacility: Joi.string()
        .valid('yes', 'no', 'true', 'false')
        .required()
        .messages({
            'any.only': 'Internet facility must be yes/no or true/false',
            'any.required': 'Internet facility is required'
        }),
    
    seatingCapacity: Joi.number()
        .integer()
        .min(1)
        .max(10000)
        .required()
        .messages({
            'number.base': 'Seating capacity must be a number',
            'number.integer': 'Seating capacity must be an integer',
            'number.min': 'Seating capacity must be at least 1',
            'number.max': 'Seating capacity cannot exceed 10000',
            'any.required': 'Seating capacity is required'
        }),
    
    // Bank Details
    bankName: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Bank name is required',
            'string.min': 'Bank name must be at least 2 characters long',
            'string.max': 'Bank name must not exceed 100 characters',
            'any.required': 'Bank name is required'
        }),
    
    accountHolder: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Account holder name is required',
            'string.min': 'Account holder name must be at least 2 characters long',
            'string.max': 'Account holder name must not exceed 100 characters',
            'any.required': 'Account holder name is required'
        }),
    
    accountNumber: Joi.string()
        .pattern(/^[0-9]{9,18}$/)
        .required()
        .messages({
            'string.empty': 'Account number is required',
            'string.pattern.base': 'Account number must be between 9 and 18 digits',
            'any.required': 'Account number is required'
        }),
    
    ifsc: Joi.string()
        .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .required()
        .messages({
            'string.empty': 'IFSC code is required',
            'string.pattern.base': 'IFSC code must be in valid format (e.g., SBIN0001234)',
            'any.required': 'IFSC code is required'
        }),
    
    branchName: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Branch name is required',
            'string.min': 'Branch name must be at least 2 characters long',
            'string.max': 'Branch name must not exceed 100 characters',
            'any.required': 'Branch name is required'
        }),
    
    // Login Credentials
    username: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Username is required',
            'string.email': 'Username must be a valid email address',
            'any.required': 'Username is required'
        }),
    
    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password must not exceed 50 characters',
            'any.required': 'Password is required'
        }),
    
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'string.empty': 'Confirm password is required',
            'any.only': 'Confirm password must match password',
            'any.required': 'Confirm password is required'
        })
});

// Validation middleware function
export const validateCenterRegistration = (req: any, res: any, next: any) => {
    const { error, value } = centerRegistrationSchema.validate(req.body, {
        abortEarly: false, // Show all validation errors
        stripUnknown: true // Remove unknown fields
    });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            status: false,
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
};
