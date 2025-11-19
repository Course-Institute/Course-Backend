import courseDal from '../dals/course.dal.js';
import { ICourse } from '../models/course.model.js';
import { ISubject } from '../models/subject.model.js';

const getAllCoursesService = async (): Promise<ICourse[]> => {
  try {
    const courses = await courseDal.getAllCoursesDal();
    return courses;
  } catch (error) {
    console.log('Error in getAllCoursesService:', error);
    throw error;
  }
};

const getCourseByIdService = async (courseId: string): Promise<ICourse | null> => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }
    const course = await courseDal.getCourseByIdDal(courseId);
    return course;
  } catch (error) {
    console.log('Error in getCourseByIdService:', error);
    throw error;
  }
};

const createCourseService = async (courseData: {
  name: string;
  code?: string;
  duration?: number;
  description?: string;
}): Promise<ICourse> => {
  try {
    const course = await courseDal.createCourseDal(courseData);
    return course;
  } catch (error) {
    console.log('Error in createCourseService:', error);
    throw error;
  }
};

const updateCourseService = async (
  courseId: string,
  updateData: {
    name?: string;
    code?: string;
    duration?: number;
    description?: string;
  }
): Promise<ICourse | null> => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Check if course exists
    const existingCourse = await courseDal.getCourseByIdDal(courseId);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    const course = await courseDal.updateCourseDal(courseId, updateData);
    return course;
  } catch (error) {
    console.log('Error in updateCourseService:', error);
    throw error;
  }
};

const deleteCourseService = async (courseId: string): Promise<boolean> => {
  try {
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    // Check if course exists
    const existingCourse = await courseDal.getCourseByIdDal(courseId);
    if (!existingCourse) {
      throw new Error('Course not found');
    }

    const result = await courseDal.deleteCourseDal(courseId);
    return result;
  } catch (error) {
    console.log('Error in deleteCourseService:', error);
    throw error;
  }
};

const getSubjectsByCourseAndSemesterService = async (
  courseId: string,
  semester: number
): Promise<ISubject[]> => {
  try {
    // Validate inputs
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    if (semester === undefined || semester === null) {
      throw new Error('Semester is required');
    }

    // Validate semester is a valid number
    const semesterNum = Number(semester);
    if (isNaN(semesterNum) || semesterNum < 1) {
      throw new Error('Semester must be a valid positive number');
    }

    const subjects = await courseDal.getSubjectsByCourseAndSemesterDal(
      courseId,
      semesterNum
    );
    return subjects;
  } catch (error) {
    console.log('Error in getSubjectsByCourseAndSemesterService:', error);
    throw error;
  }
};

const getAllSubjectsService = async (filters?: {
  courseId?: string;
  semester?: number;
}): Promise<ISubject[]> => {
  try {
    const subjects = await courseDal.getAllSubjectsDal(filters);
    return subjects;
  } catch (error) {
    console.log('Error in getAllSubjectsService:', error);
    throw error;
  }
};

const getSubjectByIdService = async (subjectId: string): Promise<ISubject | null> => {
  try {
    if (!subjectId) {
      throw new Error('Subject ID is required');
    }
    const subject = await courseDal.getSubjectByIdDal(subjectId);
    return subject;
  } catch (error) {
    console.log('Error in getSubjectByIdService:', error);
    throw error;
  }
};

const createSubjectService = async (subjectData: {
  name: string;
  courseId: string;
  semester: number;
  code?: string;
  credits?: number;
}): Promise<ISubject> => {
  try {
    // Validate course exists
    const course = await courseDal.getCourseByIdDal(subjectData.courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const subject = await courseDal.createSubjectDal(subjectData);
    return subject;
  } catch (error) {
    console.log('Error in createSubjectService:', error);
    throw error;
  }
};

const updateSubjectService = async (
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
    if (!subjectId) {
      throw new Error('Subject ID is required');
    }

    // Check if subject exists
    const existingSubject = await courseDal.getSubjectByIdDal(subjectId);
    if (!existingSubject) {
      throw new Error('Subject not found');
    }

    // If courseId is being updated, validate it exists
    if (updateData.courseId) {
      const course = await courseDal.getCourseByIdDal(updateData.courseId);
      if (!course) {
        throw new Error('Course not found');
      }
    }

    const subject = await courseDal.updateSubjectDal(subjectId, updateData);
    return subject;
  } catch (error) {
    console.log('Error in updateSubjectService:', error);
    throw error;
  }
};

const deleteSubjectService = async (subjectId: string): Promise<boolean> => {
  try {
    if (!subjectId) {
      throw new Error('Subject ID is required');
    }

    // Check if subject exists
    const existingSubject = await courseDal.getSubjectByIdDal(subjectId);
    if (!existingSubject) {
      throw new Error('Subject not found');
    }

    const result = await courseDal.deleteSubjectDal(subjectId);
    return result;
  } catch (error) {
    console.log('Error in deleteSubjectService:', error);
    throw error;
  }
};

export default {
  getAllCoursesService,
  getCourseByIdService,
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getSubjectsByCourseAndSemesterService,
  getAllSubjectsService,
  getSubjectByIdService,
  createSubjectService,
  updateSubjectService,
  deleteSubjectService,
};

