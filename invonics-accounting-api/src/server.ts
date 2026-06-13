import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startScheduler } from './jobs/scheduler';

const PORT = process.env.PORT || 3000;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Invonics API running on port ${PORT} at 0.0.0.0`);
  startScheduler();
});
