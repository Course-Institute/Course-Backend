import centerDal from '../dals/center.dal.js';
import centerHelper from '../helpers/center.helper.js';
import userDal from '../../users/dals/user.dal.js';
import bcrypt from 'bcryptjs';
import { 
    CreateCenterRequest, 
    UpdateCenterRequest, 
    CenterSearchFilters,
    CenterModel 
} from '../models/center.model';

const centerListAutoComplete = async ({query}:{query: string}) => {
    try {
        const centers = await centerDal.centerListAutoCompleteDal(query);
        
        // Transform the data to match frontend requirements
        const transformedData = centers.map(center => ({
            id: center._id.toString(),
            name: center.centerDetails.centerName,
            centerId: center.centerDetails.centerCode
        }));

        return transformedData;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const createCenter = async (centerData: CreateCenterRequest): Promise<CenterModel> => {
    try {
        // Validate required fields
        centerHelper.validateCenterData(centerData);
        
        // Extract all email addresses from the center data
        const officialEmail = centerData.centerDetails.officialEmail;
        const authorizedPersonEmail = centerData.authorizedPersonDetails.email;
        const loginUsername = centerData.loginCredentials.username;
        
        // Check if any email is used in multiple fields within the same registration
        const emails = [officialEmail, authorizedPersonEmail, loginUsername];
        const uniqueEmails = [...new Set(emails)];
        if (emails.length !== uniqueEmails.length) {
            throw new Error('Same email cannot be used in multiple fields (official email, authorized person email, and login username must be unique)');
        }
        
        // Check if official email already exists in any center
        const existingOfficialEmail = await centerDal.checkEmailExists(officialEmail);
        if (existingOfficialEmail) {
            throw new Error('Center with this official email already exists');
        }

        // Check if authorized person email already exists in any center
        const existingAuthorizedEmail = await centerDal.checkEmailExists(authorizedPersonEmail);
        if (existingAuthorizedEmail) {
            throw new Error('Authorized person email already exists in another center');
        }

        // Check if login username already exists in any center
        const existingLoginUsername = await centerDal.checkEmailExists(loginUsername);
        if (existingLoginUsername) {
            throw new Error('Login username already exists in another center');
        }

        // Check if any of these emails already exist in users collection
        for (const email of emails) {
            const existingUser = await userDal.checkUserExists(email);
            if (existingUser) {
                throw new Error(`User with email ${email} already exists`);
            }
        }

        // Create the center first
        const result = await centerDal.createCenterDal(centerData);
        
        // Create user account for the center using loginCredentials
        if (result && result.loginCredentials) {
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(result.loginCredentials.password, 12);
                
                // Create user with center role
                await userDal.createCenterUser({
                    name: result.authorizedPersonDetails.authName,
                    email: result.authorizedPersonDetails.email,
                    password: hashedPassword
                });
                
                console.log('User account created successfully for center:', result.centerDetails.centerName);
            } catch (userError) {
                console.error('Failed to create user account for center:', userError);
                // Optionally, you might want to delete the created center if user creation fails
                // await centerDal.deleteCenterDal(result.id);
                // throw new Error('Failed to create user account for center');
            }
        }

        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getCenterById = async (centerId: string): Promise<CenterModel | null> => {
    try {
        const result = await centerDal.getCenterByIdDal(centerId);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateCenter = async (centerId: string, updateData: UpdateCenterRequest): Promise<CenterModel | null> => {
    try {
        // Validate update data
        centerHelper.validateUpdateCenterData(updateData);
        
        const result = await centerDal.updateCenterDal(centerId, updateData);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const deleteCenter = async (centerId: string): Promise<boolean> => {
    try {
        const result = await centerDal.deleteCenterDal(centerId);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const searchCenters = async (filters: CenterSearchFilters) => {
    try {
        const result = await centerDal.searchCentersDal(filters);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


const updateCenterStatus = async (centerId: string, status: 'pending' | 'approved' | 'rejected'): Promise<CenterModel | null> => {
    try {
        const result = await centerDal.updateCenterStatusDal(centerId, status);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export default { 
    centerListAutoComplete,
    createCenter,
    getCenterById,
    updateCenter,
    deleteCenter,
    searchCenters,
    updateCenterStatus
};