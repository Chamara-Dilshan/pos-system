// ============================================================================
// Sidebar Component - CloudPOS
// ============================================================================
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  X,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { tokens, colorScheme } from '../../config/colors';
import { RoleBadge } from '../common/Badge';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { userData, isAdmin } = useAuth();

  const isActive = (path) => location.pathname === path;

  // ── Navigation Items ──────────────────────────────────────────────────────
  const navItems = [
    { path: '/',           icon: LayoutDashboard, label: 'Dashboard',  adminOnly: true },
    { path: '/pos',        icon: ShoppingCart,    label: 'POS',        adminOnly: false },
    { path: '/products',   icon: Package,         label: 'Products',   adminOnly: true },
    { path: '/categories', icon: FolderOpen,      label: 'Categories', adminOnly: true },
    { path: '/orders',     icon: ShoppingBag,     label: 'Orders',     adminOnly: false },
    { path: '/reports',    icon: BarChart3,       label: 'Reports',    adminOnly: true },
    { path: '/users',      icon: Users,           label: 'Users',      adminOnly: true },
    { path: '/settings',   icon: Settings,        label: 'Settings',   adminOnly: true },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin()
  );

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Store size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">CloudPOS</h1>
            <p className="text-xs text-gray-400">Point of Sale</p>
          </div>
        </div>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    font-medium transition-all duration-200
                    ${active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className={active ? 'text-white' : 'text-gray-400'} />
                  <span>{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User Info ──────────────────────────────────────────────────────── */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: colorScheme.primary[600] }}
          >
            {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {/* User Details */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{userData?.name}</p>
            <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
          </div>
          {/* Role Badge */}
          <RoleBadge role={userData?.role} size="sm" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
