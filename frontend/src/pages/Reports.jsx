// ============================================================================
// Reports Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Calendar,
  CreditCard,
  Banknote,
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Loading from '../components/common/Loading';
import { StatsCard, SectionCard } from '../components/common/Card';
import { tokens, cardColors, alertColors, inputColors, colorScheme, gradientColors } from '../config/colors';

const Reports = () => {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [cashierSales, setCashierSales] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    setDateRange({
      start: lastWeek.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0],
    });
  }, []);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchReports();
    }
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');

      const [summaryRes, dailyRes, topProductsRes, cashierRes, paymentRes] = await Promise.all([
        api.getSalesSummary(dateRange.start, dateRange.end),
        api.getDailySales(7),
        api.getTopProducts(10, dateRange.start, dateRange.end),
        api.getSalesByCashier(dateRange.start, dateRange.end),
        api.getPaymentBreakdown(dateRange.start, dateRange.end),
      ]);

      setSummary(summaryRes.summary);
      setDailySales(dailyRes.daily_sales || []);
      setTopProducts(topProductsRes.top_products || []);
      setCashierSales(cashierRes.cashier_sales || []);
      setPaymentBreakdown(paymentRes.payment_breakdown || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading reports..." />;
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Sales Reports</h1>
          <p className={`${tokens.text.muted} mt-1`}>View your business performance</p>
        </div>

        {/* Date Range Selector */}
        <div className={`${cardColors.default} rounded-xl p-3`}>
          <div className="flex items-center gap-3">
            <Calendar size={20} className={tokens.text.muted} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className={`px-3 py-2 ${inputColors.base} ${inputColors.focus} rounded-lg`}
            />
            <span className={tokens.text.muted}>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className={`px-3 py-2 ${inputColors.base} ${inputColors.focus} rounded-lg`}
            />
          </div>
        </div>
      </div>

      {/* ── Error Alert ────────────────────────────────────────────────────── */}
      {error && (
        <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError('')} className="ml-auto hover:opacity-70">×</button>
        </div>
      )}

      {/* ── Summary Cards ──────────────────────────────────────────────────── */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sales"
            value={`${settings.currency_symbol}${summary.total_sales?.toFixed(2) || '0.00'}`}
            subtitle={`From ${summary.completed_orders || 0} orders`}
            icon={DollarSign}
            iconColor="success"
          />
          <StatsCard
            title="Avg Order Value"
            value={`${settings.currency_symbol}${summary.average_order_value?.toFixed(2) || '0.00'}`}
            subtitle="Per completed order"
            icon={TrendingUp}
            iconColor="primary"
          />
          <StatsCard
            title="Total Orders"
            value={summary.total_orders || 0}
            subtitle={`${summary.refunded_orders || 0} refunded`}
            icon={BarChart3}
            iconColor="purple"
          />
          <StatsCard
            title="Total Tax"
            value={`${settings.currency_symbol}${summary.total_tax?.toFixed(2) || '0.00'}`}
            subtitle="Collected"
            icon={DollarSign}
            iconColor="warning"
          />
        </div>
      )}

      {/* ── Daily Sales Chart ──────────────────────────────────────────────── */}
      <SectionCard title="Daily Sales (Last 7 Days)" icon={BarChart3}>
        {dailySales.length === 0 ? (
          <p className={`${tokens.text.muted} text-center py-8`}>No sales data available</p>
        ) : (
          <div className="space-y-4">
            {dailySales.map((day) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className={`w-28 text-sm font-medium ${tokens.text.secondary}`}>
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                        style={{
                          width: `${Math.max(Math.min((day.daily_sales / (summary?.total_sales || 1)) * 100, 100), 10)}%`,
                          background: `linear-gradient(to right, ${colorScheme.primary[500]}, ${colorScheme.primary[600]})`,
                        }}
                      >
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          {settings.currency_symbol}{day.daily_sales?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className={`text-sm ${tokens.text.muted} w-20 text-right`}>
                      {day.completed_count} orders
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Top Products ────────────────────────────────────────────────── */}
        <SectionCard title="Top Selling Products" icon={Package}>
          {topProducts.length === 0 ? (
            <p className={`${tokens.text.muted} text-center py-8`}>No product data available</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    index < 3 ? gradientColors.subtlePrimary : 'bg-gray-50'
                  } border ${index < 3 ? 'border-blue-100' : 'border-gray-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                      style={{
                        backgroundColor:
                          index === 0
                            ? colorScheme.success[500]
                            : index === 1
                            ? colorScheme.primary[500]
                            : index === 2
                            ? colorScheme.purple[500]
                            : colorScheme.neutral[400],
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className={`font-semibold ${tokens.text.primary}`}>{product.product_name}</p>
                      <p className={`text-xs ${tokens.text.muted}`}>{product.total_quantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-bold"
                      style={{ color: colorScheme.primary[600] }}
                    >
                      {settings.currency_symbol}{product.total_revenue?.toFixed(2)}
                    </p>
                    <p className={`text-xs ${tokens.text.muted}`}>{product.order_count} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Sales by Cashier ────────────────────────────────────────────── */}
        <SectionCard title="Sales by Cashier" icon={Users}>
          {cashierSales.length === 0 ? (
            <p className={`${tokens.text.muted} text-center py-8`}>No cashier data available</p>
          ) : (
            <div className="space-y-3">
              {cashierSales.map((cashier, index) => (
                <div
                  key={cashier.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: colorScheme.primary[600] }}
                    >
                      {cashier.cashier_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-semibold ${tokens.text.primary}`}>{cashier.cashier_name}</p>
                      <p className={`text-xs ${tokens.text.muted}`}>{cashier.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-bold"
                      style={{ color: colorScheme.primary[600] }}
                    >
                      {settings.currency_symbol}{cashier.total_sales?.toFixed(2) || '0.00'}
                    </p>
                    <p className={`text-xs ${tokens.text.muted}`}>{cashier.total_orders || 0} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Payment Methods ────────────────────────────────────────────────── */}
      {paymentBreakdown.length > 0 && (
        <SectionCard title="Payment Methods" icon={CreditCard}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentBreakdown.map((method) => (
              <div
                key={method.payment_type}
                className={`p-5 rounded-xl border ${
                  method.payment_type === 'cash'
                    ? `${alertColors.success.bg} ${alertColors.success.border}`
                    : `${alertColors.info.bg} ${alertColors.info.border}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {method.payment_type === 'cash' ? (
                        <Banknote size={20} className={alertColors.success.text} />
                      ) : (
                        <CreditCard size={20} className={alertColors.info.text} />
                      )}
                      <p className={`text-sm uppercase font-semibold ${tokens.text.secondary}`}>
                        {method.payment_type}
                      </p>
                    </div>
                    <p className={`text-2xl font-bold ${tokens.text.primary}`}>
                      {settings.currency_symbol}{method.total_amount?.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-3xl font-bold"
                      style={{ color: colorScheme.primary[600] }}
                    >
                      {method.transaction_count}
                    </p>
                    <p className={`text-xs ${tokens.text.muted}`}>transactions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default Reports;
