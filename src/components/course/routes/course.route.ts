import express from 'express';
import courseController from '../controller/course.controller.js';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware.js';
import {
  validateCreateCourse,
  validateUpdateCourse,
  validateCreateSubject,
  validateUpdateSubject,
} from '../validations/course.validation.js';

const router = express.Router();

// Course routes - GET operations (may require authentication)
router.get(
  '/getAllCourses',
  authenticateToken,
  courseController.getAllCoursesController
);

router.get(
  '/getSubjectsByCourseAndSemester',
  authenticateToken,
  courseController.getSubjectsByCourseAndSemesterController
);

router.get(
  '/getAllSubjects',
  authenticateToken,
  courseController.getAllSubjectsController
);

// Course routes - CRUD operations (require admin authentication)
router.post(
  '/createCourse',
  authenticateToken,
  authorizeAdmin,
  validateCreateCourse,
  courseController.createCourseController
);

router.put(
  '/updateCourse/:courseId',
  authenticateToken,
  authorizeAdmin,
  validateUpdateCourse,
  courseController.updateCourseController
);

router.delete(
  '/deleteCourse/:courseId',
  authenticateToken,
  authorizeAdmin,
  courseController.deleteCourseController
);

// Subject routes - CRUD operations (require admin authentication)
router.post(
  '/createSubject',
  authenticateToken,
  authorizeAdmin,
  validateCreateSubject,
  courseController.createSubjectController
);

router.put(
  '/updateSubject/:subjectId',
  authenticateToken,
  authorizeAdmin,
  validateUpdateSubject,
  courseController.updateSubjectController
);

router.delete(
  '/deleteSubject/:subjectId',
  authenticateToken,
  authorizeAdmin,
  courseController.deleteSubjectController
);

export default router;

