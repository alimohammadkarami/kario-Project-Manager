import { AppError } from '../utils/AppError.js';

/**
 * validate(schema)            -> validates req.body
 * validate(schema, 'params')  -> validates req.params
 * On success the parsed (trimmed, normalized, unknown keys stripped) value
 * replaces the original, so controllers only ever see clean data.
 */
export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new AppError(422, 'VALIDATION_ERROR', details[0].message, details));
    }

    req[source] = result.data;
    return next();
  };
