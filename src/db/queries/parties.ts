import { query } from '../pool';

export async function getAllParties(type?: string) {
  const result = await query(
    'SELECT * FROM parties WHERE ($1::text IS NULL OR type = $1) ORDER BY name ASC',
    [type || null]
  );
  return result.rows;
}

export async function getPartyById(id: number) {
  const result = await query('SELECT * FROM parties WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createParty(data: any) {
  const { name, type, email, phone, notes } = data;
  const result = await query(
    'INSERT INTO parties (name, type, email, phone, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, type, email, phone, notes]
  );
  return result.rows[0];
}

export async function updateParty(id: number, data: any) {
  const keys = Object.keys(data);
  if (keys.length === 0) return getPartyById(id);

  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = keys.map(key => data[key as keyof typeof data]);
  
  const result = await query(
    `UPDATE parties SET ${setClause} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return result.rows[0];
}

export async function searchParties(q: string) {
  const result = await query(
    'SELECT * FROM parties WHERE name ILIKE $1 ORDER BY name ASC LIMIT 10',
    [`%${q}%`]
  );
  return result.rows;
}
