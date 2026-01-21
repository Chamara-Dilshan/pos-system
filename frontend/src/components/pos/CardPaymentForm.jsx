// ============================================================================
// Card Payment Form - CloudPOS
// Stripe CardElement form for processing card payments
// ============================================================================
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { tokens, alertColors } from '../../config/colors';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

const CardPaymentForm = ({ clientSecret, onSuccess, onError, processing, setProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardComplete) {
      setCardError('Please complete your card details');
      return;
    }

    setProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setCardError(error.message);
        onError(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        setCardError('Payment was not successful. Please try again.');
        onError('Payment was not successful');
        setProcessing(false);
      }
    } catch (err) {
      setCardError('An unexpected error occurred. Please try again.');
      onError(err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {cardError && (
        <div className={`${alertColors.error.full} px-4 py-3 rounded-xl flex items-center gap-2 text-sm`}>
          <AlertCircle size={18} />
          <span>{cardError}</span>
        </div>
      )}

      {/* Card Input */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard size={20} className="text-gray-400" />
          <span className={`text-sm font-medium ${tokens.text.secondary}`}>Card Details</span>
        </div>
        <CardElement
          options={CARD_ELEMENT_OPTIONS}
          onChange={handleCardChange}
        />
      </div>

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Lock size={14} />
        <span>Your payment is secured by Stripe. Card details are encrypted.</span>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={processing}
        disabled={!stripe || processing || !cardComplete}
        icon={CreditCard}
      >
        {processing ? 'Processing Payment...' : 'Pay Now'}
      </Button>

      {/* Test Card Info (only shown in development) */}
      {import.meta.env.DEV && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-1">Test Card Numbers:</p>
          <p className="text-xs text-gray-500">Success: 4242 4242 4242 4242</p>
          <p className="text-xs text-gray-500">Declined: 4000 0000 0000 0002</p>
          <p className="text-xs text-gray-500">Use any future date & any CVC</p>
        </div>
      )}
    </form>
  );
};

export default CardPaymentForm;
