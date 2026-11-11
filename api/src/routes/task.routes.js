import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import {
  changeTaskStatusSchema,
  listTasksQuerySchema,
  taskParamsSchema,
  updateTaskSchema,
} from '../validators/task.validator.js';

const router = Router();

router.use(authenticate);

// declared before '/:taskId' routes
router.get('/mine', validate(listTasksQuerySchema, 'query'), TaskController.listMine);

// the assignee changes the status of their own task (project role is irrelevant)
router.patch(
  '/:taskId/status',
  validate(taskParamsSchema, 'params'),
  validate(changeTaskStatusSchema),
  TaskController.changeStatus
);

// project manager only (checked in the business layer)
router.patch(
  '/:taskId',
  validate(taskParamsSchema, 'params'),
  validate(updateTaskSchema),
  TaskController.update
);
router.delete('/:taskId', validate(taskParamsSchema, 'params'), TaskController.remove);

export default router;
