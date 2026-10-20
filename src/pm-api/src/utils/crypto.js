import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { config } from '../config/env.js';

/** Numeric code such as "048213" generated with a CSPRNG. */
export const generateNumericCode = (length = 6) =>
  String(randomInt(0, 10 ** length)).padStart(length, '0');

/** Verification codes are stored as HMAC(secret, code), never in plain text. */
export const hashCode = (code) =>
  createHmac('sha256', config.otp.secret).update(code).digest('hex');

/** Opaque random token (sent to the client). */
export const generateOpaqueToken = () => randomBytes(32).toString('hex');

/** Only the hash of the opaque token is stored in the database. */
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
