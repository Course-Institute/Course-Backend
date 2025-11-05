import studentDal from "../dals/student.dal.js";
import userDal from "../../users/dals/user.dal.js";
import bcrypt from "bcryptjs";
import { IStudent } from "../model/student.model.js";
import mongoose from "mongoose";
import { StudentModel } from "../model/student.model.js";

const studentListAutoComplete = async ({ query, centerId }: { query: string, centerId: string }) => {
    try {
        const students = await studentDal.studentListAutoCompleteDal({query, centerId});
        
        // Transform the data to match frontend requirements
        const transformedData = students.map(student => ({
            studentName: `${student.candidateName}(Father: ${ student.fatherName}, Reg No.: ${student.registrationNo})`,
            studentId: student._id.toString()

        }));
        return transformedData;
    } catch (error) {
        throw error;
    }
};

const addStudent = async ({
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
    aadharFront,
    aadharBack,
    photo,
    signature,
    centerId
}:{
    candidateName?: string, 
    motherName?: string, 
    fatherName?: string, 
    gender?: string, 
    dateOfBirth?: string, 
    adharCardNo?: string, 
    category?: string, 
    areYouEmployed?: string, 
    employerName?: string, 
    designation?: string, 
    contactNumber?: string, 
    alternateNumber?: string, 
    emailAddress?: string, 
    currentAddress?: string, 
    permanentAddress?: string, 
    city?: string, 
    state?: string, 
    nationality?: string, 
    country?: string, 
    pincode?: string, 
    courseType?: string, 
    grade?: string, 
    course?: string, 
    stream?: string, 
    year?: string, 
    monthSession?: string, 
    hostelFacility?: string, 
    session?: string, 
    duration?: string, 
    courseFee?: string, 
    aadharFront?: Express.Multer.File, 
    aadharBack?: Express.Multer.File, 
    photo?: Express.Multer.File, 
    signature?: Express.Multer.File,
    centerId?: string
}): Promise<IStudent> => {
    try {
        // Check if user with this email already exists
        const existingUser = await userDal.checkUserExists(emailAddress || '');
        if (existingUser) {
            // Send error back, don't add student entry
            const err = new Error(`Student with email ${emailAddress} already exists`);
            // Optionally, use custom error types/codes
            (err as any).code = 'USER_ALREADY_EXISTS';
            throw err;
        }

        // Create student record
        const student = await studentDal.addStudentDal({
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
            aadharFront: aadharFront?.filename ? `/uploads/${aadharFront.filename}` : '', 
            aadharBack: aadharBack?.filename ? `/uploads/${aadharBack.filename}` : '', 
            photo: photo?.filename ? `/uploads/${photo.filename}` : '', 
            signature: signature?.filename ? `/uploads/${signature.filename}` : '',
            centerId: centerId
        });

        // Generate a default password for the student (can be changed later)
        const defaultPassword = await bcrypt.hash(student.registrationNo || '123456', 12);

        // Create user record for the student
        await userDal.createStudentUser({
            name: candidateName || '',
            email: emailAddress || '',
            password: defaultPassword,
            dob: dateOfBirth || '',
            registrationNo: student.registrationNo || ''
        });
        
        // Return student data with registration number
        return {
            registrationNo: student.registrationNo,
            candidateName: student.candidateName,
            emailAddress: student.emailAddress,
            contactNumber: student.contactNumber,
            course: student.course,
            grade: student.grade,
            session: student.session,
            createdAt: student.createdAt
        } as IStudent;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getStudentProfile = async (registrationNo: string) => {
    try {
        const student = await studentDal.getStudentProfileByRegistrationNo(registrationNo);
        
        if (!student) {
            throw new Error('Student not found with the provided registration number');
        }
        
        return student;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteStudent = async (studentId: string): Promise<boolean> => {
    try {
        // Remove from students collection
        const deletedStudent = await studentDal.findStudentById(studentId); // "deletedStudent" may be null
        if (!deletedStudent) return false;
        await StudentModel.findByIdAndDelete(studentId);
        // Remove from users collection by registrationNo if present
        if (deletedStudent.registrationNo) {
            await userDal.deleteUserByRegistrationNo(deletedStudent.registrationNo);
        }
        return true;
    } catch (err) {
        throw err;
    }
};

const updateStudent = async (studentId: string, updates: Record<string, any>) => {
    try {
        const allowed = new Set([
            'candidateName','motherName','fatherName','dateOfBirth','gender',
            'contactNumber','emailAddress','faculty','course','stream','year','session',
            'centerId','centerName','centerCode',
            'isApprovedByAdmin','isMarksheetGenerated','isMarksheetAndCertificateApproved'
        ]);
        const safeUpdates: Record<string, any> = {};
        for (const [k, v] of Object.entries(updates)) {
            if (allowed.has(k)) safeUpdates[k] = v;
        }
        if (Object.keys(safeUpdates).length === 0) {
            const err = new Error('No valid fields to update.');
            (err as any).statusCode = 400;
            throw err;
        }
        const updated = await StudentModel.findByIdAndUpdate(
            studentId,
            { $set: safeUpdates },
            { new: true }
        );
        return updated;
    } catch (err) {
        throw err;
    }
};

const getStudentById = async (studentId: string) => {
    try {
        const student = await studentDal.findStudentById(studentId);
        return student;
    } catch (error) {
        throw error;
    }
};

export default { 
    studentListAutoComplete,
    addStudent, 
    getStudentProfile, 
    deleteStudent,
    updateStudent,
    getStudentById
};
