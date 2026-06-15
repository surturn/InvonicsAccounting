import { getTOTReport } from '../db/queries/reports';
import { sendMail } from '../services/mailer';
import { formatKES } from '../utils/format';

import logger from '../utils/logger';

export async function sendTOTReminder() {
  try {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString().split('T')[0];
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const report = await getTOTReport(from, to);
    const totPayable = report.totPayable;
    const grossTurnover = report.grossTurnover;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const monthYear = `${monthName} ${year}`;

    const subject = `TOT Reminder — ${monthYear}`;
    const text = `
Period: ${monthYear}
Gross Turnover: ${formatKES(grossTurnover)}
TOT Rate: ${report.totRate}%
Amount Payable: ${formatKES(totPayable)}

Please file your TOT on iTax before the 20th of this month.
URL: https://itax.kra.go.ke
    `.trim();

    const ownerEmail = process.env.OWNER_EMAIL || 'owner@invonics.com';
    await sendMail(ownerEmail, subject, text);
  } catch (error) {
    logger.error('Error in sendTOTReminder:', error);
  }
}
