import { validateEnv } from './utils/validateEnv';
import dotenv from 'dotenv';
dotenv.config();
validateEnv();

import app from './app';
import { startScheduler } from './jobs/scheduler';
import logger from './utils/logger';

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
  logger.info(`Invonics API running on port ${PORT} at 0.0.0.0`);
  startScheduler();
});
