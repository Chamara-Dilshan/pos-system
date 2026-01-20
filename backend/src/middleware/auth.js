export const authMiddleware = async (c, next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];

    // For now, we'll decode the token without verification
    // In production, verify the Firebase token here
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return c.json({ error: 'Invalid token format' }, 401);
    }

    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      c.set('user', payload);
      await next();
    } catch (error) {
      return c.json({ error: 'Invalid token' }, 401);
    }
  } catch (error) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

export const adminMiddleware = async (c, next) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Check if user is admin from database
  const db = c.env.DB;
  const result = await db.prepare(
    'SELECT role FROM users WHERE firebase_uid = ?'
  ).bind(user.user_id || user.uid).first();

  if (!result || result.role !== 'admin') {
    return c.json({ error: 'Forbidden - Admin access required' }, 403);
  }

  await next();
};
