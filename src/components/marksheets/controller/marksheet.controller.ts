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
        const { studentId, subjects } = req.body;

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

        const marksheet = await marksheetService.uploadMarksheetService({
            studentId,
            subjects: subjects as SubjectMarks[]
        });

        return sendResponse({
            res,
            statusCode: 201,
            status: true,
            message: 'Marksheet uploaded successfully',
            data: marksheet
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to upload marksheet',
            error: error.message
        });
    }
};

export default {
    uploadMarksheetController,
    getAllMarksheetsController
};
