// ============================================================================
// Payment Modal Component - CloudPOS
// ============================================================================
import { useState } from 'react';
import { DollarSign, CreditCard, CheckCircle, X, Printer, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../common/Button';
import Receipt from './Receipt';
import { tokens, alertColors, colorScheme } from '../../config/colors';

const PaymentModal = ({ onClose, onSuccess }) => {
  const { items, discount, calculateSubtotal, calculateDiscount, calculateTax, calculateTotal } = useCart();
  const { userData } = useAuth();

  const [paymentType, setPaymentType] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const taxRate = 10;
  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount();
  const tax = calculateTax(taxRate);
  const total = calculateTotal(taxRate);
  const change = cashReceived ? parseFloat(cashReceived) - total : 0;

  // Quick cash buttons
  const quickCashAmounts = [
    Math.ceil(total),
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
    Math.ceil(total / 50) * 50,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total).slice(0, 4);

  const handlePayment = async () => {
    setError('');

    if (paymentType === 'cash') {
      const received = parseFloat(cashReceived);
      if (!received || received < total) {
        setError('Cash received must be at least the total amount');
        return;
      }
    }

    setProcessing(true);

    try {
      const orderData = {
        user_id: userData.id,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        })),
        subtotal,
        discount_type: discount.type,
        discount_value: discount.value,
        tax,
        total,
        payment_type: paymentType,
        payment_status: 'paid',
        status: 'completed',
      };

      const response = await api.createOrder(orderData);
      setCompletedOrder(response.order);
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // ── Success State ─────────────────────────────────────────────────────────
  if (completedOrder) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-2xl">
          <div className="p-6">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h2 className={`text-2xl font-bold ${tokens.text.success}`}>
                Payment Successful!
              </h2>
              <p className={tokens.text.muted}>Order #{completedOrder.order_number}</p>
            </div>

            {/* Receipt */}
            <Receipt
              order={completedOrder}
              items={items}
              change={paymentType === 'cash' ? change : 0}
            />

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handlePrintReceipt}
                variant="outlineSecondary"
                size="lg"
                fullWidth
                icon={Printer}
              >
                Print Receipt
              </Button>
              <Button
                onClick={onSuccess}
                variant="primary"
                size="lg"
                fullWidth
                icon={Plus}
              >
                New Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment Form ──────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${tokens.border.default}`}>
          <h2 className={`text-xl font-bold ${tokens.text.primary}`}>Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className={tokens.text.muted} />
          </button>
        </div>

        <div className="p-5">
          {/* Error */}
          {error && (
            <div className={`${alertColors.error.full} px-4 py-3 rounded-xl mb-4 flex items-center gap-2`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className={`flex justify-between ${tokens.text.secondary} mb-2`}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 mb-2">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className={`flex justify-between ${tokens.text.secondary} mb-2`}>
              <span>Tax ({taxRate}%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-xl font-bold ${tokens.text.primary} pt-3 border-t border-gray-200`}>
              <span>Total:</span>
              <span style={{ color: colorScheme.primary[600] }}>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-5">
            <label className={`block text-sm font-medium ${tokens.text.secondary} mb-3`}>
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentType('cash')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentType === 'cash'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <DollarSign size={28} />
                <span className="font-semibold">Cash</span>
              </button>
              <button
                onClick={() => setPaymentType('card')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentType === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <CreditCard size={28} />
                <span className="font-semibold">Card</span>
              </button>
            </div>
          </div>

          {/* Cash Payment Details */}
          {paymentType === 'cash' && (
            <div className="mb-5">
              <label className={`block text-sm font-medium ${tokens.text.secondary} mb-2`}>
                Cash Received
              </label>
              <input
                type="number"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 text-xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              {/* Quick Cash Buttons */}
              <div className="flex gap-2 mt-3">
                {quickCashAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCashReceived(amount.toString())}
                    className="flex-1 py-2 px-3 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Change Display */}
              {cashReceived && parseFloat(cashReceived) >= total && (
                <div className={`mt-3 p-4 rounded-xl ${alertColors.success.bg} border ${alertColors.success.border}`}>
                  <div className={`flex justify-between items-center ${alertColors.success.text}`}>
                    <span className="font-medium">Change:</span>
                    <span className="text-2xl font-bold">${change.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card Payment Info */}
          {paymentType === 'card' && (
            <div className={`mb-5 p-4 rounded-xl ${alertColors.info.bg} border ${alertColors.info.border}`}>
              <p className={`text-sm ${alertColors.info.text}`}>
                Card payment will be processed through the terminal. Click "Complete Payment" when the transaction is approved.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePayment}
              variant="primary"
              size="lg"
              fullWidth
              loading={processing}
              icon={CheckCircle}
            >
              Complete Payment
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              disabled={processing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
