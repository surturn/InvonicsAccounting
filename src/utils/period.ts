import { query } from '../db/pool';
import { FiscalPeriod } from '../types';

export async function getPeriodForDate(date: string): Promise<FiscalPeriod> {
  const result = await query(
    `SELECT * FROM fiscal_periods 
     WHERE $1 >= start_date AND $1 <= end_date`,
    [date]
  );

  if (result.rows.length === 0) {
    throw new Error('No period found');
  }

  const period = result.rows[0] as FiscalPeriod;
  if (period.is_locked) {
    throw new Error('Period is locked');
  }

  return period;
}
