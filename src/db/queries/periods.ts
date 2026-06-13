import { query } from '../pool';

export async function getAllPeriods() {
  const result = await query('SELECT * FROM fiscal_periods ORDER BY start_date ASC');
  return result.rows;
}

export async function getPeriodById(id: number) {
  const result = await query('SELECT * FROM fiscal_periods WHERE id = $1', [id]);
  return result.rows[0];
}

export async function lockPeriod(id: number, userId: number) {
  const result = await query(
    'UPDATE fiscal_periods SET is_locked = true, locked_at = NOW(), locked_by = $2 WHERE id = $1 RETURNING *',
    [id, userId]
  );
  return result.rows[0];
}

export async function unlockPeriod(id: number) {
  const result = await query(
    'UPDATE fiscal_periods SET is_locked = false, locked_at = NULL, locked_by = NULL WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}
