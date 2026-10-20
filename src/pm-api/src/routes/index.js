import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/auth', authRoutes);
// next modules: router.use('/projects', projectRoutes); router.use('/tasks', taskRoutes);

export default router;
