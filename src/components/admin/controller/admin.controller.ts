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
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // Remove centerCode from request data since it will be auto-generated
        if (centerData.centerDetails && centerData.centerDetails.centerCode) {
            delete centerData.centerDetails.centerCode;
        }
        
        // Validate required fields
        if (!centerData.centerDetails || !centerData.centerDetails.centerName) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Center name is required',
            });
        }

        if (!centerData.centerDetails.officialEmail) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Official email ID is required',
            });
        }

        // Process uploaded files and update centerData with file paths
        if (files) {
            // Handle authorized person photo
            if (files.authorizedPersonPhoto && files.authorizedPersonPhoto[0]) {
                centerData.authorizedPersonDetails.photo = files.authorizedPersonPhoto[0].filename;
            }

            // Handle infrastructure photos
            if (files.infraPhotos && files.infraPhotos.length > 0) {
                centerData.infrastructureDetails.infraPhotos = files.infraPhotos.map(file => file.filename);
            }

            // Handle bank details - cancelled cheque
            if (files.cancelledCheque && files.cancelledCheque[0]) {
                centerData.bankDetails.cancelledCheque = files.cancelledCheque[0].filename;
            }

            // Handle document uploads
            if (files.gstCertificate && files.gstCertificate[0]) {
                centerData.documentUploads.gstCertificate = files.gstCertificate[0].filename;
            }

            if (files.panCard && files.panCard[0]) {
                centerData.documentUploads.panCard = files.panCard[0].filename;
            }

            if (files.addressProof && files.addressProof[0]) {
                centerData.documentUploads.addressProof = files.addressProof[0].filename;
            }

            if (files.directorIdProof && files.directorIdProof[0]) {
                centerData.documentUploads.directorIdProof = files.directorIdProof[0].filename;
            }

            // Handle signature
            if (files.signature && files.signature[0]) {
                centerData.declaration.signatureUrl = files.signature[0].filename;
            }
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

const getAllCentersController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {query, limit, pageNumber} = req.body;
        const centers = await adminService.getAllCentersService({query, limit, pageNumber});
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'All centers retrieved successfully',
            data: centers
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve centers',
            error: error.message
        });
    }
}

// const approveCenterController = async (req: Request, res: Response): Promise<Response> => {

// }

export default {
    listAllStudentsController,
    getStudentDetailsController,
    getAdminDashboardController,
    approveStudentController,
    registerCenterController,
    getAllCentersController,
    // approveCenterController,
};
