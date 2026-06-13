import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import accountsRoutes from './routes/accounts';
import transactionsRoutes from './routes/transactions';
import reportsRoutes from './routes/reports';
import exportRoutes from './routes/export';
import partiesRoutes from './routes/parties';
import periodsRoutes from './routes/periods';
import toolsRoutes from './routes/tools';

import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

app.use('/api/auth/login', loginLimiter);

// Apply authenticateToken to all routes EXCEPT /api/auth/login
app.use('/api', (req, res, next) => {
  if (req.path === '/auth/login' && req.method === 'POST') {
    return next();
  }
  return authenticateToken(req, res, next);
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/parties', partiesRoutes);
app.use('/api/periods', periodsRoutes);
app.use('/api/tools', toolsRoutes);

app.use(errorHandler);

export default app;
