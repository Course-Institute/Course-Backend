import mongoose, { Schema, Document, Model } from 'mongoose';

export type InquiryType = 'student' | 'center';

export interface InquiryAttrs {
    fullName: string;
    email: string;
    phone: string; // normalized 10 digits
    programOfInterest: string;
    message: string;
    inquiryType: InquiryType;
}

export interface InquiryDoc extends Document {
    fullName: string;
    email: string;
    phone: string;
    programOfInterest: string;
    message: string;
    inquiryType: InquiryType;
    createdAt: Date;
    updatedAt: Date;
}

const InquirySchema = new Schema<InquiryDoc>(
    {
        fullName: { type: String, required: true, minlength: 2, maxlength: 100 },
        email: { type: String, required: true, maxlength: 150, index: true },
        phone: { type: String, required: true },
        programOfInterest: { type: String, required: true, maxlength: 120 },
        message: { type: String, required: true, minlength: 10, maxlength: 2000 },
        inquiryType: { type: String, required: true, enum: ['student', 'center'] }
    },
    { timestamps: true }
);

const Inquiry: Model<InquiryDoc> = mongoose.models.Inquiry || mongoose.model<InquiryDoc>('Inquiry', InquirySchema);

export default Inquiry;



