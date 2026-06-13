import { getTransactionsForExport } from '../db/queries/reports';
import { generateTransactionCSV } from '../services/exportService';
import { sendMail } from '../services/mailer';

export async function sendMonthlyExport() {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    const from = firstDay.toISOString().split('T')[0];
    const to = lastDay.toISOString().split('T')[0];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthYear = `${monthNames[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
    const filenameMonthYear = `${monthNames[firstDay.getMonth()]}${firstDay.getFullYear()}`;

    const rows = await getTransactionsForExport(from, to);
    const csvContent = generateTransactionCSV(rows);

    const subject = `Monthly Export — ${monthYear}`;
    const text = `Please find the exported transactions for ${monthYear} attached.`;
    
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@invonics.com';
    await sendMail(ownerEmail, subject, text, [
      {
        filename: `Invonics_${filenameMonthYear}.csv`,
        content: csvContent
      }
    ]);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in sendMonthlyExport:`, error);
  }
}
