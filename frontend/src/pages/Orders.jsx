// ============================================================================
// Orders Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ShoppingBag, Search, Filter } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import Table from '../components/common/Table';
import { tokens, cardColors, alertColors, inputColors, colorScheme } from '../config/colors';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      setOrders(response.orders || []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === '' ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cashier_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Order #',
      accessor: 'order_number',
      width: '160px',
      render: (value) => (
        <span className={`font-semibold ${tokens.text.primary}`}>{value}</span>
      ),
    },
    {
      header: 'Date & Time',
      accessor: 'created_at',
      render: (value) => (
        <div>
          <div className={`text-sm font-medium ${tokens.text.primary}`}>
            {new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
          <div className={`text-xs ${tokens.text.muted}`}>
            {new Date(value).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    ...(isAdmin()
      ? [
          {
            header: 'Cashier',
            accessor: 'cashier_name',
            width: '180px',
            render: (value) => (
              <span className={`text-sm ${tokens.text.secondary}`}>
                {value || 'Unknown'}
              </span>
            ),
          },
        ]
      : []),
    {
      header: 'Total',
      accessor: 'total',
      width: '140px',
      render: (value) => (
        <span className="text-sm font-bold" style={{ color: colorScheme.primary[600] }}>
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment_type',
      width: '140px',
      render: (value) => <StatusBadge status={value === 'cash' ? 'cash' : 'card'} size="sm" />,
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '140px',
      render: (value) => <StatusBadge status={value} size="sm" />,
    },
    {
      header: '',
      accessor: 'id',
      width: '140px',
      className: 'text-right',
      render: (_, row) => (
        <Button
          onClick={() => navigate(`/orders/${row.id}`)}
          variant="primary"
          size="sm"
          icon={Eye}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Loading message="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Orders</h1>
        <p className={`${tokens.text.muted} mt-1`}>View and manage order history</p>
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

      {/* ── Search and Filter ──────────────────────────────────────────────── */}
      <div className={`${cardColors.default} rounded-xl p-5`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${tokens.text.muted}`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search by order number or cashier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${inputColors.base} ${inputColors.focus} rounded-xl transition-all`}
            />
          </div>
          <div className="relative">
            <Filter
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${tokens.text.muted}`}
              size={18}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`pl-10 pr-8 py-3 ${inputColors.base} ${inputColors.focus} rounded-xl transition-all min-w-[180px] appearance-none cursor-pointer`}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Orders Table ───────────────────────────────────────────────────── */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          description={
            orders.length === 0
              ? 'No orders have been placed yet.'
              : 'Try adjusting your search or filters.'
          }
        />
      ) : (
        <>
          <Table
            columns={columns}
            data={filteredOrders}
            striped
            hoverable
            emptyMessage="No orders match your filters"
            onRowClick={(row) => navigate(`/orders/${row.id}`)}
          />

          {/* ── Results Summary ──────────────────────────────────────────────── */}
          <div className={`${cardColors.default} rounded-xl px-5 py-3`}>
            <p className={`text-sm ${tokens.text.muted}`}>
              Showing{' '}
              <span className={`font-semibold ${tokens.text.primary}`}>
                {filteredOrders.length}
              </span>{' '}
              of{' '}
              <span className={`font-semibold ${tokens.text.primary}`}>
                {orders.length}
              </span>{' '}
              orders
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
