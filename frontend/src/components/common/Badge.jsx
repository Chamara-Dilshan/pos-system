// ============================================================================
// Badge Component - CloudPOS
// ============================================================================
import { badgeColors, statusColors } from '../../config/colors';

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
}) => {
  // ── Size Variants ─────────────────────────────────────────────────────────
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${sizes[size]}
        ${badgeColors[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className={`${dotSizes[size]} rounded-full bg-current opacity-70`} />
      )}
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

// ── Status Badge ────────────────────────────────────────────────────────────
export const StatusBadge = ({ status, size = 'md', className = '' }) => {
  const statusConfig = {
    // Order Status
    completed:  { label: 'Completed',   color: statusColors.completed },
    pending:    { label: 'Pending',     color: statusColors.pending },
    cancelled:  { label: 'Cancelled',   color: statusColors.cancelled },
    refunded:   { label: 'Refunded',    color: statusColors.refunded },
    // Payment Status
    paid:       { label: 'Paid',        color: statusColors.paid },
    unpaid:     { label: 'Unpaid',      color: statusColors.unpaid },
    partial:    { label: 'Partial',     color: statusColors.partial },
    cash:       { label: 'Cash',        color: statusColors.cash },
    card:       { label: 'Card',        color: statusColors.card },
    // General Status
    active:     { label: 'Active',      color: statusColors.active },
    inactive:   { label: 'Inactive',    color: statusColors.inactive },
    blocked:    { label: 'Blocked',     color: statusColors.blocked },
    // Stock Status
    inStock:    { label: 'In Stock',    color: statusColors.inStock },
    lowStock:   { label: 'Low Stock',   color: statusColors.lowStock },
    outOfStock: { label: 'Out of Stock', color: statusColors.outOfStock },
  };

  const config = statusConfig[status] || { label: status, color: statusColors.inactive };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center
        font-medium rounded-full
        ${sizes[size]}
        ${config.color}
        ${className}
      `}
    >
      {config.label}
    </span>
  );
};

// ── Role Badge ──────────────────────────────────────────────────────────────
export const RoleBadge = ({ role, size = 'md', className = '' }) => {
  const roleConfig = {
    admin:   { label: 'Admin',   variant: 'purple' },
    cashier: { label: 'Cashier', variant: 'primary' },
    manager: { label: 'Manager', variant: 'indigo' },
  };

  const config = roleConfig[role] || { label: role, variant: 'neutral' };

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
};

export default Badge;
