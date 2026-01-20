import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { generateOrderNumber } from '../utils/orderNumber.js';

const orders = new Hono();

// Get all orders
orders.get('/', authMiddleware, async (c) => {
  try {
    const db = c.env.DB;
    const user = c.get('user');
    const firebase_uid = user.user_id || user.uid;

    // Get current user
    const currentUser = await db.prepare(
      'SELECT id, role FROM users WHERE firebase_uid = ?'
    ).bind(firebase_uid).first();

    let query = `
      SELECT o.*, u.name as cashier_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;

    // Cashiers can only see their own orders
    if (currentUser.role === 'cashier') {
      query += ' WHERE o.user_id = ?';
      const result = await db.prepare(query + ' ORDER BY o.created_at DESC')
        .bind(currentUser.id).all();
      return c.json({ success: true, orders: result.results || [] });
    }

    // Admins can see all orders
    const result = await db.prepare(query + ' ORDER BY o.created_at DESC').all();
    return c.json({ success: true, orders: result.results || [] });
  } catch (error) {
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Get single order
orders.get('/:id', authMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;

    const order = await db.prepare(`
      SELECT o.*, u.name as cashier_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `).bind(id).first();

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Get order items
    const items = await db.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).bind(id).all();

    return c.json({
      success: true,
      order: {
        ...order,
        items: items.results || [],
      },
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch order' }, 500);
  }
});

// Create order
orders.post('/', authMiddleware, async (c) => {
  try {
    const {
      user_id,
      items,
      subtotal,
      discount_type,
      discount_value,
      tax,
      total,
      payment_type,
      payment_status,
      status,
      notes,
    } = await c.req.json();

    if (!items || items.length === 0) {
      return c.json({ error: 'Order must have at least one item' }, 400);
    }

    const db = c.env.DB;
    const order_number = generateOrderNumber();

    // Start transaction by creating order first
    const order = await db.prepare(`
      INSERT INTO orders (
        user_id, order_number, subtotal, discount_type,
        discount_value, tax, total, payment_type,
        payment_status, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *
    `).bind(
      user_id,
      order_number,
      subtotal,
      discount_type || 'none',
      discount_value || 0,
      tax,
      total,
      payment_type || 'cash',
      payment_status || 'paid',
      status || 'completed',
      notes || null
    ).first();

    if (!order) {
      return c.json({ error: 'Failed to create order' }, 500);
    }

    // Insert order items and update stock
    for (const item of items) {
      // Insert order item
      await db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name,
          quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        order.id,
        item.product_id,
        item.product_name,
        item.quantity,
        item.unit_price,
        item.total_price
      ).run();

      // Update product stock
      await db.prepare(`
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
      `).bind(item.quantity, item.product_id).run();
    }

    return c.json({
      success: true,
      message: 'Order created successfully',
      order: {
        ...order,
        items,
      },
    }, 201);
  } catch (error) {
    console.error('Order creation error:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Refund order (Admin only)
orders.put('/:id/refund', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = c.req.param('id');
    const db = c.env.DB;

    // Get order
    const order = await db.prepare(
      'SELECT * FROM orders WHERE id = ?'
    ).bind(id).first();

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    if (order.status === 'refunded') {
      return c.json({ error: 'Order already refunded' }, 400);
    }

    // Update order status
    await db.prepare(`
      UPDATE orders
      SET status = 'refunded', payment_status = 'refunded'
      WHERE id = ?
    `).bind(id).run();

    // Get order items and restore stock
    const items = await db.prepare(
      'SELECT * FROM order_items WHERE order_id = ?'
    ).bind(id).all();

    for (const item of items.results || []) {
      await db.prepare(`
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
      `).bind(item.quantity, item.product_id).run();
    }

    return c.json({
      success: true,
      message: 'Order refunded successfully',
    });
  } catch (error) {
    return c.json({ error: 'Failed to refund order' }, 500);
  }
});

export default orders;
