import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { UserController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.js';
import { assignSupportStaffSchema } from '../validators/user.validator.js';

const router = Router();

// admin only (the admin role itself is assigned manually in the database)
router.post(
  '/support-staff',
  authenticate,
  authorize(ROLES.ADMIN),
  validate(assignSupportStaffSchema),
  UserController.assignSupportStaff
);

export default router;
