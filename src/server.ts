import dotenv from 'dotenv';
dotenv.config();

const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'FRONTEND_URL',
  'BREVO_SMTP_USER',
  'BREVO_SMTP_KEY',
  'OWNER_EMAIL',
];

const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('FATAL: Missing required environment variables:');
  missing.forEach(k => console.error(`  - ${k}`));
  process.exit(1);
}

import app from './app';
import { startScheduler } from './jobs/scheduler';

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Invonics API running on port ${PORT} at 0.0.0.0`);
  startScheduler();
});
