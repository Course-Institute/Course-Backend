import centerDal from '../dals/center.dal.js';
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
        validateCenterData(centerData);
        
        // Check if center with same email already exists
        const existingCenters = await centerDal.getAllCentersDal();
        const emailExists = existingCenters.some(center => 
            center.centerDetails.officialEmailId === centerData.centerDetails.officialEmailId
        );
        
        if (emailExists) {
            throw new Error('Center with this email already exists');
        }

        // Check if username already exists
        const usernameExists = existingCenters.some(center => 
            center.loginCredentials.username === centerData.loginCredentials.username
        );
        
        if (usernameExists) {
            throw new Error('Username already exists');
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
        validateUpdateCenterData(updateData);
        
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

const getAllCenters = async (): Promise<CenterModel[]> => {
    try {
        const result = await centerDal.getAllCentersDal();
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

// Validation helper functions
const validateCenterData = (data: CreateCenterRequest): void => {
    const { centerDetails, authorizedPersonDetails, infrastructureDetails, bankDetails, loginCredentials, declaration } = data;

    // Validate center details
    if (!centerDetails.centerName?.trim()) {
        throw new Error('Center name is required');
    }
    if (!centerDetails.centerType?.trim()) {
        throw new Error('Center type is required');
    }
    if (!centerDetails.yearOfEstablishment || centerDetails.yearOfEstablishment < 1900 || centerDetails.yearOfEstablishment > new Date().getFullYear()) {
        throw new Error('Valid year of establishment is required');
    }
    if (!centerDetails.fullAddress?.trim()) {
        throw new Error('Full address is required');
    }
    if (!centerDetails.city?.trim()) {
        throw new Error('City is required');
    }
    if (!centerDetails.state?.trim()) {
        throw new Error('State is required');
    }
    if (!centerDetails.pinCode?.trim() || !/^\d{6}$/.test(centerDetails.pinCode)) {
        throw new Error('Valid 6-digit PIN code is required');
    }
    if (!centerDetails.officialEmailId?.trim() || !isValidEmail(centerDetails.officialEmailId)) {
        throw new Error('Valid official email is required');
    }
    if (!centerDetails.primaryContactNo?.trim() || !isValidPhoneNumber(centerDetails.primaryContactNo)) {
        throw new Error('Valid primary contact number is required');
    }

    // Validate authorized person details
    if (!authorizedPersonDetails.name?.trim()) {
        throw new Error('Authorized person name is required');
    }
    if (!authorizedPersonDetails.designation?.trim()) {
        throw new Error('Designation is required');
    }
    if (!authorizedPersonDetails.contactNo?.trim() || !isValidPhoneNumber(authorizedPersonDetails.contactNo)) {
        throw new Error('Valid contact number is required');
    }
    if (!authorizedPersonDetails.emailId?.trim() || !isValidEmail(authorizedPersonDetails.emailId)) {
        throw new Error('Valid email ID is required');
    }
    if (!authorizedPersonDetails.aadhaarIdProofNo?.trim()) {
        throw new Error('Aadhaar/ID proof number is required');
    }

    // Validate infrastructure details
    if (!infrastructureDetails.numberOfClassrooms || infrastructureDetails.numberOfClassrooms < 0) {
        throw new Error('Valid number of classrooms is required');
    }
    if (!infrastructureDetails.numberOfComputers || infrastructureDetails.numberOfComputers < 0) {
        throw new Error('Valid number of computers is required');
    }
    if (infrastructureDetails.seatingCapacity === undefined || infrastructureDetails.seatingCapacity < 0) {
        throw new Error('Valid seating capacity is required');
    }

    // Validate bank details
    if (!bankDetails.bankName?.trim()) {
        throw new Error('Bank name is required');
    }
    if (!bankDetails.accountHolderName?.trim()) {
        throw new Error('Account holder name is required');
    }
    if (!bankDetails.accountNumber?.trim()) {
        throw new Error('Account number is required');
    }
    if (!bankDetails.ifscCode?.trim() || !isValidIFSC(bankDetails.ifscCode)) {
        throw new Error('Valid IFSC code is required');
    }
    if (!bankDetails.branchName?.trim()) {
        throw new Error('Branch name is required');
    }

    // Validate login credentials
    if (!loginCredentials.username?.trim()) {
        throw new Error('Username is required');
    }
    if (!loginCredentials.password?.trim() || loginCredentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    if (loginCredentials.password !== loginCredentials.confirmPassword) {
        throw new Error('Password and confirm password do not match');
    }

    // Validate declaration
    if (!declaration.declaration) {
        throw new Error('Declaration must be accepted');
    }
}

const validateUpdateCenterData = (data: UpdateCenterRequest): void => {
    // Validate email format if provided
    if (data.centerDetails?.officialEmailId && !isValidEmail(data.centerDetails.officialEmailId)) {
        throw new Error('Valid official email is required');
    }
    
    // Validate phone numbers if provided
    if (data.centerDetails?.primaryContactNo && !isValidPhoneNumber(data.centerDetails.primaryContactNo)) {
        throw new Error('Valid primary contact number is required');
    }
    
    if (data.authorizedPersonDetails?.contactNo && !isValidPhoneNumber(data.authorizedPersonDetails.contactNo)) {
        throw new Error('Valid contact number is required');
    }
    
    if (data.authorizedPersonDetails?.emailId && !isValidEmail(data.authorizedPersonDetails.emailId)) {
        throw new Error('Valid email ID is required');
    }
    
    // Validate PIN code if provided
    if (data.centerDetails?.pinCode && !/^\d{6}$/.test(data.centerDetails.pinCode)) {
        throw new Error('Valid 6-digit PIN code is required');
    }
    
    // Validate IFSC code if provided
    if (data.bankDetails?.ifscCode && !isValidIFSC(data.bankDetails.ifscCode)) {
        throw new Error('Valid IFSC code is required');
    }
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

const isValidIFSC = (ifsc: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
}

export default { 
    centerListAutoComplete,
    createCenter,
    getCenterById,
    updateCenter,
    deleteCenter,
    searchCenters,
    getAllCenters,
    updateCenterStatus
};