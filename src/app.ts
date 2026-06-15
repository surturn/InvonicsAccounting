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

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/accounts', authenticateToken, accountsRoutes);
app.use('/api/transactions', authenticateToken, transactionsRoutes);
app.use('/api/reports', authenticateToken, reportsRoutes);
app.use('/api/export', authenticateToken, exportRoutes);
app.use('/api/parties', authenticateToken, partiesRoutes);
app.use('/api/periods', authenticateToken, periodsRoutes);
app.use('/api/tools', authenticateToken, toolsRoutes);

app.use(errorHandler);

export default app;
