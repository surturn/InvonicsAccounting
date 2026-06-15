import { query } from '../db/pool';
import logger from '../utils/logger';

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
      logger.info(`Successfully auto-locked period: ${lastMonthLabel}`);
    } else {
      logger.info(`autoLockPeriod: Period ${lastMonthLabel} not found or already locked.`);
    }
  } catch (error) {
    logger.error(error, 'Error in autoLockPeriod:');
  }
}
