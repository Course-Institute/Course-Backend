import mongoose, { Model, Schema, Document } from "mongoose";

interface IStudent extends Document {
    candidateName: string;
    motherName: string;
    fatherName: string;
    gender: string;
    dob: string;
    adharNumber: string;
    category: string;
    areYouEmployed: string;
    employerName: string;
    designation: string;
    contactNumber: string;
    alternateNumber: string;
    email: string;
    currentAddress: string;
    parmanentAddress: string;
    city: string;
    state: string;
    nationality: string;
    country: string;
    pincode: string;
    courseType: string;
    faculty: string;
    course: string;
    stream: string;
    year: string;
    monthSession: string;
    hostelFacility: string;
    session: string;
    duration: string;
    courseFee: string;
    aadharFront: string;
    aadharBack: string;
    photo: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
}

const studentSchema = new Schema<IStudent>({
    candidateName: { type: String, required: true },
    motherName: { type: String, required: true },
    fatherName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    adharNumber: { type: String, required: true },
    category: { type: String, required: true },
    areYouEmployed: { type: String, required: true },
    employerName: { type: String, required: true },
    designation: { type: String, required: true },
    contactNumber: { type: String, required: true },
    alternateNumber: { type: String, required: true },
    email: { type: String, required: true },
    currentAddress: { type: String, required: true },
    parmanentAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    nationality: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true },
    courseType: { type: String, required: true },
    faculty: { type: String, required: true },
    course: { type: String, required: true },
    stream: { type: String, required: true },
    year: { type: String, required: true },
    monthSession: { type: String, required: true },
    hostelFacility: { type: String, required: true },
    session: { type: String, required: true },
    duration: { type: String, required: true },
    courseFee: { type: String, required: true },
    aadharFront: { type: String, required: true },
    aadharBack: { type: String, required: true },
    photo: { type: String, required: true },
    signature: { type: String, required: true }
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
