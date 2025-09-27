import adminDal from '../dals/admin.dal.js';

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
        const result = await adminDal.getAllStudents({
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
        const student = await adminDal.getStudentByRegistrationNo(registrationNo);
        
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

export default {
    listAllStudents,
    getStudentDetails,
    getDashboardData
};
