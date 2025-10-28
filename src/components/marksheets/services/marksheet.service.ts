import marksheetDal from '../dals/marksheet.dal.js';
import { IMarksheet, SubjectMarks } from '../models/marksheet.model.js';
import { calculateSubjectGrade } from '../helpers/grade.helper.js';
import studentDal from '../../students/dals/student.dal.js';

const getAllMarksheetsService = async ({
    query,
    limit,
    pageNumber,
    centerId
}: {
    query?: string;
    limit?: number;
    pageNumber?: number;
    centerId?: string;
}) => {
    try {
        const skip = ((pageNumber || 1) - 1) * (limit || 10);
        const result = await marksheetDal.getAllMarksheetsDal({
            query,
            limit,
            pageNumber,
            skip,
            centerId
        });
        return result;
    } catch (error) {
        console.log('Error in getAllMarksheetsService:', error);
        throw error;
    }
};

// Unified function to validate and process subjects
const validateAndProcessSubjects = (subjects: SubjectMarks[]): SubjectMarks[] => {
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        throw new Error('At least one subject is required');
    }

    // Validate and calculate grades for each subject
    const processedSubjects = subjects.map((subject, index) => {
        // Validate subject
        if (!subject.subjectName) {
            throw new Error(`Subject name is required for subject at index ${index}`);
        }

        if (subject.marks === undefined || subject.marks < 0) {
            throw new Error(`Marks must be a non-negative number for subject ${subject.subjectName}`);
        }

        if (subject.internal === undefined || subject.internal < 0) {
            throw new Error(`Internal marks must be a non-negative number for subject ${subject.subjectName}`);
        }

        if (subject.minMarks === undefined || subject.minMarks < 0) {
            throw new Error(`Minimum marks must be a non-negative number for subject ${subject.subjectName}`);
        }

        if (subject.maxMarks === undefined || subject.maxMarks <= 0) {
            throw new Error(`Maximum marks must be a positive number for subject ${subject.subjectName}`);
        }

        if (subject.minMarks > subject.maxMarks) {
            throw new Error(`Minimum marks cannot be greater than maximum marks for subject ${subject.subjectName}`);
        }

        // Calculate total and grade
        return calculateSubjectGrade({
            subjectName: subject.subjectName,
            marks: subject.marks,
            internal: subject.internal,
            minMarks: subject.minMarks,
            maxMarks: subject.maxMarks
        });
    });

    return processedSubjects;
};

// Simple service to upload or update marksheet based on marksheetId
const uploadOrUpdateMarksheet = async ({ 
    studentId, 
    subjects, 
    marksheetId,
    role
}: { 
    studentId: string, 
    subjects: SubjectMarks[], 
    marksheetId?: string,
    role?: string
}): Promise<IMarksheet> => {
    try {
        // Validate inputs
        if (!studentId) {
            throw new Error('Student ID is required');
        }

        // Validate and process subjects
        const processedSubjects = validateAndProcessSubjects(subjects);

        let marksheet: IMarksheet;

        if(role === 'admin') {
            await studentDal.approveStudentMarksheetDal({
                studentId
            });
        }
        // If marksheetId is provided, update existing marksheet, otherwise create new
        if (marksheetId) {
            marksheet = await marksheetDal.updateMarksheetDal({
                marksheetId,
                subjects: processedSubjects,
            });
        } else {
            // Create the marksheet
            marksheet = await marksheetDal.uploadMarksheetDal({
                studentId,
                subjects: processedSubjects,
            });
            
            // Update student status after creating marksheet
            if(marksheet) {
                await studentDal.updateMarksheetGenerationStatusDal({
                    studentId,
                    isMarksheetGenerated: true
                });
            }
        }

        return marksheet;
    } catch (error) {
        console.log('Error in uploadOrUpdateMarksheet:', error);
        throw error;
    }
};

const getMarksheetByStudentIdService = async (studentId: string): Promise<any> => {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }

        const marksheet = await marksheetDal.getMarksheetByStudentIdDal(studentId);
        return marksheet;
    } catch (error) {
        console.log('Error in getMarksheetByStudentIdService:', error);
        throw error;
    }
};

const showMarksheetService = async (studentId: string): Promise<any> => {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }

        const marksheet = await marksheetDal.showMarksheetWithFullStudentDataDal(studentId);
        return marksheet;
    } catch (error) {
        console.log('Error in showMarksheetService:', error);
        throw error;
    }
};

export default {
    uploadOrUpdateMarksheet,
    getAllMarksheetsService,
    getMarksheetByStudentIdService,
    showMarksheetService
};
