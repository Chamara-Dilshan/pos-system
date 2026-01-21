import { Hono } from 'hono';
import { cors } from 'hono/cors';

import auth from './routes/auth.js';
import categories from './routes/categories.js';
import products from './routes/products.js';
import orders from './routes/orders.js';
import users from './routes/users.js';
import reports from './routes/reports.js';
import settings from './routes/settings.js';
import payments from './routes/payments.js';
import upload from './routes/upload.js';
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
app.route('/api/payments', payments);
app.route('/api/upload', upload);

// Public images route (no auth required)
app.get('/api/images/*', async (c) => {
  try {
    const path = c.req.path.replace('/api/images/', '');

    if (!path) {
      return c.json({ error: 'Image path required' }, 400);
    }

    const object = await c.env.STORAGE.get(path);

    if (!object) {
      return c.json({ error: 'Image not found' }, 404);
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  } catch (error) {
    console.error('Serve image error:', error);
    return c.json({ error: 'Failed to retrieve image' }, 500);
  }
});

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
