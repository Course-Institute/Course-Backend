import { Request, Response } from 'express';
import studentService from '../services/student.service.js';
import { sendResponse } from '../../../utils/response.util.js';
import { sendStudentCredentialsEmail } from '../../../utils/mail.util.js';
import { authorizeAdmin } from '../../auth/middleware/auth.middleware.js';
import mongoose from 'mongoose';

const studentListAutoCompleteController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const query = req.body.query as string;
        const centerId = req.body.centerId as string;
        const result = await studentService.studentListAutoComplete({ query, centerId });
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Student list auto complete retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 404,
            status: false,
            message: error.message || 'Failed to retrieve student list auto complete',
            error: error.message
        });
    }
};

const addStudentController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            candidateName,
            motherName,
            fatherName,
            gender,
            dateOfBirth,    
            adharCardNo,
            category,
            areYouEmployed,
            employerName,
            designation,
            contactNumber,
            alternateNumber,
            emailAddress,
            currentAddress,
            permanentAddress,
            city,
            state,
            nationality,
            country,
            pincode,
            courseType,
            grade,
            course,
            stream,
            year,
            monthSession,
            hostelFacility,
            session,
            duration,
            courseFee,
            centerId,
        } = req.body;
        
        console.log('AddStudent Controller - req.user:', req.user);
        console.log('AddStudent Controller - user role:', req.user?.role);
        console.log('AddStudent Controller - user centerId:', req.user?.centerId);
        console.log('AddStudent Controller - request centerId:', centerId);
        
        // Security: Handle centerId based on user role
        let finalCenterId = centerId;
        if (req.user?.role === 'center') {
            // Centers can only add students to their own center
            if (req.user?.centerId) {
                finalCenterId = req.user.centerId;
                console.log('AddStudent Controller - Center user, using centerId from token:', finalCenterId);
            } else {
                console.log('AddStudent Controller - Center user but no centerId in token, using request centerId:', finalCenterId);
            }
        } else if (req.user?.role === 'admin') {
            // Admins can add students to any center (use centerId from request)
            console.log('AddStudent Controller - Admin user, using centerId from request:', finalCenterId);
        }
        
        console.log('AddStudent Controller - Final centerId:', finalCenterId);
        
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        const aadharFront = files?.adharCardFront?.[0];
        const aadharBack = files?.adharCardBack?.[0];
        const photo = files?.photo?.[0];
        const signature = files?.signature?.[0];
        const result = await studentService.addStudent({
            candidateName,
            motherName,
            fatherName,
            gender,
            dateOfBirth, adharCardNo, category, areYouEmployed, employerName, designation, contactNumber, alternateNumber, emailAddress, currentAddress, permanentAddress, city, state, nationality, country, pincode, courseType, grade, course, stream, year, monthSession, hostelFacility, session, duration, courseFee, aadharFront, aadharBack, photo, signature, centerId: finalCenterId
        });

        // Send login credentials email to student (non-blocking; do not fail request if mail fails)
        if (emailAddress?.trim()) {
            sendStudentCredentialsEmail({
                to: emailAddress.trim(),
                candidateName: candidateName || 'Student',
                registrationNo: result.registrationNo || '',
                dateOfBirth: dateOfBirth || '',
            }).catch(() => {});
        }

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: `Student added successfully with Registration Number: ${result.registrationNo}`,
            data: result
        });
    } catch (error: any) {
        console.log('AddStudent Controller - Error:', error);
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message:error.message || 'Failed to add student',
            error: error.message
        });
    }
};

const getStudentProfileController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.query;
        
        if (!registrationNo) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Registration number is required'
            });
        }
        
        const student = await studentService.getStudentProfile(registrationNo as string);
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Student found',
            data: student
        });
    } catch (error: any) {
        // Check if error is "Student not found" to return appropriate message
        const errorMessage = error.message || 'Failed to retrieve student profile';
        const isNotFound = errorMessage.includes('not found') || errorMessage.includes('Student not found');
        
        return sendResponse({
            res,
            statusCode: 404,
            status: false,
            message: isNotFound ? 'Student not found with this registration number' : errorMessage
        });
    }
};

const deleteStudentController = async (req: Request, res: Response) => {
    const { studentId } = req.params;
    try {
        const deleted = await studentService.deleteStudent(studentId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }
        return res.json({ success: true, message: "Student deleted successfully." });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteStudentByBodyController = async (req: Request, res: Response) => {
    const { studentId } = req.body;
    if (!studentId) {
        return res.status(400).json({ success: false, message: "Missing studentId in request body." });
    }
    try {
        const deleted = await studentService.deleteStudent(studentId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }
        return res.json({ success: true, message: "Student deleted successfully." });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const updateStudentController = async (req: Request, res: Response) => {
    try {
        const { studentId, ...updates } = req.body;
        if (!studentId) {
            return res.status(400).json({ success: false, message: 'studentId is required.' });
        }
        const updated = await studentService.updateStudent(studentId, updates);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }
        return res.json({ success: true, message: 'Student updated successfully.', student: updated });
    } catch (err: any) {
        const msg = err?.message || 'Internal server error';
        const code = (err as any)?.statusCode || 500;
        return res.status(code).json({ success: false, message: msg });
    }
};

const getStudentByIdFromBodyController = async (req: Request, res: Response) => {
    try {
        const { studentId, year, semester } = req.body;
        const user = req.user;
        
        // Validate studentId
        if (!studentId) {
            return res.status(400).json({ 
                status: false, 
                message: 'studentId is required.' 
            });
        }

        // Validate studentId format
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ 
                status: false, 
                message: 'Invalid student ID format.' 
            });
        }

        // Security check: If user is a student, they can only access their own data
        // if (user?.role === 'student') {
        //     // For students, userId in token is the studentId
        //     if (user.userId !== studentId) {
        //         return res.status(403).json({ 
        //             status: false, 
        //             message: 'Access denied. Students can only access their own data.' 
        //         });
        //     }
        // }

        // Get student with subjects filtered by year/semester
        const student = await studentService.getStudentById(studentId, year, semester);
        
        if (!student) {
            return res.status(404).json({ 
                status: false, 
                message: 'Student not found.' 
            });
        }

        return res.status(200).json({ 
            status: true, 
            message: 'Student details retrieved successfully',
            student 
        });
    } catch (err: any) {
        return res.status(500).json({ 
            status: false, 
            message: err.message || 'Internal server error. Please try again later.' 
        });
    }
};

export default { 
    studentListAutoCompleteController,
    addStudentController, 
    getStudentProfileController,
    deleteStudentController,
    deleteStudentByBodyController,
    updateStudentController,
    getStudentByIdFromBodyController
};
