import { query } from '../db/pool';

export async function log(
  tableName: string, 
  recordId: number, 
  action: 'INSERT'|'UPDATE'|'DELETE'|'VOID',
  oldValues: object | null,
  newValues: object | null,
  performedBy: number
): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_log 
        (table_name, record_id, action, old_values, new_values, performed_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tableName, recordId, action, oldValues, newValues, performedBy]
    );
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}
