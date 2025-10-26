import { Request, Response } from 'express';
import billService from '../services/bill.service.js';
import { sendResponse } from '../../../utils/response.util.js';
import { CreateBillRequest, BillSearchFilters } from '../models/bill.model.js';

const createBillController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const billData: CreateBillRequest = req.body;
        const createdBy = (req as any).user?.id; // Assuming user ID is available in request

        const bill = await billService.createBillService(billData, createdBy);

        return sendResponse({
            res,
            statusCode: 201,
            status: true,
            message: 'Bill created successfully',
            data: bill
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to create bill',
            error: error.message
        });
    }
};

const getBillByIdController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { billId } = req.params;

        if (!billId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Bill ID is required'
            });
        }

        const bill = await billService.getBillByIdService(billId);

        if (!bill) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Bill not found'
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Bill retrieved successfully',
            data: bill
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve bill',
            error: error.message
        });
    }
};

const getBillByBillNumberController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { billNumber } = req.params;

        if (!billNumber) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Bill number is required'
            });
        }

        const bill = await billService.getBillByBillNumberService(billNumber);

        if (!bill) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Bill not found'
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Bill retrieved successfully',
            data: bill
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve bill',
            error: error.message
        });
    }
};

const getAllBillsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Handle both GET (query params) and POST (body) requests
        let filters: BillSearchFilters;
        
        if (req.method === 'POST') {
            // POST request with body payload for infinite scroll
            const { query, page = 1, limit = 10, ...otherFilters } = req.body;
            
            filters = {
                ...otherFilters,
                page: Number(page),
                limit: Number(limit)
            };
            
            // If query is provided, search across multiple fields
            if (query && query.trim()) {
                const searchQuery = query.trim();
                // We'll handle this in the service layer
                filters.searchQuery = searchQuery;
            }
        } else {
            // GET request with query params
            filters = {
                billType: req.query.billType as "student" | "center" | "other",
                status: req.query.status as "paid" | "pending" | "overdue" | "cancelled",
                centerId: req.query.centerId as string,
                studentName: req.query.studentName as string,
                centerName: req.query.centerName as string,
                recipientName: req.query.recipientName as string,
                dateFrom: req.query.dateFrom as string,
                dateTo: req.query.dateTo as string,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10
            };
        }

        const result = await billService.getAllBillsService(filters);

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Bills retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve bills',
            error: error.message
        });
    }
};

const updateBillStatusController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { billId } = req.params;
        const { status } = req.body;
        const updatedBy = (req as any).user?.id;

        if (!billId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Bill ID is required'
            });
        }

        if (!status || !['paid', 'pending', 'overdue', 'cancelled'].includes(status)) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Valid status is required (paid, pending, overdue, cancelled)'
            });
        }

        const bill = await billService.updateBillStatusService(billId, status, updatedBy);

        if (!bill) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Bill not found'
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Bill status updated successfully',
            data: bill
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to update bill status',
            error: error.message
        });
    }
};

const deleteBillController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { billId } = req.params;

        if (!billId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Bill ID is required'
            });
        }

        const result = await billService.deleteBillService(billId);

        if (!result) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Bill not found'
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Bill deleted successfully'
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to delete bill',
            error: error.message
        });
    }
};

const getBillsByCenterController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { centerId } = req.params;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        if (!centerId) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Center ID is required'
            });
        }

        const result = await billService.getBillsByCenterService(centerId, page, limit);

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Center bills retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve center bills',
            error: error.message
        });
    }
};

const getBillsByStudentController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.params;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;

        if (!registrationNo) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Registration number is required'
            });
        }

        const result = await billService.getBillsByStudentService(registrationNo, page, limit);

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Student bills retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: 'Failed to retrieve student bills',
            error: error.message
        });
    }
};

export default {
    createBillController,
    getBillByIdController,
    getBillByBillNumberController,
    getAllBillsController,
    updateBillStatusController,
    deleteBillController,
    getBillsByCenterController,
    getBillsByStudentController
};
