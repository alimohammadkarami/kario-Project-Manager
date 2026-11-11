/**
 * Expected (operational) error. Anything that is not an AppError
 * is treated as a bug and answered with a generic 500.
 */
export class AppError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
