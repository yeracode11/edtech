import { Router } from 'express';
import { CourseController } from '../controllers/courseController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const courseController = new CourseController();

router.get('/', (req, res) => courseController.getAllCourses(req, res));
router.get('/my-courses', authenticate, (req, res) => courseController.getUserCourses(req, res));
router.get('/:id', (req, res) => courseController.getCourseById(req, res));
router.post('/', authenticate, requireAdmin, (req, res) => courseController.createCourse(req, res));
router.put('/:id', authenticate, requireAdmin, (req, res) => courseController.updateCourse(req, res));
router.delete('/:id', authenticate, requireAdmin, (req, res) => courseController.deleteCourse(req, res));

export default router;



