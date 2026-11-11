import { z } from 'zod';
import { normalizeDigits } from '../utils/digits.js';
import { parseJalaliDate } from '../utils/jalali.js';

/**
 * Jalali date string ("1405/4/12", Persian digits allowed)
 * -> Gregorian 'YYYY-MM-DD' for the database.
 * Use `.nullable().optional()` where the date is not required.
 */
export const jalaliDateField = z.preprocess(
  normalizeDigits,
  z
    .string({ invalid_type_error: 'تاریخ باید متن باشد. نمونه: 1405/4/12' })
    .trim()
    .transform((value, ctx) => {
      const iso = parseJalaliDate(value);
      if (!iso) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'تاریخ شمسی معتبر نیست. نمونه صحیح: 1405/4/12',
        });
        return z.NEVER;
      }
      return iso;
    })
);
