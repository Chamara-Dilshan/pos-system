// ============================================================================
// Header Component - CloudPOS
// ============================================================================
import { LogOut, Menu, Bell, User, ChevronDown, Package, AlertTriangle, XCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { tokens, colorScheme, alertColors } from '../../config/colors';
import { RoleBadge } from '../common/Badge';

const Header = ({ onMenuClick }) => {
  const { userData, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(() => {
    const saved = localStorage.getItem('readNotifications');
    return saved ? JSON.parse(saved) : [];
  });
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // ── Fetch notifications (low stock alerts) ────────────────────────────────
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAdmin()) return;

      try {
        const response = await api.getLowStockProducts();
        const lowStockProducts = response.products || [];

        const newNotifications = lowStockProducts.map((product) => {
          const isOutOfStock = product.stock === 0;
          return {
            id: isOutOfStock ? `out-of-stock-${product.id}` : `low-stock-${product.id}`,
            type: isOutOfStock ? 'out_of_stock' : 'low_stock',
            title: isOutOfStock ? 'Out of Stock!' : 'Low Stock Alert',
            message: isOutOfStock
              ? `${product.name} is completely out of stock`
              : `${product.name} has only ${product.stock} items left (min: ${product.min_stock})`,
            productId: product.id,
            productName: product.name,
            stock: product.stock,
            minStock: product.min_stock,
            timestamp: new Date().toISOString(),
          };
        });

        // Sort: out of stock first, then low stock
        newNotifications.sort((a, b) => {
          if (a.type === 'out_of_stock' && b.type !== 'out_of_stock') return -1;
          if (a.type !== 'out_of_stock' && b.type === 'out_of_stock') return 1;
          return 0;
        });

        setNotifications(newNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // ── Close dropdowns on outside click ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Save read notifications to localStorage ───────────────────────────────
  useEffect(() => {
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }, [readNotifications]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const markAsRead = (notificationId) => {
    if (!readNotifications.includes(notificationId)) {
      setReadNotifications([...readNotifications, notificationId]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(allIds);
  };

  const dismissNotification = (notificationId) => {
    markAsRead(notificationId);
  };

  const unreadCount = notifications.filter((n) => !readNotifications.includes(n.id)).length;

  // ── Get greeting based on time ────────────────────────────────────────────
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className={`${tokens.bg.header} shadow-sm border-b ${tokens.border.default} sticky top-0 z-30`}>
      <div className="px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className={tokens.text.secondary} />
          </button>

          {/* Greeting */}
          <div className="hidden sm:block">
            <h2 className={`text-lg font-semibold ${tokens.text.primary}`}>
              {getGreeting()}, {userData?.name?.split(' ')[0]}!
            </h2>
            <p className={`text-sm ${tokens.text.muted}`}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          {isAdmin() && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell size={20} className={tokens.text.secondary} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                      <h3 className={`font-semibold ${tokens.text.primary}`}>Notifications</h3>
                      <p className={`text-xs ${tokens.text.muted}`}>
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                        <p className={`text-sm ${tokens.text.muted}`}>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const isRead = readNotifications.includes(notification.id);
                        return (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                              !isRead ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-lg flex-shrink-0 ${
                                  notification.type === 'out_of_stock'
                                    ? `${alertColors.error.bg}`
                                    : notification.type === 'low_stock'
                                    ? `${alertColors.warning.bg}`
                                    : 'bg-gray-100'
                                }`}
                              >
                                {notification.type === 'out_of_stock' ? (
                                  <XCircle size={16} className={alertColors.error.text} />
                                ) : notification.type === 'low_stock' ? (
                                  <AlertTriangle size={16} className={alertColors.warning.text} />
                                ) : (
                                  <Package size={16} className={tokens.text.muted} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-medium ${tokens.text.primary}`}>
                                    {notification.title}
                                  </p>
                                  {!isRead && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                  )}
                                </div>
                                <p className={`text-xs ${tokens.text.muted} mt-0.5 line-clamp-2`}>
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      markAsRead(notification.id);
                                      navigate(`/products/${notification.productId}`);
                                      setNotificationsOpen(false);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    View Product
                                  </button>
                                  {!isRead && (
                                    <button
                                      onClick={() => dismissNotification(notification.id)}
                                      className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                      Dismiss
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={() => {
                          navigate('/products');
                          setNotificationsOpen(false);
                        }}
                        className={`text-xs ${tokens.text.muted} hover:text-blue-600 w-full text-center`}
                      >
                        View all products →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: colorScheme.primary[600] }}
              >
                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {/* User Info (hidden on mobile) */}
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${tokens.text.primary}`}>{userData?.name}</p>
                <p className={`text-xs ${tokens.text.muted} capitalize`}>{userData?.role}</p>
              </div>
              <ChevronDown size={16} className={`hidden md:block ${tokens.text.muted}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: colorScheme.primary[600] }}
                    >
                      {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${tokens.text.primary} truncate`}>{userData?.name}</p>
                      <p className={`text-sm ${tokens.text.muted} truncate`}>{userData?.email}</p>
                      <RoleBadge role={userData?.role} size="sm" className="mt-1" />
                    </div>
                  </div>
                </div>

                {/* Menu Items - Only show Settings for admins */}
                {isAdmin() && (
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left ${tokens.text.primary} hover:bg-gray-50 transition-colors`}
                    >
                      <User size={18} className={tokens.text.muted} />
                      <span>Account Settings</span>
                    </button>
                  </div>
                )}

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
