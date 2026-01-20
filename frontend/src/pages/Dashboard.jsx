// ============================================================================
// Dashboard Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/common/Loading';
import Card, { StatsCard, SectionCard } from '../components/common/Card';
import { StatusBadge } from '../components/common/Badge';
import { tokens, iconWithBg, alertColors, gradientColors, colorScheme } from '../config/colors';

const Dashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, lowStockRes] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getLowStockProducts()
      ]);

      const products = productsRes.products || [];
      const orders = ordersRes.orders || [];
      const lowStock = lowStockRes.products || [];

      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === today && order.status === 'completed';
      });
      const todaysSales = todayOrders.reduce((sum, order) => sum + order.total, 0);

      setStats({
        todaysSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        lowStockCount: lowStock.length
      });

      setLowStockProducts(lowStock.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Dashboard</h1>
        <p className={`${tokens.text.muted} mt-1`}>
          Welcome back, {userData?.name}! Here's what's happening today.
        </p>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Sales"
          value={`$${stats?.todaysSales?.toFixed(2) || '0.00'}`}
          subtitle={stats?.todaysSales > 0 ? 'Great job!' : 'No sales yet today'}
          icon={DollarSign}
          iconColor="success"
        />

        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          subtitle="All time orders"
          icon={ShoppingBag}
          iconColor="primary"
        />

        <StatsCard
          title="Products"
          value={stats?.totalProducts || 0}
          subtitle="In inventory"
          icon={Package}
          iconColor="purple"
        />

        <Link to="/products">
          <StatsCard
            title="Low Stock"
            value={stats?.lowStockCount || 0}
            subtitle={stats?.lowStockCount > 0 ? 'Click to view →' : 'All stocked!'}
            icon={AlertTriangle}
            iconColor="warning"
            className="hover:shadow-lg transition-shadow cursor-pointer"
          />
        </Link>
      </div>

      {/* ── Low Stock Alert ────────────────────────────────────────────────── */}
      {lowStockProducts.length > 0 && (
        <div className={`${alertColors.warning.bg} border ${alertColors.warning.border} rounded-xl p-5`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${iconWithBg.warning}`}>
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold ${tokens.text.primary} mb-1`}>
                Low Stock Alert
              </h3>
              <p className={`text-sm ${tokens.text.secondary} mb-4`}>
                The following products need restocking:
              </p>

              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between bg-white p-3 rounded-xl border border-orange-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold ${tokens.text.primary} truncate`}>{product.name}</p>
                        <p className={`text-xs ${tokens.text.muted}`}>{product.category_name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <StatusBadge status="lowStock" size="sm" />
                      <p className={`text-xs ${tokens.text.muted} mt-1`}>
                        {product.stock} / {product.min_stock} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {stats?.lowStockCount > 5 && (
                <Link
                  to="/products"
                  className={`inline-flex items-center gap-1 mt-4 text-sm font-semibold text-orange-600 hover:text-orange-700`}
                >
                  View all {stats.lowStockCount} low stock items
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/pos">
          <Card
            variant="primary"
            className="p-5 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">New Sale</h3>
                <p className="text-sm text-blue-700">Open POS terminal</p>
              </div>
              <ArrowRight size={20} className="ml-auto text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link to="/products">
          <Card
            variant="success"
            className="p-5 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center text-white">
                <Package size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Add Product</h3>
                <p className="text-sm text-green-700">Manage inventory</p>
              </div>
              <ArrowRight size={20} className="ml-auto text-green-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link to="/reports">
          <Card
            variant="default"
            className="p-5 hover:shadow-lg transition-all cursor-pointer group border-purple-200 bg-purple-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">View Reports</h3>
                <p className="text-sm text-purple-700">Sales analytics</p>
              </div>
              <ArrowRight size={20} className="ml-auto text-purple-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>

      {/* ── Welcome Card ───────────────────────────────────────────────────── */}
      <div className={`${gradientColors.subtlePrimary} p-6 rounded-xl border border-blue-200`}>
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: colorScheme.primary[600] }}
          >
            <Store size={28} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${tokens.text.primary} mb-2`}>
              Welcome to CloudPOS
            </h2>
            <p className={tokens.text.secondary}>
              Hello, <span className="font-semibold">{userData?.name}</span>! You're logged in as a{' '}
              <span className="font-semibold capitalize text-blue-600">{userData?.role}</span>.
              Start by adding products and categories, then use the POS system to make sales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
