import { IStudent } from '../../students/model/student.model.js';
import adminDal from '../dals/admin.dal.js';
import centerService from '../../centers/services/center.service.js';
import { CreateCenterRequest, CenterModel } from '../../centers/models/center.model.js';
import centerDal from '../../centers/dals/center.dal.js';
import studentDal from '../../students/dals/student.dal.js';
import marksheetService from '../../marksheets/services/marksheet.service.js';
import { SubjectMarks } from '../../marksheets/models/marksheet.model.js';

const listAllStudents = async ({
    page = 1,
    limit = 10,
    search,
    faculty,
    course,
    stream,
    year,
    session,
    isApprovedByAdmin,
    isMarksheetGenerated,
    isMarksheetAndCertificateApproved,
    programCategory,
    centerId
}: {
    page?: number;
    limit?: number;
    search?: string;
    faculty?: string;
    course?: string;
    stream?: string;
    year?: string;
    session?: string;
    isApprovedByAdmin?: string;
    isMarksheetGenerated?: string;
    isMarksheetAndCertificateApproved?: string;
    programCategory?: string;
    centerId?: string;
}) => {
    try {
        const result = await studentDal.getAllStudents({
            page,
            limit,
            search,
            faculty,
            course,
            stream,
            year,
            session,
            isApprovedByAdmin,
            isMarksheetGenerated,
            isMarksheetAndCertificateApproved,
            programCategory,
            centerId
        });
        const transformedResult = result.students.map((student: any) => ({
            ...student,
            stream : student.stream ? student.stream : 'N/A',
            centerName: student.centerId?.centerDetails?.centerName,
            centerCode: student.centerId?.centerDetails?.centerCode,
            centerId: student.centerId?._id.toString(),
            courseId: student.course?._id?.toString?.() || student.course?.toString?.(),
            courseName: student.course?.name,
            courseType: student.course?.coursesType || student.courseType,
            course: student.course?.name || student.course, // backward compatibility for existing consumers
            studentId: student._id?.toString(),
            whichSemesterMarksheetIsGenerated: student.whichSemesterMarksheetIsGenerated || [],
            whichYearMarksheetIsGenerated: student.whichYearMarksheetIsGenerated || [],
            approvedSemesters: student.approvedSemesters || [],
            approvedYears: student.approvedYears || [],
        }));

        return {
            students: transformedResult,
            pagination: result.pagination
        };
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

const getDashboardStats = async () => {
    try {
        const stats = await adminDal.getDashboardStatsDal();
        return stats;
    } catch (error) {
        console.log('Error in getDashboardStats service:', error);
        throw error;
    }
};

const getCenterDynamics = async () => {
    try {
        const dynamics = await adminDal.getCenterDynamicsDal();
        return dynamics;
    } catch (error) {
        console.log('Error in getCenterDynamics service:', error);
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

const approveStudentMarksheetService = async ({
    registrationNo,
    subjects,
    marksheetId,
    semester,
    year
}: {
    registrationNo: string;
    subjects?: SubjectMarks[];
    marksheetId?: string;
    semester?: string;
    year?: string;
}): Promise<{
    status: boolean,
    message: string,
    data: IStudent | null
}> => {
    try {
        // Validate required fields when semester is provided
        if ((semester || year) && !marksheetId) {
            throw new Error('marksheetId is required when approving a specific semester/year');
        }

        // Get student by registration number
        const student = await studentDal.getStudentByRegistrationNo(registrationNo);
        if (!student) {
            throw new Error('Student not found');
        }

        // If marksheetId is provided, validate and update the marksheet
        if (marksheetId) {
            // Import MarksheetModel to validate marksheet
            const { MarksheetModel } = await import('../../marksheets/models/marksheet.model.js');
            
            // Find marksheet
            const marksheet = await MarksheetModel.findById(marksheetId);
            if (!marksheet) {
                throw new Error('Marksheet not found');
            }

            // Validate marksheet belongs to student
            if (!marksheet.studentId) {
                throw new Error('Marksheet does not have a valid student ID');
            }
            
            if (marksheet.studentId.toString() !== student._id.toString()) {
                throw new Error('Marksheet does not belong to this student');
            }

            // If term is provided, validate it matches the marksheet
            if (semester && marksheet.semester !== semester) {
                throw new Error('Marksheet does not belong to this semester');
            }
            if (year && (marksheet as any).year !== year) {
                throw new Error('Marksheet does not belong to this year');
            }

            // Update marksheet subjects if provided
            if (subjects && subjects.length > 0) {
                await marksheetService.uploadOrUpdateMarksheet({
                    marksheetId,
                    subjects,
                    studentId: student._id.toString(),
                    semester: semester || marksheet.semester,
                    year: year || (marksheet as any).year
                });
            }
        }

        // Update student approval status with term
        const updatedStudent = await studentDal.approveStudentMarksheetDal({ 
            registrationNo,
            semester,
            year
        });
        
        if (!updatedStudent?.data) {
            throw new Error('Failed to update student approval status');
        }
        
        const termLabel = semester ? `Semester ${semester}` : year ? `Year ${year}` : "Marksheet";
        return {
            status: true,
            message: `${termLabel} approved successfully`,
            data: updatedStudent.data
        };
    } catch (error: any) {
        console.error(error, "Failed to approve marksheet | service");
        return {
            status: false,
            message: error?.message || `Failed to approve marksheet | service`,
            data: null
        };
    }
};

const approveAdmitCardService = async ({
    registrationNo
}: {
    registrationNo: string;
}): Promise<{
    status: boolean,
    message: string,
    data: IStudent | null
}> => {
    try {
        const result = await studentDal.approveAdmitCardDal({ registrationNo });
        return result;
    } catch (error: any) {
        console.error(error, "Failed to approve admit card | service");
        return {
            status: false,
            message: error?.message || `Failed to approve admit card | service`,
            data: null
        };
    }
};

const approveCertificateService = async ({
    registrationNo
}: {
    registrationNo: string;
}): Promise<{
    status: boolean,
    message: string,
    data: IStudent | null
}> => {
    try {
        const result = await studentDal.approveCertificateDal({ registrationNo });
        return result;
    } catch (error: any) {
        console.error(error, "Failed to approve certificate | service");
        return {
            status: false,
            message: error?.message || `Failed to approve certificate | service`,
            data: null
        };
    }
};

const approveMigrationService = async ({
    registrationNo
}: {
    registrationNo: string;
}): Promise<{
    status: boolean,
    message: string,
    data: IStudent | null
}> => {
    try {
        const result = await studentDal.approveMigrationDal({ registrationNo });
        return result;
    } catch (error: any) {
        console.error(error, "Failed to approve migration certificate | service");
        return {
            status: false,
            message: error?.message || `Failed to approve migration certificate | service`,
            data: null
        };
    }
};

export default {
    listAllStudents,
    getStudentDetails,
    getDashboardData,
    getDashboardStats,
    getCenterDynamics,
    approveStudentService,
    registerCenterService,
    getAllCentersService,
    approveStudentMarksheetService,
    approveAdmitCardService,
    approveCertificateService,
    approveMigrationService,
};
