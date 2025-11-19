import mongoose from "mongoose";
import { UserModel } from "../../users/models/user.model.js";
import { IStudent, StudentModel } from "../model/student.model.js";

const studentListAutoCompleteDal = async ({query, centerId}: {query: string, centerId: string}) => {
    try {
        const limit = 20;

        // Build filter condition
        let filter = {};
        if (query && query.trim()) {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special chars
            const regex = new RegExp(escapedQuery, "i"); // Case-insensitive search

            filter = {
                $or: [
                    { candidateName: regex },
                    { registrationNo: regex },
                    { emailAddress: regex },
                    { contactNumber: regex },
                    { course: regex },
                    { faculty: regex }
                ],
            };
        }

        if (centerId) {
            filter = {
                ...filter,
                centerId: new mongoose.Types.ObjectId(centerId)
            };
        }

        // Query MongoDB
        const students = await StudentModel.find(filter)
            .select('candidateName registrationNo _id fatherName')
            .limit(limit)
            .lean();

        return students;
    } catch (error) {
        console.error("Error in studentListAutoCompleteDal:", error);
        throw error;
    }
};

// Function to generate unique 12-digit registration number
const generateRegistrationNumber = async (): Promise<string> => {
    let registrationNo: string;
    let isUnique = false;
    
    while (!isUnique) {
        // Generate 12-digit number
        registrationNo = Math.floor(100000000000 + Math.random() * 900000000000).toString();
        
        // Check if this registration number already exists
        const existingStudent = await StudentModel.findOne({ registrationNo });
        if (!existingStudent) {
            isUnique = true;
        }
    }
    
    return registrationNo!;
};

const addStudentDal = async ({
    candidateName,
    motherName,
    fatherName,
    gender,
    dateOfBirth,
    adharCardNo,
    category,
    areYouEmployed,
    employerName,
    designation,
    contactNumber,
    alternateNumber,
    emailAddress,
    currentAddress,
    permanentAddress,
    city,
    state,
    nationality,
    country,
    pincode,
    courseType,
    grade,
    course,
    stream,
    year,
    monthSession,
    hostelFacility,
    session,
    duration,
    courseFee,
    aadharFront,
    aadharBack,
    photo,
    signature,
    centerId
}:{
    candidateName?: string, 
    motherName?: string, 
    fatherName?: string, 
    gender?: string, 
    dateOfBirth?: string, 
    adharCardNo?: string, 
    category?: string, 
    areYouEmployed?: string, 
    employerName?: string, 
    designation?: string, 
    contactNumber?: string, 
    alternateNumber?: string, 
    emailAddress?: string, 
    currentAddress?: string, 
    permanentAddress?: string, 
    city?: string, 
    state?: string, 
    nationality?: string, 
    country?: string, 
    pincode?: string, 
    courseType?: string, 
    grade?: string, 
    course?: string, 
    stream?: string, 
    year?: string, 
    monthSession?: string, 
    hostelFacility?: string, 
    session?: string, 
    duration?: string, 
    courseFee?: string, 
    aadharFront?: string, 
    aadharBack?: string, 
    photo?: string, 
    signature?: string,
    centerId?: string
}): Promise<IStudent> => {
    try {
        // Generate unique registration number
        const registrationNo = await generateRegistrationNumber();
        
        return await StudentModel.create({
            registrationNo: registrationNo,
            candidateName: candidateName,
            motherName: motherName,
            fatherName: fatherName,
            gender: gender,
            dateOfBirth: dateOfBirth,
            adharCardNo: adharCardNo,
            category: category,
            areYouEmployed: areYouEmployed,
            employerName: employerName,
            designation: designation,
            contactNumber: contactNumber,
            alternateNumber: alternateNumber,
            emailAddress: emailAddress,
            currentAddress: currentAddress,
            permanentAddress: permanentAddress,
            city: city,
            state: state,
            nationality: nationality,
            country: country,
            pincode: pincode,
            courseType: courseType,
            grade: grade,
            course: course,
            stream: stream,
            year: year,
            monthSession: monthSession,
            hostelFacility: hostelFacility,
            session: session,
            duration: duration,
            courseFee: courseFee,
            aadharFront: aadharFront,
            aadharBack: aadharBack,
            photo: photo,
            signature: signature,
            centerId: centerId ? new mongoose.Types.ObjectId(centerId) : null
        });
    } catch (error) {
        throw error;
    }
};

const findStudentByRegistrationNo = async (registrationNo: string): Promise<any> => {
    try {
        const student = await UserModel.findOne({ registrationNo: registrationNo }).lean();
        console.log(student);
        return student;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getStudentProfileByRegistrationNo = async (registrationNo: string): Promise<any> => {
    try {
        
        // Check for the specific student
        const student = await StudentModel.findOne({ registrationNo: registrationNo }).lean();
        return student;
    } catch (error) {
        console.log('Error in getStudentProfileByRegistrationNo:', error);
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

const getAllStudents = async ({
    page = 1,
    limit = 10,
    search,
    faculty,
    course,
    session,
    centerId
}: {
    page?: number;
    limit?: number;
    search?: string;
    faculty?: string;
    course?: string;
    session?: string;
    centerId?: string;
}) => {
    try {
        // Build query object
        const query: any = {};
        
        // Add search functionality
        if (search) {
            const searchConditions: any[] = [
                { candidateName: { $regex: search, $options: 'i' } },
                { registrationNo: { $regex: search, $options: 'i' } },
                { emailAddress: { $regex: search, $options: 'i' } },
                { contactNumber: { $regex: search, $options: 'i' } }
            ];
            query.$or = searchConditions;

        }
        // Check if search term is a valid ObjectId for centerId search
        if (centerId) {
            query.centerId = new mongoose.Types.ObjectId(centerId);
        }
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Get total count for pagination
        const totalCount = await StudentModel.countDocuments(query);
        
        // Get students with pagination
        const students = await StudentModel.find(query)
            .select('registrationNo candidateName emailAddress contactNumber grade course stream session year createdAt dateOfBirth isApprovedByAdmin isMarksheetAndCertificateApproved centerId isMarksheetGenerated whichSemesterMarksheetIsGenerated approvedSemesters')
            .populate({path: 'centerId'})
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

const approveStudentMarksheetDal = async ({
    registrationNo,
    studentId,
    semester
}:{
    registrationNo?: string
    studentId?: string
    semester?: string
}) => {
    try {
        if(studentId) {
            registrationNo = (await StudentModel.findById(studentId).select('registrationNo').lean())?.registrationNo;
        }

        // Find the student
        const student = await StudentModel.findOne({ registrationNo: registrationNo });
        
        if (!student) {
            return {
                status: false,
                message: "Student not found",
                data: null
            };
        }

        // If semester is provided, update approvedSemesters array
        if (semester) {
            // Initialize approvedSemesters array if it doesn't exist
            if (!student.approvedSemesters) {
                student.approvedSemesters = [];
            }

            // Add semester to approved array if not already present
            if (!student.approvedSemesters.includes(semester)) {
                student.approvedSemesters.push(semester);
                // Sort array to keep it organized
                student.approvedSemesters.sort();
            }

            // Set isMarksheetAndCertificateApproved to true if at least one semester is approved
            if (student.approvedSemesters.length > 0) {
                student.isMarksheetAndCertificateApproved = true;
            }

            await student.save();
        } else {
            // Backward compatibility: if no semester provided, set isMarksheetAndCertificateApproved to true
            const updatedStudent = await StudentModel.findOneAndUpdate(
                { registrationNo: registrationNo },
                { $set: { isMarksheetAndCertificateApproved: true } },
                { new: true, runValidators: true }
            );
            return {
                status: true,
                message: "Student Approved successfully",
                data: updatedStudent as IStudent
            };
        }

        return {
            status: true,
            message: semester ? `Semester ${semester} marksheet approved successfully` : "Student Approved successfully",
            data: student as IStudent
        };
    } catch (error) {
        console.error(error);
        return {
            status: false,
            message: `${error} | failed to approve student marksheet | DAL `,
            data: null
        };
    }
}

const findStudentById = async (studentId: string): Promise<any> => {
    try {
        const student = await StudentModel.findById(studentId).lean();
        return student;
    } catch (error) {
        console.log('Error in findStudentById DAL:', error);
        throw error;
    }
}

const updateMarksheetGenerationStatusDal = async ({studentId, isMarksheetGenerated}: {studentId: string, isMarksheetGenerated: boolean}) => {
    try {
        const updatedStudent = await StudentModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(studentId) },
            { $set: { isMarksheetGenerated: isMarksheetGenerated } },
            { new: true, runValidators: true }
        );
        return updatedStudent;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateStudentSemesterMarksheetArrayDal = async ({studentId, semester}: {studentId: string, semester: string}) => {
    try {
        // Find the student
        const student = await StudentModel.findById(studentId);
        
        if (!student) {
            throw new Error('Student not found');
        }

        // Initialize array if it doesn't exist
        if (!student.whichSemesterMarksheetIsGenerated) {
            student.whichSemesterMarksheetIsGenerated = [];
        }

        // Add semester to array if not already present
        if (!student.whichSemesterMarksheetIsGenerated.includes(semester)) {
            student.whichSemesterMarksheetIsGenerated.push(semester);
            // Sort array to keep it organized
            student.whichSemesterMarksheetIsGenerated.sort();
        }

        // Also set isMarksheetGenerated to true for backward compatibility
        student.isMarksheetGenerated = true;

        await student.save();
        
        return student;
    } catch (error) {
        console.error('Error in updateStudentSemesterMarksheetArrayDal:', error);
        throw error;
    }
}   

export default {    
    studentListAutoCompleteDal,
    addStudentDal,
    findStudentByRegistrationNo,
    getStudentProfileByRegistrationNo,
    getAllStudents,
    getStudentByRegistrationNo,
    approveStudentDal,
    approveStudentMarksheetDal,
    findStudentById,
    updateMarksheetGenerationStatusDal,
    updateStudentSemesterMarksheetArrayDal
};