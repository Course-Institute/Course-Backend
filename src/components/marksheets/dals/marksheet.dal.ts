import { IMarksheet, MarksheetModel, SubjectMarks } from '../models/marksheet.model.js';
import mongoose from 'mongoose';

const uploadMarksheetDal = async ({ studentId, subjects }: { studentId: string, subjects: SubjectMarks[] }): Promise<IMarksheet> => {
    try {
        const result = await MarksheetModel.create({ studentId, subjects });
        return result;
    } catch (error) {
        console.log('Error in uploadMarksheetDal:', error);
        throw error;
    }
}

const getAllMarksheetsDal = async ({ 
    query, 
    limit = 10, 
    pageNumber = 1, 
    skip = 0,
    centerId
}: { 
    query?: string; 
    limit?: number; 
    pageNumber?: number; 
    skip?: number;
    centerId?: string;
}): Promise<{ marksheets: IMarksheet[]; totalCount: number; hasMore: boolean, totalPages: number }> => {
    try {
        // Build filter object for MongoDB query
        const filter: any = {};
        
        // If there's a search query, apply it to the database query
        if (query && query.trim()) {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regexSearch = new RegExp(escapedQuery, 'i');
            
            // Search in subject names within the marksheet
            filter['subjects.subjectName'] = regexSearch;
            filter['studentId'] = regexSearch;
        }

        if(centerId) {
            filter['studentId.centerId'] = centerId;
        }
        
        // Calculate skip value for infinite scroll
        const calculatedSkip = skip || (pageNumber - 1) * limit;
        
        // Get total count before pagination
        const totalCount = await MarksheetModel.countDocuments(filter);
        
        // Fetch marksheets with pagination and populate student data
        const marksheetsList = await MarksheetModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(calculatedSkip)
            .limit(limit)
            .populate('studentId', 'registrationNo candidateName course faculty session centerId')
            .lean();
        
        
        // Check if there are more records
        const hasMore = calculatedSkip + marksheetsList.length < totalCount;
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
            marksheets: marksheetsList as IMarksheet[],
            totalCount,
            hasMore,
            totalPages
        };
    } catch (error) {
        console.log('Error in getAllMarksheetsDal:', error);
        throw error;
    }
};

export default {
    uploadMarksheetDal,
    getAllMarksheetsDal
};

