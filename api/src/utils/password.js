import bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { config } from '../config/env.js';

export const hashPassword = (plain) => bcrypt.hash(plain, config.bcryptSaltRounds);

export const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

let dummyHash;

/**
 * Burns the same CPU time as a real comparison. Used when the email does not
 * exist so response time does not reveal which emails are registered.
 */
export async function fakeComparePassword(plain) {
  dummyHash ??= await hashPassword(randomBytes(16).toString('hex'));
  await bcrypt.compare(plain, dummyHash);
}
