import { Router } from 'express';
import {
  getHistory,
  getHistoryById,
  deleteHistory,
  getSamples,
} from '../controllers/historyController.js';

const router = Router();

router.get('/', getHistory);
router.get('/samples', getSamples);
router.get('/:id', getHistoryById);
router.delete('/:id', deleteHistory);

export default router;
