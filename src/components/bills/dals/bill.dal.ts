import { BillModel, IBill, CreateBillRequest, BillSearchFilters, BillListResponse } from '../models/bill.model.js';

const createBillDal = async (billData: CreateBillRequest, createdBy?: string): Promise<IBill> => {
    try {
        // Determine bill type based on the data provided
        let billType: "student" | "center" | "other" = "other";
        
        if (billData.studentName || billData.registrationNo || billData.course) {
            billType = "student";
        } else if (billData.centerName || billData.centerCode || billData.centerType) {
            billType = "center";
        }

        const bill = new BillModel({
            billDetails: billData,
            billType,
            createdBy
        });

        const savedBill = await bill.save();
        return savedBill;
    } catch (error) {
        console.log('Error in createBillDal:', error);
        throw error;
    }
};

const getBillByIdDal = async (billId: string): Promise<IBill | null> => {
    try {
        const bill = await BillModel.findById(billId);
        return bill;
    } catch (error) {
        console.log('Error in getBillByIdDal:', error);
        throw error;
    }
};

const getBillByBillNumberDal = async (billNumber: string): Promise<IBill | null> => {
    try {
        const bill = await BillModel.findOne({ billNumber });
        return bill;
    } catch (error) {
        console.log('Error in getBillByBillNumberDal:', error);
        throw error;
    }
};

const getAllBillsDal = async (filters: BillSearchFilters): Promise<BillListResponse> => {
    try {
        const {
            billType,
            status,
            centerId,
            studentName,
            centerName,
            recipientName,
            dateFrom,
            dateTo,
            searchQuery,
            page = 1,
            limit = 10
        } = filters;

        // Build query object
        const query: any = {};

        if (billType) {
            query.billType = billType;
        }

        if (centerId) {
            query['billDetails.centerId'] = centerId;
        }

        if (status) {
            query['billDetails.status'] = status;
        }

        // Handle searchQuery for infinite scroll - search across multiple fields
        if (searchQuery && searchQuery.trim()) {
            const searchTerm = searchQuery.trim();
            const searchConditions = [
                { 'billDetails.studentName': { $regex: searchTerm, $options: 'i' } },
                { 'billDetails.registrationNo': { $regex: searchTerm, $options: 'i' } },
                { 'billDetails.centerName': { $regex: searchTerm, $options: 'i' } },
                { 'billDetails.centerCode': { $regex: searchTerm, $options: 'i' } },
                { 'billDetails.recipientName': { $regex: searchTerm, $options: 'i' } },
                { 'billDetails.recipientId': { $regex: searchTerm, $options: 'i' } },
                { 'billDetails.description': { $regex: searchTerm, $options: 'i' } },
                { 'billNumber': { $regex: searchTerm, $options: 'i' } }
            ];
            
            query.$or = searchConditions;
        } else {
            // Individual field searches (for backward compatibility)
            if (studentName || centerName || recipientName) {
                const nameQuery: any[] = [];
                
                if (studentName) {
                    nameQuery.push({ 'billDetails.studentName': { $regex: studentName, $options: 'i' } });
                }
                
                if (centerName) {
                    nameQuery.push({ 'billDetails.centerName': { $regex: centerName, $options: 'i' } });
                }
                
                if (recipientName) {
                    nameQuery.push({ 'billDetails.recipientName': { $regex: recipientName, $options: 'i' } });
                }

                if (nameQuery.length > 0) {
                    query.$or = nameQuery;
                }
            }
        }

        // Date range filter
        if (dateFrom || dateTo) {
            query['billDetails.billDate'] = {};
            
            if (dateFrom) {
                query['billDetails.billDate'].$gte = dateFrom;
            }
            
            if (dateTo) {
                query['billDetails.billDate'].$lte = dateTo;
            }
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const [bills, totalCount] = await Promise.all([
            BillModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BillModel.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            bills: bills as IBill[],
            totalCount,
            currentPage: page,
            totalPages
        };
    } catch (error) {
        console.log('Error in getAllBillsDal:', error);
        throw error;
    }
};

const updateBillStatusDal = async (billId: string, status: "paid" | "pending" | "overdue" | "cancelled", updatedBy?: string): Promise<IBill | null> => {
    try {
        const bill = await BillModel.findByIdAndUpdate(
            billId,
            {
                'billDetails.status': status,
                updatedBy
            },
            { new: true }
        );
        return bill;
    } catch (error) {
        console.log('Error in updateBillStatusDal:', error);
        throw error;
    }
};

const deleteBillDal = async (billId: string): Promise<boolean> => {
    try {
        const result = await BillModel.findByIdAndDelete(billId);
        return !!result;
    } catch (error) {
        console.log('Error in deleteBillDal:', error);
        throw error;
    }
};

const getBillsByCenterDal = async (centerId: string, page = 1, limit = 10): Promise<BillListResponse> => {
    try {
        const skip = (page - 1) * limit;

        const [bills, totalCount] = await Promise.all([
            BillModel.find({ 'billDetails.centerId': centerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BillModel.countDocuments({ 'billDetails.centerId': centerId })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            bills: bills as IBill[],
            totalCount,
            currentPage: page,
            totalPages
        };
    } catch (error) {
        console.log('Error in getBillsByCenterDal:', error);
        throw error;
    }
};

const getBillsByStudentDal = async (registrationNo: string, page = 1, limit = 10): Promise<BillListResponse> => {
    try {
        const skip = (page - 1) * limit;

        const [bills, totalCount] = await Promise.all([
            BillModel.find({ 'billDetails.registrationNo': registrationNo })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BillModel.countDocuments({ 'billDetails.registrationNo': registrationNo })
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            bills: bills as IBill[],
            totalCount,
            currentPage: page,
            totalPages
        };
    } catch (error) {
        console.log('Error in getBillsByStudentDal:', error);
        throw error;
    }
};

export default {
    createBillDal,
    getBillByIdDal,
    getBillByBillNumberDal,
    getAllBillsDal,
    updateBillStatusDal,
    deleteBillDal,
    getBillsByCenterDal,
    getBillsByStudentDal
};
