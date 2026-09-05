import { Router } from 'express';
import { getBudget, saveBudget } from './budget.controller.js';

const router = Router();

router.get('/', getBudget);
router.post('/', saveBudget);

export default router;