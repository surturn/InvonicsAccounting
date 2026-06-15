import { PoolClient } from 'pg';

export async function seedFiscalPeriods(client: PoolClient, companyId: number) {
  const year = new Date().getFullYear();
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  for (let m = 0; m < 12; m++) {
    const start = new Date(year, m, 1).toISOString().split('T')[0];
    const end   = new Date(year, m + 1, 0).toISOString().split('T')[0];
    await client.query(
      `INSERT INTO fiscal_periods (company_id, name, start_date, end_date)
       VALUES ($1, $2, $3, $4)`,
      [companyId, `${months[m]} ${year}`, start, end]
    );
  }
}
