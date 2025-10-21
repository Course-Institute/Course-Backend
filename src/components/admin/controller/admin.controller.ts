import { Request, Response } from 'express';
import adminService from '../services/admin.service.js';
import { sendResponse } from '../../../utils/response.util.js';
import { CreateCenterRequest } from '../../centers/models/center.model.js';

const listAllStudentsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { page = 1, limit = 10, search, faculty, course, session } = req.query;

        const result = await adminService.listAllStudents({
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            faculty: faculty as string,
            course: course as string,
            session: session as string
        });

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'All students retrieved successfully.',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve student details',
            error: error.message
        })
    }
};

const getStudentDetailsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.params;

        if (!registrationNo) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Registration number is required'
            });
        }

        const student = await adminService.getStudentDetails(registrationNo);

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Student details retrieved successfully',
            data: student
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 404,
            status: false,
            message: 'Failed to retrieve student details',
            error: error.message
        });
    }
};

const getAdminDashboardController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const dashboardData = await adminService.getDashboardData();

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Admin dashboard data retrieved successfully',
            data: dashboardData
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve dashboard data',
            error: error.message
        });
    }
};

const approveStudentController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.body;
        if (!registrationNo) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Registration number is required',
            });
        }
        const { status, message, data } = await adminService.approveStudentService({ registrationNo });
        if (!data) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: "Student not found",
            });
        }
        return sendResponse({
            res,
            statusCode: 200,
            status,
            message,
            data,
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: error.message || 'Failed in approving students',
            error: error.message
        });
    }
}

const registerCenterController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const centerData: CreateCenterRequest = req.body;
        
        // Validate required fields
        if (!centerData.centerDetails || !centerData.centerDetails.centerName) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Center name is required',
            });
        }

        if (!centerData.centerDetails.officialEmailId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Official email ID is required',
            });
        }

        if (!centerData.loginCredentials || !centerData.loginCredentials.username) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Username is required',
            });
        }

        const result = await adminService.registerCenterService(centerData);
        
        return sendResponse({
            res,
            statusCode: 201,
            status: true,
            message: 'Center registered successfully by admin',
            data: result,
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: error.message || 'Failed to register center',
            error: error.message
        });
    }
}

export default {
    listAllStudentsController,
    getStudentDetailsController,
    getAdminDashboardController,
    approveStudentController,
    registerCenterController,
};
