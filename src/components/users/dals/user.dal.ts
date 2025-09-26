import { UserModel } from "../models/user.model";

interface RegisterAdminData {
    name: string;
    email: string;
    password: string;
}

const findUserByEmail = async (email: string): Promise<any> => {
        try {
            return await UserModel.findOne({ email }).lean();
        } catch (error) {
            throw error;
        }
    }

const findUserById = async (userId: string): Promise<any> => {
        try {
            return await UserModel.findById(userId).select('-password').lean();
        } catch (error) {
            throw error;
        }
    }

const createAdmin = async (data: RegisterAdminData): Promise<any> => {
        try {
            return await UserModel.create({
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'admin'
            });
        } catch (error) {
            throw error;
        }
    }

const findAdminById = async (userId: string): Promise<any> => {
        try {
            return await UserModel.findById(userId).select('-password').lean();
        } catch (error) {
            throw error;
        }
    }

const checkUserExists = async (email: string): Promise<any> => {
        try {
            return await UserModel.findOne({ email }).lean();
        } catch (error) {
            throw error;
        }
    }

    const addStudentDal = async ({
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
    }:{candidateName: string, motherName: string, fatherName: string, gender: string, dob: string, adharNumber: string, category: string, areYouEmployed: string, employerName: string, designation: string, contactNumber: string, alternateNumber: string, email: string, currentAddress: string, parmanentAddress: string, city: string, state: string, nationality: string, country: string, pincode: string, courseType: string, faculty: string, course: string, stream: string, year: string, monthSession: string, hostelFacility: string, session: string, duration: string, courseFee: string, aadharFront: string, aadharBack: string, photo: string, signature: string}): Promise<any> => {
        try {
            return await UserModel.create({
                candidateName: candidateName,
                motherName: motherName,
                fatherName: fatherName,
                gender: gender,
                dob: dob,
                adharNumber: adharNumber,
                category: category,
                areYouEmployed: areYouEmployed,
                employerName: employerName,
                designation: designation,
                contactNumber: contactNumber,
                alternateNumber: alternateNumber,
                email: email,
                currentAddress: currentAddress,
                parmanentAddress: parmanentAddress,
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

    export default { 
        findUserByEmail,
        findUserById,
        createAdmin,
        findAdminById,
        checkUserExists,
        addStudentDal
    }