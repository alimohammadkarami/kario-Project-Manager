import { withTransaction } from '../config/db.js';
import { TicketModel } from '../models/ticket.model.js';
import { AppError } from '../utils/AppError.js';
import { buildPagination, getOffset } from '../utils/pagination.js';
import { buildTrackingCode } from '../utils/trackingCode.js';

/** Ticketing rules: one ticket -> one answer -> ticket is closed ("answered"). */

async function listPage({ userId, status, page, limit }) {
  const { rows, total } = await TicketModel.list({
    userId,
    status,
    limit,
    offset: getOffset(page, limit),
  });
  return { rows, pagination: buildPagination({ page, limit, total }) };
}

export const TicketBusiness = {
  async create(user, { title, description }) {
    // whole seconds only, so the stored value and the tracking code can never disagree
    const createdAt = new Date(Math.floor(Date.now() / 1000) * 1000);

    // the tracking code needs the row id, so insert + code update happen together
    const ticketId = await withTransaction(async (conn) => {
      const id = await TicketModel.create(
        { userId: user.id, title, description, createdAt },
        conn
      );
      await TicketModel.setTrackingCode(id, buildTrackingCode(createdAt, id), conn);
      return id;
    });

    return TicketModel.findDetailedById(ticketId);
  },

  /** The logged-in user's own tickets. */
  listMine(userId, query) {
    return listPage({ userId, ...query });
  },

  /** Every ticket (support staff only - enforced in the route). */
  listAll(query) {
    return listPage(query);
  },

  async answer(ticketId, supportUser, { answer }) {
    const answered = await TicketModel.answer(ticketId, {
      answer,
      answeredBy: supportUser.id,
      answeredAt: new Date(Math.floor(Date.now() / 1000) * 1000),
    });

    if (!answered) {
      // either the ticket does not exist or someone already answered it
      const ticket = await TicketModel.findDetailedById(ticketId);
      if (!ticket) {
        throw new AppError(404, 'TICKET_NOT_FOUND', 'تیکت موردنظر یافت نشد.');
      }
      throw new AppError(409, 'TICKET_ALREADY_ANSWERED', 'این تیکت قبلاً پاسخ داده شده است.');
    }

    return TicketModel.findDetailedById(ticketId);
  },
};
