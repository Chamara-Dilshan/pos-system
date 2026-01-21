// ============================================================================
// Cart Component - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Percent, DollarSign, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import Button from '../common/Button';
import PaymentModal from './PaymentModal';
import { tokens, cardColors, buttonColors, alertColors, colorScheme } from '../../config/colors';

const Cart = () => {
  const {
    items,
    discount,
    stockError,
    setDiscount,
    removeItem,
    updateQuantity,
    clearCart,
    clearStockError,
    calculateSubtotal,
    calculateDiscount,
    calculateTax,
    calculateTotal,
    getItemCount,
  } = useCart();

  const { settings } = useSettings();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountInput, setDiscountInput] = useState({ type: 'percentage', value: '' });

  const taxRate = settings.tax_rate || 10;
  const currencySymbol = settings.currency_symbol || '$';

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(productId, newQuantity);
  };

  const handleApplyDiscount = () => {
    const value = parseFloat(discountInput.value);
    if (isNaN(value) || value < 0) {
      alert('Please enter a valid discount value');
      return;
    }

    if (discountInput.type === 'percentage' && value > 100) {
      alert('Percentage discount cannot exceed 100%');
      return;
    }

    setDiscount({ type: discountInput.type, value });
    setShowDiscountInput(false);
  };

  const handleRemoveDiscount = () => {
    setDiscount({ type: 'none', value: 0 });
    setDiscountInput({ type: 'percentage', value: '' });
    setShowDiscountInput(false);
  };

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscount();
  const tax = calculateTax(taxRate);
  const total = calculateTotal(taxRate);

  return (
    <>
      <div className={`${cardColors.default} rounded-xl h-full flex flex-col min-h-0 max-h-full`}>
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className={`p-4 border-b ${tokens.border.default}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${tokens.text.primary} flex items-center gap-2`}>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingCart size={18} className="text-blue-600" />
              </div>
              Current Order
            </h2>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 size={14} />
                Clear
              </button>
            )}
          </div>
          <p className={`text-sm ${tokens.text.muted} mt-1`}>
            {getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in cart
          </p>
        </div>

        {/* ── Stock Error Alert ──────────────────────────────────────────────── */}
        {stockError && (
          <div className={`mx-4 mt-4 ${alertColors.warning.full} px-3 py-2.5 rounded-xl text-sm flex items-center gap-2`}>
            <AlertTriangle size={16} />
            <span className="flex-1">{stockError.message}</span>
            <button
              onClick={clearStockError}
              className="hover:opacity-70 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Cart Items ─────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag size={36} className="text-gray-300" />
              </div>
              <p className={`font-medium ${tokens.text.muted}`}>Your cart is empty</p>
              <p className={`text-sm ${tokens.text.muted} mt-1`}>Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${tokens.text.primary} flex-1 pr-2 line-clamp-2`}>
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className={`w-10 text-center font-semibold ${tokens.text.primary}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className={`text-xs ${tokens.text.muted}`}>
                        {currencySymbol}{item.price.toFixed(2)} each
                      </div>
                      <div className={`font-bold ${tokens.text.primary}`}>
                        {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                      </div>
                      {item.quantity >= item.stock && (
                        <div className="text-xs text-amber-600 font-medium mt-0.5">
                          Max stock reached
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Summary ────────────────────────────────────────────────────────── */}
        {items.length > 0 && (
          <div className={`border-t ${tokens.border.default} p-4 space-y-3 bg-gray-50/50`}>
            {/* Subtotal */}
            <div className={`flex justify-between ${tokens.text.secondary}`}>
              <span>Subtotal:</span>
              <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>

            {/* Discount Section */}
            {discount.type === 'none' && !showDiscountInput ? (
              <button
                onClick={() => setShowDiscountInput(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors"
              >
                <Percent size={16} />
                Add Discount
              </button>
            ) : discount.type !== 'none' ? (
              <div className={`flex justify-between items-center ${alertColors.success.full} px-3 py-2.5 rounded-xl`}>
                <span className="flex items-center gap-1.5 text-sm">
                  {discount.type === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}
                  Discount {discount.type === 'percentage' ? `(${discount.value}%)` : ''}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                  <button
                    onClick={handleRemoveDiscount}
                    className="p-1 rounded hover:bg-green-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 p-3 rounded-xl space-y-2 border border-blue-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiscountInput({ ...discountInput, type: 'percentage' })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      discountInput.type === 'percentage'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Percent size={14} className="inline mr-1" />
                    Percentage
                  </button>
                  <button
                    onClick={() => setDiscountInput({ ...discountInput, type: 'fixed' })}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      discountInput.type === 'fixed'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <DollarSign size={14} className="inline mr-1" />
                    Fixed
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  max={discountInput.type === 'percentage' ? '100' : undefined}
                  step="0.01"
                  value={discountInput.value}
                  onChange={(e) => setDiscountInput({ ...discountInput, value: e.target.value })}
                  placeholder={discountInput.type === 'percentage' ? 'Enter %' : 'Enter amount'}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <Button onClick={handleApplyDiscount} variant="primary" size="sm" fullWidth>
                    Apply
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDiscountInput(false);
                      setDiscountInput({ type: 'percentage', value: '' });
                    }}
                    variant="secondary"
                    size="sm"
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Tax */}
            <div className={`flex justify-between ${tokens.text.secondary}`}>
              <span>Tax ({taxRate}%):</span>
              <span className="font-medium">{currencySymbol}{tax.toFixed(2)}</span>
            </div>

            {/* Total */}
            <div className={`flex justify-between text-xl font-bold ${tokens.text.primary} pt-3 border-t ${tokens.border.default}`}>
              <span>Total:</span>
              <span style={{ color: colorScheme.primary[600] }}>{currencySymbol}{total.toFixed(2)}</span>
            </div>

            {/* Payment Button */}
            <Button
              onClick={() => setShowPaymentModal(true)}
              variant="primary"
              size="lg"
              fullWidth
              icon={DollarSign}
            >
              Proceed to Payment
            </Button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            clearCart();
          }}
        />
      )}
    </>
  );
};

export default Cart;
