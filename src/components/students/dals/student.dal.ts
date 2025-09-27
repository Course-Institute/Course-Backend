import { UserModel } from "../../users/models/user.model.js";
import { StudentModel } from "../model/student.model.js";

// Function to generate unique 12-digit registration number
const generateRegistrationNumber = async (): Promise<string> => {
    let registrationNo: string;
    let isUnique = false;
    
    while (!isUnique) {
        // Generate 12-digit number
        registrationNo = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        
        // Check if this registration number already exists
        const existingStudent = await StudentModel.findOne({ registrationNo });
        if (!existingStudent) {
            isUnique = true;
        }
    }
    
    return registrationNo!;
};

const addStudentDal = async ({
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
    aadharFront?: string, 
    aadharBack?: string, 
    photo?: string, 
    signature?: string
}): Promise<any> => {
    try {
        // Generate unique registration number
        const registrationNo = await generateRegistrationNumber();
        
        return await StudentModel.create({
            registrationNo: registrationNo,
            candidateName: candidateName,
            motherName: motherName,
            fatherName: fatherName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            adharCardNo: adharCardNo,
            category: category,
            areYouEmployed: areYouEmployed,
            employerName: employerName,
            designation: designation,
            contactNumber: contactNumber,
            alternateNumber: alternateNumber,
            emailAddress: emailAddress,
            currentAddress: currentAddress,
            permanentAddress: permanentAddress,
            city: city,
            state: state,
            nationality: nationality,
            country: country,
            pincode: pincode,
            courseType: courseType,
            faculty: faculty,
            course: course,
            stream: stream,
            year: year,
            monthSession: monthSession,
            hostelFacility: hostelFacility,
            session: session,
            duration: duration,
            courseFee: courseFee,
            aadharFront: aadharFront,
            aadharBack: aadharBack,
            photo: photo,
            signature: signature
        });
    } catch (error) {
        throw error;
    }
};

const findStudentByRegistrationNo = async (registrationNo: string): Promise<any> => {
    try {
        const student = await UserModel.findOne({ registrationNo: registrationNo }).lean();
        console.log(student);
        return student;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getStudentProfileByRegistrationNo = async (registrationNo: string): Promise<any> => {
    try {
        
        // Check for the specific student
        const student = await StudentModel.findOne({ registrationNo: registrationNo }).lean();
        return student;
    } catch (error) {
        console.log('Error in getStudentProfileByRegistrationNo:', error);
        throw error;
    }
};

export default { 
    addStudentDal,
    findStudentByRegistrationNo,
    getStudentProfileByRegistrationNo
};
