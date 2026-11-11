import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { TicketController } from '../controllers/ticket.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { ticketCreateLimiter } from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validate.js';
import {
  answerTicketSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  ticketIdParamSchema,
} from '../validators/ticket.validator.js';

const router = Router();

// every ticket route requires a logged-in user
router.use(authenticate);

// any logged-in user
router.post('/', ticketCreateLimiter, validate(createTicketSchema), TicketController.create);
router.get('/mine', validate(listTicketsQuerySchema, 'query'), TicketController.listMine);

// support staff only
router.get(
  '/',
  authorize(ROLES.SUPPORT),
  validate(listTicketsQuerySchema, 'query'),
  TicketController.listAll
);
router.post(
  '/:id/answer',
  authorize(ROLES.SUPPORT),
  validate(ticketIdParamSchema, 'params'),
  validate(answerTicketSchema),
  TicketController.answer
);

export default router;
