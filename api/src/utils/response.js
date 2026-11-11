/**
 * Unified response envelope:
 * { success, error, data, message }
 */
export function sendSuccess(res, { statusCode = 200, data = null, message = '' } = {}) {
  return res.status(statusCode).json({
    success: true,
    error: null,
    data,
    message,
  });
}

export function sendError(res, { statusCode = 500, code, message, details = null }) {
  return res.status(statusCode).json({
    success: false,
    error: { code, details },
    data: null,
    message,
  });
}
