import { Request, Response } from 'express';
import studentService from '../services/student.service.js';
import { sendResponse } from '../../../utils/response.util.js';

const studentListAutoCompleteController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const query = req.query.query as string;
        const result = await studentService.studentListAutoComplete({ query });
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
            dateOfBirth, adharCardNo, category, areYouEmployed, employerName, designation, contactNumber, alternateNumber, emailAddress, currentAddress, permanentAddress, city, state, nationality, country, pincode, courseType, faculty, course, stream, year, monthSession, hostelFacility, session, duration, courseFee, aadharFront, aadharBack, photo, signature, centerId
        });
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: `Student added successfully with Registration Number: ${result.registrationNo}`,
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message:'Failed to add student',
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
            message: 'Student profile retrieved successfully',
            data: student
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 404,
            status: false,
            message:'Failed to retrieve student profile',
            error: error.message
        });
    }
};

export default { 
    studentListAutoCompleteController,
    addStudentController, 
    getStudentProfileController 
};
