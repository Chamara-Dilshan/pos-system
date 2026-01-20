// ============================================================================
// Card Component - CloudPOS
// ============================================================================
import { cardColors, tokens, iconWithBg } from '../../config/colors';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false,
}) => {
  // ── Padding Variants ──────────────────────────────────────────────────────
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl
        ${cardColors[variant]}
        ${paddings[padding]}
        ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ── Stats Card ──────────────────────────────────────────────────────────────
export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'primary',
  trend,
  trendValue,
  className = '',
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${tokens.text.muted}`}>{title}</p>
          <p className={`text-2xl font-bold ${tokens.text.primary} mt-1`}>{value}</p>
          {subtitle && (
            <p className={`text-sm ${tokens.text.muted} mt-1`}>{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trendColors[trend]}`}>
              {trend === 'up' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconWithBg[iconColor]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
};

// ── Section Card ────────────────────────────────────────────────────────────
export const SectionCard = ({
  title,
  subtitle,
  children,
  action,
  className = '',
}) => {
  return (
    <Card className={className}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className={`text-lg font-semibold ${tokens.text.primary}`}>{title}</h3>
            )}
            {subtitle && (
              <p className={`text-sm ${tokens.text.muted} mt-0.5`}>{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </Card>
  );
};

export default Card;
