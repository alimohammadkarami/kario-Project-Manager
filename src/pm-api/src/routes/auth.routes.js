import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
  sendCodeLimiter,
  verifyCodeLimiter,
} from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validate.js';
import {
  loginSchema,
  modifyInfoSchema,
  registerSchema,
  resetPasswordSchema,
  sendVerificationCodeSchema,
  verifyCodeSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Pipeline per route: rate limit -> (authenticate) -> validate -> controller
router.post('/register', registerLimiter, validate(registerSchema), AuthController.register);
router.post('/login', loginLimiter, validate(loginSchema), AuthController.login);

router.post(
  '/verification-code',
  sendCodeLimiter,
  validate(sendVerificationCodeSchema),
  AuthController.sendVerificationCode
);
router.post('/verify', verifyCodeLimiter, validate(verifyCodeSchema), AuthController.verifyCode);
router.post(
  '/forgot-password',
  resetPasswordLimiter,
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

router.patch('/modify-info', authenticate, validate(modifyInfoSchema), AuthController.modifyInfo);
router.get('/me', authenticate, AuthController.me);

export default router;
