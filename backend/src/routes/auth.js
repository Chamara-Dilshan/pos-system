import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const auth = new Hono();

// Register/Sync user from Firebase
auth.post('/register', async (c) => {
  try {
    const { firebase_uid, name, email, role } = await c.req.json();

    if (!firebase_uid || !name || !email) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const db = c.env.DB;

    // Check if user already exists
    const existing = await db.prepare(
      'SELECT * FROM users WHERE firebase_uid = ?'
    ).bind(firebase_uid).first();

    if (existing) {
      return c.json({
        success: true,
        message: 'User already exists',
        user: existing,
      });
    }

    // Create new user
    const result = await db.prepare(`
      INSERT INTO users (firebase_uid, name, email, role)
      VALUES (?, ?, ?, ?) RETURNING *
    `).bind(firebase_uid, name, email, role || 'cashier').first();

    return c.json({
      success: true,
      message: 'User registered successfully',
      user: result,
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

// Login - sync/get user data
auth.post('/login', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];

    // Decode token to get Firebase UID
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return c.json({ error: 'Invalid token format' }, 401);
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const firebase_uid = payload.user_id || payload.uid;

    if (!firebase_uid) {
      return c.json({ error: 'Invalid token payload' }, 401);
    }

    const db = c.env.DB;

    const user = await db.prepare(
      'SELECT * FROM users WHERE firebase_uid = ?'
    ).bind(firebase_uid).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (!user.is_active) {
      return c.json({ error: 'User account is deactivated' }, 403);
    }

    return c.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error) {
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Get current user
auth.get('/me', authMiddleware, async (c) => {
  try {
    const userPayload = c.get('user');
    const firebase_uid = userPayload.user_id || userPayload.uid;

    const db = c.env.DB;

    const user = await db.prepare(
      'SELECT id, firebase_uid, name, email, role, is_active, created_at FROM users WHERE firebase_uid = ?'
    ).bind(firebase_uid).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({
      success: true,
      user,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

export default auth;
