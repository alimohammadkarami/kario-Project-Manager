export const TASK_STATUS = Object.freeze({
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
});

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);

export const TASK_STATUS_LABELS = Object.freeze({
  [TASK_STATUS.TODO]: 'در انتظار',
  [TASK_STATUS.IN_PROGRESS]: 'در حال انجام',
  [TASK_STATUS.DONE]: 'تکمیل شده',
});
