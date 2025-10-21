import centerDal from '../dals/center.dal.js';
import centerHelper from '../helpers/center.helper.js';
import { 
    CreateCenterRequest, 
    UpdateCenterRequest, 
    CenterSearchFilters,
    CenterModel 
} from '../models/center.model';

const centerListAutoComplete = async ({query}:{query: string}) => {
    try {
        const result = await centerDal.centerListAutoCompleteDal(query);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const createCenter = async (centerData: CreateCenterRequest): Promise<CenterModel> => {
    try {
        // Validate required fields
        centerHelper.validateCenterData(centerData);
        
        // Check if center with same email already exists
        const existingCentersResult = await centerDal.getAllCentersDal({ 
            query: centerData.centerDetails.officialEmail, 
            limit: 1, 
            pageNumber: 1 
        });
        const emailExists = existingCentersResult.centers.some(center => 
            center.centerDetails.officialEmail === centerData.centerDetails.officialEmail
        );
        
        if (emailExists) {
            throw new Error('Center with this email already exists');
        }

        // Check if authorized person email already exists
        const existingAuthorizedPersonResult = await centerDal.getAllCentersDal({ 
            query: centerData.authorizedPersonDetails.email, 
            limit: 1, 
            pageNumber: 1 
        });
        const usernameExists = existingAuthorizedPersonResult.centers.some(center => 
            center.authorizedPersonDetails.email === centerData.authorizedPersonDetails.email
        );
        
        if (usernameExists) {
            throw new Error('Authorized person email already exists');
        }

        const result = await centerDal.createCenterDal(centerData);
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