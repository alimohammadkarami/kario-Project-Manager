import { formatJalaliCompact } from './jalali.js';

/** <Jalali date YYYYMMDD>-<database row id padded to 4 digits> -> 14050412-0027 */
export const buildTrackingCode = (createdAt, rowId) =>
  `${formatJalaliCompact(createdAt)}-${String(rowId).padStart(4, '0')}`;
