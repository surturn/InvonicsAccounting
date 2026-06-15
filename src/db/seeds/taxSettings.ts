import { PoolClient } from 'pg';

export async function seedTaxSettings(client: PoolClient, companyId: number) {
  await client.query(
    `INSERT INTO tax_settings (company_id, name, rate, is_active)
     VALUES ($1, 'TOT_RATE', 1.5, true)`,
    [companyId]
  );
}
