import { Request, Response } from 'express';
import studentService from '../services/student.service';

const addStudentController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { 
            candidateName,
            motherName,
            fatherName,
            gender,
            dob,
            adharNumber,
            category,
            areYouEmployed,
            employerName,
            designation,
            contactNumber,
            alternateNumber,
            email,
            currentAddress,
            parmanentAddress,
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
        const files = req.files as Express.Multer.File[];
        const [aadharFront, aadharBack, photo, signature] = files || [];
        const result = await studentService.addStudent({
            candidateName,
            motherName,
            fatherName,
            gender,
            dob, adharNumber, category, areYouEmployed, employerName, designation, contactNumber, alternateNumber, email, currentAddress, parmanentAddress, city, state, nationality, country, pincode, courseType, faculty, course, stream, year, monthSession, hostelFacility, session, duration, courseFee, aadharFront, aadharBack, photo, signature
        });
        return res.status(200).json({
            status: true,
            message: 'Student added successfully',
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

export default { addStudentController };
