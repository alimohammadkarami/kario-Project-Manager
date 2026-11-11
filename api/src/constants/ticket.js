export const TICKET_STATUS = Object.freeze({
  PENDING: 'pending',
  ANSWERED: 'answered',
});

export const TICKET_STATUS_VALUES = Object.values(TICKET_STATUS);

export const TICKET_STATUS_LABELS = Object.freeze({
  [TICKET_STATUS.PENDING]: 'در انتظار',
  [TICKET_STATUS.ANSWERED]: 'پاسخ داده شده',
});
