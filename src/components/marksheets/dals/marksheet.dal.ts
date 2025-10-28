import { IMarksheet, MarksheetModel, SubjectMarks } from '../models/marksheet.model.js';


const uploadMarksheetDal = async ({ studentId, subjects }: { studentId: string, subjects: SubjectMarks[] }): Promise<IMarksheet> => {
    try {
        const result = await MarksheetModel.create({ studentId, subjects });
        return result;
    } catch (error) {
        console.log('Error in uploadMarksheetDal:', error);
        throw error;
    }
}

export default {
    uploadMarksheetDal,
};

