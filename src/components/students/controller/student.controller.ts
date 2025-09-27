import { Request, Response } from 'express';
import studentService from '../services/student.service.js';

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
        } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        const aadharFront = files?.aadharCardFront?.[0];
        const aadharBack = files?.aadharCardBack?.[0];
        const photo = files?.photo?.[0];
        const signature = files?.signature?.[0];
        const result = await studentService.addStudent({
            candidateName,
            motherName,
            fatherName,
            gender,
            dateOfBirth, adharCardNo, category, areYouEmployed, employerName, designation, contactNumber, alternateNumber, emailAddress, currentAddress, permanentAddress, city, state, nationality, country, pincode, courseType, faculty, course, stream, year, monthSession, hostelFacility, session, duration, courseFee, aadharFront, aadharBack, photo, signature
        });
        return res.status(200).json({
            status: true,
            message: `Student added successfully with Registration Number: ${result.registrationNo}`,
            data: result
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Failed to add student',
            error: error.message
        });
    }
};

const getStudentProfileController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.query;
        
        if (!registrationNo) {
            return res.status(400).json({
                status: false,
                message: 'Registration number is required'
            });
        }
        
        const student = await studentService.getStudentProfile(registrationNo as string);
        
        return res.status(200).json({
            status: true,
            message: 'Student profile retrieved successfully',
            data: student
        });
    } catch (error: any) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Failed to retrieve student profile',
            error: error.message
        });
    }
};

export default { addStudentController, getStudentProfileController };
