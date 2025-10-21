
import centerData from '../api/center.json' with { type: 'json' };
import { 
  CenterModel, 
  CreateCenterRequest, 
  UpdateCenterRequest, 
  CenterSearchFilters,
  CenterListResponse 
} from '../models/center.model';

// In-memory storage for demo purposes - replace with actual database operations
let centersStorage: CenterModel[] = [];

const centerListAutoCompleteDal = async (query: string) => {
  try {
    const limit = 20;
    // If no query provided, return all centers
    if (!query || query.trim() === "") {
      return centerData
        .slice(0, limit)
        .map((center) => ({ name: center.centerName, centerId: center.id }));
    }

    // Filter centers by name (case-insensitive)
    const filteredCenters = centerData
      .slice(0, limit)
      .filter((center) =>
        center.centerName.toLowerCase().includes(query.toLowerCase())
      );

    // Return only the name field as expected by the API
    return filteredCenters
      .slice(0, limit)
      .map((center) => ({ name: center.centerName, centerId: center.id }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createCenterDal = async (centerData: CreateCenterRequest): Promise<CenterModel> => {
  try {
    // Validate password confirmation
    if (centerData.loginCredentials.password !== centerData.loginCredentials.confirmPassword) {
      throw new Error('Password and confirm password do not match');
    }

    // Generate unique ID
    const id = `center_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newCenter: CenterModel = {
      id,
      centerDetails: centerData.centerDetails,
      authorizedPersonDetails: centerData.authorizedPersonDetails,
      infrastructureDetails: centerData.infrastructureDetails,
      bankDetails: centerData.bankDetails,
      documentUploads: centerData.documentUploads,
      loginCredentials: centerData.loginCredentials,
      declaration: centerData.declaration,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    centersStorage.push(newCenter);
    return newCenter;
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

const getAllCentersDal = async (): Promise<CenterModel[]> => {
  try {
    return centersStorage;
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
