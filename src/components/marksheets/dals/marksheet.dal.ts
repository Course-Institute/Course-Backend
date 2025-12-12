import { IMarksheet, MarksheetModel, SubjectMarks } from '../models/marksheet.model.js';
import mongoose from 'mongoose';

const buildTermFilter = (studentId: string, semester?: string, year?: string) => {
    const filter: any = { studentId };
    if (semester) {
        filter.semester = semester;
    }
    if (year) {
        filter.year = year;
    }
    return filter;
};

const uploadMarksheetDal = async ({ studentId, semester, year, courseId, serialNo, subjects, role }: { studentId: string, semester?: string, year?: string, courseId: string, serialNo?: string, subjects: SubjectMarks[], role?: string }): Promise<IMarksheet> => {
    try {
        const result = await MarksheetModel.create({ studentId, semester, year, courseId, serialNo, subjects, role });
        return result;
    } catch (error: any) {
        console.log('Error in uploadMarksheetDal:', error);
        // Handle duplicate serialNo error
        if (error.code === 11000 && error.keyPattern?.serialNo) {
            throw new Error('Serial number already exists. Please use a different serial number.');
        }
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
        }
        
        // Calculate skip value for infinite scroll
        const calculatedSkip = skip || (pageNumber - 1) * limit;
        
        // Get total count before pagination
        const totalCount = await MarksheetModel.countDocuments(filter);
        
        // Fetch marksheets with pagination and populate student and course data
        const marksheetsList = await MarksheetModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(calculatedSkip)
            .limit(limit)
            .populate('studentId', 'registrationNo candidateName course faculty session centerId')
            .populate('courseId', 'name code duration description')
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

const getMarksheetByStudentIdDal = async (studentId: string): Promise<any> => {
    try {
        const marksheet = await MarksheetModel.findOne({ studentId })
            .populate('studentId', 'registrationNo candidateName course faculty session centerId isMarksheetAndCertificateApproved whichSemesterMarksheetIsGenerated whichYearMarksheetIsGenerated approvedSemesters approvedYears')
            .populate('courseId', 'name code duration description')
            .lean();
        
        return marksheet;
    } catch (error) {
        console.log('Error in getMarksheetByStudentIdDal:', error);
        throw error;
    }
};

const showMarksheetWithFullStudentDataDal = async (studentId: string): Promise<any> => {
    try {
        const marksheet = await MarksheetModel.findOne({ studentId })
            .populate({
                path: 'studentId',
                select: 'registrationNo candidateName motherName fatherName gender dateOfBirth adharCardNo category areYouEmployed employerName designation contactNumber alternateNumber emailAddress currentAddress permanentAddress city state nationality country pincode courseType faculty course stream year monthSession hostelFacility session duration courseFee aadharFront aadharBack photo signature isApprovedByAdmin isMarksheetAndCertificateApproved isMarksheetGenerated centerId createdAt updatedAt',
                populate: {
                    path: 'centerId',
                    select: 'centerName email'
                }
            })
            .populate('courseId', 'name code duration description')
            .lean();
        
        return marksheet;
    } catch (error) {
        console.log('Error in showMarksheetWithFullStudentDataDal:', error);
        throw error;
    }
};

const updateMarksheetDal = async ({ marksheetId, serialNo, semester, year, subjects, role }: { marksheetId: string, serialNo?: string, semester?: string | null, year?: string | null, subjects: SubjectMarks[], role?: string }): Promise<IMarksheet> => {
    try {
        const updateData: any = { subjects: subjects };
        if (role) {
            updateData.role = role;
        }
        // Update serialNo only if provided (preserve existing if not provided)
        if (serialNo !== undefined) {
            updateData.serialNo = serialNo || null;
        }
        // Update term fields if provided to maintain mutual exclusivity
        if (semester !== undefined) {
            updateData.semester = semester;
            if (semester !== null) {
                updateData.year = null;
            }
        }
        if (year !== undefined) {
            updateData.year = year;
            if (year !== null) {
                updateData.semester = null;
            }
        }
        
        const result = await MarksheetModel.findByIdAndUpdate(
            marksheetId,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!result) {
            throw new Error('Marksheet not found');
        }
        
        return result;
    } catch (error: any) {
        console.log('Error in updateMarksheetDal:', error);
        // Handle duplicate serialNo error
        if (error.code === 11000 && error.keyPattern?.serialNo) {
            throw new Error('Serial number already exists. Please use a different serial number.');
        }
        throw error;
    }
};

const getMarksheetByStudentIdAndSemesterDal = async (studentId: string, semester?: string, year?: string): Promise<any> => {
    try {
        const marksheet = await MarksheetModel.findOne(buildTermFilter(studentId, semester, year))
            .populate({
                path: 'studentId',
                select: 'registrationNo candidateName motherName fatherName gender dateOfBirth courseType faculty course stream year monthSession session duration photo signature isMarksheetAndCertificateApproved',
            })
            .populate({
                path: 'courseId',
                select: 'name code duration description',
            })
            .lean();
        
        return marksheet;
    } catch (error) {
        console.log('Error in getMarksheetByStudentIdAndSemesterDal:', error);
        throw error;
    }
};

const findMarksheetByStudentIdAndSemesterDal = async (studentId: string, semester?: string, year?: string): Promise<IMarksheet | null> => {
    try {
        const marksheet = await MarksheetModel.findOne(buildTermFilter(studentId, semester, year));
        return marksheet;
    } catch (error) {
        console.log('Error in findMarksheetByStudentIdAndSemesterDal:', error);
        throw error;
    }
};

export default {
    uploadMarksheetDal,
    getAllMarksheetsDal,
    getMarksheetByStudentIdDal,
    updateMarksheetDal,
    showMarksheetWithFullStudentDataDal,
    getMarksheetByStudentIdAndSemesterDal,
    findMarksheetByStudentIdAndSemesterDal
};

