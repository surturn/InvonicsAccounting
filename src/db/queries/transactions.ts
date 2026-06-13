import { query } from '../pool';

export async function getTransactions(filters: {
  type?: string,
  accountCode?: string,
  partyId?: number,
  from?: string,
  to?: string,
  page: number,
  limit: number
}) {
  let whereClauses = ['je.is_void = false'];
  const values: any[] = [];
  let paramCount = 1;

  if (filters.type) {
    whereClauses.push(`je.reference LIKE $${paramCount++}`);
    const prefix = filters.type === 'income' ? 'INC%' : 
                   filters.type === 'expense' ? 'EXP%' : 'DRW%';
    values.push(prefix);
  }

  if (filters.accountCode) {
    whereClauses.push(`a.code = $${paramCount++}`);
    values.push(filters.accountCode);
  }

  if (filters.partyId) {
    whereClauses.push(`je.party_id = $${paramCount++}`);
    values.push(filters.partyId);
  }

  if (filters.from) {
    whereClauses.push(`je.date >= $${paramCount++}`);
    values.push(filters.from);
  }

  if (filters.to) {
    whereClauses.push(`je.date <= $${paramCount++}`);
    values.push(filters.to);
  }

  const whereString = whereClauses.join(' AND ');

  const baseQuery = `
    FROM journal_entries je
    JOIN journal_lines jl ON je.id = jl.entry_id
    JOIN accounts a ON jl.account_id = a.id
    LEFT JOIN parties p ON je.party_id = p.id
    WHERE ${whereString}
  `;

  const countQuery = `SELECT COUNT(DISTINCT je.id) ${baseQuery}`;
  const dataQuery = `
    SELECT DISTINCT je.id, je.reference, je.date, je.description, je.party_id, p.name as party_name, je.created_at
    ${baseQuery}
    ORDER BY je.date DESC, je.id DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;

  const countResult = await query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

  const offset = (filters.page - 1) * filters.limit;
  const dataResult = await query(dataQuery, [...values, filters.limit, offset]);

  return {
    data: dataResult.rows,
    total,
    page: filters.page,
    pages: Math.ceil(total / filters.limit)
  };
}

export async function getTransactionById(id: number) {
  const jeResult = await query(
    `SELECT je.*, p.name as party_name 
     FROM journal_entries je 
     LEFT JOIN parties p ON je.party_id = p.id 
     WHERE je.id = $1`,
    [id]
  );
  
  if (jeResult.rows.length === 0) return null;
  const entry = jeResult.rows[0];

  const jlResult = await query(
    `SELECT jl.*, a.code as account_code, a.name as account_name 
     FROM journal_lines jl 
     JOIN accounts a ON jl.account_id = a.id 
     WHERE jl.entry_id = $1`,
    [id]
  );

  const attachmentsResult = await query(
    `SELECT * FROM attachments WHERE entry_id = $1`,
    [id]
  );

  return {
    ...entry,
    lines: jlResult.rows,
    attachments: attachmentsResult.rows
  };
}

export async function voidTransaction(id: number, userId: number, reason: string) {
  const result = await query(
    `UPDATE journal_entries 
     SET is_void = true, voided_at = NOW(), voided_by = $2, void_reason = $3 
     WHERE id = $1 RETURNING *`,
    [id, userId, reason]
  );
  return result.rows[0];
}
