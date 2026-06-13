import { query } from '../db/pool';
import { sendMail } from '../services/mailer';
import { formatKES, formatDate } from '../utils/format';

export async function sendWeeklyCashPosition() {
  try {
    const accountsResult = await query(
      `SELECT id, code, name FROM accounts WHERE code IN ('1001', '1002', '1003') AND is_active = true`
    );

    let totalCash = 0;
    const accountLines: string[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    for (const acc of accountsResult.rows) {
      const balResult = await query(
        `SELECT COALESCE(SUM(jl.debit - jl.credit), 0) AS balance
         FROM journal_lines jl
         JOIN journal_entries je ON je.id = jl.entry_id
         WHERE jl.account_id = $1 AND je.is_void = false AND je.date <= $2`,
        [acc.id, todayStr]
      );
      
      const balance = parseFloat(balResult.rows[0].balance);
      totalCash += balance;
      accountLines.push(`${acc.name}: ${formatKES(balance)}`);
    }

    const dateFormatted = formatDate(todayStr);
    const subject = `Weekly Cash Position — ${dateFormatted}`;
    
    const text = `
Current Cash Position:

${accountLines.join('\n')}

Total Cash: ${formatKES(totalCash)}
    `.trim();

    const ownerEmail = process.env.OWNER_EMAIL || 'owner@invonics.com';
    await sendMail(ownerEmail, subject, text);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in sendWeeklyCashPosition:`, error);
  }
}
