import { z } from 'zod';
import {
  confirmPasswordField,
  emailField,
  fullNameField,
  passwordField,
  passwordsMatch,
  resetTokenField,
  verificationCodeField,
} from './common.fields.js';

export const registerSchema = z
  .object({
    fullName: fullNameField,
    email: emailField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine(...passwordsMatch);

export const loginSchema = z.object({
  email: emailField,
  // no strength rules on login: only check that something was sent
  password: z
    .string({ required_error: 'رمز عبور الزامی است.', invalid_type_error: 'رمز عبور باید متن باشد.' })
    .min(1, 'رمز عبور الزامی است.'),
});

export const sendVerificationCodeSchema = z.object({
  email: emailField,
});

export const verifyCodeSchema = z.object({
  email: emailField,
  code: verificationCodeField,
});

export const resetPasswordSchema = z
  .object({
    resetToken: resetTokenField,
    password: passwordField,
    confirmPassword: confirmPasswordField,
  })
  .refine(...passwordsMatch);

export const modifyInfoSchema = z.object({
  fullName: fullNameField,
});
export const modifyPassSchema = z.object({
  CurrentPassword: passwordField,
  NewPassword: passwordField,
});