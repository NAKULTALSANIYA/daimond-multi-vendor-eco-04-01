import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { applySecurityMiddlewares } from './middlewares/security.middleware.js';
import { setupSwagger } from './config/swagger.js';
import { ApiResponse } from './utils/ApiResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Respect X-Forwarded-* headers when running behind a reverse proxy/load balancer.
app.set('trust proxy', 1);

applySecurityMiddlewares(app);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// Serve uploaded files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (_req, res) => {
  res.status(200).json(
    new ApiResponse(200, 'Multi-vendor backend is running', {
      docs: '/api-docs',
      health: '/health',
      apiBase: env.apiPrefix,
    })
  );
});

// Browsers request /favicon.ico automatically. Return no-content to avoid noisy 404 logs.
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

app.get('/health', (_req, res) => {
  res.status(200).json(new ApiResponse(200, 'Server healthy', { uptime: process.uptime() }));
});

app.use(env.apiPrefix, routes);
setupSwagger(app);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
