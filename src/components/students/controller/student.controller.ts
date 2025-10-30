import { Request, Response } from 'express';
import studentService from '../services/student.service.js';
import { sendResponse } from '../../../utils/response.util.js';

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
            faculty,
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
            dateOfBirth, adharCardNo, category, areYouEmployed, employerName, designation, contactNumber, alternateNumber, emailAddress, currentAddress, permanentAddress, city, state, nationality, country, pincode, courseType, faculty, course, stream, year, monthSession, hostelFacility, session, duration, courseFee, aadharFront, aadharBack, photo, signature, centerId: finalCenterId
        });
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

export default { 
    studentListAutoCompleteController,
    addStudentController, 
    getStudentProfileController 
};
