import { Request, Response } from 'express';
import adminService from '../services/admin.service.js';
import { sendResponse } from '../../../utils/response.util.js';
import { CreateCenterRequest } from '../../centers/models/center.model.js';

const listAllStudentsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { page = 1, limit = 10, search, faculty, course, session, centerId } = req.query;

        const result = await adminService.listAllStudents({
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            faculty: faculty as string,
            course: course as string,
            session: session as string,
            centerId: centerId as string,
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
        const payload = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // Convert internetFacility string to boolean
        const internetFacility = payload.internetFacility === 'yes' || payload.internetFacility === 'true';

        // Map flat payload to nested structure
        const centerData: CreateCenterRequest = {
            centerDetails: {
                centerName: payload.centerName,
                centerType: payload.centerType,
                yearOfEstablishment: parseInt(payload.yearOfEstablishment),
                address: payload.address,
                city: payload.city,
                state: payload.state,
                pinCode: payload.pinCode,
                officialEmail: payload.officialEmail,
                primaryContactNo: payload.contactNo,
                website: payload.website || undefined
            },
            authorizedPersonDetails: {
                authName: payload.authName,
                designation: payload.designation,
                contactNo: payload.contactNo,
                email: payload.email,
                idProofNo: payload.idProofNo,
                photo: undefined // Will be set from file upload
            },
            infrastructureDetails: {
                numClassrooms: parseInt(payload.numClassrooms),
                numComputers: parseInt(payload.numComputers),
                internetFacility: internetFacility,
                seatingCapacity: parseInt(payload.seatingCapacity),
                infraPhotos: [] // Will be set from file uploads
            },
            bankDetails: {
                bankName: payload.bankName,
                accountHolder: payload.accountHolder,
                accountNumber: payload.accountNumber,
                ifsc: payload.ifsc,
                branchName: payload.branchName,
                cancelledCheque: undefined // Will be set from file upload
            },
            documentUploads: {
                gstCertificate: undefined,
                panCard: undefined,
                addressProof: undefined,
                directorIdProof: undefined
            },
            loginCredentials: {
                username: payload.username,
                password: payload.password
            },
            declaration: {
                declaration: true, // Assuming declaration is always true for admin registration
                signatureUrl: undefined // Will be set from file upload
            },
        };

        // Process uploaded files and update centerData with file paths
        if (files) {
            // Handle authorized person photo
            if (files.photo && files.photo[0]) {
                centerData.authorizedPersonDetails.photo = files.photo[0].filename;
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

const approveStudentMarksheetController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.body;

        // Call the service to approve the marksheet
        const result = await adminService.approveStudentMarksheetService(registrationNo);

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Marksheet approved successfully',
            data: result,
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to approve marksheet',
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
    approveStudentMarksheetController,
    // approveCenterController,
};
