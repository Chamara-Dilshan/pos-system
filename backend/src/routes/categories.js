import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const categories = new Hono();

// Get all categories
categories.get('/', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const result = await db.prepare(
      'SELECT * FROM categories WHERE is_active = 1 ORDER BY name'
    ).all();

    return c.json({
      success: true,
      categories: result.results || [],
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Get single category
categories.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;

    const category = await db.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).bind(id).first();

    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({
      success: true,
      category,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch category' }, 500);
  }
});

// Create category (Admin only)
categories.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { name } = await c.req.json();

    if (!name) {
      return c.json({ error: 'Category name is required' }, 400);
    }

    const db = c.env.DB;

    // Check if category already exists
    const existing = await db.prepare(
      'SELECT id FROM categories WHERE name = ?'
    ).bind(name).first();

    if (existing) {
      return c.json({ error: 'Category already exists' }, 400);
    }

    const result = await db.prepare(
      'INSERT INTO categories (name) VALUES (?) RETURNING *'
    ).bind(name).first();

    return c.json({
      success: true,
      message: 'Category created successfully',
      category: result,
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Update category (Admin only)
categories.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const { name, is_active } = await c.req.json();

    if (!name) {
      return c.json({ error: 'Category name is required' }, 400);
    }

    const db = c.env.DB;

    const result = await db.prepare(
      'UPDATE categories SET name = ?, is_active = ? WHERE id = ? RETURNING *'
    ).bind(name, is_active !== undefined ? is_active : 1, id).first();

    if (!result) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Category updated successfully',
      category: result,
    });
  } catch (error) {
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

// Delete category (Admin only)
categories.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;

    // Check if category has products
    const products = await db.prepare(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?'
    ).bind(id).first();

    if (products && products.count > 0) {
      return c.json({
        error: 'Cannot delete category with existing products'
      }, 400);
    }

    const result = await db.prepare(
      'DELETE FROM categories WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return c.json({ error: 'Category not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

export default categories;
