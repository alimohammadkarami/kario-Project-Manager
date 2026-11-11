import { z } from 'zod';
import { emailField } from './common.fields.js';
import { jalaliDateField } from './common.dates.js';
import { buildLimitField, pageField } from './pagination.fields.js';

const projectId = z
  .string({ required_error: 'شناسه پروژه الزامی است.' })
  .uuid('شناسه پروژه معتبر نیست.');

const titleField = z
  .string({ required_error: 'عنوان پروژه الزامی است.', invalid_type_error: 'عنوان پروژه باید متن باشد.' })
  .trim()
  .min(3, 'عنوان پروژه باید حداقل ۳ کاراکتر باشد.')
  .max(150, 'عنوان پروژه نباید بیشتر از ۱۵۰ کاراکتر باشد.');

const descriptionField = z
  .string({ invalid_type_error: 'توضیحات پروژه باید متن باشد.' })
  .trim()
  .max(5000, 'توضیحات پروژه نباید بیشتر از ۵۰۰۰ کاراکتر باشد.');

const hasAtLeastOneField = [
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'حداقل یکی از فیلدها باید ارسال شود.' },
];

export const projectParamsSchema = z.object({ projectId });

export const memberParamsSchema = z.object({
  projectId,
  userId: z.string({ required_error: 'شناسه کاربر الزامی است.' }).uuid('شناسه کاربر معتبر نیست.'),
});

export const createProjectSchema = z.object({
  title: titleField,
  description: descriptionField.nullable().optional(),
  dueDate: jalaliDateField.nullable().optional(),
});

export const updateProjectSchema = z
  .object({
    title: titleField.optional(),
    description: descriptionField.nullable().optional(),
    dueDate: jalaliDateField.nullable().optional(),
  })
  .refine(...hasAtLeastOneField);

export const archiveProjectSchema = z.object({
  isArchived: z.boolean({ invalid_type_error: 'مقدار isArchived باید true یا false باشد.' }).default(true),
});

export const listProjectsQuerySchema = z.object({
  page: pageField,
  limit: buildLimitField({ defaultValue: 20, max: 50 }),
  archived: z
    .enum(['true', 'false'], { errorMap: () => ({ message: 'مقدار archived باید true یا false باشد.' }) })
    .transform((value) => value === 'true')
    .optional(),
});

export const addMemberSchema = z.object({
  email: emailField,
});
