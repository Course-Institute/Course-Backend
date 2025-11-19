import { CourseModel, ICourse } from '../models/course.model.js';
import { SubjectModel, ISubject } from '../models/subject.model.js';
import { MarksheetModel } from '../../marksheets/models/marksheet.model.js';
import mongoose from 'mongoose';

const getAllCoursesDal = async (): Promise<ICourse[]> => {
  try {
    const courses = await CourseModel.find({})
      .sort({ name: 1 })
      .lean();
    return courses as ICourse[];
  } catch (error) {
    console.log('Error in getAllCoursesDal:', error);
    throw error;
  }
};

const getCourseByIdDal = async (courseId: string): Promise<ICourse | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID format');
    }
    const course = await CourseModel.findById(courseId).lean();
    return course as ICourse | null;
  } catch (error) {
    console.log('Error in getCourseByIdDal:', error);
    throw error;
  }
};

const createCourseDal = async (courseData: {
  name: string;
  code?: string;
  duration?: number;
  description?: string;
}): Promise<ICourse> => {
  try {
    const course = await CourseModel.create(courseData);
    return course;
  } catch (error: any) {
    console.log('Error in createCourseDal:', error);
    // Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.name) {
        throw new Error('Course with this name already exists');
      }
      if (error.keyPattern?.code) {
        throw new Error('Course with this code already exists');
      }
    }
    throw error;
  }
};

const updateCourseDal = async (
  courseId: string,
  updateData: {
    name?: string;
    code?: string;
    duration?: number;
    description?: string;
  }
): Promise<ICourse | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID format');
    }

    const course = await CourseModel.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    return course as ICourse | null;
  } catch (error: any) {
    console.log('Error in updateCourseDal:', error);
    // Handle duplicate key error
    if (error.code === 11000) {
      if (error.keyPattern?.name) {
        throw new Error('Course with this name already exists');
      }
      if (error.keyPattern?.code) {
        throw new Error('Course with this code already exists');
      }
    }
    throw error;
  }
};

const deleteCourseDal = async (courseId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID format');
    }

    // Check if course has associated subjects
    const subjectCount = await SubjectModel.countDocuments({
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (subjectCount > 0) {
      throw new Error('Cannot delete course. It has associated subjects. Please delete all subjects first.');
    }

    const result = await CourseModel.findByIdAndDelete(courseId);
    return !!result;
  } catch (error) {
    console.log('Error in deleteCourseDal:', error);
    throw error;
  }
};

const getSubjectsByCourseAndSemesterDal = async (
  courseId: string,
  semester: number
): Promise<ISubject[]> => {
  try {
    // Validate courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID format');
    }

    // Check if course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    // Get subjects for the course and semester
    const subjects = await SubjectModel.find({
      courseId: new mongoose.Types.ObjectId(courseId),
      semester: semester,
    })
      .select('_id name')
      .sort({ name: 1 })
      .lean();

    return subjects as ISubject[];
  } catch (error) {
    console.log('Error in getSubjectsByCourseAndSemesterDal:', error);
    throw error;
  }
};

const getAllSubjectsDal = async (filters?: {
  courseId?: string;
  semester?: number;
}): Promise<ISubject[]> => {
  try {
    const query: any = {};

    if (filters?.courseId) {
      if (!mongoose.Types.ObjectId.isValid(filters.courseId)) {
        throw new Error('Invalid course ID format');
      }
      query.courseId = new mongoose.Types.ObjectId(filters.courseId);
    }

    if (filters?.semester !== undefined) {
      query.semester = filters.semester;
    }

    const subjects = await SubjectModel.find(query)
      .populate('courseId', 'name')
      .sort({ 'courseId.name': 1, semester: 1, name: 1 })
      .lean();

    return subjects as ISubject[];
  } catch (error) {
    console.log('Error in getAllSubjectsDal:', error);
    throw error;
  }
};

const getSubjectByIdDal = async (subjectId: string): Promise<ISubject | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      throw new Error('Invalid subject ID format');
    }
    const subject = await SubjectModel.findById(subjectId).lean();
    return subject as ISubject | null;
  } catch (error) {
    console.log('Error in getSubjectByIdDal:', error);
    throw error;
  }
};

const createSubjectDal = async (subjectData: {
  name: string;
  courseId: string;
  semester: number;
  code?: string;
  credits?: number;
}): Promise<ISubject> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(subjectData.courseId)) {
      throw new Error('Invalid course ID format');
    }

    const subject = await SubjectModel.create({
      ...subjectData,
      courseId: new mongoose.Types.ObjectId(subjectData.courseId),
    });
    return subject;
  } catch (error) {
    console.log('Error in createSubjectDal:', error);
    throw error;
  }
};

const updateSubjectDal = async (
  subjectId: string,
  updateData: {
    name?: string;
    courseId?: string;
    semester?: number;
    code?: string;
    credits?: number;
  }
): Promise<ISubject | null> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      throw new Error('Invalid subject ID format');
    }

    const updatePayload: any = { ...updateData };
    if (updateData.courseId) {
      if (!mongoose.Types.ObjectId.isValid(updateData.courseId)) {
        throw new Error('Invalid course ID format');
      }
      updatePayload.courseId = new mongoose.Types.ObjectId(updateData.courseId);
    }

    const subject = await SubjectModel.findByIdAndUpdate(
      subjectId,
      updatePayload,
      { new: true, runValidators: true }
    ).lean();

    return subject as ISubject | null;
  } catch (error) {
    console.log('Error in updateSubjectDal:', error);
    throw error;
  }
};

const deleteSubjectDal = async (subjectId: string): Promise<boolean> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      throw new Error('Invalid subject ID format');
    }

    // Get subject to check its name
    const subject = await SubjectModel.findById(subjectId);
    if (!subject) {
      return false;
    }

    // Check if subject has associated marksheets (by subject name)
    const marksheetCount = await MarksheetModel.countDocuments({
      'subjects.subjectName': subject.name,
    });

    if (marksheetCount > 0) {
      throw new Error('Cannot delete subject. It has associated marksheets. Please handle marksheets first.');
    }

    const result = await SubjectModel.findByIdAndDelete(subjectId);
    return !!result;
  } catch (error) {
    console.log('Error in deleteSubjectDal:', error);
    throw error;
  }
};

export default {
  getAllCoursesDal,
  getCourseByIdDal,
  createCourseDal,
  updateCourseDal,
  deleteCourseDal,
  getSubjectsByCourseAndSemesterDal,
  getAllSubjectsDal,
  getSubjectByIdDal,
  createSubjectDal,
  updateSubjectDal,
  deleteSubjectDal,
};

