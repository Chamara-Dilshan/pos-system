// ============================================================================
// Stripe Service - CloudPOS
// Initializes and exports Stripe instance for card payments
// ============================================================================
import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise = null;

/**
 * Get the Stripe instance (lazy loaded)
 * @returns {Promise<Stripe|null>} Stripe instance or null if not configured
 */
export const getStripe = () => {
  if (!stripePromise && stripePublicKey && !stripePublicKey.includes('placeholder')) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

/**
 * Check if Stripe is properly configured
 * @returns {boolean} True if Stripe public key is set
 */
export const isStripeConfigured = () => {
  return !!(stripePublicKey && !stripePublicKey.includes('placeholder'));
};

export default { getStripe, isStripeConfigured };
