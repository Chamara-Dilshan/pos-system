import { Hono } from 'hono';
import { cors } from 'hono/cors';

import auth from './routes/auth.js';
import categories from './routes/categories.js';
import products from './routes/products.js';
import orders from './routes/orders.js';
import users from './routes/users.js';
import reports from './routes/reports.js';
import settings from './routes/settings.js';
import { authMiddleware, adminMiddleware } from './middleware/auth.js';

const app = new Hono();

// CORS middleware
app.use('*', cors());

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    message: 'CloudPOS API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.route('/api/auth', auth);
app.route('/api/categories', categories);
app.route('/api/products', products);
app.route('/api/orders', orders);

// Admin-only routes
app.use('/api/users/*', authMiddleware);
app.use('/api/users/*', adminMiddleware);
app.route('/api/users', users);

app.route('/api/reports', reports);
app.route('/api/settings', settings);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
