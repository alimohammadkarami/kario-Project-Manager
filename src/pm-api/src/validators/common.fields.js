import { z } from 'zod';
import { normalizeDigits } from '../utils/digits.js';

/** Reusable zod fields, so messages and rules live in exactly one place. */

export const emailField = z
  .string({ required_error: 'ایمیل الزامی است.', invalid_type_error: 'ایمیل باید متن باشد.' })
  .trim()
  .toLowerCase()
  .min(1, 'ایمیل الزامی است.')
  .max(255, 'ایمیل نباید بیشتر از ۲۵۵ کاراکتر باشد.')
  .email('فرمت ایمیل معتبر نیست.');

export const fullNameField = z
  .string({ required_error: 'نام کامل الزامی است.', invalid_type_error: 'نام کامل باید متن باشد.' })
  .trim()
  .min(2, 'نام کامل باید حداقل ۲ کاراکتر باشد.')
  .max(100, 'نام کامل نباید بیشتر از ۱۰۰ کاراکتر باشد.')
  .regex(/^[\p{L}\p{M}\s.'\-\u200c]+$/u, 'نام کامل فقط می‌تواند شامل حروف و فاصله باشد.')
  .transform((value) => value.replace(/\s+/g, ' '));

export const passwordField = z
  .string({ required_error: 'رمز عبور الزامی است.', invalid_type_error: 'رمز عبور باید متن باشد.' })
  .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد.')
  .regex(/[A-Za-z]/, 'رمز عبور باید حداقل شامل یک حرف انگلیسی باشد.')
  .regex(/\d/, 'رمز عبور باید حداقل شامل یک عدد باشد.')
  // bcrypt only uses the first 72 bytes of the input
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'رمز عبور بیش از حد طولانی است.');

export const confirmPasswordField = z.string({
  required_error: 'تکرار رمز عبور الزامی است.',
  invalid_type_error: 'تکرار رمز عبور باید متن باشد.',
});

export const verificationCodeField = z.preprocess(
  normalizeDigits,
  z
    .string({ required_error: 'کد تأیید الزامی است.', invalid_type_error: 'کد تأیید معتبر نیست.' })
    .trim()
    .regex(/^\d{6}$/, 'کد تأیید باید ۶ رقم باشد.')
);

export const resetTokenField = z
  .string({ required_error: 'توکن بازیابی الزامی است.', invalid_type_error: 'توکن بازیابی معتبر نیست.' })
  .trim()
  .regex(/^[a-f0-9]{64}$/i, 'توکن بازیابی معتبر نیست.');

/** Reused by every schema that has a password + confirmation pair. */
export const passwordsMatch = [
  (data) => data.password === data.confirmPassword,
  { message: 'تکرار رمز عبور با رمز عبور مطابقت ندارد.', path: ['confirmPassword'] },
];
