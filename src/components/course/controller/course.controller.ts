import { Request, Response } from 'express';
import courseService from '../services/course.service.js';
import { sendResponse } from '../../../utils/response.util.js';

const getAllCoursesController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const courses = await courseService.getAllCoursesService();

    // Format response according to specification with all fields
    const formattedCourses = courses.map((course) => ({
      _id: String(course._id),
      name: course.name,
      code: course.code || undefined,
      coursesType: course.coursesType || undefined,
      duration: course.duration || undefined,
      description: course.description || undefined,
      createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : undefined,
      updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : undefined,
    }));

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Courses fetched successfully',
      data: formattedCourses,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to fetch courses',
      data: [],
    });
  }
};

const createCourseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, code, coursesType, duration, description } = req.body;

    const course = await courseService.createCourseService({
      name,
      code,
      coursesType,
      duration,
      description,
    });

    // Format response
    const formattedCourse = {
      _id: String(course._id),
      name: course.name,
      code: course.code || undefined,
      coursesType: course.coursesType || undefined,
      duration: course.duration || undefined,
      description: course.description || undefined,
      createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : new Date().toISOString(),
    };

    return sendResponse({
      res,
      statusCode: 201,
      status: true,
      message: 'Course created successfully',
      data: formattedCourse,
    });
  } catch (error: any) {
    // Handle duplicate errors
    if (error.message.includes('already exists')) {
      return sendResponse({
        res,
        statusCode: 409,
        status: false,
        message: error.message,
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to create course',
    });
  }
};

const updateCourseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;
    const { name, code, coursesType, duration, description } = req.body;

    if (!courseId) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Course ID is required',
      });
    }

    const course = await courseService.updateCourseService(courseId, {
      name,
      code,
      coursesType,
      duration,
      description,
    });

    if (!course) {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Course not found',
      });
    }

    // Format response
    const formattedCourse = {
      _id: String(course._id),
      name: course.name,
      code: course.code || undefined,
      coursesType: course.coursesType || undefined,
      duration: course.duration || undefined,
      description: course.description || undefined,
      createdAt: course.createdAt ? new Date(course.createdAt).toISOString() : undefined,
      updatedAt: course.updatedAt ? new Date(course.updatedAt).toISOString() : new Date().toISOString(),
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Course updated successfully',
      data: formattedCourse,
    });
  } catch (error: any) {
    // Handle duplicate errors
    if (error.message.includes('already exists')) {
      return sendResponse({
        res,
        statusCode: 409,
        status: false,
        message: error.message,
      });
    }

    if (error.message === 'Course not found') {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Course not found',
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to update course',
    });
  }
};

const deleteCourseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Course ID is required',
      });
    }

    const result = await courseService.deleteCourseService(courseId);

    if (!result) {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Course not found',
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Course not found') {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Course not found',
      });
    }

    if (error.message.includes('associated subjects')) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: error.message,
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to delete course',
    });
  }
};

const getSubjectsByCourseAndSemesterController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId, semester, year } = req.query;

    // Validate required parameters
    if (!courseId) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Course ID is required',
        data: [],
      });
    }

    const hasSemester = semester !== undefined && semester !== null && semester !== '';
    const hasYear = year !== undefined && year !== null && year !== '';

    if (hasSemester && hasYear) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Provide either semester or year, not both',
        data: [],
      });
    }

    if (!hasSemester && !hasYear) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Either semester or year is required',
        data: [],
      });
    }

    const subjects = await courseService.getSubjectsByCourseAndSemesterService(
      courseId as string,
      hasSemester ? Number(semester) : undefined,
      hasYear ? Number(year) : undefined
    );

    // Format response according to specification
    const formattedSubjects = subjects.map((subject: any) => ({
      _id: String(subject._id),
      name: subject.name,
      semester: subject.semester || null,
      year: subject.year || null,
    }));

    // If no subjects found, return empty array with appropriate message
    if (formattedSubjects.length === 0) {
      return sendResponse({
        res,
        statusCode: 200,
        status: true,
        message: 'No subjects found for the given course and term',
        data: [],
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Subjects fetched successfully',
      data: formattedSubjects,
    });
  } catch (error: any) {
    // Handle specific error messages
    if (error.message === 'Course not found') {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Course not found',
        data: [],
      });
    }

    if (error.message === 'Invalid course ID format') {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Invalid course ID format',
        data: [],
      });
    }

    if (error.message.includes('Provide either semester or year')) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: error.message,
        data: [],
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to fetch subjects',
      data: [],
    });
  }
};

const getAllSubjectsController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { courseId, semester, year } = req.query;

    const filters: { courseId?: string; semester?: number; year?: number } = {};
    if (courseId) filters.courseId = courseId as string;
    if (semester) filters.semester = Number(semester);
    if (year) filters.year = Number(year);

    const subjects = await courseService.getAllSubjectsService(filters);

    // Format response with course information
    const formattedSubjects = subjects.map((subject: any) => ({
      _id: String(subject._id),
      name: subject.name,
      courseId: String(subject.courseId?._id || subject.courseId),
      courseName: subject.courseId?.name || undefined,
      semester: subject.semester || null,
      year: subject.year || null,
      code: subject.code || undefined,
      credits: subject.credits || undefined,
      createdAt: subject.createdAt ? new Date(subject.createdAt).toISOString() : undefined,
      updatedAt: subject.updatedAt ? new Date(subject.updatedAt).toISOString() : undefined,
    }));

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Subjects fetched successfully',
      data: formattedSubjects,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to fetch subjects',
      data: [],
    });
  }
};

const createSubjectController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, courseId, semester, year, code, credits } = req.body;

    const subject = await courseService.createSubjectService({
      name,
      courseId,
      semester: semester !== undefined && semester !== '' ? Number(semester) : null,
      year: year !== undefined && year !== '' ? Number(year) : null,
      code,
      credits,
    });

    // Format response
    const formattedSubject = {
      _id: String(subject._id),
      name: subject.name,
      courseId: String(subject.courseId),
      semester: (subject as any).semester || null,
      year: (subject as any).year || null,
      code: subject.code || undefined,
      credits: subject.credits || undefined,
      createdAt: subject.createdAt ? new Date(subject.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: subject.updatedAt ? new Date(subject.updatedAt).toISOString() : new Date().toISOString(),
    };

    return sendResponse({
      res,
      statusCode: 201,
      status: true,
      message: 'Subject created successfully',
      data: formattedSubject,
    });
  } catch (error: any) {
    if (error.message === 'Course not found') {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Course not found',
      });
    }

    if (error.message.includes('Provide either semester or year') || error.message.includes('Either semester or year is required')) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: error.message,
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to create subject',
    });
  }
};

const updateSubjectController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { subjectId } = req.params;
    const { name, courseId, semester, year, code, credits } = req.body;

    if (!subjectId) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Subject ID is required',
      });
    }

    const subject = await courseService.updateSubjectService(subjectId, {
      name,
      courseId,
      semester: semester !== undefined && semester !== '' ? Number(semester) : null,
      year: year !== undefined && year !== '' ? Number(year) : null,
      code,
      credits,
    });

    if (!subject) {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Subject not found',
      });
    }

    // Format response
    const formattedSubject = {
      _id: String(subject._id),
      name: subject.name,
      courseId: String(subject.courseId),
      semester: (subject as any).semester || null,
      year: (subject as any).year || null,
      code: subject.code || undefined,
      credits: subject.credits || undefined,
      createdAt: subject.createdAt ? new Date(subject.createdAt).toISOString() : undefined,
      updatedAt: subject.updatedAt ? new Date(subject.updatedAt).toISOString() : new Date().toISOString(),
    };

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Subject updated successfully',
      data: formattedSubject,
    });
  } catch (error: any) {
    if (error.message === 'Subject not found' || error.message === 'Course not found') {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: error.message,
      });
    }

    if (error.message.includes('Provide either semester or year')) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: error.message,
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to update subject',
    });
  }
};

const deleteSubjectController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { subjectId } = req.params;

    if (!subjectId) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: 'Subject ID is required',
      });
    }

    const result = await courseService.deleteSubjectService(subjectId);

    if (!result) {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Subject not found',
      });
    }

    return sendResponse({
      res,
      statusCode: 200,
      status: true,
      message: 'Subject deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Subject not found') {
      return sendResponse({
        res,
        statusCode: 404,
        status: false,
        message: 'Subject not found',
      });
    }

    if (error.message.includes('associated marksheets')) {
      return sendResponse({
        res,
        statusCode: 400,
        status: false,
        message: error.message,
      });
    }

    return sendResponse({
      res,
      statusCode: 400,
      status: false,
      message: error.message || 'Failed to delete subject',
    });
  }
};

export default {
  getAllCoursesController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
  getSubjectsByCourseAndSemesterController,
  getAllSubjectsController,
  createSubjectController,
  updateSubjectController,
  deleteSubjectController,
};

