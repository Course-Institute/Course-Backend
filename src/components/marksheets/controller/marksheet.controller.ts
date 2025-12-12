import { Request, Response } from 'express';
import marksheetService from '../services/marksheet.service.js';
import { sendResponse } from '../../../utils/response.util.js';
import { SubjectMarks } from '../models/marksheet.model.js';

const getAllMarksheetsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { query, limit = 10, pageNumber = 1, centerId } = req.query;
        const marksheets = await marksheetService.getAllMarksheetsService({ 
            query: query as string, 
            limit: Number(limit), 
            pageNumber: Number(pageNumber),
            centerId: centerId as string
        });
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'All marksheets retrieved successfully',
            data: marksheets
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve marksheets',
            error: error.message
        });
    }
};

const uploadMarksheetController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { studentId, semester, year, courseId, serialNo, subjects, marksheetId, role } = req.body;

        if (!studentId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Student ID is required',
                data: null
            });
        }

        const hasSemester = semester !== undefined && semester !== null && semester !== '';
        const hasYear = year !== undefined && year !== null && year !== '';

        if (!hasSemester && !hasYear) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Semester or year is required',
                data: null
            });
        }

        if (hasSemester && hasYear) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Provide either semester or year, not both',
                data: null
            });
        }

        // CourseId is required when creating new marksheet (when marksheetId is not provided)
        if (!marksheetId && !courseId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Course ID is required when creating a new marksheet',
                data: null
            });
        }

        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'At least one subject is required',
                data: null
            });
        }

        // Check if marksheet already exists for this student + semester
        const existingMarksheet = await marksheetService.getMarksheetByStudentIdAndSemesterService(
            studentId,
            hasSemester ? semester : undefined,
            hasYear ? year : undefined
        );
        const isUpdate = existingMarksheet || marksheetId;

        const marksheet = await marksheetService.uploadOrUpdateMarksheet({
            studentId,
            semester,
            year,
            courseId,
            serialNo,
            subjects: subjects as SubjectMarks[],
            marksheetId,
            role
        });

        return sendResponse({
            res,
            statusCode: isUpdate ? 200 : 201,
            status: true,
            message: isUpdate ? 'Marksheet updated successfully' : 'Marksheet created successfully',
            data: marksheet
        });
    } catch (error: any) {
        // Handle specific error cases
        if (error.message.includes('Invalid courseId') || error.message.includes('Invalid course ID')) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: error.message || 'Invalid courseId',
                data: null
            });
        }

        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: error.message || 'Failed to upload/update marksheet',
            error: error.message
        });
    }
};

const getMarksheetController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Student ID is required'
            });
        }

        const marksheet = await marksheetService.getMarksheetByStudentIdService(studentId as string);

        if (!marksheet) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Marksheet not found for the given student ID'
            });
        }

        // Format the response according to the specification
        const formattedResponse = {
            id: marksheet._id.toString(),
            studentId: marksheet.studentId?._id?.toString() || marksheet.studentId?.toString() || '',
            registrationNo: marksheet.studentId?.registrationNo || '',
            serialNo: marksheet.serialNo || null,
            semester: marksheet.semester || null,
            year: (marksheet as any).year || null,
            whichSemesterMarksheetIsGenerated: marksheet.studentId?.whichSemesterMarksheetIsGenerated || [],
            whichYearMarksheetIsGenerated: marksheet.studentId?.whichYearMarksheetIsGenerated || [],
            approvedSemesters: marksheet.studentId?.approvedSemesters || [],
            approvedYears: marksheet.studentId?.approvedYears || [],
            subjects: marksheet.subjects?.map((subject: any, index: number) => ({
                id: subject.id || index.toString(),
                subjectName: subject.subjectName || '',
                marks: subject.marks || 0,
                internal: subject.internal || 0,
                total: subject.total || 0,
                minMarks: subject.minMarks || 0,
                maxMarks: subject.maxMarks || 0
            })) || [],
            createdAt: marksheet.createdAt?.toISOString() || new Date().toISOString(),
            isMarksheetApproved: marksheet.studentId?.isMarksheetAndCertificateApproved || false,
            role: req.user?.role || ''
        };

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Marksheet retrieved successfully',
            data: formattedResponse
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve marksheet',
            error: error.message
        });
    }
};

const showMarksheetController = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Support both query parameters and request body
        const studentId = (req.query.studentId || req.body.studentId) as string;
        const semester = (req.query.semester || req.body.semester) as string;
        const year = (req.query.year || req.body.year) as string;

        if (!studentId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Student ID is required'
            });
        }

        const hasSemester = semester !== undefined && semester !== null && semester !== '';
        const hasYear = year !== undefined && year !== null && year !== '';

        if (!hasSemester && !hasYear) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Semester or year is required',
                data: null
            });
        }

        if (hasSemester && hasYear) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Provide either semester or year, not both',
                data: null
            });
        }

        const marksheet = await marksheetService.getMarksheetByStudentIdAndSemesterService(
            studentId,
            hasSemester ? semester : undefined,
            hasYear ? year : undefined
        );

        if (!marksheet) {
            return sendResponse({
                res,
                statusCode: 200,
                status: false,
                message: 'No marksheet found for this student and semester/year',
                data: null
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Marksheet fetched successfully',
            data: marksheet
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve marksheet',
            error: error.message
        });
    }
};

const updateMarksheetController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { marksheetId, studentId, semester, year, serialNo, subjects, role } = req.body;

        if (!marksheetId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Marksheet ID is required'
            });
        }

        if (!studentId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Student ID is required'
            });
        }

        const hasSemester = semester !== undefined && semester !== null && semester !== '';
        const hasYear = year !== undefined && year !== null && year !== '';

        if (!hasSemester && !hasYear) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Semester or year is required',
                data: null
            });
        }

        if (hasSemester && hasYear) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Provide either semester or year, not both',
                data: null
            });
        }

        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Subjects array cannot be empty',
                data: null
            });
        }

        const marksheet = await marksheetService.updateMarksheetService({
            marksheetId,
            studentId,
            semester,
            year,
            serialNo,
            subjects: subjects as SubjectMarks[],
            role
        });

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Marksheet updated successfully',
            data: marksheet
        });
    } catch (error: any) {
        // Handle specific error cases
        if (error.message.includes('not found')) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: error.message || 'Marksheet not found',
                data: null
            });
        }

        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: error.message || 'Failed to update marksheet',
            data: null
        });
    }
};

export default {
    uploadMarksheetController,
    getAllMarksheetsController,
    getMarksheetController,
    showMarksheetController,
    updateMarksheetController
};
