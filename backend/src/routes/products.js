import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const products = new Hono();

// Get all products
products.get('/', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const { category_id, search } = c.req.query();

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.name';

    const result = await db.prepare(query).bind(...params).all();

    return c.json({
      success: true,
      products: result.results || [],
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

// Get single product
products.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;

    const product = await db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).bind(id).first();

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({
      success: true,
      product,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Get low stock products (Admin only)
products.get('/alerts/low-stock', authMiddleware, adminMiddleware, async (c) => {
  try {
    const db = c.env.DB;

    const result = await db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock <= p.min_stock AND p.is_active = 1
      ORDER BY p.stock ASC
    `).all();

    return c.json({
      success: true,
      products: result.results || [],
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch low stock products' }, 500);
  }
});

// Create product (Admin only)
products.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const {
      category_id,
      name,
      sku,
      price,
      cost_price,
      stock,
      min_stock,
      image_url,
    } = await c.req.json();

    if (!name || !price) {
      return c.json({ error: 'Name and price are required' }, 400);
    }

    const db = c.env.DB;

    // Check if SKU already exists
    if (sku) {
      const existing = await db.prepare(
        'SELECT id FROM products WHERE sku = ?'
      ).bind(sku).first();

      if (existing) {
        return c.json({ error: 'Product with this SKU already exists' }, 400);
      }
    }

    const result = await db.prepare(`
      INSERT INTO products (
        category_id, name, sku, price, cost_price,
        stock, min_stock, image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *
    `).bind(
      category_id || null,
      name,
      sku || null,
      price,
      cost_price || 0,
      stock || 0,
      min_stock || 5,
      image_url || null
    ).first();

    return c.json({
      success: true,
      message: 'Product created successfully',
      product: result,
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

// Update product (Admin only)
products.put('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const {
      category_id,
      name,
      sku,
      price,
      cost_price,
      stock,
      min_stock,
      image_url,
      is_active,
    } = await c.req.json();

    if (!name || !price) {
      return c.json({ error: 'Name and price are required' }, 400);
    }

    const db = c.env.DB;

    // Check if SKU already exists for a different product
    if (sku) {
      const existing = await db.prepare(
        'SELECT id FROM products WHERE sku = ? AND id != ?'
      ).bind(sku, id).first();

      if (existing) {
        return c.json({ error: 'Product with this SKU already exists' }, 400);
      }
    }

    const result = await db.prepare(`
      UPDATE products SET
        category_id = ?,
        name = ?,
        sku = ?,
        price = ?,
        cost_price = ?,
        stock = ?,
        min_stock = ?,
        image_url = ?,
        is_active = ?
      WHERE id = ? RETURNING *
    `).bind(
      category_id || null,
      name,
      sku || null,
      price,
      cost_price || 0,
      stock || 0,
      min_stock || 5,
      image_url || null,
      is_active !== undefined ? is_active : 1,
      id
    ).first();

    if (!result) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Product updated successfully',
      product: result,
    });
  } catch (error) {
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete product (Admin only)
products.delete('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;

    const result = await db.prepare(
      'DELETE FROM products WHERE id = ?'
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

export default products;
