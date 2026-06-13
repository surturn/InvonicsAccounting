import { query } from '../db/pool';

export async function generateReference(type: 'INC' | 'EXP' | 'DRW'): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${type}-${year}-`;
  
  // Must be called inside a transaction to avoid race conditions
  const result = await query(
    `SELECT reference FROM journal_entries 
     WHERE reference LIKE $1 
     ORDER BY reference DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let nextNum = 1;
  if (result.rows.length > 0) {
    const lastRef = result.rows[0].reference;
    const lastNum = parseInt(lastRef.split('-')[2], 10);
    nextNum = lastNum + 1;
  }

  const paddedNum = nextNum.toString().padStart(4, '0');
  return `${prefix}${paddedNum}`;
}
