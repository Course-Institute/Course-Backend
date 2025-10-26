import billDal from '../dals/bill.dal.js';
import { CreateBillRequest, BillSearchFilters, BillListResponse, BillModel } from '../models/bill.model.js';

const createBillService = async (billData: CreateBillRequest, createdBy?: string): Promise<BillModel> => {
    try {
        // Create the bill
        const bill = await billDal.createBillDal(billData, createdBy);
        
        return {
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        };
    } catch (error) {
        console.log('Error in createBillService:', error);
        throw error;
    }
};

const getBillByIdService = async (billId: string): Promise<BillModel | null> => {
    try {
        const bill = await billDal.getBillByIdDal(billId);
        
        if (!bill) {
            return null;
        }

        return {
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        };
    } catch (error) {
        console.log('Error in getBillByIdService:', error);
        throw error;
    }
};

const getBillByBillNumberService = async (billNumber: string): Promise<BillModel | null> => {
    try {
        const bill = await billDal.getBillByBillNumberDal(billNumber);
        
        if (!bill) {
            return null;
        }

        return {
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        };
    } catch (error) {
        console.log('Error in getBillByBillNumberService:', error);
        throw error;
    }
};

const getAllBillsService = async (filters: BillSearchFilters): Promise<BillListResponse> => {
    try {
        const result = await billDal.getAllBillsDal(filters);
        
        // Transform the result to match frontend expectations
        // Flatten bill details to top level for easier frontend access
        const transformedBills = result.bills.map(bill => ({
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        }));

        return {
            bills: transformedBills,
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages
        };
    } catch (error) {
        console.log('Error in getAllBillsService:', error);
        throw error;
    }
};

const updateBillStatusService = async (billId: string, status: "paid" | "pending" | "overdue" | "cancelled", updatedBy?: string): Promise<BillModel | null> => {
    try {
        const bill = await billDal.updateBillStatusDal(billId, status, updatedBy);
        
        if (!bill) {
            return null;
        }

        return {
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        };
    } catch (error) {
        console.log('Error in updateBillStatusService:', error);
        throw error;
    }
};

const deleteBillService = async (billId: string): Promise<boolean> => {
    try {
        const result = await billDal.deleteBillDal(billId);
        return result;
    } catch (error) {
        console.log('Error in deleteBillService:', error);
        throw error;
    }
};

const getBillsByCenterService = async (centerId: string, page = 1, limit = 10): Promise<BillListResponse> => {
    try {
        const result = await billDal.getBillsByCenterDal(centerId, page, limit);
        
        // Transform the result to match frontend expectations
        // Flatten bill details to top level for easier frontend access
        const transformedBills = result.bills.map(bill => ({
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        }));

        return {
            bills: transformedBills,
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages
        };
    } catch (error) {
        console.log('Error in getBillsByCenterService:', error);
        throw error;
    }
};

const getBillsByStudentService = async (registrationNo: string, page = 1, limit = 10): Promise<BillListResponse> => {
    try {
        const result = await billDal.getBillsByStudentDal(registrationNo, page, limit);
        
        // Transform the result to match frontend expectations
        // Flatten bill details to top level for easier frontend access
        const transformedBills = result.bills.map(bill => ({
            id: (bill as any)._id.toString(),
            // Flatten bill details to top level
            ...(bill.billDetails || {}),
            // Add top-level fields
            billType: bill.billType || "other",
            billNumber: bill.billNumber || "",
            createdAt: bill.createdAt,
            updatedAt: bill.updatedAt,
            createdBy: bill.createdBy,
            updatedBy: bill.updatedBy
        }));

        return {
            bills: transformedBills,
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages
        };
    } catch (error) {
        console.log('Error in getBillsByStudentService:', error);
        throw error;
    }
};

// Helper function to validate bill data based on type (simplified - all fields optional)
const validateBillData = (billData: CreateBillRequest): { isValid: boolean; error?: string } => {
    // Basic validation - all fields are optional now
    if (billData.amount && billData.amount <= 0) {
        return { isValid: false, error: 'Amount must be greater than 0 if provided' };
    }

    return { isValid: true };
};

export default {
    createBillService,
    getBillByIdService,
    getBillByBillNumberService,
    getAllBillsService,
    updateBillStatusService,
    deleteBillService,
    getBillsByCenterService,
    getBillsByStudentService
};
