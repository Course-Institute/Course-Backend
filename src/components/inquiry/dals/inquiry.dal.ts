import Inquiry, { InquiryAttrs } from '../models/Inquiry.js';

export type InquiryCreateResult = {
    fullName: string;
    email: string;
    phone: string;
    programOfInterest: string;
    message: string;
    inquiryType: 'student' | 'center';
    createdAt: Date;
};

export const createInquiryDal = async (attrs: InquiryAttrs): Promise<InquiryCreateResult> => {
    const doc = await Inquiry.create(attrs);
    return {
        fullName: doc.fullName,
        email: doc.email,
        phone: doc.phone,
        programOfInterest: doc.programOfInterest,
        message: doc.message,
        inquiryType: doc.inquiryType,
        createdAt: doc.createdAt
    };
};

export default { createInquiryDal };



export type InquiryListItem = {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    programOfInterest: string;
    message: string;
    createdAt: string; // ISO
    status?: string; // optional; not in schema currently
    inquiryType?: 'student' | 'center';
};

export type InquiryListResult = {
    data: InquiryListItem[];
    total: number;
};

export const listInquiriesDal = async (): Promise<InquiryListResult> => {
    const [docs, total] = await Promise.all([
        Inquiry.find({}).sort({ createdAt: -1 }).lean(),
        Inquiry.countDocuments({})
    ]);

    const data: InquiryListItem[] = docs.map((d: any) => ({
        id: `INQ-${String(d._id)}`,
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        programOfInterest: d.programOfInterest,
        message: d.message,
        createdAt: new Date(d.createdAt).toISOString(),
        inquiryType: d.inquiryType
    }));

    return { data, total };
};
