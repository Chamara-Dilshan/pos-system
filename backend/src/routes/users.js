import { Hono } from 'hono';

const users = new Hono();

// Get all users (Admin only)
users.get('/', async (c) => {
  const db = c.env.DB;

  try {
    const { results } = await db
      .prepare(
        `SELECT id, firebase_uid, name, email, role, is_active, created_at
         FROM users
         ORDER BY created_at DESC`
      )
      .all();

    return c.json({ users: results });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Get single user by ID (Admin only)
users.get('/:id', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('id');

  try {
    const user = await db
      .prepare(
        `SELECT id, firebase_uid, name, email, role, is_active, created_at
         FROM users
         WHERE id = ?`
      )
      .bind(userId)
      .first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Update user (Admin only)
users.put('/:id', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('id');
  const { name, email, role, is_active } = await c.req.json();

  // Validation
  if (!name || !email || !role) {
    return c.json({ error: 'Name, email, and role are required' }, 400);
  }

  if (!['admin', 'cashier'].includes(role)) {
    return c.json({ error: 'Role must be either admin or cashier' }, 400);
  }

  try {
    // Check if user exists
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Check if email is already taken by another user
    const emailCheck = await db
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .bind(email, userId)
      .first();

    if (emailCheck) {
      return c.json({ error: 'Email already in use' }, 400);
    }

    // Update user
    await db
      .prepare(
        `UPDATE users
         SET name = ?, email = ?, role = ?, is_active = ?
         WHERE id = ?`
      )
      .bind(name, email, role, is_active !== undefined ? is_active : 1, userId)
      .run();

    // Fetch updated user
    const updatedUser = await db
      .prepare(
        `SELECT id, firebase_uid, name, email, role, is_active, created_at
         FROM users
         WHERE id = ?`
      )
      .bind(userId)
      .first();

    return c.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Deactivate user (Admin only - soft delete)
users.delete('/:id', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('id');
  const currentUserId = c.get('userId');

  try {
    // Prevent self-deactivation
    if (parseInt(userId) === currentUserId) {
      return c.json({ error: 'Cannot deactivate your own account' }, 400);
    }

    // Check if user exists
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Soft delete - set is_active to 0
    await db
      .prepare('UPDATE users SET is_active = 0 WHERE id = ?')
      .bind(userId)
      .run();

    return c.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating user:', error);
    return c.json({ error: 'Failed to deactivate user' }, 500);
  }
});

// Reactivate user (Admin only)
users.post('/:id/reactivate', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('id');

  try {
    // Check if user exists
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE id = ?')
      .bind(userId)
      .first();

    if (!existingUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Reactivate user
    await db
      .prepare('UPDATE users SET is_active = 1 WHERE id = ?')
      .bind(userId)
      .run();

    return c.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Error reactivating user:', error);
    return c.json({ error: 'Failed to reactivate user' }, 500);
  }
});

// Get user statistics (Admin only)
users.get('/stats/summary', async (c) => {
  const db = c.env.DB;

  try {
    const stats = await db
      .prepare(
        `SELECT
          COUNT(*) as total_users,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_count,
          SUM(CASE WHEN role = 'cashier' THEN 1 ELSE 0 END) as cashier_count,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
          SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_users
         FROM users`
      )
      .first();

    return c.json({ stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return c.json({ error: 'Failed to fetch user statistics' }, 500);
  }
});

export default users;
