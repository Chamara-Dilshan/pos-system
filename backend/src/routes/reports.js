import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const reports = new Hono();

// All reports require admin access
reports.use('/*', authMiddleware);
reports.use('/*', adminMiddleware);

// Get sales summary
reports.get('/sales/summary', async (c) => {
  const db = c.env.DB;
  const { start_date, end_date } = c.req.query();

  try {
    let query = `
      SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) as refunded_orders,
        SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as total_sales,
        SUM(CASE WHEN status = 'completed' THEN subtotal ELSE 0 END) as total_subtotal,
        SUM(CASE WHEN status = 'completed' AND discount_type != 'none' THEN discount_value ELSE 0 END) as total_discounts,
        SUM(CASE WHEN status = 'completed' THEN tax ELSE 0 END) as total_tax,
        AVG(CASE WHEN status = 'completed' THEN total ELSE NULL END) as average_order_value
      FROM orders
    `;

    const params = [];

    if (start_date && end_date) {
      query += ' WHERE DATE(created_at) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    } else if (start_date) {
      query += ' WHERE DATE(created_at) >= ?';
      params.push(start_date);
    } else if (end_date) {
      query += ' WHERE DATE(created_at) <= ?';
      params.push(end_date);
    }

    const summary = await db.prepare(query).bind(...params).first();

    return c.json({ summary });
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    return c.json({ error: 'Failed to fetch sales summary' }, 500);
  }
});

// Get daily sales
reports.get('/sales/daily', async (c) => {
  const db = c.env.DB;
  const { days = 7 } = c.req.query();

  try {
    const result = await db.prepare(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(CASE WHEN status = 'completed' THEN total ELSE 0 END) as daily_sales,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM orders
      WHERE DATE(created_at) >= DATE('now', '-' || ? || ' days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `).bind(days).all();

    return c.json({ daily_sales: result.results || [] });
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    return c.json({ error: 'Failed to fetch daily sales' }, 500);
  }
});

// Get top selling products
reports.get('/products/top', async (c) => {
  const db = c.env.DB;
  const { limit = 10, start_date, end_date } = c.req.query();

  try {
    let query = `
      SELECT
        oi.product_name,
        oi.product_id,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.total_price) as total_revenue,
        COUNT(DISTINCT oi.order_id) as order_count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
    `;

    const params = [];

    if (start_date && end_date) {
      query += ' AND DATE(o.created_at) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND DATE(o.created_at) >= ?';
      params.push(start_date);
    } else if (end_date) {
      query += ' AND DATE(o.created_at) <= ?';
      params.push(end_date);
    }

    query += `
      GROUP BY oi.product_id, oi.product_name
      ORDER BY total_quantity DESC
      LIMIT ?
    `;
    params.push(parseInt(limit));

    const result = await db.prepare(query).bind(...params).all();

    return c.json({ top_products: result.results || [] });
  } catch (error) {
    console.error('Error fetching top products:', error);
    return c.json({ error: 'Failed to fetch top products' }, 500);
  }
});

// Get sales by cashier
reports.get('/sales/by-cashier', async (c) => {
  const db = c.env.DB;
  const { start_date, end_date } = c.req.query();

  try {
    let query = `
      SELECT
        u.id,
        u.name as cashier_name,
        u.email,
        COUNT(o.id) as total_orders,
        SUM(CASE WHEN o.status = 'completed' THEN o.total ELSE 0 END) as total_sales,
        AVG(CASE WHEN o.status = 'completed' THEN o.total ELSE NULL END) as average_order_value
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
    `;

    const params = [];

    if (start_date || end_date) {
      query += ' WHERE ';
      if (start_date && end_date) {
        query += 'DATE(o.created_at) BETWEEN ? AND ?';
        params.push(start_date, end_date);
      } else if (start_date) {
        query += 'DATE(o.created_at) >= ?';
        params.push(start_date);
      } else {
        query += 'DATE(o.created_at) <= ?';
        params.push(end_date);
      }
    }

    query += `
      GROUP BY u.id, u.name, u.email
      ORDER BY total_sales DESC
    `;

    const result = await db.prepare(query).bind(...params).all();

    return c.json({ cashier_sales: result.results || [] });
  } catch (error) {
    console.error('Error fetching cashier sales:', error);
    return c.json({ error: 'Failed to fetch cashier sales' }, 500);
  }
});

// Get payment method breakdown
reports.get('/payments/breakdown', async (c) => {
  const db = c.env.DB;
  const { start_date, end_date } = c.req.query();

  try {
    let query = `
      SELECT
        payment_type,
        COUNT(*) as transaction_count,
        SUM(total) as total_amount
      FROM orders
      WHERE status = 'completed'
    `;

    const params = [];

    if (start_date && end_date) {
      query += ' AND DATE(created_at) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND DATE(created_at) >= ?';
      params.push(start_date);
    } else if (end_date) {
      query += ' AND DATE(created_at) <= ?';
      params.push(end_date);
    }

    query += ' GROUP BY payment_type ORDER BY total_amount DESC';

    const result = await db.prepare(query).bind(...params).all();

    return c.json({ payment_breakdown: result.results || [] });
  } catch (error) {
    console.error('Error fetching payment breakdown:', error);
    return c.json({ error: 'Failed to fetch payment breakdown' }, 500);
  }
});

export default reports;
