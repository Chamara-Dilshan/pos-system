// ============================================================================
// Input Component - CloudPOS
// ============================================================================
import { inputColors, tokens } from '../../config/colors';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
}) => {
  // ── Size Variants ─────────────────────────────────────────────────────────
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // ── State Classes ─────────────────────────────────────────────────────────
  const getInputClasses = () => {
    if (disabled) return inputColors.disabled;
    if (error) return inputColors.error;
    return inputColors.default;
  };

  // ── Padding for Icon ──────────────────────────────────────────────────────
  const getIconPadding = () => {
    if (!Icon) return '';
    if (iconPosition === 'left') return 'pl-10';
    return 'pr-10';
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`block font-medium ${tokens.text.secondary} ${labelSizes[size]} mb-1.5`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              size={iconSizes[size]}
              className={error ? 'text-red-400' : 'text-gray-400'}
            />
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg border
            transition-colors duration-200
            focus:outline-none focus:ring-2
            ${sizes[size]}
            ${getInputClasses()}
            ${getIconPadding()}
          `}
        />

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon
              size={iconSizes[size]}
              className={error ? 'text-red-400' : 'text-gray-400'}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className={`mt-1.5 text-sm ${tokens.text.muted}`}>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
