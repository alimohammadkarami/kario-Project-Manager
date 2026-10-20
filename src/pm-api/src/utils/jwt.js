import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const ALGORITHM = 'HS256';

export const signAccessToken = (userId) =>
  jwt.sign({}, config.jwt.secret, {
    algorithm: ALGORITHM,
    subject: userId,
    expiresIn: config.jwt.expiresIn,
  });

/** Throws jsonwebtoken errors (TokenExpiredError / JsonWebTokenError). */
export const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.secret, { algorithms: [ALGORITHM] });
