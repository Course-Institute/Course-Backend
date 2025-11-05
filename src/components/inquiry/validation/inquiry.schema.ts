import Joi from 'joi';

export const inquirySchema = Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    email: Joi.string().email({ tlds: { allow: false } }).max(150).required(),
    phone: Joi.string().required(), // normalized later to 10 digits
    programOfInterest: Joi.string().max(120).required(),
    message: Joi.string().min(10).max(2000).required(),
    inquiryType: Joi.string().valid('student', 'center').required()
});

export type InquiryPayload = {
    fullName: string;
    email: string;
    phone: string;
    programOfInterest: string;
    message: string;
    inquiryType: 'student' | 'center';
};

export function normalizePhone(input: string): string {
    const digits = (input || '').replace(/\D/g, '');
    return digits;
}

export function sanitizeText(input: string): string {
    if (typeof input !== 'string') return '';
    // Basic XSS/NoSQL injection mitigation: strip tags and dangerous chars
    return input
        .replace(/[\$<>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}


