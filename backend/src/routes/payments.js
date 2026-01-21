// ============================================================================
// Payments Route - CloudPOS
// Handles Stripe Payment Intent creation for card payments
// ============================================================================
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

const payments = new Hono();

// All payment routes require authentication
payments.use('/*', authMiddleware);

// Create Payment Intent
payments.post('/create-intent', async (c) => {
  try {
    const { amount, currency, metadata } = await c.req.json();

    // Validate amount (must be positive)
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount' }, 400);
    }

    const stripeSecretKey = c.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return c.json({ error: 'Payment service not configured' }, 500);
    }

    // Create Payment Intent using Stripe REST API
    // (Cloudflare Workers compatible - no Node.js SDK needed)
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency: currency || 'usd',
        'automatic_payment_methods[enabled]': 'true',
        'metadata[items_count]': metadata?.itemsCount?.toString() || '0',
        'metadata[user_id]': metadata?.userId?.toString() || '',
      }).toString(),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      console.error('Stripe error:', paymentIntent);
      return c.json({
        error: paymentIntent.error?.message || 'Failed to create payment intent'
      }, 400);
    }

    return c.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment Intent creation error:', error);
    return c.json({ error: 'Failed to create payment intent' }, 500);
  }
});

// Verify Payment Intent status
payments.get('/verify/:paymentIntentId', async (c) => {
  try {
    const paymentIntentId = c.req.param('paymentIntentId');
    const stripeSecretKey = c.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return c.json({ error: 'Payment service not configured' }, 500);
    }

    const response = await fetch(
      `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`,
      {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      }
    );

    const paymentIntent = await response.json();

    if (!response.ok) {
      return c.json({ error: 'Failed to verify payment' }, 400);
    }

    return c.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back from cents
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

export default payments;
