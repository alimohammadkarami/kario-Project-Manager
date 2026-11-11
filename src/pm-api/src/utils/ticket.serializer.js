import { TICKET_STATUS_LABELS } from '../constants/ticket.js';
import { formatJalaliDate, formatTehranTime } from './jalali.js';

const withAnswer = (row, extra = {}) =>
  row.answer === null
    ? null
    : {
        text: row.answer,
        answeredAt: row.answered_at,
        jalaliDate: formatJalaliDate(row.answered_at),
        time: formatTehranTime(row.answered_at),
        ...extra,
      };

/** What the ticket's owner sees. */
export const toTicket = (row) => ({
  id: row.id,
  trackingCode: row.tracking_code,
  title: row.title,
  description: row.description,
  status: row.status,
  statusLabel: TICKET_STATUS_LABELS[row.status],
  createdAt: row.created_at,
  jalaliDate: formatJalaliDate(row.created_at),
  time: formatTehranTime(row.created_at),
  answer: withAnswer(row),
});

/** What support staff see: the same data plus who asked and who answered. */
export const toSupportTicket = (row) => ({
  ...toTicket(row),
  user: { id: row.user_id, fullName: row.user_full_name, email: row.user_email },
  answer: withAnswer(row, {
    answeredBy: row.answered_by ? { id: row.answered_by, fullName: row.answered_by_name } : null,
  }),
});
