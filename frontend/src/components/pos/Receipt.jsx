// ============================================================================
// Receipt Component - CloudPOS
// ============================================================================
import { Store } from 'lucide-react';
import { tokens, colorScheme } from '../../config/colors';

const Receipt = ({ order, items, change }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto print:border-0 print:shadow-none">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center mb-6 pb-4 border-b-2 border-dashed border-gray-200">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
          style={{ backgroundColor: colorScheme.primary[600] }}
        >
          <Store size={24} className="text-white" />
        </div>
        <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>CloudPOS</h1>
        <p className={`text-sm ${tokens.text.muted}`}>Point of Sale System</p>
      </div>

      {/* ── Order Info ─────────────────────────────────────────────────────── */}
      <div className={`py-3 mb-4 border-b border-gray-200 space-y-1.5`}>
        <div className="flex justify-between text-sm">
          <span className={tokens.text.muted}>Order #:</span>
          <span className={`font-semibold ${tokens.text.primary}`}>{order.order_number}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className={tokens.text.muted}>Date:</span>
          <span className={tokens.text.secondary}>{formatDate(order.created_at)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className={tokens.text.muted}>Cashier:</span>
          <span className={tokens.text.secondary}>{order.cashier_name || 'Admin'}</span>
        </div>
      </div>

      {/* ── Items ──────────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${tokens.text.muted} mb-3`}>
          Order Items
        </h3>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex-1">
                <p className={`font-medium ${tokens.text.primary}`}>{item.name}</p>
                <p className={`text-sm ${tokens.text.muted}`}>
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <span className={`font-semibold ${tokens.text.primary}`}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Totals ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-3 space-y-2">
        <div className={`flex justify-between ${tokens.text.secondary}`}>
          <span>Subtotal:</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        {order.discount_value > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-${order.discount_value.toFixed(2)}</span>
          </div>
        )}
        <div className={`flex justify-between ${tokens.text.secondary}`}>
          <span>Tax:</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between text-xl font-bold ${tokens.text.primary} pt-3 border-t border-gray-200`}>
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* ── Payment Details ────────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 mt-4 pt-3 space-y-2">
        <div className={`flex justify-between ${tokens.text.secondary}`}>
          <span>Payment Method:</span>
          <span className={`font-semibold capitalize ${tokens.text.primary}`}>{order.payment_type}</span>
        </div>
        {order.payment_type === 'cash' && change !== undefined && change > 0 && (
          <>
            <div className={`flex justify-between ${tokens.text.secondary}`}>
              <span>Cash Received:</span>
              <span>${(order.total + change).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Change:</span>
              <span>${change.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="text-center mt-6 pt-4 border-t-2 border-dashed border-gray-200">
        <p className={`font-medium ${tokens.text.primary}`}>Thank you for your purchase!</p>
        <p className={`text-xs ${tokens.text.muted} mt-2`}>
          Powered by CloudPOS • Receipt #{order.order_number}
        </p>
        <div className="mt-4 flex justify-center">
          <div className="w-32 h-8 bg-gray-100 rounded flex items-center justify-center">
            <div className="flex gap-0.5">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gray-800"
                  style={{ height: Math.random() * 16 + 8 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
