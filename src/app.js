import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import approvalRoutes from './routes/approval.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import rateLimit from 'express-rate-limit';
import rateLimiter from './middlewares/rateLimiter.middleware.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

const app = express();

app.use(express.json());
app.use(rateLimiter);

app.use(cors());

app.use(helmet());

app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({
    message: 'API running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/content', contentRoutes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use(errorMiddleware);

export default app;