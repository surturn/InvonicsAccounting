import { PoolClient } from 'pg';
import { generateReference } from '../utils/reference';

export async function createEntry(client: PoolClient, data: {
  date: string,
  narration: string,
  transactionType: 'income' | 'expense' | 'drawing',
  partyId: number | null,
  fiscalPeriodId: number,
  createdBy: number,
  lines: Array<{
    accountId: number,
    type: 'debit' | 'credit',
    amount: number
  }>
}) {
  // 1. Validate lines: sum of all debits MUST equal sum of all credits
  let debitSum = 0;
  let creditSum = 0;
  
  for (const line of data.lines) {
    if (line.amount <= 0) {
      throw new Error('Line amount must be positive');
    }
    if (line.type === 'debit') debitSum += line.amount;
    else creditSum += line.amount;
  }
  
  // To avoid floating point issues, round to 2 decimals or check small difference
  if (Math.abs(debitSum - creditSum) > 0.001) {
    throw new Error('Journal entry does not balance');
  }

  // Map transaction type to prefix
  let refType: 'INC' | 'EXP' | 'DRW';
  if (data.transactionType === 'income') refType = 'INC';
  else if (data.transactionType === 'expense') refType = 'EXP';
  else refType = 'DRW';

  // 3. Generate reference
  const reference = await generateReference(refType, client);

  // 4. INSERT into journal_entries first
  const jeResult = await client.query(
    `INSERT INTO journal_entries 
     (reference, date, description, period_id, party_id, created_by) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [reference, data.date, data.narration, data.fiscalPeriodId, data.partyId, data.createdBy]
  );
  
  const journalEntry = jeResult.rows[0];

  // 5. INSERT all journal_lines
  const createdLines = [];
  for (const line of data.lines) {
    const debitAmount = line.type === 'debit' ? line.amount : 0;
    const creditAmount = line.type === 'credit' ? line.amount : 0;
    
    const jlResult = await client.query(
      `INSERT INTO journal_lines 
       (entry_id, account_id, debit, credit) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [journalEntry.id, line.accountId, debitAmount, creditAmount]
    );
    createdLines.push(jlResult.rows[0]);
  }

  // 6. Return the created journal entry with lines
  return {
    ...journalEntry,
    lines: createdLines
  };
}
