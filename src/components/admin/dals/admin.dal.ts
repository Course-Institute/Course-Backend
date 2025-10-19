import { IStudent, StudentModel } from '../../students/model/student.model.js';
import { UserModel } from '../../users/models/user.model.js';

const getAllStudents = async ({
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
        // Build query object
        const query: any = {};
        
        // Add search functionality
        if (search) {
            query.$or = [
                { candidateName: { $regex: search, $options: 'i' } },
                { registrationNo: { $regex: search, $options: 'i' } },
                { emailAddress: { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Add faculty filter
        if (faculty) {
            query.faculty = faculty;
        }
        
        // Add course filter
        if (course) {
            query.course = course;
        }
        
        // Add session filter
        if (session) {
            query.session = session;
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Get total count for pagination
        const totalCount = await StudentModel.countDocuments(query);
        
        // Get students with pagination
        const students = await StudentModel.find(query)
            .select('registrationNo candidateName emailAddress contactNumber faculty course stream session year createdAt dateOfBirth')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        
        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        
        return {
            students,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage
            }
        };
    } catch (error) {
        console.log('Error in getAllStudents DAL:', error);
        throw error;
    }
};

const getStudentByRegistrationNo = async (registrationNo: string) => {
    try {
        const student = await StudentModel.findOne({ registrationNo }).lean();
        return student;
    } catch (error) {
        console.log('Error in getStudentByRegistrationNo DAL:', error);
        throw error;
    }
};

const getDashboardStatistics = async () => {
    try {
        // Get total students count
        const totalStudents = await StudentModel.countDocuments();
        
        // Get students by faculty
        const studentsByFaculty = await StudentModel.aggregate([
            {
                $group: {
                    _id: '$faculty',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get students by course
        const studentsByCourse = await StudentModel.aggregate([
            {
                $group: {
                    _id: '$course',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get students by session
        const studentsBySession = await StudentModel.aggregate([
            {
                $group: {
                    _id: '$session',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentRegistrations = await StudentModel.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });
        
        // Get monthly registrations for the current year
        const currentYear = new Date().getFullYear();
        const monthlyRegistrations = await StudentModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        return {
            totalStudents,
            recentRegistrations,
            studentsByFaculty,
            studentsByCourse,
            studentsBySession,
            monthlyRegistrations
        };
    } catch (error) {
        console.log('Error in getDashboardStatistics DAL:', error);
        throw error;
    }
};

const approveStudentDal = async (
    {
        registrationNo
    }: {
        registrationNo: string
    }): Promise<{ status: boolean, message: string, data: IStudent | null }> => {
    try {
        const updatedStudent = await StudentModel.findOneAndUpdate(
            { registrationNo },
            { $set: { isApprovedByAdmin: true } },
            { new: true, runValidators: true }
        );
        return {
            status: true,
            message: "Student Approved successfully",
            data: updatedStudent as IStudent
        }
    } catch (error) {
        console.error(error);
        return {
            status: false,
            message: `${error} | failed to approve student | DAL `,
            data: null
        }
    }
}

export default {
    getAllStudents,
    getStudentByRegistrationNo,
    getDashboardStatistics,
    approveStudentDal,
};
