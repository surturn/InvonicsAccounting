import { query } from '../pool';

export async function getAllAccounts() {
  const result = await query(
    'SELECT id, code, name, type, normal_balance, is_turnover FROM accounts WHERE is_active = true ORDER BY code ASC'
  );
  return result.rows;
}

export async function getAccountByCode(code: string) {
  const result = await query(
    'SELECT * FROM accounts WHERE code = $1 AND is_active = true',
    [code]
  );
  return result.rows[0];
}

export async function getAccountsByType(type: string) {
  const result = await query(
    'SELECT * FROM accounts WHERE type = $1 AND is_active = true ORDER BY code ASC',
    [type]
  );
  return result.rows;
}
