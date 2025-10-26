import { Request, Response, NextFunction } from 'express';

// Validation middleware for creating bills (simplified - all fields optional)
export const validateCreateBill = (req: Request, res: Response, next: NextFunction): void => {
    const {
        amount,
        paymentMethod,
        billDate,
        dueDate,
        description,
        status,
        centerId
    } = req.body;

    const errors: string[] = [];

    // Basic validation - only validate if fields are provided
    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
        errors.push('Amount must be a positive number if provided');
    }

    if (paymentMethod !== undefined && typeof paymentMethod !== 'string') {
        errors.push('Payment method must be a string if provided');
    }

    if (billDate !== undefined && typeof billDate !== 'string') {
        errors.push('Bill date must be a string if provided');
    }

    if (dueDate !== undefined && typeof dueDate !== 'string') {
        errors.push('Due date must be a string if provided');
    }

    if (description !== undefined && typeof description !== 'string') {
        errors.push('Description must be a string if provided');
    }

    if (status !== undefined && !['paid', 'pending', 'overdue', 'cancelled'].includes(status)) {
        errors.push('Status must be one of: paid, pending, overdue, cancelled if provided');
    }

    if (centerId !== undefined && typeof centerId !== 'string') {
        errors.push('Center ID must be a string if provided');
    }

    // Validate date format (basic validation) - only if provided
    if (billDate && !isValidDate(billDate)) {
        errors.push('Bill date must be in valid date format (YYYY-MM-DD)');
    }

    if (dueDate && !isValidDate(dueDate)) {
        errors.push('Due date must be in valid date format (YYYY-MM-DD)');
    }

    if (errors.length > 0) {
        res.status(400).json({
            status: false,
            message: 'Validation failed',
            errors
        });
        return;
    }

    next();
};

// Validation middleware for updating bill status
export const validateUpdateBillStatus = (req: Request, res: Response, next: NextFunction): void => {
    const { status } = req.body;

    if (!status || !['paid', 'pending', 'overdue', 'cancelled'].includes(status)) {
        res.status(400).json({
            status: false,
            message: 'Valid status is required (paid, pending, overdue, cancelled)'
        });
        return;
    }

    next();
};

// Validation middleware for query parameters
export const validateBillQuery = (req: Request, res: Response, next: NextFunction): void => {
    const { billType, status, page, limit } = req.query;

    if (billType && !['student', 'center', 'other'].includes(billType as string)) {
        res.status(400).json({
            status: false,
            message: 'Invalid bill type. Must be one of: student, center, other'
        });
        return;
    }

    if (status && !['paid', 'pending', 'overdue', 'cancelled'].includes(status as string)) {
        res.status(400).json({
            status: false,
            message: 'Invalid status. Must be one of: paid, pending, overdue, cancelled'
        });
        return;
    }

    if (page && (isNaN(Number(page)) || Number(page) < 1)) {
        res.status(400).json({
            status: false,
            message: 'Page must be a positive number'
        });
        return;
    }

    if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        res.status(400).json({
            status: false,
            message: 'Limit must be a positive number between 1 and 100'
        });
        return;
    }

    next();
};

// Helper function to validate date format
const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        return false;
    }
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};
