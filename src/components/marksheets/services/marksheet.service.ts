import marksheetDal from '../dals/marksheet.dal.js';
import { IMarksheet, SubjectMarks } from '../models/marksheet.model.js';
import { calculateSubjectGrade } from '../helpers/grade.helper.js';

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

const uploadMarksheetService = async ({ studentId, subjects }: { studentId: string, subjects: SubjectMarks[] }): Promise<IMarksheet> => {
    try {
        // Validate inputs
        if (!studentId) {
            throw new Error('Student ID is required');
        }

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

        // Create the marksheet
        const marksheet = await marksheetDal.uploadMarksheetDal({
            studentId,
            subjects: processedSubjects
        });

        return marksheet;
    } catch (error) {
        console.log('Error in uploadMarksheetService:', error);
        throw error;
    }
};

export default {
    uploadMarksheetService,
    getAllMarksheetsService
};
