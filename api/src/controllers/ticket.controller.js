import { TicketBusiness } from '../business/ticket.business.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { toSupportTicket, toTicket } from '../utils/ticket.serializer.js';

export const TicketController = {
  create: asyncHandler(async (req, res) => {
    const ticket = await TicketBusiness.create(req.user, req.body);
    sendSuccess(res, {
      statusCode: 201,
      message: `تیکت شما با کد رهگیری ${ticket.tracking_code} ثبت شد.`,
      data: { ticket: toTicket(ticket) },
    });
  }),

  listMine: asyncHandler(async (req, res) => {
    const { rows, pagination } = await TicketBusiness.listMine(req.user.id, req.query);
    sendSuccess(res, { data: { tickets: rows.map(toTicket), pagination } });
  }),

  listAll: asyncHandler(async (req, res) => {
    const { rows, pagination } = await TicketBusiness.listAll(req.query);
    sendSuccess(res, { data: { tickets: rows.map(toSupportTicket), pagination } });
  }),

  answer: asyncHandler(async (req, res) => {
    const ticket = await TicketBusiness.answer(req.params.id, req.user, req.body);
    sendSuccess(res, {
      message: 'پاسخ تیکت با موفقیت ثبت شد.',
      data: { ticket: toSupportTicket(ticket) },
    });
  }),
};
