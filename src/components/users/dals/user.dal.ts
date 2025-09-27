import { UserModel } from "../models/user.model.js";

interface RegisterAdminData {
    name: string;
    email: string;
    password: string;
}

interface CreateStudentUserData {
    name: string;
    email: string;
    password: string;
    dob: string;
    registrationNo: string;
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

const createStudentUser = async (data: CreateStudentUserData): Promise<any> => {
        try {
            return await UserModel.create({
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'student',
                dob: data.dob,
                registrationNo: data.registrationNo
            });
        } catch (error) {
            throw error;
        }
    }


export default { 
        findUserByEmail,
        findUserById,
        createAdmin,
        findAdminById,
        checkUserExists,
        createStudentUser
}