import studentDal from "../dals/student.dal.js";
import userDal from "../../users/dals/user.dal.js";
import bcrypt from "bcryptjs";

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
    faculty,
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
    signature
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
    faculty?: string, 
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
    signature?: Express.Multer.File
}) => {
    try {
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
            faculty, 
            course, 
            stream, 
            year, 
            monthSession, 
            hostelFacility, 
            session, 
            duration, 
            courseFee, 
            aadharFront: aadharFront?.path || '', 
            aadharBack: aadharBack?.path || '', 
            photo: photo?.path || '', 
            signature: signature?.path || ''
        });

        // Check if user with this email already exists
        const existingUser = await userDal.checkUserExists(emailAddress || '');
        if (existingUser) {
            console.log(`User with email ${emailAddress} already exists, skipping user creation`);
        } else {
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
        }
        
        // Return student data with registration number
        return {
            registrationNo: student.registrationNo,
            candidateName: student.candidateName,
            emailAddress: student.emailAddress,
            contactNumber: student.contactNumber,
            course: student.course,
            faculty: student.faculty,
            session: student.session,
            createdAt: student.createdAt
        };
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

export default { addStudent, getStudentProfile };
