import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool';
import { validate } from '../middleware/validate';
import { getPeriodForDate } from '../utils/period';
import { createEntry } from '../services/journalService';
import { getTransactions, getTransactionById, voidTransaction } from '../db/queries/transactions';
import { getAccountByCode } from '../db/queries/accounts';
import { log as auditLog } from '../services/auditService';
import { requireRole } from '../middleware/auth';

const router = Router();

const incomeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  revenueAccountCode: z.string().regex(/^4\d{3}$/),
  cashAccountCode: z.enum(['1001','1002','1003','1004']),
  partyId: z.number().optional(),
  reference: z.string().optional(),
  narration: z.string().min(1),
  attachmentUrl: z.string().url().optional()
});

router.post('/income', validate(incomeSchema), async (req, res, next) => {
  let client;
  try {
    const data = req.body;
    
    // 2. Get fiscal period
    const period = await getPeriodForDate(data.date);
    
    // 3. Get account IDs
    const revenueAccount = await getAccountByCode(data.revenueAccountCode);
    const cashAccount = await getAccountByCode(data.cashAccountCode);
    
    if (!revenueAccount || !cashAccount) {
      return res.status(400).json({ error: 'Invalid account code' });
    }

    // 4. BEGIN transaction
    client = await pool.connect();
    await client.query('BEGIN');
    
    // 5. Call journalService
    const entryData = {
      date: data.date,
      narration: data.narration,
      transactionType: 'income' as const,
      partyId: data.partyId || null,
      fiscalPeriodId: period.id,
      createdBy: req.user!.userId,
      lines: [
        { accountId: cashAccount.id, type: 'debit' as const, amount: data.amount },
        { accountId: revenueAccount.id, type: 'credit' as const, amount: data.amount }
      ]
    };
    
    const entry = await createEntry(client, entryData);
    
    if (data.attachmentUrl) {
      await client.query(
        'INSERT INTO attachments (entry_id, file_url, file_name) VALUES ($1, $2, $3)',
        [entry.id, data.attachmentUrl, 'Income Attachment']
      );
    }

    // 6. COMMIT
    await client.query('COMMIT');
    
    // 7. Write audit log
    await auditLog('journal_entries', entry.id, 'INSERT', null, entry, req.user!.userId);
    
    // 8. Return 201
    res.status(201).json(entry);
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    next(error);
  } finally {
    if (client) client.release();
  }
});

const expenseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  expenseAccountCode: z.string().regex(/^5\d{3}$/),
  cashAccountCode: z.enum(['1001','1002','1003']),
  partyId: z.number().optional(),
  reference: z.string().optional(),
  narration: z.string().min(1),
  attachmentUrl: z.string().url().optional()
});

router.post('/expense', validate(expenseSchema), async (req, res, next) => {
  let client;
  try {
    const data = req.body;
    
    const period = await getPeriodForDate(data.date);
    
    const expenseAccount = await getAccountByCode(data.expenseAccountCode);
    const cashAccount = await getAccountByCode(data.cashAccountCode);
    
    if (!expenseAccount || !cashAccount) {
      return res.status(400).json({ error: 'Invalid account code' });
    }

    client = await pool.connect();
    await client.query('BEGIN');
    
    const entryData = {
      date: data.date,
      narration: data.narration,
      transactionType: 'expense' as const,
      partyId: data.partyId || null,
      fiscalPeriodId: period.id,
      createdBy: req.user!.userId,
      lines: [
        { accountId: expenseAccount.id, type: 'debit' as const, amount: data.amount },
        { accountId: cashAccount.id, type: 'credit' as const, amount: data.amount }
      ]
    };
    
    const entry = await createEntry(client, entryData);
    
    if (data.attachmentUrl) {
      await client.query(
        'INSERT INTO attachments (entry_id, file_url, file_name) VALUES ($1, $2, $3)',
        [entry.id, data.attachmentUrl, 'Expense Attachment']
      );
    }

    await client.query('COMMIT');
    
    await auditLog('journal_entries', entry.id, 'INSERT', null, entry, req.user!.userId);
    
    res.status(201).json(entry);
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    next(error);
  } finally {
    if (client) client.release();
  }
});

const drawingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount: z.number().positive(),
  cashAccountCode: z.enum(['1001','1002','1003']),
  narration: z.string().min(1)
});

router.post('/drawing', validate(drawingSchema), async (req, res, next) => {
  let client;
  try {
    const data = req.body;
    
    const period = await getPeriodForDate(data.date);
    
    const drawingAccount = await getAccountByCode('3002');
    const cashAccount = await getAccountByCode(data.cashAccountCode);
    
    if (!drawingAccount || !cashAccount) {
      return res.status(400).json({ error: 'Invalid account code' });
    }

    client = await pool.connect();
    await client.query('BEGIN');
    
    const entryData = {
      date: data.date,
      narration: data.narration,
      transactionType: 'drawing' as const,
      partyId: null,
      fiscalPeriodId: period.id,
      createdBy: req.user!.userId,
      lines: [
        { accountId: drawingAccount.id, type: 'debit' as const, amount: data.amount },
        { accountId: cashAccount.id, type: 'credit' as const, amount: data.amount }
      ]
    };
    
    const entry = await createEntry(client, entryData);
    
    await client.query('COMMIT');
    
    await auditLog('journal_entries', entry.id, 'INSERT', null, entry, req.user!.userId);
    
    res.status(201).json(entry);
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    next(error);
  } finally {
    if (client) client.release();
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filters = {
      type: req.query.type as string,
      accountCode: req.query.accountCode as string,
      partyId: req.query.partyId ? parseInt(req.query.partyId as string, 10) : undefined,
      from: req.query.from as string,
      to: req.query.to as string,
      page: parseInt(req.query.page as string || '1', 10),
      limit: parseInt(req.query.limit as string || '50', 10)
    };
    
    const result = await getTransactions(filters);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const entry = await getTransactionById(id);
    if (!entry) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

const voidSchema = z.object({ reason: z.string().min(1) });

router.post('/:id/void', requireRole('owner'), validate(voidSchema), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await getTransactionById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    if (existing.is_void) {
      return res.status(400).json({ error: 'Transaction already voided' });
    }
    
    const voided = await voidTransaction(id, req.user!.userId, req.body.reason);
    await auditLog('journal_entries', id, 'VOID', existing, voided, req.user!.userId);
    
    res.json(voided);
  } catch (err) {
    next(err);
  }
});

export default router;
