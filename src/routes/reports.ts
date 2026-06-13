import { Router } from 'express';
import { z } from 'zod';
import { getPLReport, getTOTReport, getTrialBalance, getCashFlow } from '../db/queries/reports';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const dateQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

router.use(authenticateToken);

router.get('/pl', async (req, res, next) => {
  try {
    const parsed = dateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid dates' });
    const report = await getPLReport(parsed.data.from, parsed.data.to);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

router.get('/tot', async (req, res, next) => {
  try {
    const parsed = dateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid dates' });
    const report = await getTOTReport(parsed.data.from, parsed.data.to);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

router.get('/trial-balance', async (req, res, next) => {
  try {
    const parsed = dateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid dates' });
    const report = await getTrialBalance(parsed.data.from, parsed.data.to);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

router.get('/cashflow', async (req, res, next) => {
  try {
    const parsed = dateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid dates' });
    const report = await getCashFlow(parsed.data.from, parsed.data.to);
    res.json(report);
  } catch (err) {
    next(err);
  }
});

export default router;
