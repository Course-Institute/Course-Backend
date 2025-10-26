import centerDal from '../dals/center.dal.js';
import centerHelper from '../helpers/center.helper.js';
import bcrypt from 'bcryptjs';
import { 
    CreateCenterRequest, 
    UpdateCenterRequest, 
    CenterSearchFilters,
    CenterModel 
} from '../models/center.model';
import userDal from '../../users/dals/user.dal.js';

const centerListAutoComplete = async ({query}:{query: string}) => {
    try {
        const centers = await centerDal.centerListAutoCompleteDal(query);
        
        // Transform the data to match frontend requirements
        const transformedData = centers.map(center => ({
            name: center.centerDetails.centerName,
            centerId: center._id.toString()
        }));
        return transformedData;
    } catch (error) {
        throw error;
    }
};

const createCenter = async (centerData: CreateCenterRequest): Promise<CenterModel> => {
    try {
        // Validate required fields
        centerHelper.validateCenterData(centerData);
        
        // Extract all email addresses from the center data
        const officialEmail = centerData.centerDetails.officialEmail;
        const authorizedPersonEmail = centerData.authorizedPersonDetails.email;
        const loginUsername = centerData.loginCredentials.username;
        
        // Check if official email already exists in any center (only check officialEmail field)
        const existingOfficialEmail = await centerDal.checkOfficialEmailExists(officialEmail);
        if (existingOfficialEmail) {
            throw new Error('Center with this official email already exists');
        }

        // Check if login username (email) already exists in users collection
        const existingUser = await userDal.checkUserExists(loginUsername);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create the center first
        const result = await centerDal.createCenterDal(centerData);
        
        // Create a user in the Users collection with role 'center'
        if (result && result.loginCredentials) {
            try {
                // Hash the password for the user
                const hashedPassword = await bcrypt.hash(result.loginCredentials.password, 12);
                
                // Create user in Users collection with role 'center'
                await userDal.createCenterUser({
                    name: result.authorizedPersonDetails.authName,
                    email: result.loginCredentials.username,
                    password: hashedPassword
                });
                
                console.log('Center user created successfully for:', result.centerDetails.centerName);
            } catch (userError) {
                console.error('Failed to create center user:', userError);
                // Don't throw error, just log it - center is still created
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