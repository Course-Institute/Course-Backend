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

const getCenterProfile = async (centerId: string, baseUrl?: string): Promise<CenterModel | null> => {
    try {
        const center = await centerDal.getCenterByIdDal(centerId);
        if (!center) {
            return null;
        }

        // Format photo URLs to full URLs
        // Files are stored as just filenames (e.g., "photo-1234567890-987654321.jpg")
        // They need to be formatted as "/uploads/filename" for the API
        const formatUrl = (url?: string): string | undefined => {
            if (!url || url.trim() === '') return undefined;
            
            // If already a full URL (http/https), return as is
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            
            // Remove any leading slashes or "uploads/" prefix to normalize
            let cleanUrl = url.trim();
            if (cleanUrl.startsWith('/uploads/')) {
                cleanUrl = cleanUrl.replace('/uploads/', '');
            } else if (cleanUrl.startsWith('uploads/')) {
                cleanUrl = cleanUrl.replace('uploads/', '');
            } else if (cleanUrl.startsWith('/')) {
                cleanUrl = cleanUrl.substring(1);
            }
            
            // Format as /uploads/filename
            const formattedUrl = `/uploads/${cleanUrl}`;
            
            // If baseUrl is provided, prepend it to make full URL
            return baseUrl ? `${baseUrl}${formattedUrl}` : formattedUrl;
        };

        // Format all photo URLs in the center object
        const centerDetailsWithPhoto = center.centerDetails as any;
        const formattedCenter: any = {
            ...center,
            centerDetails: {
                ...center.centerDetails,
                ...(centerDetailsWithPhoto.photo && { photo: formatUrl(centerDetailsWithPhoto.photo) })
            },
            authorizedPersonDetails: {
                ...center.authorizedPersonDetails,
                photo: formatUrl(center.authorizedPersonDetails.photo)
            },
            infrastructureDetails: {
                ...center.infrastructureDetails,
                infraPhotos: center.infrastructureDetails.infraPhotos?.map(photo => formatUrl(photo) || photo)
            },
            bankDetails: {
                ...center.bankDetails,
                cancelledCheque: formatUrl(center.bankDetails.cancelledCheque)
            },
            documentUploads: {
                ...center.documentUploads,
                gstCertificate: formatUrl(center.documentUploads.gstCertificate),
                panCard: formatUrl(center.documentUploads.panCard),
                addressProof: formatUrl(center.documentUploads.addressProof),
                directorIdProof: formatUrl(center.documentUploads.directorIdProof)
            },
            declaration: {
                ...center.declaration,
                signatureUrl: formatUrl(center.declaration.signatureUrl)
            }
        };

        return formattedCenter;
    } catch (error) {
        console.log('Error in getCenterProfile service:', error);
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

const getDashboardStats = async (centerId: string) => {
    try {
        if (!centerId) {
            throw new Error('Center ID is required');
        }
        const stats = await centerDal.getDashboardStatsDal(centerId);
        return stats;
    } catch (error) {
        console.log('Error in getDashboardStats service:', error);
        throw error;
    }
};
export default { 
    centerListAutoComplete,
    createCenter,
    getCenterById,
    getCenterProfile,
    updateCenter,
    deleteCenter,
    searchCenters,
    updateCenterStatus,
    getDashboardStats
};