import { InquiryAttrs } from '../models/Inquiry.js';
import { createInquiryDal, InquiryCreateResult, listInquiriesDal, InquiryListResult } from '../dals/inquiry.dal.js';

export class InquiryService {
    async createInquiry(attrs: InquiryAttrs): Promise<InquiryCreateResult> {
        return await createInquiryDal(attrs);
    }
    async listInquiries(): Promise<InquiryListResult> {
        return await listInquiriesDal();
    }
}

export default InquiryService;


