
import { 
  CenterModel, 
  CreateCenterRequest, 
  UpdateCenterRequest, 
  CenterSearchFilters,
  CenterListResponse, 
  ICenter,
} from '../models/center.model.js';

// In-memory storage for demo purposes - replace with actual database operations
let centersStorage: CenterModel[] = [];

const centerListAutoCompleteDal = async (query: string) => {
  try {
    const limit = 20;

    // Build filter condition
    let filter = {};
    if (query && query.trim()) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special chars
      const regex = new RegExp(escapedQuery, "i"); // Case-insensitive search

      filter = {
        $or: [
          { "centerDetails.centerName": regex },
          { "centerDetails.centerCode": regex },
          { "centerDetails.city": regex },
          { "centerDetails.state": regex },
        ],
      };
    }

    // Query MongoDB
    const centers = await CenterModel.find(filter).select('centerDetails.centerName centerDetails.centerCode _id')
      .limit(limit)
      .lean();

    return centers;
  } catch (error) {
    console.error("Error in centerListAutoCompleteDal:", error);
    throw error;
  }
};


const createCenterDal = async (centerData: CreateCenterRequest): Promise<CenterModel> => {
  try {

    // Generate unique ID
    centerData.centerDetails.centerCode = `MIV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`; //generates a random 5 digit number
    
    const newCenter: CenterModel = {
      centerDetails: centerData.centerDetails,
      authorizedPersonDetails: centerData.authorizedPersonDetails,
      infrastructureDetails: centerData.infrastructureDetails,
      bankDetails: centerData.bankDetails,
      documentUploads: centerData.documentUploads,
      declaration: centerData.declaration,
      loginCredentials: centerData.loginCredentials,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return await CenterModel.create(newCenter);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCenterByIdDal = async (centerId: string): Promise<CenterModel | null> => {
  try {
    const center = centersStorage.find(c => c.id === centerId);
    return center || null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateCenterDal = async (centerId: string, updateData: UpdateCenterRequest): Promise<CenterModel | null> => {
  try {
    const centerIndex = centersStorage.findIndex(c => c.id === centerId);
    if (centerIndex === -1) {
      return null;
    }

    const existingCenter = centersStorage[centerIndex];
    const updatedCenter: CenterModel = {
      ...existingCenter,
      centerDetails: { ...existingCenter.centerDetails, ...updateData.centerDetails },
      authorizedPersonDetails: { ...existingCenter.authorizedPersonDetails, ...updateData.authorizedPersonDetails },
      infrastructureDetails: { ...existingCenter.infrastructureDetails, ...updateData.infrastructureDetails },
      bankDetails: { ...existingCenter.bankDetails, ...updateData.bankDetails },
      documentUploads: { ...existingCenter.documentUploads, ...updateData.documentUploads },
      declaration: { ...existingCenter.declaration, ...updateData.declaration },
      id: centerId,
      updatedAt: new Date()
    };

    centersStorage[centerIndex] = updatedCenter;
    return updatedCenter;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteCenterDal = async (centerId: string): Promise<boolean> => {
  try {
    const centerIndex = centersStorage.findIndex(c => c.id === centerId);
    if (centerIndex === -1) {
      return false;
    }

    centersStorage.splice(centerIndex, 1);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const searchCentersDal = async (filters: CenterSearchFilters): Promise<CenterListResponse> => {
  try {
    let filteredCenters = [...centersStorage];

    // Apply filters
    if (filters.centerName) {
      filteredCenters = filteredCenters.filter(center =>
        center.centerDetails.centerName.toLowerCase().includes(filters.centerName!.toLowerCase())
      );
    }

    if (filters.centerType) {
      filteredCenters = filteredCenters.filter(center =>
        center.centerDetails.centerType === filters.centerType
      );
    }

    if (filters.city) {
      filteredCenters = filteredCenters.filter(center =>
        center.centerDetails.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.state) {
      filteredCenters = filteredCenters.filter(center =>
        center.centerDetails.state.toLowerCase().includes(filters.state!.toLowerCase())
      );
    }

    if (filters.status) {
      filteredCenters = filteredCenters.filter(center =>
        center.status === filters.status
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const totalCount = filteredCenters.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const centers = filteredCenters.slice(startIndex, endIndex);

    return {
      centers,
      totalCount,
      currentPage: page,
      totalPages
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllCentersDal = async ({ 
  query, 
  limit = 10, 
  pageNumber = 1, 
  skip = 0
}: { 
  query?: string; 
  limit?: number; 
  pageNumber?: number; 
  skip?: number;
}): Promise<{ centers: ICenter[]; totalCount: number; hasMore: boolean, totalPages: number }> => {
  try {
    // Build filter object for MongoDB query
    const filter: any = {};
    
    // Handle search query with regex across multiple fields
    if (query) {
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
      const regexSearch = new RegExp(escapedQuery, 'i');
      
      filter.$or = [
        { 'centerDetails.centerName': regexSearch },
        { 'centerDetails.centerCode': regexSearch },
        { 'centerDetails.centerType': regexSearch },
        { 'centerDetails.city': regexSearch },
        { 'centerDetails.state': regexSearch },
        { 'centerDetails.pinCode': regexSearch },
        { 'centerDetails.officialEmailId': regexSearch },
        { 'authorizedPersonDetails.name': regexSearch },
        { 'authorizedPersonDetails.emailId': regexSearch },
        { 'status': regexSearch } // Also search in status field
      ];
    }
    
    // Calculate skip value for infinite scroll
    const calculatedSkip = skip || (pageNumber - 1) * limit;
    
    // Get total count for pagination info
    const totalCount = await CenterModel.countDocuments(filter);
    
    // Fetch centers with pagination
    const centersList = await CenterModel.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(calculatedSkip)
      .limit(limit)
      .lean();
    
    // Check if there are more records
    const hasMore = calculatedSkip + centersList.length < totalCount;
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      centers: centersList,
      totalCount,
      hasMore,
      totalPages
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateCenterStatusDal = async (centerId: string, status: 'pending' | 'approved' | 'rejected'): Promise<CenterModel | null> => {
  try {
    const centerIndex = centersStorage.findIndex(c => c.id === centerId);
    if (centerIndex === -1) {
      return null;
    }

    centersStorage[centerIndex].status = status;
    centersStorage[centerIndex].updatedAt = new Date();

    return centersStorage[centerIndex];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { 
  centerListAutoCompleteDal,
  createCenterDal,
  getCenterByIdDal,
  updateCenterDal,
  deleteCenterDal,
  searchCentersDal,
  getAllCentersDal,
  updateCenterStatusDal
};
