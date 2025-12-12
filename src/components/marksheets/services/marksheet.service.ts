import marksheetDal from '../dals/marksheet.dal.js';
import { IMarksheet, SubjectMarks } from '../models/marksheet.model.js';
import { calculateSubjectGrade } from '../helpers/grade.helper.js';
import studentDal from '../../students/dals/student.dal.js';
import { CourseModel } from '../../course/models/course.model.js';
import mongoose from 'mongoose';

const normalizeTermInput = (semester?: string, year?: string | number) => {
    const normalizedSemester = semester !== undefined && semester !== null && String(semester).trim() !== ''
        ? String(semester).trim()
        : undefined;
    const normalizedYear = year !== undefined && year !== null && String(year).trim() !== ''
        ? String(year).trim()
        : undefined;

    const hasSemester = Boolean(normalizedSemester);
    const hasYear = Boolean(normalizedYear);

    if (hasSemester && hasYear) {
        throw new Error('Provide either semester or year, not both');
    }

    if (!hasSemester && !hasYear) {
        throw new Error('Semester or year is required');
    }

    return {
        semester: normalizedSemester,
        year: normalizedYear
    };
};

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
    semester,
    year,
    courseId,
    serialNo,
    subjects, 
    marksheetId,
    role
}: { 
    studentId: string, 
    semester?: string,
    year?: string | number,
    courseId?: string,
    serialNo?: string,
    subjects: SubjectMarks[], 
    marksheetId?: string,
    role?: string
}): Promise<IMarksheet> => {
    try {
        // Validate inputs
        if (!studentId) {
            throw new Error('Student ID is required');
        }

        const term = normalizeTermInput(semester, year);

        // CourseId is required when creating a new marksheet
        if (!marksheetId && !courseId) {
            throw new Error('Course ID is required when creating a new marksheet');
        }

        // Validate course exists if courseId is provided
        if (courseId) {
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                throw new Error('Invalid course ID format');
            }
            const course = await CourseModel.findById(courseId);
            if (!course) {
                throw new Error('Invalid courseId - course not found');
            }
        }

        // Validate and process subjects
        const processedSubjects = validateAndProcessSubjects(subjects);

        let marksheet: IMarksheet;

        if(role === 'admin') {
            await studentDal.approveStudentMarksheetDal({
                studentId
            });
        }

        // If marksheetId is provided, update existing marksheet
        if (marksheetId) {
            marksheet = await marksheetDal.updateMarksheetDal({
                marksheetId,
                serialNo,
                semester: term.semester ?? null,
                year: term.year ?? null,
                subjects: processedSubjects,
                role
            });
            
            // Use semester from marksheet if not provided in request
            const semesterToUse = term.semester || marksheet.semester || undefined;
            const yearToUse = term.year || (marksheet as any).year || undefined;
            
            // Ensure term is in the student's array
            if (marksheet && (semesterToUse || yearToUse)) {
                await studentDal.updateStudentSemesterMarksheetArrayDal({
                    studentId,
                    semester: semesterToUse,
                    year: yearToUse
                });
            }
        } else {
            // Check if marksheet already exists for this student + semester combination
            const existingMarksheet = await marksheetDal.findMarksheetByStudentIdAndSemesterDal(studentId, term.semester, term.year);
            
            if (existingMarksheet) {
                // Update existing marksheet
                const marksheetIdString = existingMarksheet._id instanceof mongoose.Types.ObjectId 
                    ? existingMarksheet._id.toString() 
                    : String(existingMarksheet._id);
                marksheet = await marksheetDal.updateMarksheetDal({
                    marksheetId: marksheetIdString,
                    serialNo,
                    semester: term.semester ?? null,
                    year: term.year ?? null,
                    subjects: processedSubjects,
                    role
                });
                
                // Ensure term is in the student's array (should already be there, but ensure it)
                if(marksheet && (term.semester || term.year)) {
                    await studentDal.updateStudentSemesterMarksheetArrayDal({
                        studentId,
                        semester: term.semester,
                        year: term.year
                    });
                }
            } else {
                // CourseId is required when creating new marksheet
                if (!courseId) {
                    throw new Error('Course ID is required when creating a new marksheet');
                }

                // Create new marksheet
                marksheet = await marksheetDal.uploadMarksheetDal({
                    studentId,
                    semester: term.semester,
                    year: term.year,
                    courseId,
                    serialNo,
                    subjects: processedSubjects,
                    role
                });
                
                // Update student status and term array after creating marksheet
                if(marksheet && (term.semester || term.year)) {
                    await studentDal.updateStudentSemesterMarksheetArrayDal({
                        studentId,
                        semester: term.semester,
                        year: term.year
                    });
                }
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

const showMarksheetService = async (studentId: string, semester?: string, year?: string | number): Promise<any> => {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }

        // If term is provided, use the specific lookup
        if (semester || year) {
            const marksheet = await marksheetDal.getMarksheetByStudentIdAndSemesterDal(studentId, semester, year ? String(year) : undefined);
            return marksheet;
        }

        // Otherwise, use the old method (for backward compatibility)
        const marksheet = await marksheetDal.showMarksheetWithFullStudentDataDal(studentId);
        return marksheet;
    } catch (error) {
        console.log('Error in showMarksheetService:', error);
        throw error;
    }
};

const getMarksheetByStudentIdAndSemesterService = async (studentId: string, semester?: string, year?: string | number): Promise<any> => {
    try {
        if (!studentId) {
            throw new Error('Student ID is required');
        }

        const term = normalizeTermInput(semester, year);

        const marksheet = await marksheetDal.getMarksheetByStudentIdAndSemesterDal(studentId, term.semester, term.year);
        return marksheet;
    } catch (error) {
        console.log('Error in getMarksheetByStudentIdAndSemesterService:', error);
        throw error;
    }
};

const updateMarksheetService = async ({
    marksheetId,
    studentId,
    semester,
    year,
    serialNo,
    subjects,
    role
}: {
    marksheetId: string;
    studentId: string;
    semester?: string;
    year?: string | number;
    serialNo?: string;
    subjects: SubjectMarks[];
    role?: string;
}): Promise<IMarksheet> => {
    try {
        // Validate inputs
        if (!marksheetId) {
            throw new Error('Marksheet ID is required');
        }

        if (!studentId) {
            throw new Error('Student ID is required');
        }

        const term = normalizeTermInput(semester, year);

        // Validate and process subjects
        const processedSubjects = validateAndProcessSubjects(subjects);

        // Find the marksheet to validate it exists and belongs to the student
        const existingMarksheet = await marksheetDal.findMarksheetByStudentIdAndSemesterDal(studentId, term.semester, term.year);
        
        if (!existingMarksheet) {
            throw new Error('Marksheet not found for this student and semester/year');
        }

        // Validate that the marksheetId matches the found marksheet
        const existingMarksheetId = existingMarksheet._id instanceof mongoose.Types.ObjectId 
            ? existingMarksheet._id.toString() 
            : String(existingMarksheet._id);
        if (existingMarksheetId !== marksheetId) {
            throw new Error('Marksheet does not match provided student and semester');
        }

        // Update the marksheet
        const updatedMarksheet = await marksheetDal.updateMarksheetDal({
            marksheetId,
            serialNo,
            semester: term.semester ?? null,
            year: term.year ?? null,
            subjects: processedSubjects,
            role
        });

        // Ensure term is in the student's array
        if (updatedMarksheet && (term.semester || term.year)) {
            await studentDal.updateStudentSemesterMarksheetArrayDal({
                studentId,
                semester: term.semester,
                year: term.year
            });
        }

        return updatedMarksheet;
    } catch (error) {
        console.log('Error in updateMarksheetService:', error);
        throw error;
    }
};

export default {
    uploadOrUpdateMarksheet,
    getAllMarksheetsService,
    getMarksheetByStudentIdService,
    showMarksheetService,
    getMarksheetByStudentIdAndSemesterService,
    updateMarksheetService
};
