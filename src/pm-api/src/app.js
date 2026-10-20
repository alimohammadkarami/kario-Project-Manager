import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter } from './middlewares/rateLimiter.js';
import apiRoutes from './routes/index.js';
import { sendSuccess } from './utils/response.js';

const app = express();

app.set('trust proxy', config.trustProxy); // needed for correct client IPs behind nginx / a load balancer

app.use(helmet());
app.use(cors({ origin: config.corsOrigins }));
if (!config.isProd) app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

app.get('/health', (req, res) => sendSuccess(res, { message: 'OK' }));

app.use(globalLimiter);
app.use('/api/v1', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
