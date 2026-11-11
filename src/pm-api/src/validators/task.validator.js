import { z } from 'zod';
import { TASK_STATUS_VALUES } from '../constants/task.js';
import { jalaliDateField } from './common.dates.js';
import { buildLimitField, pageField } from './pagination.fields.js';

const titleField = z
  .string({ required_error: 'عنوان تسک الزامی است.', invalid_type_error: 'عنوان تسک باید متن باشد.' })
  .trim()
  .min(3, 'عنوان تسک باید حداقل ۳ کاراکتر باشد.')
  .max(150, 'عنوان تسک نباید بیشتر از ۱۵۰ کاراکتر باشد.');

const descriptionField = z
  .string({ invalid_type_error: 'توضیحات تسک باید متن باشد.' })
  .trim()
  .max(5000, 'توضیحات تسک نباید بیشتر از ۵۰۰۰ کاراکتر باشد.');

const assigneeIdField = z
  .string({ invalid_type_error: 'شناسه مسئول تسک معتبر نیست.' })
  .uuid('شناسه مسئول تسک معتبر نیست.');

const statusField = z.enum(TASK_STATUS_VALUES, {
  errorMap: (issue, ctx) => ({
    message:
      issue.code === z.ZodIssueCode.invalid_type
        ? 'وضعیت تسک الزامی است.'
        : 'وضعیت تسک معتبر نیست.',
  }),
});

export const taskParamsSchema = z.object({
  taskId: z.string({ required_error: 'شناسه تسک الزامی است.' }).uuid('شناسه تسک معتبر نیست.'),
});

export const createTaskSchema = z.object({
  title: titleField,
  description: descriptionField.nullable().optional(),
  dueDate: jalaliDateField.nullable().optional(),
  assigneeId: assigneeIdField.nullable().optional(), // omitted/null = unassigned
});

export const updateTaskSchema = z
  .object({
    title: titleField.optional(),
    description: descriptionField.nullable().optional(),
    dueDate: jalaliDateField.nullable().optional(),
    assigneeId: assigneeIdField.nullable().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'حداقل یکی از فیلدها باید ارسال شود.',
  });

export const changeTaskStatusSchema = z.object({
  status: statusField,
});

export const listTasksQuerySchema = z.object({
  page: pageField,
  limit: buildLimitField({ defaultValue: 50, max: 100 }),
  status: statusField.optional(),
});
