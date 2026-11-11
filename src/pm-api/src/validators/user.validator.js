import { z } from 'zod';
import { emailField } from './common.fields.js';

export const assignSupportStaffSchema = z.object({
  email: emailField,
});
