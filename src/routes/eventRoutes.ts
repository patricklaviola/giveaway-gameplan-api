import { Router } from 'express';

import {
  getEventById,
  getAllEvents,
  createEvent,
  createManyEvents,
  deleteEventById,
  deleteAllEvents,
} from '../controllers/eventController.js';

const router = Router();

router.get('/:id', getEventById);
router.get('/', getAllEvents);
router.post('/', createEvent);
router.post('/batch', createManyEvents);
router.delete('/:id', deleteEventById);
router.delete('/', deleteAllEvents);

export default router;
