import { body, validationResult } from 'express-validator';

export const createTodoValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('startTime').isISO8601().withMessage('Start time must be a valid ISO8601 date'),
  body('endTime').isISO8601().withMessage('End time must be a valid ISO8601 date'),
  body('durationMinutes').optional().isNumeric().withMessage('Duration must be a number'),
  body('reminder').optional().isISO8601().withMessage('Reminder must be a valid ISO8601 date'),
  body('status').optional().isIn(['COMPLETED', 'PENDING', 'CANCELLED']).withMessage('Status must be COMPLETED, PENDING, or CANCELLED'),
  body('completedTime').optional().isISO8601().withMessage('Completed time must be a valid ISO8601 date'),
];
export const updateTodoValidator = [
  body('task').optional().notEmpty().withMessage('Task cannot be empty'),
  body('from').optional().isISO8601().withMessage('Invalid start date/time format'),
  body('to').optional().isISO8601().withMessage('Invalid end date/time format'),
  body('durationMinutes').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
  body('reminder').optional().isISO8601().withMessage('Invalid reminder date/time format'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};