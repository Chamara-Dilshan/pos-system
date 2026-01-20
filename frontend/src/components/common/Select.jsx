// ============================================================================
// Select Component - CloudPOS
// ============================================================================
import { ChevronDown } from 'lucide-react';
import { inputColors, tokens } from '../../config/colors';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  helperText,
  size = 'md',
  className = '',
}) => {
  // ── Size Variants ─────────────────────────────────────────────────────────
  const sizes = {
    sm: 'px-3 py-1.5 text-sm pr-8',
    md: 'px-3 py-2.5 text-sm pr-10',
    lg: 'px-4 py-3 text-base pr-12',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // ── State Classes ─────────────────────────────────────────────────────────
  const getSelectClasses = () => {
    if (disabled) return inputColors.disabled;
    if (error) return inputColors.error;
    return inputColors.default;
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

      {/* Select Wrapper */}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-lg border appearance-none
            transition-colors duration-200
            focus:outline-none focus:ring-2
            ${sizes[size]}
            ${getSelectClasses()}
            ${!value ? 'text-gray-400' : ''}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown
            size={iconSizes[size]}
            className={error ? 'text-red-400' : 'text-gray-400'}
          />
        </div>
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

export default Select;
