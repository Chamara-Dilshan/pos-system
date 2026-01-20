// ============================================================================
// Button Component - CloudPOS
// ============================================================================
import { buttonColors } from '../../config/colors';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
}) => {
  // ── Base Styles ───────────────────────────────────────────────────────────
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // ── Size Variants ─────────────────────────────────────────────────────────
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
    xl: 'px-6 py-3.5 text-base gap-2.5',
  };

  // ── Color Variants ────────────────────────────────────────────────────────
  const variants = {
    primary:          buttonColors.primary,
    secondary:        buttonColors.secondary,
    success:          buttonColors.success,
    danger:           buttonColors.danger,
    warning:          buttonColors.warning,
    info:             buttonColors.info,
    dark:             buttonColors.dark,
    outlinePrimary:   buttonColors.outlinePrimary,
    outlineSecondary: buttonColors.outlineSecondary,
    outlineDanger:    buttonColors.outlineDanger,
    ghostPrimary:     buttonColors.ghostPrimary,
    ghostDanger:      buttonColors.ghostDanger,
    ghostNeutral:     buttonColors.ghostNeutral,
  };

  // ── Icon Sizes ────────────────────────────────────────────────────────────
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseStyles}
        ${sizes[size]}
        ${isDisabled ? buttonColors.disabled : variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          className="animate-spin"
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}

      {/* Left Icon */}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={iconSizes[size]} />
      )}

      {/* Button Text */}
      {children}

      {/* Right Icon */}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={iconSizes[size]} />
      )}
    </button>
  );
};

export default Button;
