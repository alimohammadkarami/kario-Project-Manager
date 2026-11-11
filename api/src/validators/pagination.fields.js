import { z } from 'zod';

export const pageField = z.coerce
  .number({ invalid_type_error: 'شماره صفحه معتبر نیست.' })
  .int('شماره صفحه معتبر نیست.')
  .min(1, 'شماره صفحه باید حداقل ۱ باشد.')
  .default(1);

export const buildLimitField = ({ defaultValue = 20, max = 100 } = {}) =>
  z.coerce
    .number({ invalid_type_error: 'تعداد در هر صفحه معتبر نیست.' })
    .int('تعداد در هر صفحه معتبر نیست.')
    .min(1, 'تعداد در هر صفحه باید حداقل ۱ باشد.')
    .max(max, `تعداد در هر صفحه نباید بیشتر از ${max} باشد.`)
    .default(defaultValue);
