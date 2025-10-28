import { Request, Response, NextFunction } from 'express';

// Validation middleware for uploading marksheets
export const validateCreateMarksheet = (req: Request, res: Response, next: NextFunction): void => {
    const {
        studentId,
        subjects
    } = req.body;

    const errors: string[] = [];

    // Validate studentId
    if (!studentId || typeof studentId !== 'string') {
        errors.push('Student ID is required and must be a string');
    }

    // Validate subjects array
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        errors.push('At least one subject is required');
    } else {
        subjects.forEach((subject: any, index: number) => {
            // Validate subject name
            if (!subject.subjectName || typeof subject.subjectName !== 'string') {
                errors.push(`Subject name is required and must be a string for subject at index ${index}`);
            }

            // Validate marks
            if (subject.marks === undefined || typeof subject.marks !== 'number' || subject.marks < 0) {
                errors.push(`Marks must be a non-negative number for subject ${subject.subjectName || `at index ${index}`}`);
            }

            // Validate internal marks
            if (subject.internal === undefined || typeof subject.internal !== 'number' || subject.internal < 0) {
                errors.push(`Internal marks must be a non-negative number for subject ${subject.subjectName || `at index ${index}`}`);
            }

            // Validate minimum marks
            if (subject.minMarks === undefined || typeof subject.minMarks !== 'number' || subject.minMarks < 0) {
                errors.push(`Minimum marks must be a non-negative number for subject ${subject.subjectName || `at index ${index}`}`);
            }

            // Validate maximum marks
            if (subject.maxMarks === undefined || typeof subject.maxMarks !== 'number' || subject.maxMarks <= 0) {
                errors.push(`Maximum marks must be a positive number for subject ${subject.subjectName || `at index ${index}`}`);
            }

            // Validate that minMarks is not greater than maxMarks
            if (subject.minMarks !== undefined && subject.maxMarks !== undefined && subject.minMarks > subject.maxMarks) {
                errors.push(`Minimum marks cannot be greater than maximum marks for subject ${subject.subjectName || `at index ${index}`}`);
            }
        });
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
