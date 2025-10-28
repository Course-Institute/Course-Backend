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
        const { studentId, subjects, marksheetId, role } = req.body;

        if (!studentId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Student ID is required'
            });
        }

        if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'At least one subject is required'
            });
        }

        const marksheet = await marksheetService.uploadOrUpdateMarksheet({
            studentId,
            subjects: subjects as SubjectMarks[],
            marksheetId,
            role
        });

        return sendResponse({
            res,
            statusCode: marksheetId ? 200 : 201,
            status: true,
            message: marksheetId ? 'Marksheet updated successfully' : 'Marksheet uploaded successfully',
            data: marksheet
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to upload/update marksheet',
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
        const { studentId } = req.query;

        if (!studentId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Student ID is required'
            });
        }

        const marksheet = await marksheetService.showMarksheetService(studentId as string);

        if (!marksheet) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Marksheet not found for the given student ID'
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Marksheet retrieved successfully',
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

export default {
    uploadMarksheetController,
    getAllMarksheetsController,
    getMarksheetController,
    showMarksheetController
};
