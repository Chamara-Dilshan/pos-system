// ============================================================================
// Order Details Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  RefreshCcw,
  ShoppingBag,
  User,
  CreditCard,
  Calendar,
  Hash,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Receipt from '../components/pos/Receipt';
import { StatusBadge } from '../components/common/Badge';
import { SectionCard } from '../components/common/Card';
import { tokens, cardColors, alertColors, colorScheme } from '../config/colors';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { settings } = useSettings();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.getOrder(id);
      setOrder(response.order);
    } catch (err) {
      setError('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to refund this order? This action cannot be undone.')) {
      return;
    }

    try {
      setRefunding(true);
      await api.refundOrder(id);
      await fetchOrder();
      alert('Order refunded successfully');
    } catch (err) {
      setError(err.message || 'Failed to refund order');
    } finally {
      setRefunding(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <Loading message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={36} className="text-gray-300" />
        </div>
        <h2 className={`text-2xl font-bold ${tokens.text.primary} mb-2`}>Order not found</h2>
        <p className={`${tokens.text.muted} mb-4`}>The order you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/orders')} variant="primary">
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Back Button ────────────────────────────────────────────────────── */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 ${tokens.text.muted} hover:${tokens.text.primary} transition-colors font-medium print:hidden`}
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </button>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: colorScheme.primary[600] }}
          >
            <ShoppingBag size={28} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>
              Order #{order.order_number}
            </h1>
            <p className={tokens.text.muted}>
              {new Date(order.created_at).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} size="lg" />
      </div>

      {/* ── Error Alert ────────────────────────────────────────────────────── */}
      {error && (
        <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2 print:hidden`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError('')} className="ml-auto hover:opacity-70">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column - Order Details ──────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <SectionCard title="Order Information" icon={Hash}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className={`text-sm ${tokens.text.muted} mb-1`}>Order Number</p>
                <p className={`font-semibold ${tokens.text.primary}`}>{order.order_number}</p>
              </div>
              <div>
                <p className={`text-sm ${tokens.text.muted} mb-1`}>Date & Time</p>
                <p className={`font-semibold ${tokens.text.primary}`}>
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className={`text-sm ${tokens.text.muted}`}>
                  {new Date(order.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className={`text-sm ${tokens.text.muted} mb-1`}>Cashier</p>
                <div className="flex items-center gap-2">
                  <User size={16} className={tokens.text.muted} />
                  <span className={`font-semibold ${tokens.text.primary}`}>
                    {order.cashier_name || 'Unknown'}
                  </span>
                </div>
              </div>
              <div>
                <p className={`text-sm ${tokens.text.muted} mb-1`}>Payment Method</p>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className={tokens.text.muted} />
                  <span className={`font-semibold ${tokens.text.primary} capitalize`}>
                    {order.payment_type}
                  </span>
                </div>
              </div>
              <div>
                <p className={`text-sm ${tokens.text.muted} mb-1`}>Payment Status</p>
                <StatusBadge status={order.payment_status} size="sm" />
              </div>
              <div>
                <p className={`text-sm ${tokens.text.muted} mb-1`}>Order Status</p>
                <StatusBadge status={order.status} size="sm" />
              </div>
            </div>
          </SectionCard>

          {/* Order Items */}
          <SectionCard title="Order Items" icon={Package}>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`flex justify-between items-center py-4 ${
                      index !== order.items.length - 1 ? `border-b ${tokens.border.light}` : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${tokens.text.primary}`}>
                          {item.product_name}
                        </h3>
                        <p className={`text-sm ${tokens.text.muted}`}>
                          {item.quantity} × {settings.currency_symbol}{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className="font-bold"
                        style={{ color: colorScheme.primary[600] }}
                      >
                        {settings.currency_symbol}{item.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={tokens.text.muted}>No items found</p>
            )}
          </SectionCard>
        </div>

        {/* ── Right Column - Summary & Actions ─────────────────────────────── */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className={`${cardColors.default} rounded-xl p-6`}>
            <h2 className={`text-lg font-semibold ${tokens.text.primary} mb-4`}>
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className={`flex justify-between ${tokens.text.secondary}`}>
                <span>Subtotal:</span>
                <span>{settings.currency_symbol}{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount_value > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{settings.currency_symbol}{order.discount_value.toFixed(2)}</span>
                </div>
              )}
              <div className={`flex justify-between ${tokens.text.secondary}`}>
                <span>Tax:</span>
                <span>{settings.currency_symbol}{order.tax.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-xl font-bold ${tokens.text.primary} pt-4 border-t ${tokens.border.default}`}>
                <span>Total:</span>
                <span style={{ color: colorScheme.primary[600] }}>
                  {settings.currency_symbol}{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`${cardColors.default} rounded-xl p-6 print:hidden`}>
            <h2 className={`text-lg font-semibold ${tokens.text.primary} mb-4`}>
              Actions
            </h2>
            <div className="space-y-3">
              <Button
                onClick={handlePrint}
                variant="outlineSecondary"
                size="lg"
                fullWidth
                icon={Printer}
              >
                Print Receipt
              </Button>

              {isAdmin() && order.status !== 'refunded' && (
                <Button
                  onClick={handleRefund}
                  variant="danger"
                  size="lg"
                  fullWidth
                  loading={refunding}
                  icon={RefreshCcw}
                >
                  Refund Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Hidden Receipt for Printing ────────────────────────────────────── */}
      <div className="hidden print:block mt-8">
        <Receipt
          order={order}
          items={order.items || []}
          change={0}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
