import cron from 'node-cron';
import { sendTOTReminder } from './totReminder';
import { sendWeeklyCashPosition } from './cashPosition';
import { sendMonthlyExport } from './monthlyExport';
import { autoLockPeriod } from './periodLock';

export const startScheduler = () => {
  const options = { timezone: 'Africa/Nairobi' };

  cron.schedule('0 8 1 * *', sendTOTReminder, options);
  console.log('Registered cron: 0 8 1 * * -> sendTOTReminder (Africa/Nairobi)');

  cron.schedule('0 7 * * 1', sendWeeklyCashPosition, options);
  console.log('Registered cron: 0 7 * * 1 -> sendWeeklyCashPosition (Africa/Nairobi)');

  cron.schedule('0 9 2 * *', sendMonthlyExport, options);
  console.log('Registered cron: 0 9 2 * * -> sendMonthlyExport (Africa/Nairobi)');

  cron.schedule('0 10 21 * *', autoLockPeriod, options);
  console.log('Registered cron: 0 10 21 * * -> autoLockPeriod (Africa/Nairobi)');
};
