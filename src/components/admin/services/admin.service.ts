import { IStudent } from '../../students/model/student.model.js';
import adminDal from '../dals/admin.dal.js';
import centerService from '../../centers/services/center.service.js';
import { CreateCenterRequest, CenterModel } from '../../centers/models/center.model.js';
import centerDal from '../../centers/dals/center.dal.js';
import studentDal from '../../students/dals/student.dal.js';

const listAllStudents = async ({
    page = 1,
    limit = 10,
    search,
    faculty,
    course,
    session
}: {
    page?: number;
    limit?: number;
    search?: string;
    faculty?: string;
    course?: string;
    session?: string;
}) => {
    try {
        const result = await studentDal.getAllStudents({
            page,
            limit,
            search,
            faculty,
            course,
            session
        });

        return result;
    } catch (error) {
        console.log('Error in listAllStudents service:', error);
        throw error;
    }
};

const getStudentDetails = async (registrationNo: string) => {
    try {
        const student = await studentDal.getStudentByRegistrationNo(registrationNo);

        if (!student) {
            throw new Error('Student not found with the provided registration number');
        }

        return student;
    } catch (error) {
        console.log('Error in getStudentDetails service:', error);
        throw error;
    }
};

const getDashboardData = async () => {
    try {
        const dashboardData = await adminDal.getDashboardStatistics();
        return dashboardData;
    } catch (error) {
        console.log('Error in getDashboardData service:', error);
        throw error;
    }
};

const approveStudentService = async (
    {
        registrationNo
    }: {
        registrationNo: string
    }): Promise<{
        status: boolean,
        message: string,
        data: IStudent | null
    }> => {
    try {
        const updatedStudent = await studentDal.approveStudentDal({ registrationNo });
        return {
            status: true,
            message: "Student approved successfully",
            data: updatedStudent.data
        };
    } catch (error) {
        console.error(error, "Failed to approve student | service");
        return {
            status: false,
            message: `${error} | Failed to approve student | service `,
            data: null
        }
    }
}

const registerCenterService = async (centerData: CreateCenterRequest): Promise<CenterModel> => {
    try {
        // Admin is registering the center, so we can set status to approved by default
        const result = await centerService.createCenter(centerData);
        
        // Update the status to approved since admin is registering it
        if (result.id) {
            await centerService.updateCenterStatus(result.id, 'approved');
            result.status = 'approved';
        }
        
        return result;
    } catch (error) {
        console.log('Error in registerCenterService:', error);
        throw error;
    }
};

const getAllCentersService = async ({
  query,
  limit,
  pageNumber,
}: {
  query?: string;
  limit?: number;
  pageNumber?: number;
}) => {
  try {
    const skip = ((pageNumber || 1) - 1) * (limit || 10);
    const result = await centerDal.getAllCentersDal({
      query,
      limit,
      pageNumber,
      skip,
    });
    return result;
  } catch (error) {
    console.log("Error in getAllCentersService:", error);
    throw error;
  }
};

const approveStudentMarksheetService = async (registrationNo: string): Promise<{
    status: boolean,
    message: string,
    data: IStudent | null
}> => {
    try {
        const updatedStudent = await studentDal.approveStudentMarksheetDal({ registrationNo });
        return {
            status: true,
            message: "Marksheet approved successfully",
            data: updatedStudent.data
        };
    } catch (error) {
        console.error(error, "Failed to approve marksheet | service");
        return {
            status: false,
            message: `${error} | Failed to approve marksheet | service `,
            data: null
        };
    }
};

export default {
    listAllStudents,
    getStudentDetails,
    getDashboardData,
    approveStudentService,
    registerCenterService,
    getAllCentersService,
    approveStudentMarksheetService,
};
