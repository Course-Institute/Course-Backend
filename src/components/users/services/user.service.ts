import bcrypt from "bcryptjs";
import userDal from "../dals/user.dal";

const registerAdmin = async ({name, email, password}: {name: string, email: string, password: string}) => {
    try {
        // Check if user already exists using DAL
        const existingUser = await userDal.checkUserExists(email);
        if (existingUser) {
            throw new Error('Admin with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create admin user using DAL
        const user = await userDal.createAdmin({
            name,
            email,
            password: hashedPassword
        });

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const addStudent = async ({
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
    aadharFront,
    aadharBack,
    photo,
    signature
}:{candidateName: string, motherName: string, fatherName: string, gender: string, dob: string, adharNumber: string, category: string, areYouEmployed: string, employerName: string, designation: string, contactNumber: string, alternateNumber: string, email: string, currentAddress: string, parmanentAddress: string, city: string, state: string, nationality: string, country: string, pincode: string, courseType: string, faculty: string, course: string, stream: string, year: string, monthSession: string, hostelFacility: string, session: string, duration: string, courseFee: string, aadharFront: Express.Multer.File, aadharBack: Express.Multer.File, photo: Express.Multer.File, signature: Express.Multer.File}) => {
    try {
        const student = await userDal.addStudentDal({
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
            aadharFront: aadharFront?.path || '', 
            aadharBack: aadharBack?.path || '', 
            photo: photo?.path || '', 
            signature: signature?.path || ''
        });
        return student;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default { registerAdmin, addStudent };