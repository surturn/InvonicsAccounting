import { Router } from 'express';
import { z } from 'zod';
import { getTransactionsForExport, getPLReport } from '../db/queries/reports';
import { generateTransactionCSV, generatePLCSV } from '../services/exportService';


const router = Router();

const dateQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.string().optional()
});



router.get('/transactions', async (req, res, next) => {
  try {
    const parsed = dateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid queries' });
    
    const rows = await getTransactionsForExport(parsed.data.from, parsed.data.to, parsed.data.type);
    const csvString = generateTransactionCSV(rows);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Invonics_Transactions_${parsed.data.from}_${parsed.data.to}.csv"`);
    res.send(csvString);
  } catch (err) {
    next(err);
  }
});

router.get('/pl-summary', async (req, res, next) => {
  try {
    const parsed = dateQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid queries' });
    
    const report = await getPLReport(parsed.data.from, parsed.data.to);
    const csvString = generatePLCSV(report);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Invonics_PL_${parsed.data.from}_${parsed.data.to}.csv"`);
    res.send(csvString);
  } catch (err) {
    next(err);
  }
});

export default router;
