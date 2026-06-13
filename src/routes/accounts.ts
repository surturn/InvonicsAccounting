import { Router } from 'express';
import { getAllAccounts, getAccountsByType } from '../db/queries/accounts';
import { z } from 'zod';

const router = Router();

const typeSchema = z.object({
  type: z.enum(['asset', 'liability', 'equity', 'income', 'expense'])
});

router.get('/', async (req, res, next) => {
  try {
    const accounts = await getAllAccounts();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get('/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const parsed = typeSchema.safeParse({ type });
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const accounts = await getAccountsByType(parsed.data.type);
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

export default router;
