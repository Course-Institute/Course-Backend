import mongoose, { Model, Document, Types } from "mongoose";
const Schema = mongoose.Schema;

interface IStudent extends Document {
    registrationNo?: string;
    candidateName?: string;
    motherName?: string;
    fatherName?: string;
    gender?: string;
    dateOfBirth?: string;
    adharCardNo?: string;
    category?: string;
    areYouEmployed?: string;
    employerName?: string;
    designation?: string;
    contactNumber?: string;
    alternateNumber?: string;
    emailAddress?: string;
    currentAddress?: string;
    permanentAddress?: string;
    city?: string;
    state?: string;
    nationality?: string;
    country?: string;
    pincode?: string;
    courseType?: string;
    grade?: string;
    course?: Types.ObjectId | string;
    stream?: string;
    year?: string;
    monthSession?: string;
    hostelFacility?: string;
    session?: string;
    duration?: string;
    courseFee?: string;
    aadharFront?: string;
    aadharBack?: string;
    photo?: string;
    signature?: string;
    createdAt: Date;
    updatedAt: Date;
    isApprovedByAdmin: Boolean;
    isMarksheetAndCertificateApproved: Boolean;
    isMarksheetGenerated: Boolean;
    whichSemesterMarksheetIsGenerated?: string[];
    whichYearMarksheetIsGenerated?: string[];
    approvedSemesters?: string[];
    approvedYears?: string[];
    centerId?: Types.ObjectId | null;
}

const studentSchema = new Schema<IStudent>({
    registrationNo: { type: String, required: false, unique: true },
    candidateName: { type: String, required: false },
    motherName: { type: String, required: false },
    fatherName: { type: String, required: false },
    gender: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
    adharCardNo: { type: String, required: false },
    category: { type: String, required: false },
    areYouEmployed: { type: String, required: false },
    employerName: { type: String, required: false },
    designation: { type: String, required: false },
    contactNumber: { type: String, required: false },
    alternateNumber: { type: String, required: false },
    emailAddress: { type: String, required: false },
    currentAddress: { type: String, required: false },
    permanentAddress: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    nationality: { type: String, required: false },
    country: { type: String, required: false },
    pincode: { type: String, required: false },
    courseType: { type: String, required: false },
    grade: { type: String, required: false },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: false },
    stream: { type: String, required: false },
    year: { type: String, required: false },
    monthSession: { type: String, required: false },
    hostelFacility: { type: String, required: false },
    session: { type: String, required: false },
    duration: { type: String, required: false },
    courseFee: { type: String, required: false },
    aadharFront: { type: String, required: false },
    aadharBack: { type: String, required: false },
    photo: { type: String, required: false },
    signature: { type: String, required: false },
    isApprovedByAdmin: { type: Boolean, required: false, default: false },
    isMarksheetAndCertificateApproved: { type: Boolean, required: false, default: false },
    isMarksheetGenerated: { type: Boolean, required: false, default: false },
    whichSemesterMarksheetIsGenerated: { type: [String], required: false, default: [] },
    whichYearMarksheetIsGenerated: { type: [String], required: false, default: [] },
    approvedSemesters: { type: [String], required: false, default: [] },
    approvedYears: { type: [String], required: false, default: [] },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'centers', required: false }
},
    {
        timestamps: true
    });

const StudentModel: Model<IStudent> =
    mongoose.model<IStudent>(
        "students",
        studentSchema,
        "students"
    );

export { StudentModel, IStudent };
