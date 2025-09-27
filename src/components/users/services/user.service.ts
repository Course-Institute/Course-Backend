import bcrypt from "bcryptjs";
import userDal from "../dals/user.dal.js";

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


export default { registerAdmin };