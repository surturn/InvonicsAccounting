import { Router } from 'express';
import { requireRole } from '../middleware/auth';
import { getAllPeriods, getPeriodById, lockPeriod, unlockPeriod } from '../db/queries/periods';
import { log as auditLog } from '../services/auditService';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const periods = await getAllPeriods();
    res.json(periods);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/lock', requireRole('owner'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const oldPeriod = await getPeriodById(id);
    if (!oldPeriod) {
      return res.status(404).json({ error: 'Period not found' });
    }
    
    const newPeriod = await lockPeriod(id, req.user!.userId);
    await auditLog('fiscal_periods', id, 'UPDATE', oldPeriod, newPeriod, req.user!.userId);
    
    res.json(newPeriod);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/unlock', requireRole('owner'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const oldPeriod = await getPeriodById(id);
    if (!oldPeriod) {
      return res.status(404).json({ error: 'Period not found' });
    }
    
    const newPeriod = await unlockPeriod(id);
    await auditLog('fiscal_periods', id, 'UPDATE', oldPeriod, newPeriod, req.user!.userId);
    
    res.json(newPeriod);
  } catch (err) {
    next(err);
  }
});

export default router;
