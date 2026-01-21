// ============================================================================
// Header Component - CloudPOS
// ============================================================================
import { LogOut, Menu, Bell, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { tokens, colorScheme } from '../../config/colors';
import { RoleBadge } from '../common/Badge';

const Header = ({ onMenuClick }) => {
  const { userData, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ── Close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ── Get greeting based on time ──────────────────────────────────────────
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
          {/* Notifications (placeholder) */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className={tokens.text.secondary} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

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
