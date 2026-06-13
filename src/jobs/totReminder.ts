import { getTOTReport } from '../db/queries/reports';
import { sendMail } from '../services/mailer';
import { formatKES } from '../utils/format';

export async function sendTOTReminder() {
  try {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

    const from = firstDay.toISOString().split('T')[0];
    const to = lastDay.toISOString().split('T')[0];

    const report = await getTOTReport(from, to);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[firstDay.getMonth()];
    const year = firstDay.getFullYear();
    const monthYear = `${monthName} ${year}`;

    const subject = `TOT Reminder — ${monthYear}`;
    const text = `
Period: ${monthYear}
Gross Turnover: ${formatKES(report.grossTurnover)}
TOT Rate: ${report.totRate}%
Amount Payable: ${formatKES(report.totPayable)}

Please file your TOT on iTax before the 20th of this month.
URL: https://itax.kra.go.ke
    `.trim();

    const ownerEmail = process.env.OWNER_EMAIL || 'owner@invonics.com';
    await sendMail(ownerEmail, subject, text);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in sendTOTReminder:`, error);
  }
}
