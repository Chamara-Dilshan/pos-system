// ============================================================================
// Users Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  Edit,
  UserCheck,
  UserX,
  Shield,
  User,
  Mail,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import Select from '../components/common/Select';
import { StatsCard } from '../components/common/Card';
import { RoleBadge, StatusBadge } from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { tokens, cardColors, alertColors, tableColors, colorScheme } from '../config/colors';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier',
    is_active: 1,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        api.getUsers(),
        api.getUserStats(),
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes.stats || null);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!editingUser) {
      setError('Cannot create users from this page. Users are created during registration.');
      return;
    }

    setSubmitting(true);
    try {
      await api.updateUser(editingUser.id, formData);
      setShowModal(false);
      setFormData({ name: '', email: '', role: 'cashier', is_active: 1 });
      setEditingUser(null);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user) => {
    const action = user.is_active ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      if (user.is_active) {
        await api.deactivateUser(user.id);
      } else {
        await api.reactivateUser(user.id);
      }
      fetchData();
    } catch (err) {
      setError(err.message || `Failed to ${action} user`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'cashier', is_active: 1 });
    setError('');
  };

  if (loading) {
    return <Loading message="Loading users..." />;
  }

  const roleOptions = [
    { value: 'cashier', label: 'Cashier' },
    { value: 'admin', label: 'Admin' },
  ];

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>User Management</h1>
        <p className={`${tokens.text.muted} mt-1`}>Manage user accounts and permissions</p>
      </div>

      {/* ── Error Alert ────────────────────────────────────────────────────── */}
      {error && !showModal && (
        <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
          <button onClick={() => setError('')} className="ml-auto hover:opacity-70">×</button>
        </div>
      )}

      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={stats.total_users}
            subtitle="All registered users"
            icon={UsersIcon}
            iconColor="primary"
          />
          <StatsCard
            title="Admins"
            value={stats.admin_count}
            subtitle="Administrator accounts"
            icon={Shield}
            iconColor="purple"
          />
          <StatsCard
            title="Cashiers"
            value={stats.cashier_count}
            subtitle="Cashier accounts"
            icon={User}
            iconColor="primary"
          />
          <StatsCard
            title="Active Users"
            value={stats.active_users}
            subtitle="Currently active"
            icon={UserCheck}
            iconColor="success"
          />
        </div>
      )}

      {/* ── Users Table ────────────────────────────────────────────────────── */}
      <div className={`${cardColors.default} rounded-xl overflow-hidden`}>
        {users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="User accounts will appear here after registration."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={tableColors.header}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      Created
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`bg-white divide-y ${tokens.border.light}`}>
                {users.map((user) => (
                  <tr key={user.id} className={tableColors.row}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: user.role === 'admin' ? colorScheme.purple[600] : colorScheme.primary[600] }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`font-semibold ${tokens.text.primary}`}>
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${tokens.text.muted}`}>{user.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.is_active ? 'active' : 'inactive'} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${tokens.text.muted}`}>
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(user)}
                          variant="primary"
                          size="sm"
                          icon={Edit}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleToggleActive(user)}
                          variant={user.is_active ? 'danger' : 'success'}
                          size="sm"
                          icon={user.is_active ? UserX : UserCheck}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Results Summary ────────────────────────────────────────────────── */}
      {users.length > 0 && (
        <div className={`${cardColors.default} rounded-xl px-5 py-3`}>
          <p className={`text-sm ${tokens.text.muted}`}>
            Total:{' '}
            <span className={`font-semibold ${tokens.text.primary}`}>
              {users.length}
            </span>{' '}
            {users.length === 1 ? 'user' : 'users'}
          </p>
        </div>
      )}

      {/* ── Edit User Modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={showModal && editingUser}
        onClose={handleCloseModal}
        title="Edit User"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error in Modal */}
          {error && showModal && (
            <div className={`${alertColors.error.full} px-4 py-3 rounded-xl text-sm flex items-center gap-2`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
            icon={Mail}
            required
          />

          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={roleOptions}
            icon={Shield}
            required
          />

          <Select
            label="Status"
            name="is_active"
            value={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
            options={statusOptions}
            icon={UserCheck}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
            >
              Update User
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
