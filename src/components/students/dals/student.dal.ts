import mongoose from "mongoose";
import { UserModel } from "../../users/models/user.model.js";
import { IStudent, StudentModel } from "../model/student.model.js";
import { CourseModel } from "../../course/models/course.model.js";

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
        
        // Handle course field - expects ObjectId from frontend
        let courseObjectId: mongoose.Types.ObjectId | undefined = undefined;
        if (course) {
            if (mongoose.Types.ObjectId.isValid(course)) {
                courseObjectId = new mongoose.Types.ObjectId(course);
            } else {
                throw new Error(`Invalid course ObjectId: ${course}`);
            }
        }
        
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
            course: courseObjectId,
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
            centerId: centerId && mongoose.Types.ObjectId.isValid(centerId) ? new mongoose.Types.ObjectId(centerId) : null
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
        const student = await StudentModel.findOne({ registrationNo: registrationNo }).populate('course').lean();
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
        // Build query object
        const query: any = {};
        
        // Add search functionality - search across name, registration number, or email
        if (search && search.trim()) {
            const searchConditions: any[] = [
                { candidateName: { $regex: search, $options: 'i' } },
                { registrationNo: { $regex: search, $options: 'i' } },
                { emailAddress: { $regex: search, $options: 'i' } }
            ];
            query.$or = searchConditions;
        }
        
        // Exact match filters
        if (faculty && faculty.trim()) {
            query.faculty = faculty;
        }
        if (stream && stream.trim()) {
            query.stream = stream;
        }
        if (year && year.trim()) {
            query.year = year;
        }
        if (session && session.trim()) {
            query.session = session;
        }

        // Resolve course and courseType filters against Course collection
        const requestedCourseIds: mongoose.Types.ObjectId[] = [];

        // Helper to escape regex
        const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // course filter (expects course _id, but will also resolve by name for backward compatibility)
        if (course && course.trim()) {
            if (mongoose.isValidObjectId(course)) {
                requestedCourseIds.push(new mongoose.Types.ObjectId(course));
            } else {
                const courseByName = await CourseModel.findOne({
                    name: { $regex: `^${escapeRegex(course)}$`, $options: 'i' }
                }).select('_id').lean();
                if (courseByName?._id) {
                    requestedCourseIds.push(courseByName._id as mongoose.Types.ObjectId);
                } else {
                    // If a course filter was provided but no course matched, return empty result early
                    return {
                        students: [],
                        pagination: {
                            currentPage: page,
                            totalPages: 0,
                            totalCount: 0,
                            limit,
                            hasNextPage: false,
                            hasPrevPage: page > 1
                        }
                    };
                }
            }
        }

        // programCategory is mapped to courseType (coursesType field in Course model)
        if (programCategory && programCategory.trim()) {
            const matchingCourses = await CourseModel.find({
                coursesType: { $regex: `^${escapeRegex(programCategory)}$`, $options: 'i' }
            }).select('_id').lean();

            matchingCourses.forEach(c => {
                if (c._id) {
                    requestedCourseIds.push(c._id as mongoose.Types.ObjectId);
                }
            });

            // If courseType filter was provided but no courses match, return empty early
            if (requestedCourseIds.length === 0) {
                return {
                    students: [],
                    pagination: {
                        currentPage: page,
                        totalPages: 0,
                        totalCount: 0,
                        limit,
                        hasNextPage: false,
                        hasPrevPage: page > 1
                    }
                };
            }
        }

        // Boolean filters - convert string to boolean
        if (isApprovedByAdmin !== undefined && isApprovedByAdmin !== null && isApprovedByAdmin !== '') {
            query.isApprovedByAdmin = isApprovedByAdmin === 'true';
        }
        if (isMarksheetGenerated !== undefined && isMarksheetGenerated !== null && isMarksheetGenerated !== '') {
            query.isMarksheetGenerated = isMarksheetGenerated === 'true';
        }
        if (isMarksheetAndCertificateApproved !== undefined && isMarksheetAndCertificateApproved !== null && isMarksheetAndCertificateApproved !== '') {
            query.isMarksheetAndCertificateApproved = isMarksheetAndCertificateApproved === 'true';
        }
        
        // Center ID filter
        if (centerId) {
            query.centerId = new mongoose.Types.ObjectId(centerId);
        }
        
        // Calculate pagination
        const skip = (page - 1) * limit;
        
        // Get course names for the requested course IDs to handle string-based course references
        let requestedCourseNames: string[] = [];
        if (requestedCourseIds.length > 0) {
            const courses = await CourseModel.find({
                _id: { $in: requestedCourseIds }
            }).select('name').lean();
            requestedCourseNames = courses.map(c => c.name);
        }
        
        // Build aggregate pipeline to safely handle cases where course might be a string instead of ObjectId
        const aggregatePipeline: any[] = [
            { $match: query }
        ];
        
        // Add course filter in aggregate pipeline to handle both ObjectId and string values
        if (requestedCourseIds.length > 0) {
            // Convert ObjectIds to strings for comparison
            const courseIdStrings = requestedCourseIds.map(id => id.toString());
            aggregatePipeline.push({
                $match: {
                    $or: [
                        // Match by ObjectId
                        { course: { $in: requestedCourseIds } },
                        // Match by string representation of ObjectId
                        {
                            $expr: {
                                $in: [
                                    { $toString: '$course' },
                                    courseIdStrings
                                ]
                            }
                        },
                        // Match by string course name (for backward compatibility)
                        ...(requestedCourseNames.length > 0 ? [{
                            course: { $in: requestedCourseNames }
                        }] : [])
                    ]
                }
            });
        }
        
        // Get total count for pagination (need to build count pipeline separately)
        const countPipeline = [...aggregatePipeline];
        const totalCountResult = await StudentModel.aggregate([
            ...countPipeline,
            { $count: 'total' }
        ]);
        const totalCount = totalCountResult[0]?.total || 0;
        
        // Use aggregate pipeline to safely handle cases where course might be a string instead of ObjectId
        const students = await StudentModel.aggregate([
            ...aggregatePipeline,
            {
                $lookup: {
                    from: 'centers',
                    localField: 'centerId',
                    foreignField: '_id',
                    as: 'centerId'
                }
            },
            {
                $unwind: {
                    path: '$centerId',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    let: { courseRef: '$course' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        // Match by ObjectId if courseRef is an ObjectId
                                        {
                                            $and: [
                                                { $ne: ['$$courseRef', null] },
                                                { $eq: [{ $type: '$$courseRef' }, 'objectId'] },
                                                { $eq: ['$_id', '$$courseRef'] }
                                            ]
                                        },
                                        // Match by name if courseRef is a string
                                        {
                                            $and: [
                                                { $ne: ['$$courseRef', null] },
                                                { $eq: [{ $type: '$$courseRef' }, 'string'] },
                                                { $eq: ['$name', '$$courseRef'] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                coursesType: 1,
                                code: 1,
                                duration: 1
                            }
                        }
                    ],
                    as: 'course'
                }
            },
            {
                $unwind: {
                    path: '$course',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    registrationNo: 1,
                    candidateName: 1,
                    emailAddress: 1,
                    contactNumber: 1,
                    grade: 1,
                    course: 1,
                    stream: 1,
                    session: 1,
                    year: 1,
                    createdAt: 1,
                    dateOfBirth: 1,
                    isApprovedByAdmin: 1,
                    isMarksheetAndCertificateApproved: 1,
                    centerId: 1,
                    isMarksheetGenerated: 1,
                    whichSemesterMarksheetIsGenerated: 1,
                    approvedSemesters: 1,
                    faculty: 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
        
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