import { Request, Response } from 'express';
import { sendResponse } from '../../../utils/response.util.js';
import centerService from '../services/center.service.js';
import { CreateCenterRequest, UpdateCenterRequest, CenterSearchFilters } from '../models/center.model.js';

const centerListAutoCompleteController = async (req: Request, res: Response): Promise<Response> => {
 try {
    const query = req.query.query as string;
    const result = await centerService.centerListAutoComplete({query});
    return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: 'Center list auto complete retrieved successfully',
        data: result
    });
 } catch (error: any) {
    return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: error.message || 'Failed to retrieve center list auto complete',
        error: error.message
    });
 }   
}

const createCenterController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const centerData: CreateCenterRequest = req.body;
        const result = await centerService.createCenter(centerData);
        
        return sendResponse({
            res,
            statusCode: 201,
            status: true,
            message: 'Center created successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: error.message || 'Failed to create center',
            error: error.message
        });
    }
}

const getCenterByIdController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { centerId } = req.params;
        const result = await centerService.getCenterById(centerId);
        
        if (!result) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Center not found',
                error: 'Center not found'
            });
        }
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Center retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 500,
            status: false,
            message: error.message || 'Failed to retrieve center',
            error: error.message
        });
    }
}

const updateCenterController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { centerId } = req.params;
        const updateData: UpdateCenterRequest = req.body;
        const result = await centerService.updateCenter(centerId, updateData);
        
        if (!result) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Center not found',
                error: 'Center not found'
            });
        }
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Center updated successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message: error.message || 'Failed to update center',
            error: error.message
        });
    }
}

const deleteCenterController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { centerId } = req.params;
        const result = await centerService.deleteCenter(centerId);
        
        if (!result) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Center not found',
                error: 'Center not found'
            });
        }
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Center deleted successfully',
            data: { deleted: true }
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 500,
            status: false,
            message: error.message || 'Failed to delete center',
            error: error.message
        });
    }
}

const searchCentersController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const filters: CenterSearchFilters = req.query;
        const result = await centerService.searchCenters(filters);
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Centers retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 500,
            status: false,
            message: error.message || 'Failed to search centers',
            error: error.message
        });
    }
}

const getAllCentersController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await centerService.getAllCenters();
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'All centers retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 500,
            status: false,
            message: error.message || 'Failed to retrieve centers',
            error: error.message
        });
    }
}

const updateCenterStatusController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { centerId } = req.params;
        const { status } = req.body;
        
        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Valid status is required (pending, approved, rejected)',
                error: 'Invalid status'
            });
        }
        
        const result = await centerService.updateCenterStatus(centerId, status);
        
        if (!result) {
            return sendResponse({
                res,
                statusCode: 404,
                status: false,
                message: 'Center not found',
                error: 'Center not found'
            });
        }
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Center status updated successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 500,
            status: false,
            message: error.message || 'Failed to update center status',
            error: error.message
        });
    }
}

export default { 
    centerListAutoCompleteController,
    createCenterController,
    getCenterByIdController,
    updateCenterController,
    deleteCenterController,
    searchCentersController,
    getAllCentersController,
    updateCenterStatusController
};