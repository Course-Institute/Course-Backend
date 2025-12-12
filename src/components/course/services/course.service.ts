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
  coursesType?: string;
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
    coursesType?: string;
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
  semester?: number,
  year?: number
): Promise<ISubject[]> => {
  try {
    // Validate inputs
    if (!courseId) {
      throw new Error('Course ID is required');
    }

    const hasSemester = semester !== undefined && semester !== null;
    const hasYear = year !== undefined && year !== null;

    if (hasSemester && hasYear) {
      throw new Error('Provide either semester or year, not both');
    }

    if (!hasSemester && !hasYear) {
      throw new Error('Semester or year is required');
    }

    let normalizedSemester: number | undefined = undefined;
    let normalizedYear: number | undefined = undefined;

    if (hasSemester) {
      const semesterNum = Number(semester);
      if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        throw new Error('Semester must be a valid number between 1 and 8');
      }
      normalizedSemester = semesterNum;
    } else if (hasYear) {
      const yearNum = Number(year);
      if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
        throw new Error('Year must be a valid number between 1 and 4');
      }
      normalizedYear = yearNum;
    }

    const subjects = await courseDal.getSubjectsByCourseAndSemesterDal(
      courseId,
      normalizedSemester,
      normalizedYear
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
  year?: number;
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
  semester?: number | null;
  year?: number | null;
  code?: string;
  credits?: number;
}): Promise<ISubject> => {
  try {
    // Validate mutual exclusivity
    const hasSemester = subjectData.semester !== undefined && subjectData.semester !== null;
    const hasYear = subjectData.year !== undefined && subjectData.year !== null;

    if (hasSemester && hasYear) {
      throw new Error('Provide either semester or year, not both');
    }

    if (!hasSemester && !hasYear) {
      throw new Error('Either semester or year is required');
    }

    // Validate semester range if provided
    if (hasSemester) {
      const semesterNum = Number(subjectData.semester);
      if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        throw new Error('Semester must be between 1 and 8');
      }
    }

    // Validate year range if provided
    if (hasYear) {
      const yearNum = Number(subjectData.year);
      if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
        throw new Error('Year must be between 1 and 4');
      }
    }

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
    semester?: number | null;
    year?: number | null;
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

    // Validate mutual exclusivity if term fields are being updated
    const hasSemester = updateData.semester !== undefined && updateData.semester !== null;
    const hasYear = updateData.year !== undefined && updateData.year !== null;

    if (hasSemester && hasYear) {
      throw new Error('Provide either semester or year, not both');
    }

    // Validate semester range if provided
    if (hasSemester) {
      const semesterNum = Number(updateData.semester);
      if (isNaN(semesterNum) || semesterNum < 1 || semesterNum > 8) {
        throw new Error('Semester must be between 1 and 8');
      }
    }

    // Validate year range if provided
    if (hasYear) {
      const yearNum = Number(updateData.year);
      if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
        throw new Error('Year must be between 1 and 4');
      }
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

