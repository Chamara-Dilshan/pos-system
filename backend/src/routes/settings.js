import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const settings = new Hono();

// All settings routes require authentication
settings.use('/*', authMiddleware);

// Get store settings (all users can view)
settings.get('/', async (c) => {
  const db = c.env.DB;

  try {
    // Check if settings table exists, if not create it
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_name TEXT DEFAULT 'CloudPOS',
        store_email TEXT,
        store_phone TEXT,
        store_address TEXT,
        tax_rate REAL DEFAULT 10.0,
        currency TEXT DEFAULT 'USD',
        currency_symbol TEXT DEFAULT '$',
        theme_primary TEXT DEFAULT 'blue',
        theme_success TEXT DEFAULT 'green',
        theme_danger TEXT DEFAULT 'red',
        theme_neutral TEXT DEFAULT 'gray',
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_by INTEGER
      )
    `).run();

    // Get settings or return defaults
    let settingsData = await db.prepare('SELECT * FROM settings WHERE id = 1').first();

    if (!settingsData) {
      // Create default settings
      await db.prepare(`
        INSERT INTO settings (
          id, store_name, tax_rate, currency, currency_symbol,
          theme_primary, theme_success, theme_danger, theme_neutral
        ) VALUES (1, 'CloudPOS', 10.0, 'USD', '$', 'blue', 'green', 'red', 'gray')
      `).run();

      settingsData = await db.prepare('SELECT * FROM settings WHERE id = 1').first();
    }

    return c.json({ settings: settingsData });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update settings (admin only)
settings.put('/', adminMiddleware, async (c) => {
  const db = c.env.DB;
  const user = c.get('user');

  try {
    const {
      store_name,
      store_email,
      store_phone,
      store_address,
      tax_rate,
      currency,
      currency_symbol,
      theme_primary,
      theme_success,
      theme_danger,
      theme_neutral,
    } = await c.req.json();

    // Validate tax rate
    if (tax_rate !== undefined && (isNaN(tax_rate) || tax_rate < 0 || tax_rate > 100)) {
      return c.json({ error: 'Tax rate must be between 0 and 100' }, 400);
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (store_name !== undefined) {
      updates.push('store_name = ?');
      params.push(store_name);
    }
    if (store_email !== undefined) {
      updates.push('store_email = ?');
      params.push(store_email);
    }
    if (store_phone !== undefined) {
      updates.push('store_phone = ?');
      params.push(store_phone);
    }
    if (store_address !== undefined) {
      updates.push('store_address = ?');
      params.push(store_address);
    }
    if (tax_rate !== undefined) {
      updates.push('tax_rate = ?');
      params.push(tax_rate);
    }
    if (currency !== undefined) {
      updates.push('currency = ?');
      params.push(currency);
    }
    if (currency_symbol !== undefined) {
      updates.push('currency_symbol = ?');
      params.push(currency_symbol);
    }
    if (theme_primary !== undefined) {
      updates.push('theme_primary = ?');
      params.push(theme_primary);
    }
    if (theme_success !== undefined) {
      updates.push('theme_success = ?');
      params.push(theme_success);
    }
    if (theme_danger !== undefined) {
      updates.push('theme_danger = ?');
      params.push(theme_danger);
    }
    if (theme_neutral !== undefined) {
      updates.push('theme_neutral = ?');
      params.push(theme_neutral);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    updates.push('updated_by = ?');
    params.push(user.id);

    if (updates.length === 2) {
      return c.json({ error: 'No fields to update' }, 400);
    }

    const query = `UPDATE settings SET ${updates.join(', ')} WHERE id = 1`;
    await db.prepare(query).bind(...params).run();

    const updatedSettings = await db.prepare('SELECT * FROM settings WHERE id = 1').first();

    return c.json({
      message: 'Settings updated successfully',
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// Reset settings to defaults (admin only)
settings.post('/reset', adminMiddleware, async (c) => {
  const db = c.env.DB;
  const user = c.get('user');

  try {
    await db.prepare(`
      UPDATE settings SET
        store_name = 'CloudPOS',
        store_email = NULL,
        store_phone = NULL,
        store_address = NULL,
        tax_rate = 10.0,
        currency = 'USD',
        currency_symbol = '$',
        theme_primary = 'blue',
        theme_success = 'green',
        theme_danger = 'red',
        theme_neutral = 'gray',
        updated_at = CURRENT_TIMESTAMP,
        updated_by = ?
      WHERE id = 1
    `).bind(user.id).run();

    const settings = await db.prepare('SELECT * FROM settings WHERE id = 1').first();

    return c.json({
      message: 'Settings reset to defaults',
      settings,
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return c.json({ error: 'Failed to reset settings' }, 500);
  }
});

export default settings;
