import { z } from 'zod';
import { TICKET_STATUS_VALUES } from '../constants/ticket.js';
import { buildLimitField, pageField } from './pagination.fields.js';

const titleField = z
  .string({ required_error: 'عنوان تیکت الزامی است.', invalid_type_error: 'عنوان تیکت باید متن باشد.' })
  .trim()
  .min(3, 'عنوان تیکت باید حداقل ۳ کاراکتر باشد.')
  .max(150, 'عنوان تیکت نباید بیشتر از ۱۵۰ کاراکتر باشد.');

const descriptionField = z
  .string({ required_error: 'توضیحات تیکت الزامی است.', invalid_type_error: 'توضیحات تیکت باید متن باشد.' })
  .trim()
  .min(10, 'توضیحات تیکت باید حداقل ۱۰ کاراکتر باشد.')
  .max(5000, 'توضیحات تیکت نباید بیشتر از ۵۰۰۰ کاراکتر باشد.');

const answerField = z
  .string({ required_error: 'متن پاسخ الزامی است.', invalid_type_error: 'متن پاسخ باید متن باشد.' })
  .trim()
  .min(2, 'متن پاسخ باید حداقل ۲ کاراکتر باشد.')
  .max(5000, 'متن پاسخ نباید بیشتر از ۵۰۰۰ کاراکتر باشد.');

export const createTicketSchema = z.object({
  title: titleField,
  description: descriptionField,
});

export const answerTicketSchema = z.object({
  answer: answerField,
});

export const ticketIdParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'شناسه تیکت معتبر نیست.' })
    .int('شناسه تیکت معتبر نیست.')
    .positive('شناسه تیکت معتبر نیست.'),
});

// query-string values arrive as strings, so numbers are coerced
export const listTicketsQuerySchema = z.object({
  page: pageField,
  limit: buildLimitField({ defaultValue: 20, max: 100 }),
  status: z
    .enum(TICKET_STATUS_VALUES, { errorMap: () => ({ message: 'وضعیت تیکت معتبر نیست.' }) })
    .optional(),
});
