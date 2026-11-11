import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { ProjectMemberController } from '../controllers/projectMember.controller.js';
import { TaskController } from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validate } from '../middlewares/validate.js';
import {
  addMemberSchema,
  archiveProjectSchema,
  createProjectSchema,
  listProjectsQuerySchema,
  memberParamsSchema,
  projectParamsSchema,
  updateProjectSchema,
} from '../validators/project.validator.js';
import { createTaskSchema, listTasksQuerySchema } from '../validators/task.validator.js';

const router = Router();

// Authorization (member / manager) is enforced in the business layer (projectAccess.js),
// because it depends on the user's role INSIDE the specific project.
router.use(authenticate);

// projects
router.post('/', validate(createProjectSchema), ProjectController.create);
router.get('/', validate(listProjectsQuerySchema, 'query'), ProjectController.listMine);
router.get('/:projectId', validate(projectParamsSchema, 'params'), ProjectController.preview);
router.patch(
  '/:projectId',
  validate(projectParamsSchema, 'params'),
  validate(updateProjectSchema),
  ProjectController.update
);
router.delete('/:projectId', validate(projectParamsSchema, 'params'), ProjectController.remove);
router.patch(
  '/:projectId/archive',
  validate(projectParamsSchema, 'params'),
  validate(archiveProjectSchema),
  ProjectController.archive
);

// members
router.get(
  '/:projectId/members',
  validate(projectParamsSchema, 'params'),
  ProjectMemberController.list
);
router.post(
  '/:projectId/members',
  validate(projectParamsSchema, 'params'),
  validate(addMemberSchema),
  ProjectMemberController.add
);
router.delete(
  '/:projectId/members/:userId',
  validate(memberParamsSchema, 'params'),
  ProjectMemberController.remove
);

// tasks of a project
router.get(
  '/:projectId/tasks',
  validate(projectParamsSchema, 'params'),
  validate(listTasksQuerySchema, 'query'),
  TaskController.listByProject
);
router.post(
  '/:projectId/tasks',
  validate(projectParamsSchema, 'params'),
  validate(createTaskSchema),
  TaskController.create
);

export default router;
