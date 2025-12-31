import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import lessonRoutes from './lesson.routes';
import testRoutes from './test.routes';
import progressRoutes from './progress.routes';
import paymentRoutes from './payment.routes';
import enrollmentRoutes from './enrollment.routes';
import userRoutes from './user.routes';
import videoRoutes from './video.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/tests', testRoutes);
router.use('/progress', progressRoutes);
router.use('/payments', paymentRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/users', userRoutes);
router.use('/videos', videoRoutes);
router.use('/upload', uploadRoutes);

export default router;

