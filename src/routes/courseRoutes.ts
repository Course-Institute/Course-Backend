import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Create a new course
router.post('/', async (req, res) => {
  const { title, description, price, duration } = req.body;
  const course = new Course({ title, description, price, duration });
  await course.save();
  res.status(201).json(course);
});

export default router;
