import { query } from '../db/pool';

export async function autoLockPeriod() {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastMonthLabel = `${monthNames[firstDay.getMonth()]} ${firstDay.getFullYear()}`;

    const searchResult = await query(
      `SELECT id FROM fiscal_periods WHERE name = $1 AND is_locked = false`,
      [lastMonthLabel]
    );

    if (searchResult.rows.length > 0) {
      const periodId = searchResult.rows[0].id;
      await query(
        `UPDATE fiscal_periods SET is_locked = true, locked_at = NOW(), locked_by = 0 WHERE id = $1`,
        [periodId]
      );
      console.log(`[${new Date().toISOString()}] Successfully auto-locked period: ${lastMonthLabel}`);
    } else {
      console.log(`[${new Date().toISOString()}] autoLockPeriod: Period ${lastMonthLabel} not found or already locked.`);
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in autoLockPeriod:`, error);
  }
}
