import { Request, Response } from 'express';
import InquiryService from '../services/inquiry.service.js';
import { inquirySchema, normalizePhone, sanitizeText } from '../validation/inquiry.schema.js';
import { sendResponse } from '../../../utils/response.util.js';


const service = new InquiryService();

async function createInquiry(req: Request, res: Response): Promise<Response> {
    try {
        // sanitize and normalize input first
        const payload = {
            fullName: sanitizeText(req.body?.fullName),
            email: sanitizeText(req.body?.email),
            phone: normalizePhone(req.body?.phone),
            programOfInterest: sanitizeText(req.body?.programOfInterest),
            message: sanitizeText(req.body?.message),
            inquiryType: sanitizeText(req.body?.inquiryType) as 'student' | 'center'
        };

        // validate
        const { error, value } = inquirySchema.validate(payload, { abortEarly: false, stripUnknown: true });
        const errors: { field: string; message: string }[] = [];

        if (!value.phone || value.phone.length !== 10) {
            errors.push({ field: 'phone', message: 'Phone must be exactly 10 digits' });
        }

        if (error) {
            for (const detail of error.details) {
                const field = detail.path.join('.') || 'body';
                // avoid duplicate phone error if we added custom one
                if (field === 'phone' && errors.find((e) => e.field === 'phone')) continue;
                errors.push({ field, message: detail.message.replace(/\"/g, '') });
            }
        }

        if (errors.length > 0) {
            res.status(400).json({ status: false, message: 'Validation failed', errors });
            return sendResponse({
              res,
              statusCode: 400,
              status: false,
              message: 'Validation failed',
              error: errors,
            });
        }

        const record = await service.createInquiry(value);
        return sendResponse({
          res,
          statusCode: 200,
          status: true,
          message: "Inquiry submitted successfully",
          data: {
            fullName: record.fullName,
            email: record.email,
            phone: record.phone,
            programOfInterest: record.programOfInterest,
            message: record.message,
            inquiryType: record.inquiryType,
            createdAt: record.createdAt.toISOString(),
          },
        });
    } catch (err) {
        console.error(JSON.stringify({ level: 'error', event: 'inquiry_error', message: (err as Error).message }));
        return sendResponse({
          res,
          statusCode: 500,
          status: false,
          message: 'Failed to submit inquiry',
          error: (err as Error).message,
        });
    }
}

export default { 
    createInquiry,
    async list(req: Request, res: Response): Promise<Response> {
        try {
            const result = await service.listInquiries();
            return res.status(200).json({ data: result.data, total: result.total });
        } catch (err) {
            return res.status(500).json({ status: false, message: 'Internal server error' });
        }
    }
 };


